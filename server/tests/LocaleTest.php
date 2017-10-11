<?php

use Matriphe\ISO639\ISO639;

class LocaleTest extends TestCase
{
    function testAddLanguage()
    {
        $this->login();
        $this->call('POST', '/api/v1/projects/sample_project/locales', array('localeId' => 'fr'), $this->cookies());
        $this->assertStatusOk('add locale');
        $this->seeJsonEquals([
            'localeId' => 'fr',
            'name' => 'French'
        ]);
        $this->call('DELETE', '/api/v1/projects/sample_project/locales', array('localeId' => 'fr'), $this->cookies());
        $this->assertStatusOk('remove locale');
        $this->dontSeeJson([
            'localeId' => 'fr',
            'name' => 'French'
        ]);
        $this->logout();
    }
}