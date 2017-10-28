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
use App\Http\Controllers\InitController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectImageController;
use App\Http\Controllers\ProjectLinkController;
use App\Http\Controllers\ProjectTextController;
use App\Http\Controllers\ProjectUserController;
use Illuminate\Support\Facades\Artisan;

/**
 * Customer Portal
 * @version 0.1
 */

$app->group(['middleware' => 'cors', 'prefix' => '/api/v1/'], function () use ($app) {
    $app->POST('login', DefaultApi::class . '@loginPost');
    $app->GET('token/{login_token}', DefaultApi::class . '@loginLinkGet');
});

$app->group(['middleware' => ['auth', 'cors'], 'prefix' => '/api/v1/'], function () use ($app) {
    $app->POST('logout', DefaultApi::class . '@logoutPost');
    $app->POST('setPassword', DefaultApi::class . '@setPassword');


    $app->GET('projects', DefaultApi::class . '@projectsGet');
    $app->PATCH('projects', DefaultApi::class . '@projectsPatch');
});

$app->group(['middleware' => ['auth', 'cors', 'model'], 'prefix' => '/api/v1/'], function () use ($app) {

    $app->GET('projects/{project_id}', ProjectController::class . '@projectsIdGet');
    $app->GET('languages', ProjectController::class . '@languages');
    $app->PUT('projects/{project_id}/texts', ProjectTextController::class . '@projectsIdPutTexts');
    $app->POST('projects/{project_id}/texts', ProjectTextController::class . '@addText');
    $app->DELETE('projects/{project_id}/texts/{text_id}', ProjectTextController::class . '@deleteText');
    $app->POST('projects/{project_id}/texts/{text_id}', ProjectTextController::class . '@updateText');
    $app->GET('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageGet');
    $app->POST('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imagePost');
    $app->GET('projects/{project_id}/text_versions',ProjectTextController::class . '@textVersions');
});

$app->group(['middleware' => ['auth', 'cors', 'model', 'admin'], 'prefix' => '/api/v1/'], function () use ($app) {

    $app->POST('projects/{project_id}/languages', ProjectController::class . '@addLanguage');
    $app->DELETE('projects/{project_id}/languages', ProjectController::class . '@removeLanguage');

    $app->POST('projects/{project_id}', ProjectController::class . '@projectsModify');
    $app->DELETE('projects/{project_id}', ProjectController::class . '@projectsDelete');
    $app->GET('projects/{project_id}/texts/{text_id}', ProjectTextController::class . '@getText');

    ProjectUserController::addRoutes($app);

    ProjectLinkController::addRoutes($app);

    ProjectImageController::addRoutes($app);
});
