<?php

namespace App\Http\Controllers;

use function App\getProjectWithSlug;
use App\Image;
use App\Project;
use function App\slugify;
use Illuminate\Http\Request;

class ProjectImageController extends Controller{

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

    public function imageGet(string $project_id,string $image_id)
    {
        $img = $this->getImage($project_id, $image_id);
        if ($this == null)
            return response('', 404);

        if ($img->fileName == null || $img->fileName == '') {
            $image = $this->getPlaceholderImage($img);
            header("Content-Type: image/png");
            imagepng($image);
        } else
            return response()->download($img->filePath());
    }


    public function imagePost(Request $request, string $project_id,string $image_id)
    {
        $img = $this->getImage($project_id, $image_id);
        if ($img == null)
            return response('', 404);
        $uploadedFile = $request->file('image');
        $img->setFile($uploadedFile);
        return response('{}');
    }

    public function imageDelete(string $project_id,string $image_id)
    {
        $img = $this->getImage($project_id, $image_id);
        if ($img == null)
            return response('', 404);
        if ($img->hasFile() && file_exists($img->filePath()))
            unlink($img->filePath());
        $img->delete();
        return response('{}');
    }

    private function getImage(string $project_id,string $image_id) : Image
    {
        $project = getProjectWithSlug($project_id);
        if ($project == null)
            return null;
        foreach ($project->images as $img) {
            if ($img->imageId == $image_id) {
                return $img;
            }
        }
        return null;
    }

    protected function getPlaceholderImage(Image $img)
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

    public function imagePatch(Request $request, string $project_id)
    {
        $project = getProjectWithSlug($project_id);
        if ($project == null)
            return null;
        $img = new Image();
        $this->updateImage($request, $img, $project);

        $project->images()->save($img);
        return response($img);
    }

    public function imageModify(Request $request, string $project_id, string $image_id)
    {
        $project = getProjectWithSlug($project_id);
        $img = $project->getImageWithId($image_id);
        if ($img == null)
            return response('{}', 404);
        $this->updateImage($request, $img, $project);
        $img->save();
        return response($img);
    }


    protected function updateImage(Request $request, Image $img, Project $project)
    {
        $data = $request->all();
        if (isset($data['name'])) {

            $img->name = $data['name'];
            $img_slug = slugify($img->name);
            $newImageId = $img_slug;
            $idx = 1;
            while ($project->hasImageWithId($newImageId)) {
                $newImageId = $img_slug . (++$idx);
            }
            $img->imageId = $newImageId;
        }
        if (isset($data['description']))
            $img->description = $data['description'];
        if (isset($data['preferredWidth']))
            $img->preferredWidth = $data['preferredWidth'];
        if (isset($data['preferredHeight']))
            $img->preferredHeight = $data['preferredHeight'];
    }

}