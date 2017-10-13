<?php


/**
 * Customer Portal
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: 0.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
use App\Http\Controllers\DefaultApi;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectImageController;
use Illuminate\Support\Facades\Artisan;

/**
 * Customer Portal
 * @version 0.1
 */

$app->get('/', function () use ($app) {
    return $app->version();
});

$app->get('/init', function () {
    Artisan::call('migrate:refresh');
    Artisan::call('db:seed');
});

$app->group(['middleware' => 'cors', 'prefix' => '/api/v1/'], function () use ($app) {
    $app->POST('login', DefaultApi::class . '@loginPost');
    $app->GET('token/{login_token}', DefaultApi::class . '@loginLinkGet');
});

$app->group(['middleware' => ['auth', 'cors'], 'prefix' => '/api/v1/'], function () use ($app) {


    $app->POST('logout', DefaultApi::class . '@logoutPost');
    $app->POST('setPassword', DefaultApi::class . '@setPassword');


    $app->GET('projects', DefaultApi::class . '@projectsGet');
    $app->PATCH('projects', DefaultApi::class . '@projectsPatch');
    $app->POST('projects/{project_id}', ProjectController::class . '@projectsModify');
    $app->DELETE('projects/{project_id}', ProjectController::class . '@projectsDelete');

    $app->POST('projects/{project_id}/languages', ProjectController::class . '@addLanguage');
    $app->DELETE('projects/{project_id}/languages', ProjectController::class . '@removeLanguage');


    $app->GET('projects/{id}', DefaultApi::class . '@projectsIdGet');

    $app->GET('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageGet');
    $app->POST('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imagePost');
    $app->PATCH('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageModify');
    $app->DELETE('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageDelete');

    $app->PATCH('projects/{project_id}/images', ProjectImageController::class . '@imagePatch');
    $app->PUT('projects/{project_id}/texts', DefaultApi::class . '@projectsIdPutTexts');

    $app->POST('projects/{project_id}/users', ProjectController::class . '@addUser');
    $app->POST('projects/{project_id}/users/{user_id}', ProjectController::class . '@modifyUser');
    $app->DELETE('projects/{project_id}/users/{user_id}', ProjectController::class . '@deleteUser');

    $app->POST('projects/{project_id}/links', ProjectController::class . '@addLink');
    $app->POST('projects/{project_id}/links/{link_id}', ProjectController::class . '@modifyLink');
    $app->DELETE('projects/{project_id}/links/{link_id}', ProjectController::class . '@deleteLink');

    $app->GET('projects/{project_id}/text_versions',ProjectController::class . '@textVersions');
});
