<?php

namespace App\Http\Controllers;

use function App\getProjectWithSlug;
use App\Image;
use App\Project;
use function App\slugify;
use Illuminate\Http\Request;


class ProjectImageController extends Controller{

    /**
     * @var Project
     */
    public static $project;

    /**
     * @var Image
     */
    public static $image;

    function __construct()
    {
        $this->middleware('model');
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

    public function imageGet()
    {
        if ($this == null)
            return response('', 404);

        if (self::$image->fileName === null || self::$image->fileName === '') {
            $image = self::getPlaceholderImage(self::$image);
            header("Content-Type: image/png");
            imagepng($image);
        } else {
            $ext = explode('.', self::$image->fileName)[1];
            return response()->download(self::$image->filePath(), self::$image->imageId . '.' . $ext);
        }
    }


    public function imagePost(Request $request)
    {
        if (self::$image == null)
            return response('', 404);
        $uploadedFile = $request->file('image');
        $copy = self::$image->copy();
        self::$project->versionedImages()->save($copy);
        self::$image->setFile($uploadedFile);
        return response('{}');
    }

    public function imageDelete()
    {
        if (self::$image == null)
            return response('', 404);
        if (self::$image->hasFile() && file_exists(self::$image->filePath()))
            unlink(self::$image->filePath());
        self::$image->delete();
        return response('{}');
    }

    private static function getPlaceholderImage(Image $img)
    {
        // Create image
        $image = imagecreate($img->preferredWidth, $img->preferredHeight);

        // Colours
        $bg = 'f5f5f5';
        $bg = self::hex2rgb($bg);
        $setbg = imagecolorallocate($image, $bg['r'], $bg['g'], $bg['b']);

        $fg = '337ab7';
        $fg = self::hex2rgb($fg);
        $setfg = imagecolorallocate($image, $fg['r'], $fg['g'], $fg['b']);

        // Text
        $text = $img->preferredWidth .' x ' . $img->preferredHeight;

        $font = dirname(__FILE__) . '/HelveticaNeueMed.ttf';
        // Text positioning
        $fontsize = $img->preferredWidth > 200 ? 20 : 10;
        $bbox = imagettfbbox($fontsize, 0, $font, $text);
        $fontheight = $bbox[5] - $bbox[1];   // height of a character
        $textwidth = $bbox[2] - $bbox[0];         // text width
        $xpos = (imagesx($image) - $textwidth) / 2;
        $ypos = (imagesy($image) - $fontheight) / 2;
        // Generate text
        imagettftext($image, $fontsize, 0, $xpos, $ypos, $setfg, $font, $text);
        return $image;
    }

    public function imagePatch(Request $request)
    {
        if (self::$project == null)
            return null;
        self::$image = new Image();
        $this->updateImage($request);

        self::$project->versionedImages()->save(self::$image);
        self::$image->project()->associate(self::$project);
        self::$image->save();

        return response(self::$image);
    }

    public function imageModify(Request $request, string $project_id, string $image_id)
    {
        if (self::$image == null)
            return response('{}', 404);
        $this->updateImage($request);
        self::$image ->save();
        return response(self::$image);
    }


    protected function updateImage(Request $request)
    {
        $data = $request->all();
        if (isset($data['name'])) {

            self::$image ->name = $data['name'];
            $img_slug = slugify(self::$image ->name);
            $newImageId = $img_slug;
            $idx = 1;
            while (self::$project->hasImageWithId($newImageId)) {
                $newImageId = $img_slug . (++$idx);
            }
            self::$image ->imageId = $newImageId;
        }
        if (isset($data['description']))
            self::$image ->description = $data['description'];
        if (isset($data['preferredWidth']))
            self::$image ->preferredWidth = $data['preferredWidth'];
        if (isset($data['preferredHeight']))
            self::$image ->preferredHeight = $data['preferredHeight'];
    }

}