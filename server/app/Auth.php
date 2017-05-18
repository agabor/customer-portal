<?php
/**
 * Created by PhpStorm.
 * User: Gabor
 * Date: 5/17/2017
 * Time: 5:22 PM
 */

namespace App;


use Firebase\JWT\JWT;

class Auth
{
    static private $user;

    public static function login(User $user){
        self::$user = $user;
    }

    public static function user() : User{
        return self::$user;
    }

    public static function startSession(User $user)
    {
        self::$user = $user;
        $user->session_id = uniqid();
        $user->save();
    }

    public static function JWT() : string
    {
        return JWT::encode(array('id' => self::$user ->id, 'session_id' => self::$user ->session_id), env('APP_KEY'));
    }

    public static function tryLogin($token) : bool
    {
        if ($token == null)
            return false;

        $decoded = JWT::decode($token, env('APP_KEY'), array('HS256'));
        if ($decoded == null )
            return false;

        $u = User::find($decoded->id);
        if ($u == null || !isset($decoded->session_id) || $u->session_id != $decoded->session_id)
            return false;
        self::login($u);
        return true;
    }
}