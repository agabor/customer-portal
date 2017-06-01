<?php
/**
 * Created by PhpStorm.
 * User: Gabor
 * Date: 6/1/2017
 * Time: 4:57 PM
 */

namespace App\Http\Middleware;


use App\Auth;
use App\Http\Controllers\ProjectImageController;
use Illuminate\Http\Request;

class ModelBinderMiddleware
{
    public function handle(Request $request, \Closure $next){
        $params = $request->route()[2];
        if (isset($params['project_id'])){
            $project_id = $params['project_id'];
            foreach (Auth::user()->projects as $project){
                if ($project->slug == $project_id){
                    ProjectImageController::$project = $project;
                    if (isset($params['image_id'])) {
                        $image_id = $params['image_id'];
                        foreach ($project->images as $image){
                            if ($image->imageId == $image_id)
                                ProjectImageController::$image = $image;
                        }
                    }
                }
            }
        }
        return $next($request);
    }

}