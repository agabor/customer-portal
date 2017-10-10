<?php

class UserTest extends TestCase {

    public function testProjectAddUser()
    {
        $this->login();
        $user_data = ['name' => 'test_user', 'email' => 'test@test.test'];
        $this->call('POST', '/api/v1/projects/sample_project/users', $user_data, $this->cookies());
        $this->assertStatusOk('add user');
        $this->seeJson($user_data);
        $resp = json_decode($this->response->getContent());
        $user_id = $resp->id;

        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($user_data);

        $user_data['name'] = 'test_user2';
        $user_data['email'] = 'test@test.test2';
        $this->call('POST', '/api/v1/projects/sample_project/users/'.$user_id, $user_data, $this->cookies());
        $this->assertStatusOk('modify user');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->seeJson($user_data);

        $this->call('DELETE', '/api/v1/projects/sample_project/users/'.$user_id, array(), $this->cookies());
        $this->assertStatusOk('delete user');
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->dontSeeJson($user_data);

        $this->logout();
    }
}