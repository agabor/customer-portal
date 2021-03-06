<?php

namespace App\Providers;

use function App\origin;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $request = app('request');


        // ALLOW OPTIONS METHOD
        if($request->getMethod() === 'OPTIONS')  {
            $origin = origin($request);
            app()->options($request->path(), function () use ($origin) {
                $res = response('OK', 200)
                    //->header('Access-Control-Allow-Origin', env('CLIENT_URL'))
                    ->header('Access-Control-Allow-Origin', $origin )
                    ->header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Origin, token')
                    ->header('Access-Control-Allow-Credentials', 'true');
                return $res;
            });
        }
    }
}