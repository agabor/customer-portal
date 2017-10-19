<?php

namespace App\Providers;

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
            $referrer = $request->headers->get('referer');
            app()->options($request->path(), function () use ($referrer) {
                $res = response('OK', 200)
                    //->header('Access-Control-Allow-Origin', env('CLIENT_URL'))
                    ->header('Access-Control-Allow-Origin', substr($referrer, 0, strpos($referrer, '/', 8)) )
                    ->header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE, PATCH')
                    ->header('Access-Control-Allow-Headers', 'Content-Type, Origin, token')
                    ->header('Access-Control-Allow-Credentials', 'true');
                return $res;
            });
        }
    }
}