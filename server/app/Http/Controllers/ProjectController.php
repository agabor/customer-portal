<?php

namespace App\Http\Controllers;

use App\Auth;
use function App\getProjectWithSlug;
use App\Image;
use App\Project;
use function App\slugify;
use App\User;
use Illuminate\Http\Request;


class ProjectController extends Controller
{

    function __construct()
    {
        $this->middleware('model');
    }

    public function addUser(Request $request) {
        $input = $request->all();

        $name = self::getString($input, 'name');
        $email = self::getString($input, 'email');

        $u = new User(['name' => $name, 'email' => $email, 'loginToken' => uniqid()]);
        self::$project->users()->save($u);
        return $u;
    }

    public function modifyUser(Request $request) {
        $input = $request->all();

        self::$user->name = self::getString($input, 'name');
        self::$user->email = self::getString($input, 'email');
        self::$user->save();

        return self::$user;
    }

    public function deleteUser()
    {
        if (self::$user->id != Auth::user()->id)
            self::$user->delete();

        return response('{}');
    }

    public function textVersions(Request $request) {
        if (self::$project == null)
            return null;

        $input = $request->all();
        $text_id = self::getString($input, 'text_id');
        $locale_id = self::getString($input, 'locale_id');
        $text = self::$project->getText($text_id);
        $versions = [];
        /* @var \App\Localtext $localeText */
        foreach ($text->versionedValues as $localeText) {
            if ($localeText->locale->localeId === $locale_id)
                $versions[] = $localeText->value;
        }
        return $versions;
    }
}