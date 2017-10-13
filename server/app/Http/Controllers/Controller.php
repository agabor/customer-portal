<?php

/**
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */

namespace App\Http\Controllers;

use App\Image;
use App\Link;
use App\Project;
use App\User;
use Laravel\Lumen\Routing\Controller as BaseController;


class Controller extends BaseController
{
    /**
     * @var Project
     */
    public static $project;

    /**
     * @var Image
     */
    public static $image;

    /**
     * @var User
     */
    public static $user;

    /**
     * @var Link
     */
    public static $link;


    protected static function getArray(array $input, string $paramName) : array
    {
        if (!isset($input[$paramName]) || !is_array($input[$paramName])) {
            throw new \InvalidArgumentException('Missing the required parameter $' . $paramName);
        }

        return $input[$paramName];
    }

    protected static function getString(array $input, string $paramName) : string
    {
        if (!isset($input[$paramName]) || !is_string($input[$paramName])) {
            throw new \InvalidArgumentException('Missing the required parameter $' . $paramName);
        }

        return $input[$paramName];
    }

    protected static function getInt(array $input, string $paramName) : string
    {
        if (!isset($input[$paramName]) || !is_numeric($input[$paramName])) {
            throw new \InvalidArgumentException('Missing the required parameter $' . $paramName);
        }

        return intval($input[$paramName]);
    }
}
