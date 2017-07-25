<?php

namespace App\Http\Middleware;

use App\Auth;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class Authenticate
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
        //$token = $request->header('token');
        //if ($token == null)
        //    $token = $request->get('token');
        $token = $request->cookie('jwt');
        if (!Auth::tryLogin($token))
            return self::unauthorized();

        return $next($request);
    }

    private static function unauthorized() : Response {
        return response(array('error' => 'unauthorized'), 401);
    }
}
