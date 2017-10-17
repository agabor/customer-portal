<?php

namespace App\Http\Controllers;


use App\Auth;
use App\Project;
use App\User;
use Illuminate\Http\Request;

class ProjectUserController extends Controller {
    public function addUser(Request $request, Project $project) {
        $input = $request->all();

        $name = self::getString($input, 'name');
        $email = self::getString($input, 'email');

        /* @var User $u */
        $u = User::where('email', $email)->first();
        if ($u != null){
            /* @var User $user */
            foreach ($project->users as $user){
                if ($user->id === $u->id) {
                    return $u;
                }
            }
            $project->users()->attach($u);
            return $u;
        }

        $u = new User(['name' => $name, 'email' => $email, 'loginToken' => uniqid()]);
        $project->users()->save($u);
        return $u;
    }

    public function modifyUser(Request $request, User $user) {
        $input = $request->all();

        $user->name = self::getString($input, 'name');
        $user->email = self::getString($input, 'email');
        $user->save();

        return $user;
    }

    public function removeUser(Project $project, User $user)
    {
        if ($user->id != Auth::user()->id) {
            $project->users()->detach($user);
        }

        return response('{}');
    }

}