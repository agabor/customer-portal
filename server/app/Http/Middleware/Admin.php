<?php

namespace App\Http\Middleware;

use App\Project;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Admin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $project = app(Project::class);
        if (!$project->admin) {
            return self::unauthorized($project);
        }

        return $next($request);
    }

    private static function unauthorized(Project $project) : Response {
        return response($project, 401);
    }
}
