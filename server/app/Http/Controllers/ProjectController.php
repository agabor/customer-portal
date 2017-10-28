<?php

namespace App\Http\Controllers;

use App\Link;
use App\Language;
use App\Localtext;
use App\Project;
use App\Text;
use Illuminate\Http\Request;
use Matriphe\ISO639\ISO639;


class ProjectController extends Controller
{

    public function projectsIdGet(Project $project)
    {
        $project->load(['texts.values', 'images', 'files', 'users', 'links', 'languages']);
        return $project;
    }

    public function projectsModify(Request $request, Project $project){
        $input = $request->all();
        $project->name = self::getString($input, 'name');
        $project->setSlug();
        $project->save();
        return $project;
    }

    public function projectsDelete(Project $project){
        $project->delete();
        return \response('{}');
    }

    public function languages() {
        $iso = new ISO639();
        $result = [];
        $codes = ['sq', 'an', 'av', 'az', 'ba', 'eu', 'be', 'bs', 'br', 'bg', 'ca', 'ce', 'zh', 'cv', 'kw', 'co', 'hr',
            'cs', 'da', 'nl', 'en', 'et', 'fo', 'fi', 'fr', 'gl', 'de', 'el', 'hu', 'is', 'ga', 'it', 'ja', 'kk', 'kv',
            'la', 'lv', 'lt', 'mk', 'mt', 'gv', 'mn', 'no', 'oc', 'pl', 'pt', 'ro', 'ru', 'sc', 'gd', 'sr', 'sk', 'sl',
            'es', 'sv', 'tt', 'tr', 'uk', 'cy', 'yi'];
        foreach ($codes as $code) {
            $l = new Language();
            $l->code = $code;
            $l->name = $iso->languageByCode1($code);
            $result[] = $l;
        }
        return $result;
    }

    public function addLanguage(Request $request, Project $project) {
        $input = $request->all();
        $code = self::getString($input, 'code');

        /* @var Language $language */
        foreach ($project->languages as $language) {
            if ($language->code == $code)
                return $language;
        }

        $language = Language::forCode($code);
        $project->languages()->attach($language);

        /* @var Text $text */
        foreach ($project->texts as $text){
            $lt = new Localtext();
            $lt->language_id = $language->id;
            $lt->value = '';
            $text->saveLocale($lt);
        }

        $project->calculateState();
        return $language;
    }

    public function removeLanguage(Request $request, Project $project) {
        $input = $request->all();
        $code = self::getString($input, 'code');

        /* @var Language $deletedLanguage */
        $deletedLanguage = null;
        /* @var Language $language */
        foreach ($project->languages as $language) {
            if ($language->code == $code) {
                $project->languages()->detach($language);
                $deletedLanguage = $language;
            }
        }

        if ($deletedLanguage != null) {
            /* @var Text $text */
            foreach ($project->texts as $text) {
                /* @var Localtext $lt */
                foreach ($text->values as $lt) {
                    if ($lt->language_id == $deletedLanguage->id) {
                        $lt->delete();
                    }
                }
            }
        }
        $project->calculateState();

        return response('{}');
    }
}
