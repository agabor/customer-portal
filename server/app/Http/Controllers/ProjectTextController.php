<?php

namespace App\Http\Controllers;

use App\Language;
use App\Localtext;
use App\Project;
use App\Text;
use Illuminate\Http\Request;


class ProjectTextController extends Controller {

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

    public function projectsIdPutTexts(Request $request, Project $project)
    {
        $input = $request->all();
        $sources = self::getArray($input, 'sources');

        $this->updateTextValues($sources, $project);

        $project->calculateState();
        return response('{}');
    }


    private function updateTextValues(array $sources, Project $project)
    {
        $languages = iterator_to_array($project->languages);

        $dict = self::getLocaleTextDict($sources);

        /* @var Text $text */
        foreach ($project->texts as $text) {
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


    public function addText(Request $request, Project $project)
    {
        $input = $request->all();
        $text = new Text();
        $text->name = $input['name'];
        $text->textId = $input['textId'];
        if (array_key_exists('description', $input))
            $text->description = $input['description'];
        if (array_key_exists('startGroup', $input))
            $text->startGroup = $input['startGroup'];
        if (array_key_exists('minLength', $input))
            $text->minLength = $input['minLength'];
        if (array_key_exists('maxLength', $input))
            $text->maxLength = $input['maxLength'];
        $project->texts()->save($text);

        /* @var Language $language */
        foreach ($project->languages as $language) {
            $lt = new Localtext();
            $lt->language_id = $language->id;
            $lt->value = '';
            $text->saveLocale($lt);
        }
        $project->calculateState();
        $text->load(['values']);
        return $text;
    }

    public function updateText(Request $request, Project $project, Text $text) {
        $input = $request->all();
        $text->name = $input['name'];
        $text->description = $input['description'];
        $text->startGroup = $input['startGroup'];
        $text->minLength = $input['minLength'];
        $text->maxLength = $input['maxLength'];
        $text->save();
        $project->calculateState();
        return $text;
    }

    public function getText(Text $text) {
        $text->load(['values']);
        return $text;
    }

    public function deleteText(Text $text){
        $text->delete();
        return response('{}');
    }

    public function textVersions(Request $request, Project $project) {
        if ($project == null)
            return null;

        $input = $request->all();
        $text_id = self::getString($input, 'textId');
        $languageCode = self::getString($input, 'languageCode');
        $text = $project->getText($text_id);
        $versions = [];

        /* @var \App\Localtext $localeText */
        foreach ($text->versionedValues as $localeText) {
            if ($localeText->language->code === $languageCode)
                $versions[] = $localeText->value;
        }
        return $versions;
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