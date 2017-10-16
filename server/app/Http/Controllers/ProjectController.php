<?php

namespace App\Http\Controllers;

use App\Auth;
use App\Link;
use App\Language;
use App\Localtext;
use App\Project;
use App\Text;
use App\User;
use Illuminate\Http\Request;


class ProjectController extends Controller
{

    public function projectsIdGet()
    {
        self::$project->load(['texts.values', 'images', 'files', 'users', 'links', 'languages']);
        return self::$project;
    }

    public function projectsIdDelete()
    {
        self::$project->delete();
        return response('{}');
    }


    private static function getLocaleTextDict(array $sources): LocaleTextDict
    {
        $dict = new LocaleTextDict;
        foreach ($sources as $text) {
            $values = $text['values'];
            $textId = $text['textId'];
            foreach ($values as $value) {
                $dict->set($textId, $value['languageCode'], $value['value']);
            }
        }
        return $dict;
    }

    private static function updateTextValue(LocaleTextDict $dict, Localtext $value, Text $text)
    {
        $newValue = $dict->get($text->textId, $value->language->code);
        if ($value->value != $newValue) {
            $newVersion = new Localtext();
            $newVersion->language_id = $value->language_id;
            $newVersion->value = $newValue;
            $text->saveLocale($newVersion);
            $value->text()->dissociate();
            $value->save();
        }
    }

    public function projectsIdPutTexts(Request $request)
    {
        $input = $request->all();
        $sources = self::getArray($input, 'sources');

        $this->updateTextValues($sources, self::$project);

        if (self::$project->admin) {
            $this->updateTexts($sources, self::$project);
        }
        self::$project->calculateState();
        return response('{}');
    }


    private function updateTextValues(array $sources, Project $project)
    {
        $languages = iterator_to_array($project->languages);

        $dict = self::getLocaleTextDict($sources);

        /* @var Text $text */
        foreach ($project->texts as $text) {
            if (!$dict->hasText($text->textId)){
                $text->delete();
                continue;
            }
            foreach ($languages as $language) {
                /* @var Localtext value */
                $value = $text->getValue($language);
                if ($value == null) {
                    $value = new Localtext(['language_id' => $language->id, 'value' => '']);
                    $text->saveLocale($value);
                }

                self::updateTextValue($dict, $value, $text);

            }
        }
    }

    private function updateTexts(array $sources, Project $project)
    {
        $languages = Language::all();
        $language_ids = [];
        /* @var Language $language */
        foreach ($languages as $language) {
            $language_ids[$language->code] = $language->id;
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
                foreach ($values as $language => $value) {
                    $t->saveLocale(new Localtext(['language_id' => $language_ids[$value['languageCode']], 'value' => $value['value']]));
                }
            }
        }
    }

    public function addUser(Request $request) {
        $input = $request->all();

        $name = self::getString($input, 'name');
        $email = self::getString($input, 'email');

        /* @var User $u */
        $u = User::where('email', $email)->first();
        if ($u != null){
            /* @var User $user */
            foreach (self::$project->users as $user){
                if ($user->id === $u->id) {
                    return $u;
                }
            }
            self::$project->users()->attach($u);
            return $u;
        }

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

    public function removeUser()
    {
        if (self::$user->id != Auth::user()->id) {
            self::$project->users()->detach(self::$user);
        }

        return response('{}');
    }

    public function addLink(Request $request) {
        $input = $request->all();

        $link = new Link();
        $link->name = self::getString($input, 'name');
        $link->icon = self::getString($input, 'icon');
        $link->url = self::getString($input, 'url');

        self::$project->links()->save($link);
        return $link;
    }

    public function modifyLink(Request $request) {
        $input = $request->all();

        self::$link->name = self::getString($input, 'name');
        self::$link->icon = self::getString($input, 'icon');
        self::$link->url = self::getString($input, 'url');
        self::$link->save();

        return self::$link;
    }

    public function deleteLink()
    {
        self::$link->delete();
        return response('{}');
    }

    public function textVersions(Request $request) {
        if (self::$project == null)
            return null;

        $input = $request->all();
        $text_id = self::getString($input, 'text_id');
        $languageCode = self::getString($input, 'languageCode');
        $text = self::$project->getText($text_id);
        $versions = [];

        /* @var \App\Localtext $localeText */
        foreach ($text->versionedValues as $localeText) {
            if ($localeText->language->code === $languageCode)
                $versions[] = $localeText->value;
        }
        return $versions;
    }


    public function projectsModify(Request $request){
        $input = $request->all();
        self::$project->name = self::getString($input, 'name');
        self::$project->setSlug();
        self::$project->save();
        return self::$project;
    }

    public function projectsDelete(){
        self::$project->delete();
        return \response('{}');
    }

    public function addLanguage(Request $request) {
        $input = $request->all();
        $code = self::getString($input, 'code');

        /* @var Language $language */
        foreach (self::$project->languages as $language) {
            if ($language->code == $code)
                return $language;
        }

        $language = Language::forCode($code);
        self::$project->languages()->attach($language);

        /* @var Text $text */
        foreach (self::$project->texts as $text){
            $lt = new Localtext();
            $lt->language_id = $language->id;
            $lt->value = '';
            $text->saveLocale($lt);
        }

        return $language;
    }

    public function removeLanguage(Request $request) {
        $input = $request->all();
        $code = self::getString($input, 'code');

        /* @var Language $deletedLanguage */
        $deletedLanguage = null;
        /* @var Language $language */
        foreach (self::$project->languages as $language) {
            if ($language->code == $code) {
                self::$project->languages()->detach($language);
                $deletedLanguage = $language;
            }
        }

        if ($deletedLanguage != null) {
            /* @var Text $text */
            foreach (self::$project->texts as $text) {
                /* @var Localtext $lt */
                foreach ($text->values as $lt) {
                    if ($lt->language_id == $deletedLanguage->id) {
                        $lt->delete();
                    }
                }
            }
        }

        return response('{}');
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