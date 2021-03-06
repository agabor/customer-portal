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
use App\Image;
use App\Link;
use App\Project;
use App\Text;
use App\User;
use Illuminate\Container\Container;
use Illuminate\Http\Request;

class ModelBinderMiddleware
{
    /*
     * @var \Illuminate\Contracts\Container\Container $app
     */
    var $app;

    public function __construct()
    {
        $this->app = Container::getInstance();
    }

    public function handle(Request $request, \Closure $next){
        $params = $request->route()[2];
        if (array_key_exists('project_id', $params) && is_string($params['project_id'])){
            $project_id = $params['project_id'];
            /* @var Project $project */
            foreach (Auth::user()->projects as $project){
                if ($project->slug === $project_id) {
                    $this->app->instance(Project::class, $project);
                    $this->bindImage($params, $project);
                    $this->bindUser($params, $project);
                    $this->bindLink($params, $project);
                    $this->bindText($params, $project);
                    break;
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
                    $this->app->instance(User::class, $user);
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
                    $this->app->instance(Link::class, $link);
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
                    $this->app->instance(Image::class, $image);
                    break;
                }
            }
        }
    }

    private function bindText(array $params, Project $project)
    {
        if (array_key_exists('text_id', $params) && is_string($params['text_id'])) {

            /* @var string $text_id */
            $text_id = $params['text_id'];

            /* @var Text $text */
            foreach ($project->texts as $text) {
                if ($text->textId == $text_id) {
                    $this->app->instance(Text::class, $text);
                    break;
                }
            }
        }
    }

}