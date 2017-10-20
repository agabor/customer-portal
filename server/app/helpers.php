<?php
namespace  App;

use Illuminate\Http\Request;

function slugify(string $text) : string
{
    // replace non letter or digits by -
    $text = preg_replace('~[^\pL\d]+~u', '_', $text);

    // transliterate
    $text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

    // remove unwanted characters
    $text = preg_replace('~[^-\w]+~', '', $text);

    // trim
    $text = trim($text, '-');

    // remove duplicate -
    $text = preg_replace('~-+~', '-', $text);

    // lowercase
    $text = strtolower($text);

    if (empty($text)) {
        return 'n-a';
    }

    return $text;
}

function origin(Request $request)
{
    $origin = env('CLIENT_URL');
    /* @var string $referer */
    $referer = $request->headers->get('referer');
    if ($referer != null && strlen($referer) != 0) {
        $url_data = parse_url($referer);
        $origin = $url_data['scheme'] . '://' . $url_data['host'];
        if (array_key_exists('port', $url_data)) {
            $origin .= ':' . $url_data['port'];
        }
    }
    return $origin;
}