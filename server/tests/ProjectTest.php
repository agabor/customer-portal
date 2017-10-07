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
        $this->call('GET', '/api/v1/projects', array(), $this->cookies());
        $this->seeJson([
                'name' => 'Sample Project',
                'slug' => 'sample_project',
                'warnings' => 4,
                'progress' => 20
            ]);
        $this->assertStatusOk('project list');
        $this->logout();
    }

    public function testProjectAddUser()
    {
        $this->login();
        $user_data = ['name' => 'test_user', 'email' => 'test@test.test'];
        $this->call('POST', '/api/v1/projects/sample_project/add_user', $user_data, $this->cookies());
        $this->seeJson($user_data);
        $this->assertStatusOk('add user');
        $this->logout();
    }

    public function testProjectData()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->seeJsonEquals([
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
                        'conditions' => []
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
        $this->assertStatusOk('project equals');
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

    public function testAddDelete2Projects()
    {
        $this->login();

        $data = [
            'name' => 'New Project',
            'slug' => 'new_project'
        ];
        $data2 = [
            'name' => 'New Project',
            'slug' => 'new_project2'
        ];
        $this->addProject($data);
        $this->addProject($data2);

        $this->deleteProject($data);
        $this->deleteProject($data2);

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

    public function testAddDelete2Images()
    {
        $this->login();

        $imageId1 = 'sample_image';
        $imageId2 = 'sample_image2';

        $imageName = 'Sample Image';
        $this->addImage($imageId1, $imageName);
        $this->assertImageCountIncreased();
        $this->addImage($imageId2, $imageName);

        $this->deleteImage($imageId1);
        $this->deleteImage($imageId2);

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
        $this->call('PATCH', '/api/v1/projects/sample_project/images/' . $imageId, ['name' => $newName], $this->cookies());
        $this->assertStatusOk('modify sample_image');
        $this ->seeJson([
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

        $this->call('POST', '/api/v1/projects/sample_project/images/' . $imageId, [],  $this->cookies(), ['image' => $file]);
        $this->assertStatusOk('post image');
        $image = self::sampleProject()->getImageWithId($imageId);
        self::assertTrue(file_exists($image->filePath()));

        $this->deleteImage($imageId);
        $this->assertImageCountIsOriginal();
        self::assertFalse(file_exists($image->filePath()));

        $this->logout();
    }


    public function testVersionedTexts()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());

        $response = json_decode($this->response->getContent(), true);
        $texts = $response['texts'];
        $texts[0]['values'][0]['value'] = 'changed';
        $content = json_encode($texts);
        //dd($content);
        $this->call('PUT', '/api/v1/projects/sample_project/texts', ['sources' => $texts], $this->cookies());
        $this->assertStatusOk('put texts');
        $this->call('GET', '/api/v1/projects/sample_project/text_versions', ['text_id' => 'webpage_title', 'locale_id' => 'en_US'], $this->cookies());
        $this->assertStatusOk('text versions');
        $response = json_decode($this->response->getContent(), true);
        self::assertEquals(2, count($response));
        $this->logout();
    }

    private static function sampleProject() : Project
    {
        return Project::where('slug', 'sample_project')->first();
    }


    protected function login()
    {
        $this->json('POST', '/api/v1/login', ['user_name' => 'gabor', 'password' => 'secret']);
        $this->assertStatusOk('login');
        $this->jwt = $this->getJWT();
        $this->imgCount = $this->sampleProjectImageCount();
    }

    protected function cookies(): array
    {
        return array('jwt' => $this->jwt);
    }


    protected function addImage(string $expectedId, string $imageName)
    {
        $this->call('PATCH', '/api/v1/projects/sample_project/images', ['name' => $imageName,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100], $this->cookies());
        $this->assertStatusOk('add ' . $expectedId);
        $this->seeJsonEquals([
            'name' => $imageName,
            'imageId' => $expectedId,
            'description' => 'description',
            'preferredWidth' => 100,
            'preferredHeight' => 100
        ]);
    }


    protected function deleteImage(string $imageId)
    {
        $this->call('DELETE', '/api/v1/projects/sample_project/images/'. $imageId, [], $this->cookies());
        $this->assertStatusOk('delete ' . $imageId);
    }

    protected function logout()
    {
        $this->call('POST', '/api/v1/logout', array(), $this->cookies());
        $this->assertStatusOk('logout');
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
        $this->call('PATCH', '/api/v1/projects', ['name' => $data['name']], $this->cookies());
        $this->assertStatusOk('add new project');
        $this->seeJsonEquals($data);
    }

    /**
     * @param $data
     */
    protected function deleteProject($data)
    {
        $this->call('DELETE', '/api/v1/projects/' . $data['slug'], [], $this->cookies());
        $this->assertStatusOk('delete new project');
    }

    protected function assertStatusOk($message)
    {
        $status = $this->response->status();
        if ($status == 500)
            file_put_contents('E:\temp\\'.$message.' err.html', $this->response->content());
        $this->assertEquals(200, $status, $message);
    }


}