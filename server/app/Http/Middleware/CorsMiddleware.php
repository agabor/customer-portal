<?php

namespace App\Http\Middleware;

use function App\origin;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

class CorsMiddleware {
    public function handle(Request $request, \Closure $next)
    {
        $response = $next($request);
        if ($response instanceof BinaryFileResponse)
            return $response;
        $origin = origin($request);
        $response
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Credentials', 'true');;
        return $response;
    }


}