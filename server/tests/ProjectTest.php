<?php

use App\Project;

class ProjectTest extends TestCase
{

    public function testProjectList()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $actual = json_decode($this->response->getContent(), true);
        $this->json('GET', '/api/v1/projects', array(), array('token' => $actual['jwt']))
            ->seeJson([
                'name' => 'Sample Project',
                'slug' => 'sample_project',
                'warnings' => 4,
                'progress' => 20
            ]);
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
                'warnings' => 4,
                'progress' => 20,
                'texts' => [[
                    'name' => 'Webpage Title',
                    'description' => 'This text will appear in the titlebar of the browser, an on the fron page of your website.',
                    'textId' => 'webpage_title',
                    'startGroup' => '',
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
                'images' => [
                    [
                        "imageId"=> "play_store_banner",
                        "name"=> "Play Store Banner",
                        "description"=> "This image will appear in the Google Play store as a banner.",
                        "width"=> 1024,
                        "height"=> 500,
                        "preferredHeight"=> 500,
                        "preferredWidth"=> 1024,
                        "fileName"=> "",
                        "conditions"=> []
                    ],[
                        'imageId' => 'facebook_icon',
                        'name' => 'Facebook Icon',
                        'description' => 'This image will appear on Facebook, when users log in to your application.',
                        'width' => 512,
                        'height' => 512,
                        'preferredWidth' => 512,
                        'preferredHeight' => 512,
                        'fileName' => '',
                        'conditions' => []
                    ]],
                'files' => [
                    [
                        'fileId' => 'terms_and_conditions',
                        'name' => 'Terms and Conditions',
                        'description' => 'Terms and conditions will be readable on your website. You can not start a webshop without this!',
                        'fileName' => 'licence.pdf',
                        'size' => 127,
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

    public function testAddDeleteImage()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status());
        $actual = json_decode($this->response->getContent(), true);

        $data = array('name' => 'Sample Image',
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100);
        $headers = array('token' => $actual['jwt']);

        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images', $data, $headers);
        $this->assertEquals(200, $this->response->status());
        $result ->seeJsonEquals([
                'name' => 'Sample Image',
                'imageId' => 'sample_image',
                'description' => 'description',
                'preferredWidth' => 100,
                'preferredHeight' => 100
            ]);

        self::assertEquals(3, count(self::sampleProject()->images));

        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images', $data, $headers);
        $this->assertEquals(200, $this->response->status());
        $result ->seeJsonEquals([
            'name' => 'Sample Image',
            'imageId' => 'sample_image2',
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);

        self::assertEquals(4, count(self::sampleProject()->images));

        $this->delete('/api/v1/projects/sample_project/images/sample_image',[], $headers);
        $this->assertEquals(200, $this->response->status());
        self::assertEquals(3, count(self::sampleProject()->images));

        $this->delete('/api/v1/projects/sample_project/images/sample_image2',[], $headers);
        $this->assertEquals(200, $this->response->status());
        self::assertEquals(2, count(self::sampleProject()->images));

        $this->post('/api/v1/logout',[], $headers);
        $this->assertEquals(200, $this->response->status());
    }

    /**
     * @return mixed
     */
    private static function sampleProject() : Project
    {
        return Project::where('slug', 'sample_project')->first();
    }
}