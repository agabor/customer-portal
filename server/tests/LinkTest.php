<?php

class LinkTest extends TestCase {

    public function testProjectAddLink()
    {
        $this->login();
        $link_data = ['name' => 'Play Store', 'icon' => 'fa_google', 'url' => 'http://google.com'];
        $this->call('POST', '/api/v1/projects/sample_project/links', $link_data, $this->cookies());
        $this->assertStatusOk('add link');
        $this->seeJson($link_data);
        $resp = json_decode($this->response->getContent());
        $link_id = $resp->id;

        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($link_data);

        $link_data['name'] = 'Play Store2';
        $link_data['icon'] = 'fa_facebook';
        $link_data['url'] = 'http://google.com';

        $this->call('POST', '/api/v1/projects/sample_project/links/'.$link_id, $link_data, $this->cookies());
        $this->assertStatusOk('modify link');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($link_data);

        $this->call('DELETE', '/api/v1/projects/sample_project/links/'.$link_id, array(), $this->cookies());
        $this->assertStatusOk('delete link');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->dontSeeJson($link_data);

        $this->logout();
    }
}