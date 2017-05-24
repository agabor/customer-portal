<?php

class ProjectTest extends TestCase
{

    public function testProjectList()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $actual = json_decode($this->response->getContent(), true);
        $this->json('GET', '/api/v1/projects', array(), array('token' => $actual['jwt']))
            ->seeJsonEquals([[
                'name' => 'Sample Project',
                'slug' => 'sample_project'
            ]]);
        $this->assertEquals(200, $this->response->status());
        $this->post('/api/v1/logout',array(), array('token' => $actual['jwt']));
        $this->assertEquals(200, $this->response->status());
    }

    public function testProjectData()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $actual = json_decode($this->response->getContent(), true);
        $this->json('GET', '/api/v1/projects/sample_project', array(), array('token' => $actual['jwt']))
            ->seeJsonEquals([
                'name' => 'Sample Project',
                'slug' => 'sample_project',
                'texts' => [[
                    'name' => 'Webpage Title',
                    'textId' => 'webpage_title',
                    'minLength' => 10,
                    'maxLength' => 20,
                    'values' => [
                        [
                            'localeCode' => 'en_US',
                            'value' => 'Sample Project Webpage'
                        ],
                        [
                            'localeCode' => 'hu_HU',
                            'value' => 'Pelda Projekt Weboldal'
                        ]
                    ],
                ]],
                'images' => [[
                    'imageId' => 'facebook_icon',
                    'name' => 'Facebook Icon',
                    'width' => 500,
                    'height' => 512,
                    'preferredWidth' => 512,
                    'preferredHeight' => 512,
                    'fileName' => 'logo.png',
                    'conditions' => []
                ]],
                'files' => [
                    [
                        'fileId' => 'terms_and_conditions',
                        'name' => 'Terms and Conditions',
                        'fileName' => 'licence.pdf',
                        'maxSize' => 10000,
                        'ext' => [
                            'doc',
                            'docx',
                            'pdf'
                        ],
                    ]
                ],
                'locales' => [
                    [
                        'localeId' => 'en_US',
                        'name' => 'English'
                    ],
                    [
                        'localeId' => 'hu_HU',
                        'name' => 'Hungarian'
                    ]
                ]
            ]);
        $this->assertEquals(200, $this->response->status());
        $this->post('/api/v1/logout',array(), array('token' => $actual['jwt']));
        $this->assertEquals(200, $this->response->status());
    }
}