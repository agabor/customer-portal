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
                    'text_id' => 'webpage_title',
                    'min_length' => 10,
                    'max_length' => 20,
                    'localtexts' => [
                        [
                            'locale_code' => 'en_US',
                            'value' => 'Sample Project Webpage'
                        ],
                        [
                            'locale_code' => 'hu_HU',
                            'value' => 'Pelda Projekt Weboldal'
                        ]
                    ],
                ]],
                'images' => [[
                    'image_id' => 'facebook_icon',
                    'name' => 'Facebook Icon',
                    'width' => 500,
                    'height' => 512,
                    'preferredWidth' => 512,
                    'preferredHeight' => 512,
                    'file_name' => 'logo.png',
                    'conditions' => []
                ]],
                'files' => [
                    [
                        'file_id' => 'terms_and_conditions',
                        'name' => 'Terms and Conditions',
                        'file_name' => 'licence.pdf',
                        'max_size' => 10000,
                        'ext' => [
                            'doc',
                            'docx',
                            'pdf'
                        ],
                    ]
                ],
                'locales' => [
                    [
                        'locale_id' => 'en_US',
                        'name' => 'English'
                    ],
                    [
                        'locale_id' => 'hu_HU',
                        'name' => 'Hungarian'
                    ]
                ]
            ]);
        $this->assertEquals(200, $this->response->status());
        $this->post('/api/v1/logout',array(), array('token' => $actual['jwt']));
        $this->assertEquals(200, $this->response->status());
    }
}