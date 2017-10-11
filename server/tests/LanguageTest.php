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
        $this->call('DELETE', '/api/v1/projects/sample_project/languages', array('code' => 'fr'), $this->cookies());
        $this->assertStatusOk('remove locale');
        $this->dontSeeJson([
            'code' => 'fr',
            'name' => 'French'
        ]);
        $this->logout();
    }
}