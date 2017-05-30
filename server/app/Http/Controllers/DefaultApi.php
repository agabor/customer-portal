<?php

/**
 * Customer Portal
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */


namespace App\Http\Controllers;

use App\Auth;
use App\Image;
use App\Project;
use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\File\UploadedFile;

class DefaultApi extends Controller
{
    /**
     * Constructor
     */
    public function __construct()
    {
    }


    public function loginPost(Request $request)
    {
        $input = $request->all();

        //not path params validation
        if (!isset($input['user_name'])) {
            throw new \InvalidArgumentException('Missing the required parameter $user_name when calling loginPost');
        }
        $user_name = $input['user_name'];

        if (!isset($input['password'])) {
            throw new \InvalidArgumentException('Missing the required parameter $password when calling loginPost');
        }
        $password = $input['password'];

        $u = User::where('name', $user_name)->first();

        if ($u == null)
            return response(array('error' => 'user_not_found'), 401);

        if (!password_verify($password, $u->password))
            return response(array('error' => 'password_error') , 401);

        Auth::startSession($u);

        return response(array('jwt' => Auth::JWT()));
    }
    /**
     * Operation logoutPost
     *
     * .
     *
     *
     * @return Http response
     */
    public function logoutPost()
    {
        Auth::logout();
        return response('');
    }
    /**
     * Operation projectsGet
     *
     * .
     *
     *
     * @return Http response
     */
    public function projectsGet()
    {
        return response(Auth::user()->projects);
    }
    /**
     * Operation projectsIdGet
     *
     * .
     *
     * @param string $id project identifier (required)
     *
     * @return Http response
     */
    public function projectsIdGet(string $id)
    {
        $project = $this->getProjectWithSlug($id);
        if ($project == null)
            return response('',404);
        $project->load(['texts.values', 'images.conditions', 'files', 'locales']);
        return $project;
    }


    public function projectsIdPutTexts(Request $request, string $id)
    {
        $data = $request->all();
        $dict = [];
        if (isset($data['sources']) && is_array($data['sources'])){
            foreach ($data['sources'] as $textdata){
                foreach ($textdata['values'] as $localdata) {
                    $localCode = $localdata['localeCode'];
                    if(!isset($dict[$localCode]))
                        $dict[$localCode] = [];
                    $dict[$localCode][$textdata['textId']] = $localdata['value'];
                }
            }
        }
        $project = $this->getProjectWithSlug($id);
        foreach ($project->texts as $text) {
            foreach ($text->values as $localtext){
                $newValue = $dict[$localtext->locale->localeId][$text->textId];
                if ($localtext->value != $newValue) {
                    $localtext->value = $newValue;
                    $localtext->save();
                }
            }
        }
        $project->calculateState();
    }

    protected function getProjectWithSlug(string $id) : Project
    {
        $project = Project::where('slug', $id)->first();
        return $project;
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

    public function imageGet(string $project_id,string $image_id)
    {
        $img = $this->getImage($project_id, $image_id);
        if ($this == null)
            return response('', 404);

        $image = $this->getPlaceholderImage($img);
        header("Content-Type: image/png");
        imagepng($image);
    }


    public function imagePost(Request $request, string $project_id,string $image_id)
    {
        $img = $this->getImage($project_id, $image_id);
        if ($this == null)
            return response('', 404);
        $uploadedFile = $request->file('image');
        $clientOriginalName = $uploadedFile->getClientOriginalName();
        $uploadedFile->move(base_path('public'), $clientOriginalName);
        $img->fileName = 'http://localhost:8000/'.$clientOriginalName;
        $img->save();
    }

    private function getImage(string $project_id,string $image_id) : Image
    {
        $project = $this->getProjectWithSlug($project_id);
        if ($project == null)
            return null;
        foreach ($project->images as $img) {
            if ($img->imageId == $image_id) {
                return $img;
            }
        }
        return null;
    }


    /**
     * @param $img
     * @return resource
     */
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
        $fontsize = 20;
        $bbox = imagettfbbox($fontsize, 0, $font, $text);
        $fontheight = $bbox[5] - $bbox[1];   // height of a character
        $textwidth = $bbox[2] - $bbox[0];         // text width
        $xpos = (imagesx($image) - $textwidth) / 2;
        $ypos = (imagesy($image) - $fontheight) / 2;
        // Generate text
        imagettftext($image, $fontsize, 0, $xpos, $ypos, $setfg, $font, $text);
        return $image;
    }
}
