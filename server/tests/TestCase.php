<?php

abstract class TestCase extends Laravel\Lumen\Testing\TestCase
{
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
        foreach ($this->response->headers->getCookies() as $cookie) {
            if ($cookie->getName() == "jwt") {
                return $cookie->getValue();
            }
        }
        return null;
    }
}
