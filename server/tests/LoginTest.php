<?php

class LoginTest extends TestCase
{
    public function testLoginLogout()
    {
        $this->json('POST', '/api/v1/login', ['email' => 'angyalgabor@outlook.com', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $jwt = $this->getJWT();
        $this->call('post', '/api/v1/logout',array(), array('jwt' => $jwt));
        $this->assertEquals(200, $this->response->status());
        $this->call('post', '/api/v1/logout',array(), array('jwt' => $jwt));
        $this->assertEquals(401, $this->response->status());
    }
    public function testWrongPassword()
    {
        $this->json('POST', '/api/v1/login', ['email' => 'angyalgabor@outlook.com', 'password' => 'wrong'])
            ->seeJsonEquals([
                'error' => 'password_error',
            ]);
        $this->assertEquals(401, $this->response->status());
    }
    public function testWrongUsername()
    {
        $this->json('POST', '/api/v1/login', ['email' => 'wrong@email.com', 'password' => 'wrong'])
            ->seeJsonEquals([
                'error' => 'user_not_found',
            ]);
        $this->assertEquals(401, $this->response->status());
    }


}