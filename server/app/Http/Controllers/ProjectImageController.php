<?php

namespace App\Http\Controllers;

use App\Image;
use App\Project;
use function App\slugify;
use Aws\S3\S3Client;
use Illuminate\Http\Request;
use Laravel\Lumen\Application;
use Symfony\Component\HttpFoundation\File\UploadedFile;


class ProjectImageController extends Controller {

    const ROUTE = 'projects/{project_id}/images';

    public static function addRoutes(Application $app)
    {
        $app->PATCH(self::uri(''), self::action('imagePatch'));
        $app->PATCH(self::uri('/{image_id}'), self::action('imageModify'));
        $app->DELETE(self::uri('/{image_id}'), self::action('imageDelete'));
    }

    public static function uri(string $suffix) {
        return self::ROUTE . $suffix;
    }

    public static function action(string $function_name) {
        return self::class . '@' . $function_name;
    }

    static function hex2rgb($colour)
    {
        $colour = preg_replace("/[^abcdef0-9]/i", "", $colour);
        if (strlen($colour) == 6)
        {
            list($r, $g, $b) = str_split($colour, 2);
            return Array("r" => hexdec($r), "g" => hexdec($g), "b" => hexdec($b));
        }
        elseif (strlen($colour) == 3)
        {
            list($r, $g, $b) = array($colour[0] . $colour[0], $colour[1] . $colour[1], $colour[2] . $colour[2]);
            return Array("r" => hexdec($r), "g" => hexdec($g), "b" => hexdec($b));
        }
        return false;
    }

    public function imageGet(Image $image)
    {
        if ($this == null)
            return response('', 404);

        if ($image->fileName === null || $image->fileName === '') {
            $image = self::getPlaceholderImage($image);
            header("Content-Type: image/png");
            imagepng($image);
        } else {
            return $this->downloadFromS3($image);
        }
        return response('{}');
    }


    public function imagePost(Request $request, Project $project, Image $image)
    {
        $uploadedFile = $request->file('image');
        if ($image->fileName !== null && $image->fileName !== '') {
            $copy = $image->copy();
            $project->versionedImages()->save($copy);
        }
        $image->setFile($uploadedFile);
        $project->calculateState();
        $this->uploadToS3($image, $uploadedFile);
        return $image;
    }

    public function imageDelete(Project $project, Image $image)
    {
        if ($image == null)
            return response('', 404);
        /* @var Image $img */
        foreach ($project->versionedImagesForId($image->imageId) as $img)
            $img->delete();
        $project->calculateState();
        return response('{}');
    }

    private static function getPlaceholderImage(Image $img)
    {
        // Create image
        $width = $img->minWidth ?? $img->maxWidth ?? 100;
        $height = $img->minHeight ?? $img->maxHeight ?? 100;
        $image = imagecreate($width, $height);

        // Colours
        $bg = 'f5f5f5';
        $bg = self::hex2rgb($bg);
        imagecolorallocate($image, $bg['r'], $bg['g'], $bg['b']);

        $fg = '337ab7';
        $fg = self::hex2rgb($fg);
        $setfg = imagecolorallocate($image, $fg['r'], $fg['g'], $fg['b']);

        // Text
        $text = '';
        if ($img->minWidth != null || $img->minHeight != null) {
            $text = ($img->minWidth ?? '?') . ' x ' . ($img->minHeight ?? '?');
        }
        if (($img->maxWidth != null || $img->maxHeight != null) &&
            ($img->maxWidth != $img->minWidth || $img->maxHeight != $img->minHeight)) {
            if (strlen($text) != 0)
                $text .= ' - ';
            $text .= ($img->maxWidth ?? '?') . ' x ' . ($img->maxHeight ?? '?');
        }

        $font = dirname(__FILE__) . '/HelveticaNeueMed.ttf';
        // Text positioning
        $fontsize = $width > 200 ? 20 : 10;
        $bbox = imagettfbbox($fontsize, 0, $font, $text);
        $fontheight = $bbox[5] - $bbox[1];   // height of a character
        $textwidth = $bbox[2] - $bbox[0];         // text width
        $xpos = (imagesx($image) - $textwidth) / 2;
        $ypos = (imagesy($image) - $fontheight) / 2;
        // Generate text
        imagettftext($image, $fontsize, 0, $xpos, $ypos, $setfg, $font, $text);
        return $image;
    }

    public function imagePatch(Request $request, Project $project)
    {
        $image = new Image();
        $this->updateImage($request, $project, $image);
        $this->setImageId($project, $image);
        $project->versionedImages()->save($image);
        $image->project()->associate($project);
        $image->save();
        $project->calculateState();
        return response($image);
    }

    public function imageModify(Request $request, Project $project, Image $image)
    {
        if ($image == null)
            return response('{}', 404);
        $this->updateImage($request, $project, $image);
        $image->save();
        $project->calculateState();
        return response($image);
    }


    protected function updateImage(Request $request, Project $project, Image $image)
    {
        $data = $request->all();
        if (isset($data['name']))
            $image ->name = $data['name'];
        if (isset($data['description']))
            $image ->description = $data['description'];
        if (isset($data['minWidth']))
            $image->minWidth = $data['minWidth'];
        else
            $image->minWidth = null;

        if (isset($data['maxWidth']))
            $image->maxWidth = $data['maxWidth'];
        else
            $image->maxWidth = null;

        if (isset($data['minHeight']))
            $image->minHeight = $data['minHeight'];
        else
            $image->minHeight = null;

        if (isset($data['maxHeight']))
            $image->maxHeight = $data['maxHeight'];
        else
            $image->maxHeight = null;
    }

    /**
     * @param Project $project
     * @param Image $image
     */
    protected function setImageId(Project $project, Image $image)
    {
        $img_slug = slugify($image->name);
        $newImageId = $img_slug;
        $idx = 1;
        while ($project->hasImageWithId($newImageId)) {
            $newImageId = $img_slug . (++$idx);
        }
        $image->imageId = $newImageId;
    }

    public function downloadFromS3(Image $image)
    {
        $client = $this->getS3Client();
        $object = $client->getObject(array(
            'Bucket' => 'customerpoint-data',
            'Key' => $image->fileName
        ));

        $ext = explode('.', $image->fileName)[1];

        $headers =['Content-Description' => 'File Transfer',
            'Content-Type' => $object['ContentType'],
            'Content-Disposition' => 'attachment; filename=' . $image->imageId . '.' . $ext,
            'Expires' => '0',
            'Cache-Control' => 'must-revalidate',
            'Pragma' => 'public'];

        return response($object["Body"], 200, $headers);
    }

    protected function getS3Client(): S3Client
    {
        define('AWS_ACCESS_KEY_ID', 'AKIAIRGOLS753PUJPBQA');
        define('AWS_SECRET_ACCESS_KEY', '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');
        $client = new S3Client([
            'version' => 'latest',
            'region' => 'eu-central-1',
            'credentials' => array(
                'key' => AWS_ACCESS_KEY_ID,
                'secret' => AWS_SECRET_ACCESS_KEY,
            )
        ]);
        return $client;
    }


    protected function uploadToS3(Image $image, UploadedFile $uploadedFile)
    {
        $client = $this->getS3Client();
        $client->putObject(array(
            'Bucket' => 'customerpoint-data',
            'Key' => $image->fileName,
            'SourceFile' => $uploadedFile->getPathname(),
            'Metadata' => array()
        ));
    }

}