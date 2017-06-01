<?php

use App\Project;
use Illuminate\Http\UploadedFile;

class ProjectTest extends TestCase
{

    public function testProjectList()
    {
        $jwt = $this->login();
        $this->json('GET', '/api/v1/projects', array(), $this->header($jwt))
            ->seeJson([
                'name' => 'Sample Project',
                'slug' => 'sample_project',
                'warnings' => 4,
                'progress' => 20
            ]);
        $this->assertStatus200('project list');
        $this->logout($jwt);
    }

    public function testProjectData()
    {
        $jwt = $this->login();
        $this->json('GET', '/api/v1/projects/sample_project', array(), $this->header($jwt))
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
        $this->assertStatus200('project equals');
        $this->logout($jwt);
    }

    public function testAddDeleteImage()
    {
        $jwt = $this->login();
        $headers = $this->header($jwt);

        $imageId = 'sample_image';
        $this->addImage($headers, $imageId, 'Sample Image');

        self::assertEquals(3, count(self::sampleProject()->images));

        $this->deleteImage($headers, $imageId);

        self::assertEquals(2, count(self::sampleProject()->images));

        $this->logout($jwt);
    }

    public function testAddModifyDeleteImage()
    {
        $jwt = $this->login();
        $headers = $this->header($jwt);

        $imageId = 'image_to_modify';
        $this->addImage($headers, $imageId, 'Image To Modify');

        self::assertEquals(3, count(self::sampleProject()->images));

        $newName = 'Sample Image Modified';
        $newImageId = 'sample_image_modified';
        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images/' . $imageId, ['name' => $newName], $headers);
        $this->assertStatus200('modify sample_image');
        $result ->seeJson([
            'name' => $newName,
            'imageId' => $newImageId,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);
        self::assertEquals($newName, self::sampleProject()->getImageWithId($newImageId)->name);

        $this->deleteImage($headers, $newImageId);

        $this->logout($jwt);
    }

    public function testAddUploadDeleteImage()
    {
        $jwt = $this->login();
        $headers = $this->header($jwt);

        $imageId = 'image_to_upload';
        $this->addImage($headers, $imageId, 'Image To Upload');

        self::assertEquals(3, count(self::sampleProject()->images));

        $path = base_path('testdata/temp.png');
        $fileName = 'ikon.png';
        copy(base_path('testdata/' . $fileName), $path);
        $file = new UploadedFile($path, $fileName, filesize($path), 'image/png', null, true);

        $this->call('POST', '/api/v1/projects/sample_project/images/' . $imageId, $headers, [], ['image' => $file]);
        $this->assertStatus200('post image');
        $image = self::sampleProject()->getImageWithId($imageId);
        self::assertEquals($fileName, $image->fileName);
        self::assertTrue(file_exists($image->filePath()));

        $this->deleteImage($headers, $imageId);
        self::assertFalse(file_exists($image->filePath()));

        $this->logout($jwt);
    }

    /**
     * @return mixed
     */
    private static function sampleProject() : Project
    {
        return Project::where('slug', 'sample_project')->first();
    }

    /**
     * @return mixed
     */
    protected function login()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status(), 'login');
        $actual = json_decode($this->response->getContent(), true);

        $jwt = $actual['jwt'];
        return $jwt;
    }

    /**
     * @param $jwt
     * @return array
     */
    protected function header($jwt): array
    {
        return array('token' => $jwt);
    }

    /**
     * @param array $headers
     * @param string $expectedId
     * @param $imageName
     * @return $this|ProjectTest
     */
    protected function addImage(array $headers, string $expectedId, string $imageName)
    {
        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images', ['name' => $imageName,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100], $headers);
        $this->assertEquals(200, $this->response->status(), 'add sample_image');
        $result->seeJsonEquals([
            'name' => $imageName,
            'imageId' => $expectedId,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);
    }

    /**
     * @param $headers
     * @param $imageId
     */
    protected function deleteImage($headers, $imageId)
    {
        $this->delete('/api/v1/projects/sample_project/images/'. $imageId, [], $headers);
        $this->assertStatus200('delete ' . $imageId);
        self::assertEquals(2, count(self::sampleProject()->images));
    }

    /**
     * @param $jwt
     */
    protected function logout($jwt)
    {
        $this->post('/api/v1/logout', array(), $this->header($jwt));
        $this->assertStatus200('logout');
    }

    /**
     * @param $message
     */
    protected function assertStatus200($message)
    {
        if ($this->response->status() == 500)
            file_put_contents('E:\temp\\'.$message.' err.html', $this->response->content());
        $this->assertEquals(200, $this->response->status(), $message);
    }
}