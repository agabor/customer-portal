<?php

class LinkTest extends TestCase {

    public function testProjectAddLink()
    {
        $this->login();
        $link_data = ['name' => 'Play Store', 'icon' => 'fa-google', 'url' => 'http://google.com'];
        $resp = $this->addLink($link_data);
        $link_id = $resp->id;

        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($link_data);

        $link_data['name'] = 'Play Store2';
        $link_data['icon'] = 'fa-facebook';
        $link_data['url'] = 'http://google.com';

        $this->call('POST', '/api/v1/projects/sample_project/links/'.$link_id, $link_data, $this->cookies());
        $this->assertStatusOk('modify link');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($link_data);

        $this->deleteLink($link_id, $link_data);

        $this->logout();
    }

    public function  testAddModifyDeleteLinks()
    {

        $this->login();
        $links = [];
        $links[] = ['name' => 'Play Store', 'icon' => 'fa-google', 'url' => 'http://google.com'];
        $links[] = ['name' => 'App Store', 'icon' => 'fa-apple', 'url' => 'http://apple.com'];
        $links[] = ['name' => 'Facebook', 'icon' => 'fa-facebook', 'url' => 'http://facebook.com'];

        foreach ($links as &$link) {
            $resp = $this->addLink($link);
            $link['id'] = $resp->id;
        }

        $links[0]['url'] = 'http://1.com';
        $links[1]['url'] = 'http://2.com';
        $links[2]['url'] = 'http://3.com';
        $this->call('PUT', '/api/v1/projects/sample_project/links', array('sources' => $links), $this->cookies());
        $this->assertStatusOk('put links');

        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($links[0]);
        $this->seeJson($links[1]);
        $this->seeJson($links[2]);

        foreach ($links as &$link) {
            $this->deleteLink($link['id'], $link);
        }

        $this->logout();
    }

    protected function addLink($link_data): stdClass
    {
        $this->call('POST', '/api/v1/projects/sample_project/links', $link_data, $this->cookies());
        $this->assertStatusOk('add link');
        $this->seeJson($link_data);
        $resp = json_decode($this->response->getContent());
        return $resp;
    }

    protected function deleteLink($link_id, $link_data)
    {
        $this->call('DELETE', '/api/v1/projects/sample_project/links/' . $link_id, array(), $this->cookies());
        $this->assertStatusOk('delete link');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->dontSeeJson($link_data);
    }
}