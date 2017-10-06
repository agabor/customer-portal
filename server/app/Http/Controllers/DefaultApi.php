<?php

namespace App\Http\Controllers;

use App\Auth;
use function App\getProjectWithSlug;
use App\Locale;
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

        $u = User::where('login_token', $login_token)->first();

        if ($u == null)
            return response(array('error' => 'user_not_found'), 401);

        return $this->startSession($u);
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
        $input = $request->all();
        $project = new Project();
        $project->name = self::getString($input, 'name');
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
        $input = $request->all();
        $sources = self::getArray($input, 'sources');
        $dict = self::getLocaleTextDict($sources);
        $project = getProjectWithSlug($id);
        foreach ($project->texts as $text) {
            foreach ($text->values as $value) {
                self::updateTextValue($dict, $value, $text);
            }
        }
        $locale_ids = [];
        foreach(Locale::all() as $locale) {
            $locale_ids[$locale->localeId] = $locale->id;
        }
        foreach ($sources as $text) {
            $t = $project->getText($text['textId']);
            if ($t != null) {
                $t->name = $text['name'];
                $t->description = $text['description'];
                $t->minLength = $text['minLength'];
                $t->maxLength = $text['maxLength'];
                $t->save();
            } else {
                $t = new Text($text);
                $project->texts()->save($t);
                $values = self::getArray($text, 'values');
                foreach ($values as $locale => $value) {
                    $t->values()->save(new Localtext(['locale_id' => $locale_ids[$value['localeCode']], 'value' => $value['value']]));
                }
            }
        }

        $project->calculateState();
        return response('{}');
    }

    private static function getLocaleTextDict(array $sources): LocaleTextDict
    {
        $dict = new LocaleTextDict;
        foreach ($sources as $text) {
            $values = self::getArray($text, 'values');
            $textId = $text['textId'];
            foreach ($values as $value) {
                $dict->set($textId, $value['localeCode'], $value['value']);
            }
        }
        return $dict;
    }

    private static function updateTextValue(LocaleTextDict $dict, Localtext $value, Text $text)
    {
        $newValue = $dict->get($text->textId, $value->locale->localeId);
        if ($value->value != $newValue) {
            $value->value = $newValue;
            $value->save();
        }
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

class LocaleTextDict
{
    public $dict = [];
    public function set(string $textId, string $localCode, string $value)
    {
        if (!isset($this->dict[$textId]))
            $this->dict[$textId] = [];
        $this->dict[$textId][$localCode] = $value;

    }
    public function get(string $textId, string $localCode) : string
    {
        $result = $this->dict[$textId][$localCode];
        unset($this->dict[$textId][$localCode]);
        if (count($this->dict[$textId]) == 0)
            unset($this->dict[$textId]);
        return $result;
    }
}