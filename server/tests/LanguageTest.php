<?php

use Matriphe\ISO639\ISO639;

class LanguageTest extends TestCase
{
    function testAddRemoveLanguage()
    {
        $this->login();
        $this->call('POST', '/api/v1/projects/sample_project/languages', array('code' => 'fr'), $this->cookies());
        $this->assertStatusOk('add locale');
        $this->seeJsonEquals([
            'code' => 'fr',
            'name' => 'French'
        ]);

        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());

        $response = json_decode($this->response->getContent());
        $texts = $response->texts;

        foreach ($texts as $text) {
            $found = false;
            foreach ($text->values as $value) {
                if ($value->languageCode === 'fr') {
                    $found = true;
                    break;
                }
            }
            assert($found);
        }

        $this->call('DELETE', '/api/v1/projects/sample_project/languages', array('code' => 'fr'), $this->cookies());
        $this->assertStatusOk('remove locale');
        $this->dontSeeJson([
            'code' => 'fr',
            'name' => 'French'
        ]);

        $this->logout();
    }
}