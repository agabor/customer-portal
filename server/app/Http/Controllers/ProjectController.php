<?php

namespace App\Http\Controllers;

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

    public function addUser(Request $request)
    {
        if (self::$project == null)
            return null;

        $input = $request->all();

        $name = self::getString($input, 'name');
        $email = self::getString($input, 'email');

        $u = new User(['name' => $name, 'email' => $email, 'login_token' => uniqid()]);
        self::$project->users()->save($u);
        return $u;
    }
}