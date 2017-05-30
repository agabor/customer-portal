<?php

namespace App\Http\Middleware;

use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CorsMiddleware {
    public function handle($request, \Closure $next)
    {
        $response = $next($request);
        if ($response instanceof BinaryFileResponse)
            return $response;
        $response->header('Access-Control-Allow-Origin', '*');
        return $response;
    }
}