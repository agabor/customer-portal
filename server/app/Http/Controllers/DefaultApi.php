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
        Auth::user()->projects()->save($project);
        return $project;
    }

    public function projectsIdGet(string $id)
    {
        $project = getProjectWithSlug($id);
        if ($project == null)
            return response('{}',404);
        $project->load(['texts.values', 'images', 'files', 'users', 'links', 'locales']);
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
        $project = getProjectWithSlug($id);

        $this->updateTextValues($sources, $project);

        $this->updateTexts($sources, $project);

        $project->calculateState();
        return response('{}');
    }

    private static function getLocaleTextDict(array $sources): LocaleTextDict
    {
        $dict = new LocaleTextDict;
        foreach ($sources as $text) {
            $values = $text['values'];
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
            $newVersion = new Localtext();
            $newVersion->locale_id = $value->locale_id;
            $newVersion->value = $newValue;
            $text->saveLocale($newVersion);
            $value->text()->dissociate();
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

    private function updateTextValues(array $sources, Project $project)
    {
        $locales = iterator_to_array($project->locales);

        $dict = self::getLocaleTextDict($sources);

        /* @var Text $text */
        foreach ($project->texts as $text) {
            if (!$dict->hasText($text->textId)){
                $text->delete();
                continue;
            }
            foreach ($locales as $locale) {
                /* @var Localtext value */
                $value = $text->getValue($locale);
                if ($value == null) {
                    $value = new Localtext(['locale_id' => $locale->id, 'value' => '']);
                    $text->saveLocale($value);
                }

                self::updateTextValue($dict, $value, $text);

            }
        }
    }

    private function updateTexts(array $sources, Project $project)
    {
        $locales = Language::all();
        $locale_ids = [];
        foreach ($locales as $locale) {
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
                    $t->saveLocale(new Localtext(['locale_id' => $locale_ids[$value['localeCode']], 'value' => $value['value']]));
                }
            }
        }
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

    public function hasText(string $textId)
    {
        return array_key_exists($textId, $this->dict);
    }

    public function get(string $textId, string $localCode) //: string
    {
        if (!array_key_exists($textId, $this->dict))
            return null;
        if (!array_key_exists($localCode, $this->dict[$textId]))
            return null;
        $result = $this->dict[$textId][$localCode];
        unset($this->dict[$textId][$localCode]);
        if (count($this->dict[$textId]) == 0)
            unset($this->dict[$textId]);
        return $result;
    }
}