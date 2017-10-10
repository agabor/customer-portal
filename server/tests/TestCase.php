<?php

use App\Project;
use Symfony\Component\HttpFoundation\Cookie;

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
    private $jwt;
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


    protected function login()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
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
        $status = $this->response->status();
        if ($status == 500)
            file_put_contents('E:\temp\\'.$message.' err.html', $this->response->content());
        $this->assertEquals(200, $status, $message);
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
}
