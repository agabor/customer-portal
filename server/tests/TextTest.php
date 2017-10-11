<?php

class TextTest extends TestCase {

    public function testVersionedTexts()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());

        $response = json_decode($this->response->getContent(), true);
        $texts = $response['texts'];
        $texts[0]['values'][0]['value'] = 'changed';
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project/text_versions', ['text_id' => 'webpage_title', 'locale_id' => 'en'], $this->cookies());
        $this->assertStatusOk('text versions');
        $response = json_decode($this->response->getContent(), true);
        self::assertEquals(2, count($response));
        $this->logout();
    }

    public function testAddDeleteText()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());

        $response = json_decode($this->response->getContent(), true);
        $texts = $response['texts'];
        $newTextData = [
            'name' => 'sample',
            'description' => 'abc',
            'textId' => 'sample',
            'minLength' => 9,
            'maxLength' => 99,
            'values' => [
                ['localeCode' => 'en', 'value' => 'a'],
                ['localeCode' => 'hu', 'value' => 'b']
            ]
        ];
        $texts[] = $newTextData;
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project', [], $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($newTextData);


        array_pop($texts);
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project', [], $this->cookies());
        $this->assertStatusOk('get project');
        $this->dontSeeJson($newTextData);

        $this->logout();
    }


    public function testAddUpdateText()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());

        $response = json_decode($this->response->getContent(), true);
        $texts = $response['texts'];
        $newTextData = [
            'name' => 'sample',
            'description' => 'abc',
            'textId' => 'sample',
            'minLength' => 9,
            'maxLength' => 99,
            'values' => []
        ];
        $texts[] = $newTextData;
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project', [], $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($newTextData);

        array_pop($texts);
        $newTextData['values'] = [
            ['localeCode' => 'en', 'value' => 'a'],
            ['localeCode' => 'hu', 'value' => 'b']
        ];

        $texts[] = $newTextData;
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project', [], $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($newTextData);

        $this->logout();
    }

}