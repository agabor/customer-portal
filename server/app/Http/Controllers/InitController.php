<?php

namespace App\Http\Controllers;

class InitController extends Controller {
    function init() {
        Artisan::call('droptables');
        Artisan::call('migrate:refresh');
        Artisan::call('db:seed');
        unlink(__FILE__);
    }
}