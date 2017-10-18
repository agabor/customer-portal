<?php

use App\Project;
use Symfony\Component\HttpFoundation\Cookie;

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    protected $jwt;
    protected $imgCount;

    /**
     * Creates the application.
     *
     * @return \Laravel\Lumen\Application
     */
    public function createApplication()
    {
        return require __DIR__.'/../bootstrap/app.php';
    }

    protected function getJWT()
    {
        /* @var Cookie $cookie */
        foreach ($this->response->headers->getCookies() as $cookie) {
            if ($cookie->getName() == "jwt") {
                return $cookie->getValue();
            }
        }
        return null;
    }


    protected function login(array $data = null)
    {
        if ($data == null)
            $data = ['email' => 'angyalgabor@outlook.com', 'password' => 'secret'];
        $this->json('POST', '/api/v1/login', $data);
        $this->assertStatusOk('login');
        $this->jwt = $this->getJWT();
        $this->imgCount = $this->sampleProjectImageCount();
    }

    protected function logout()
    {
        $this->call('POST', '/api/v1/logout', array(), $this->cookies());
        $this->assertStatusOk('logout');
    }


    protected function assertStatusOk($message)
    {
        $this->assertStatus($message, 200);
    }


    protected function cookies(): array
    {
        return array('jwt' => $this->jwt);
    }


    protected function sampleProjectImageCount(): int
    {
        return count(self::sampleProject()->images);
    }


    protected static function sampleProject() : Project
    {
        return Project::where('slug', 'sample_project')->first();
    }

    /**
     * @param $message
     * @param $expectedStatus
     */
    protected function assertStatus($message, $expectedStatus)
    {
        $status = $this->response->status();
        if ($status !== $expectedStatus)
            file_put_contents('E:\temp\\' . $message . ' err.html', $this->response->content());
        $this->assertEquals($expectedStatus, $status, $message);
    }
}
