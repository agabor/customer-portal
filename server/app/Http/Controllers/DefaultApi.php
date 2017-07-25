<?php

namespace App\Http\Controllers;

use App\Auth;
use function App\getProjectWithSlug;
use App\Project;
use function App\slugify;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Symfony\Component\HttpFoundation\Cookie;

class DefaultApi extends Controller
{
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

        $response = new Response('{}');

        $response->withCookie(new Cookie('jwt', Auth::JWT()));

        return $response;
    }

    public function logoutPost()
    {
        Auth::logout();
        return response('{}');
    }

    public function projectsGet()
    {
        return response(Auth::user()->projects);
    }

    public function projectsPatch(Request $request)
    {
        $data = $request->all();
        $project = new Project();
        $project->name = $data['name'];
        $base_slug = slugify($project->name);
        $slug = $base_slug;
        $idx = 1;
        while ($this->projectSlugExists($slug)){
            $slug = $base_slug . (++$idx);
        }
        $project->slug = $slug;
        Auth::user()->projects()->save($project);
        return $project;
    }

    private function projectSlugExists(string $slug) : bool
    {
        foreach (Auth::user()->projects as $project)
            if ($project->slug == $slug)
                return true;
        return false;
    }

    public function projectsIdGet(string $id)
    {
        $project = getProjectWithSlug($id);
        if ($project == null)
            return response('{}',404);
        $project->load(['texts.values', 'images.conditions', 'files', 'locales']);
        return $project;
    }

    public function projectsIdDelete(string $id)
    {
        $project = getProjectWithSlug($id);
        if ($project == null)
            return response('{}',404);
        $project->delete();
        return response('{}');
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
        $project = getProjectWithSlug($id);
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

}
