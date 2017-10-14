<?php

use Illuminate\Http\UploadedFile;

class ProjectTest extends TestCase
{
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

    public function testProjectData()
    {
        $this->login();
        $this->call('GET', '/api/v1/projects/sample_project', array(), $this->cookies());
        $this->assertStatusOk('get project');
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
                            'languageCode' => 'en',
                            'value' => 'Sample Project Webpage'
                        ],
                        [
                            'languageCode' => 'hu',
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
                        "fileName"=> ""
                    ],[
                        'imageId' => 'facebook_icon',
                        'name' => 'Facebook Icon',
                        'description' => 'This image will appear on Facebook, when users log in to your application.',
                        'width' => 512,
                        'height' => 512,
                        'preferredWidth' => 512,
                        'preferredHeight' => 512,
                        'fileName' => ''
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
                'links' => [],
                'users' => [['id' => 1,'email' => 'angyalgbr@gmail.com','name' => 'gabor', 'loginToken' => null]],
                'languages' => [
                    [
                        'code' => 'en',
                        'name' => 'English'
                    ],
                    [
                        'code' => 'hu',
                        'name' => 'Hungarian'
                    ]
                ],
            'admin' => true
            ]);
        $this->assertStatusOk('project equals');
        $this->logout();
    }


    public function testAddModifyDeleteProject()
    {
        $this->login();

        $data = [
            'name' => 'New Project',
            'slug' => 'new_project'
        ];
        $this->addProject($data);


        $data['name'] = 'Other Name';
        $this->call('POST', '/api/v1/projects/'.$data['slug'], ['name' => $data['name']], $this->cookies());
        $this->assertStatusOk('modify project');
        $this->seeJson(['name' => $data['name']]);
        $this->dontSeeJson(['slug' => $data['slug']]);

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


    protected function assertImageCountIncreased()
    {
        self::assertEquals($this->imgCount + 1, $this->sampleProjectImageCount());
    }

    protected function assertImageCountIsOriginal()
    {
        self::assertEquals($this->imgCount, $this->sampleProjectImageCount());
    }

    protected function addProject($data)
    {
        $this->call('PATCH', '/api/v1/projects', ['name' => $data['name']], $this->cookies());
        $this->assertStatusOk('add new project');
        $data['admin'] = true;
        $this->seeJson($data);
    }

    protected function deleteProject(array $data)
    {
        $this->call('DELETE', '/api/v1/projects/' . $data['slug'], [], $this->cookies());
        $this->assertStatusOk('delete new project');
    }



}