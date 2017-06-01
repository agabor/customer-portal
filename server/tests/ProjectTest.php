<?php

use App\Project;
use Illuminate\Http\UploadedFile;

class ProjectTest extends TestCase
{
    private $jwt;
    private $imgCount;

    public function testProjectList()
    {
        $this->login();
        $this->json('GET', '/api/v1/projects', array(), $this->header())
            ->seeJson([
                'name' => 'Sample Project',
                'slug' => 'sample_project',
                'warnings' => 4,
                'progress' => 20
            ]);
        $this->assertStatus200('project list');
        $this->logout();
    }

    public function testProjectData()
    {
        $this->login();
        $this->json('GET', '/api/v1/projects/sample_project', array(), $this->header())
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
        $this->logout();
    }

    public function testAddDeleteProject()
    {
        $this->login();

        $data = [
            'name' => 'New Project',
            'slug' => 'new_project'
        ];
        $this->addProject($data);

        $this->deleteProject($data);

        $this->logout();
    }

    public function testAddDeleteImage()
    {
        $this->login();

        $imageId = 'sample_image';


        $this->addImage($imageId, 'Sample Image');

        $this->assertImageCountIncreased();

        $this->deleteImage($imageId);

        $this->assertImageCountIsOriginal();

        $this->logout();
    }

    public function testAddModifyDeleteImage()
    {
        $this->login();

        $imageId = 'image_to_modify';
        $this->addImage($imageId, 'Image To Modify');

        $this->assertImageCountIncreased();

        $newName = 'Sample Image Modified';
        $newImageId = 'sample_image_modified';
        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images/' . $imageId, ['name' => $newName], $this->header());
        $this->assertStatus200('modify sample_image');
        $result ->seeJson([
            'name' => $newName,
            'imageId' => $newImageId,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);
        self::assertEquals($newName, self::sampleProject()->getImageWithId($newImageId)->name);

        $this->deleteImage($newImageId);

        $this->assertImageCountIsOriginal();

        $this->logout();
    }

    public function testAddUploadDeleteImage()
    {
        $this->login();

        $imageId = 'image_to_upload';
        $this->addImage($imageId, 'Image To Upload');

        $this->assertImageCountIncreased();

        $path = base_path('testdata/temp.png');
        $fileName = 'ikon.png';
        copy(base_path('testdata/' . $fileName), $path);
        $file = new UploadedFile($path, $fileName, filesize($path), 'image/png', null, true);

        $this->call('POST', '/api/v1/projects/sample_project/images/' . $imageId, $this->header(), [], ['image' => $file]);
        $this->assertStatus200('post image');
        $image = self::sampleProject()->getImageWithId($imageId);
        self::assertEquals($fileName, $image->fileName);
        self::assertTrue(file_exists($image->filePath()));

        $this->deleteImage($imageId);
        $this->assertImageCountIsOriginal();
        self::assertFalse(file_exists($image->filePath()));

        $this->logout();
    }


    private static function sampleProject() : Project
    {
        return Project::where('slug', 'sample_project')->first();
    }


    protected function login()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertEquals(200, $this->response->status(), 'login');
        $actual = json_decode($this->response->getContent(), true);
        $this->jwt = $actual['jwt'];
        $this->imgCount = $this->sampleProjectImageCount();
    }

    protected function header(): array
    {
        return array('token' => $this->jwt);
    }


    protected function addImage(string $expectedId, string $imageName)
    {
        $result = $this->json('PATCH', '/api/v1/projects/sample_project/images', ['name' => $imageName,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100], $this->header());
        $this->assertEquals(200, $this->response->status(), 'add sample_image');
        $result->seeJsonEquals([
            'name' => $imageName,
            'imageId' => $expectedId,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);
    }


    protected function deleteImage(string $imageId)
    {
        $this->delete('/api/v1/projects/sample_project/images/'. $imageId, [], $this->header());
        $this->assertStatus200('delete ' . $imageId);
        self::assertEquals(2, $this->sampleProjectImageCount());
    }

    protected function logout()
    {
        $this->post('/api/v1/logout', array(), $this->header());
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

    /**
     * @return int
     */
    protected function sampleProjectImageCount(): int
    {
        return count(self::sampleProject()->images);
    }

    protected function assertImageCountIncreased()
    {
        self::assertEquals($this->imgCount + 1, $this->sampleProjectImageCount());
    }

    protected function assertImageCountIsOriginal()
    {
        self::assertEquals($this->imgCount, $this->sampleProjectImageCount());
    }

    /**
     * @param $data
     */
    protected function addProject($data)
    {
        $result = $this->json('PATCH', '/api/v1/projects', ['name' => $data['name']], $this->header());
        $this->assertEquals(200, $this->response->status(), 'add new project');
        $result->seeJsonEquals($data);
    }

    /**
     * @param $data
     */
    protected function deleteProject($data)
    {
        $this->json('DELETE', '/api/v1/projects/' . $data['slug'], [], $this->header());
        $this->assertEquals(200, $this->response->status(), 'delete new project');
    }
}