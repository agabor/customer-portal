<?php

namespace App\Http\Controllers;

use App\Link;
use App\Project;
use Illuminate\Http\Request;
use Laravel\Lumen\Application;


class ProjectLinkController extends Controller
{

    const ROUTE = 'projects/{project_id}/links';

    public static function addRoutes(Application $app)
    {
        $app->POST(self::uri(''), self::action('addLink'));
        $app->PUT(self::uri(''), self::action('putLinks'));
        $app->POST(self::uri('/{link_id}'), self::action('modifyLink'));
        $app->DELETE(self::uri('/{link_id}'), self::action('deleteLink'));
    }

    public static function uri(string $suffix) {
        return self::ROUTE . $suffix;
    }

    protected static function action(string $function_name) {
        return self::class . '@' . $function_name;
    }

    public function addLink(Request $request, Project $project) {
        $input = $request->all();

        $link = new Link();
        $link->name = self::getString($input, 'name');
        $link->icon = self::getString($input, 'icon');
        $link->url = self::getString($input, 'url');

        $project->links()->save($link);
        return $link;
    }

    public function modifyLink(Request $request, Link $link) {
        $input = $request->all();

        $link->name = self::getString($input, 'name');
        $link->icon = self::getString($input, 'icon');
        $link->url = self::getString($input, 'url');
        $link->save();

        return $link;
    }

    public function deleteLink(Link $link)
    {
        $link->delete();
        return response('{}');
    }

    public function putLinks(Request $request, Project $project)
    {
        $input = $request->all();
        $sources = self::getArray($input, 'sources');
        $dict = [];
        foreach ($sources as $link) {
            $dict[$link['id']] = $link['url'];
        }
        /* @var Link $link */
        foreach ($project->links as $link) {
            $link->url = $dict[$link->id];
            $link->save();
        }
        return response('{}');
    }
}