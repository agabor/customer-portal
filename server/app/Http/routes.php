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
use App\Http\Controllers\ProjectImageController;

/**
 * Customer Portal
 * @version 0.1
 */

$app->get('/', function () use ($app) {
    return $app->version();
});


$app->group(['middleware' => 'cors', 'prefix' => '/api/v1/'], function () use ($app) {
    /**
     * POST loginPost
     * Summary:
     * Notes: Login with username and password. The response contains a JWT.
     * Output-Formats: [application/json]
     */
    $app->POST('login', DefaultApi::class . '@loginPost');
});

$app->group(['middleware' => ['auth', 'cors'], 'prefix' => '/api/v1/'], function () use ($app) {

    /**
     * POST logoutPost
     * Summary:
     * Notes:
     * Output-Formats: [application/json]
     */
    $app->POST('logout', DefaultApi::class . '@logoutPost');

    /**
     * GET projectsGet
     * Summary:
     * Notes: list of projects
     * Output-Formats: [application/json]
     */
    $app->GET('projects', DefaultApi::class . '@projectsGet');
    $app->PATCH('projects', DefaultApi::class . '@projectsPatch');

    /**
     * GET projectsIdGet
     * Summary:
     * Notes: project data
     * Output-Formats: [application/json]
     */
    $app->GET('projects/{id}', DefaultApi::class . '@projectsIdGet');
    $app->DELETE('projects/{id}', DefaultApi::class . '@projectsIdDelete');

    /**
     * GET projectsIdGet
     * Summary:
     * Notes: project data
     * Output-Formats: [application/json]
     */
    $app->GET('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageGet');
    $app->POST('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imagePost');
    $app->PATCH('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageModify');
    $app->DELETE('projects/{project_id}/images/{image_id}', ProjectImageController::class . '@imageDelete');

    $app->PATCH('projects/{project_id}/images', ProjectImageController::class . '@imagePatch');
    $app->PUT('projects/{project_id}/texts', DefaultApi::class . '@projectsIdPutTexts');

});
