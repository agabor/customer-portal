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


namespace App\Http\Controllers;

use App\Auth;
use App\Project;
use App\User;
use Illuminate\Support\Facades\Request;
use \Firebase\JWT\JWT;

class DefaultApi extends Controller
{
    /**
     * Constructor
     */
    public function __construct()
    {
    }




    /**
     * Operation loginPost
     *
     * .
     *
     *
     * @return Http response
     */
    public function loginPost()
    {
        $input = Request::all();

        //not path params validation
        if (!isset($input['user_name'])) {
            throw new \InvalidArgumentException('Missing the required parameter $user_name when calling loginPost');
        }
        $user_name = $input['user_name'];

        if (!isset($input['password'])) {
            throw new \InvalidArgumentException('Missing the required parameter $password when calling loginPost');
        }
        $password = $input['password'];

        $u = User::where('name', $user_name)->first();

        if ($u == null)
            return response(array('error' => 'user_not_found'), 401);

        if (!password_verify($password, $u->password))
            return response(array('error' => 'password_error') , 401);

        Auth::startSession($u);

        return response(array('jwt' => Auth::JWT()));
    }
    /**
     * Operation logoutPost
     *
     * .
     *
     *
     * @return Http response
     */
    public function logoutPost()
    {
        Auth::logout();
        return response('');
    }
    /**
     * Operation projectsGet
     *
     * .
     *
     *
     * @return Http response
     */
    public function projectsGet()
    {
        return Project::all();
    }
    /**
     * Operation projectsIdGet
     *
     * .
     *
     * @param string $id project identifier (required)
     *
     * @return Http response
     */
    public function projectsIdGet(string $id)
    {
        $project = $this->getProjectWithSlug($id);
        if ($project == null)
            return response('',404);
        $project->load(['texts.localtexts', 'images.conditions', 'files', 'locales']);
        return $project;
    }

    protected function getProjectWithSlug(string $id) : Project
    {
        $project = Project::where('slug', $id)->first();
        return $project;
    }
}
