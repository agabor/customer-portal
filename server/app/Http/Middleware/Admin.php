<?php

namespace App\Http\Middleware;

use App\Auth;
use App\Http\Controllers\Controller;
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
        if (!Controller::$project->admin) {
            return self::unauthorized();
        }

        return $next($request);
    }

    private static function unauthorized() : Response {
        return response(Controller::$project, 401);
    }
}
