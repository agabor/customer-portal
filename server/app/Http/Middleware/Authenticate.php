<?php

namespace App\Http\Middleware;

use App\Auth;
use App\Http\Controllers\DefaultApi;
use App\User;
use Closure;
use Illuminate\Http\Request;
use \Firebase\JWT\JWT;

class Authenticate
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string|null  $guard
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        $token = $request->header('token');
        if ($token == null) {
            return response(array('error' => 'unauthorized'), 401);
        }
        $decoded = JWT::decode($token, env('APP_KEY'), array('HS256'));
        if ($decoded == null ) {
            return response(array('error' => 'unauthorized'), 401);
        }
        $u = User::findOrFail($decoded->id);
        Auth::login($u);

        return $next($request);
    }
}
