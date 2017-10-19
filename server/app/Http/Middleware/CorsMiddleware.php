<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CorsMiddleware {
    public function handle(Request $request, \Closure $next)
    {
        $response = $next($request);
        if ($response instanceof BinaryFileResponse)
            return $response;
        $referrer = $request->headers->get('referer');
        $response
            //->header('Access-Control-Allow-Origin', env('CLIENT_URL'))
            ->header('Access-Control-Allow-Origin', substr($referrer, 0, strpos($referrer, '/', 8)) )
            ->header('Access-Control-Allow-Credentials', 'true');;
        return $response;
    }
}