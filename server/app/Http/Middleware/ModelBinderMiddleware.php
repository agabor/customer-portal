<?php
/**
 * Created by PhpStorm.
 * User: Gabor
 * Date: 6/1/2017
 * Time: 4:57 PM
 */

namespace App\Http\Middleware;


use App\Auth;
use App\Http\Controllers\Controller;
use App\Http\Controllers\ProjectImageController;
use App\Link;
use App\Project;
use App\User;
use Illuminate\Http\Request;

class ModelBinderMiddleware
{
    public function handle(Request $request, \Closure $next){
        $params = $request->route()[2];
        if (array_key_exists('project_id', $params)){
            $project_id = $params['project_id'];

            /* @var Project $project */
            foreach (Auth::user()->projects as $project){
                if ($project->slug == $project_id) {
                    Controller::$project = $project;
                    $this->bindImage($params, $project);
                    $this->bindUser($params, $project);
                    $this->bindLink($params, $project);
                }
            }
        }
        return $next($request);
    }

    private function bindUser(array $params, Project $project)
    {
        if (array_key_exists('user_id', $params) && is_numeric($params['user_id'])) {

            $user_id = intval($params['user_id']);

            /* @var User $user */
            foreach ($project->users as $user) {
                if ($user->id == $user_id) {
                    Controller::$user = $user;
                    break;
                }
            }
        }
    }

    private function bindLink(array $params, Project $project)
    {
        if (array_key_exists('link_id', $params) && is_numeric($params['link_id'])) {

            $link_id = intval($params['link_id']);

            /* @var Link $link */
            foreach ($project->links as $link) {
                if ($link->id == $link_id) {
                    Controller::$link = $link;
                    break;
                }
            }
        }
    }

    private function bindImage(array $params, Project $project)
    {
        if (array_key_exists('image_id', $params) && is_string($params['image_id'])) {

            /* @var string $image_id */
            $image_id = $params['image_id'];

            foreach ($project->images as $image) {
                if ($image->imageId == $image_id) {
                    Controller::$image = $image;
                    break;
                }
            }
        }
    }

}