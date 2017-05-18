<?php

class LoginTest extends TestCase
{
    public function testLoginLogout()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $actual = json_decode($this->response->getContent(), true);
        $this->post('/api/v1/logout',array(), array('token' => $actual['jwt']));
        $this->assertEquals(200, $this->response->status());
        $this->post('/api/v1/logout',array(), array('token' => $actual['jwt']));
        $this->assertEquals(401, $this->response->status());
    }
    public function testWrongPassword()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'wrong'])
            ->seeJsonEquals([
                'error' => 'password_error',
            ]);
        $this->assertEquals(401, $this->response->status());
    }
    public function testWrongUsername()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'wrong', 'password' => 'wrong'])
            ->seeJsonEquals([
                'error' => 'user_not_found',
            ]);
        $this->assertEquals(401, $this->response->status());
    }
}