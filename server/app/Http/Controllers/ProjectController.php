<?php

namespace App\Http\Controllers;

use App\Auth;
use function App\getProjectWithSlug;
use App\Image;
use App\Link;
use App\Language;
use App\Localtext;
use App\Project;
use function App\slugify;
use App\Text;
use App\User;
use Illuminate\Http\Request;


class ProjectController extends Controller
{

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