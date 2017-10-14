<?php

namespace App\Http\Controllers;

use App\Auth;
use function App\getProjectWithSlug;
use App\Language;
use App\Localtext;
use App\Project;
use function App\slugify;
use App\Text;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Cookie;

class DefaultApi extends Controller
{
    public function loginPost(Request $request)
    {
        $input = $request->all();

        $user_name = self::getString($input, 'user_name');
        $password = self::getString($input, 'password');

        $u = User::where('name', $user_name)->first();

        if ($u == null)
            return response(array('error' => 'user_not_found'), 401);

        if (!password_verify($password, $u->password))
            return response(array('error' => 'password_error'), 401);

        return $this->startSession($u);
    }

    public function loginLinkGet(Request $request)
    {
        $input = $request->route()[2];;

        $login_token = self::getString($input, 'login_token');
        if ($login_token == null || strlen($login_token) == 0)
            return response(array('error' => 'user_not_found'), 401);

        $u = User::where('loginToken', $login_token)->first();

        if ($u == null)
            return response(array('error' => 'user_not_found'), 401);

        return $this->startSession($u);
    }

    public function logoutPost()
    {
        Auth::logout();
        return response('{}');
    }


    public function setPassword(Request $request)
    {
        if (strlen(Auth::user()->loginToken) === 0)
            return response('{}', 401);
        $input = $request->all();
        $password = self::getString($input, 'password');
        Auth::user()->password = password_hash($password, PASSWORD_DEFAULT);
        Auth::user()->loginToken = '';
        Auth::user()->save();
        return response('{}');
    }

    public function projectsGet()
    {
        return response(Auth::user()->projects);
    }

    public function projectsPatch(Request $request)
    {
        $input = $request->all();
        $project = new Project();
        $project->name = self::getString($input, 'name');
        $project->setSlug();
        Auth::user()->projects()->save($project, ['admin' => true]);
        return $project;
    }


    /**
     * @param $u
     * @return Response
     */
    private function startSession($u): Response
    {
        Auth::startSession($u);

        $response = new Response($u);

        $response->withCookie(new Cookie('jwt', Auth::JWT()));

        return $response;
    }

}
