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
    /**
     * @var User
     */
    static private $user;

    /**
     * @var Session
     */
    static private $session;


    public static function user() : User
    {
        return self::$user;
    }

    public static function startSession(User $user)
    {
        self::$user = $user;
        self::$session = new Session();
        self::$session->session_id = uniqid();
        self::$user->sessions()->save(self::$session);
    }

    public static function JWT() : string
    {
        return JWT::encode(array('session_id' => self::$session->session_id), env('APP_KEY'));
    }

    public static function tryLogin($token) : bool
    {
        if ($token == null)
            return false;

        $decoded = JWT::decode($token, env('APP_KEY'), array('HS256'));
        if ($decoded == null )
            return false;

        if(!isset($decoded->session_id))
            return false;

        self::$session = Session::where('session_id', $decoded->session_id)->first();
        if (self::$session == null)
            return false;
        self::$user = self::$session->user;

        self::$session->touch();

        return true;
    }

    public static function logout()
    {
        self::$session->delete();
        self::$session = null;
        self::$user = null;
    }
}