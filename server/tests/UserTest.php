<?php

use App\User;

class UserTest extends TestCase {

    public function testProjectAddUser()
    {
        $this->login();
        $user_data = ['name' => 'test_user', 'email' => 'test@test.test'];
        $user_id = $this->addUser($user_data)->id;

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

        $this->deleteUser($user_id);
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
        $this->dontSeeJson($user_data);

        $this->logout();
    }
    public function testSetPassword()
    {
        $this->login();
        $user_data = ['name' => 'test_user', 'email' => 'test@test.test'];
        $user = $this->addUser($user_data);
        $this->logout();

        $this->call('GET', '/api/v1/token/'.$user->loginToken, array());
        $this->jwt = $this->getJWT();


        $this->call('POST', '/api/v1/setPassword', ['password' => 'newPassword'], $this->cookies());
        $this->assertStatusOk('setPassword');

        $this->logout();

        $this->login(['email' => 'test@test.test', 'password' => 'newPassword']);
        $this->logout();

        $this->login();
        $this->deleteUser($user->id);
        $this->logout();
    }
    public function testAuthorization()
    {
        $this->login();
        $user_data = ['name' => 'test_user2', 'email' => 'test2@test.test'];
        $user = $this->addUser($user_data);
        $this->logout();

        $this->call('GET', '/api/v1/token/'.$user->loginToken, array());
        $this->assertStatusOk('token login');
        $this->jwt = $this->getJWT();

        $this->call('POST', '/api/v1/projects/sample_project', ['name' =>'Something Else'], $this->cookies());
        $this->assertStatus('modify project', 401);

        $this->logout();

        $this->login();
        $this->deleteUser($user->id);
        $this->logout();
    }


    /**
     * @param $user_data
     * @return mixed
     */
    private function addUser($user_data) : User
    {
        $this->call('POST', '/api/v1/projects/sample_project/users', $user_data, $this->cookies());
        $this->assertStatusOk('add user');
        $this->seeJson($user_data);
        return new User(json_decode($this->response->getContent(), true));
    }

    /**
     * @param $user_id
     */
    private function deleteUser($user_id)
    {
        $this->call('DELETE', '/api/v1/projects/sample_project/users/' . $user_id, array(), $this->cookies());
        $this->assertStatusOk('delete user');
    }
}