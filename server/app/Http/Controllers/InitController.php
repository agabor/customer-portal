<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Artisan;

class InitController extends Controller {
    function init() {
        Artisan::call('droptables');
        Artisan::call('migrate:refresh');
        Artisan::call('db:seed');
        unlink(__FILE__);
    }
}