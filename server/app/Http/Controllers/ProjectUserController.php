<?php

namespace App\Http\Controllers;


use App\Auth;
use App\Project;
use App\User;
use Illuminate\Http\Request;
use Laravel\Lumen\Application;
use PHPMailer\PHPMailer\PHPMailer;

class ProjectUserController extends Controller {

    const ROUTE = 'projects/{project_id}/users';

    public static function addRoutes(Application $app)
    {
        $app->POST(self::uri(''), self::action('addUser'));
        $app->POST(self::uri('/{user_id}'), self::action('modifyUser'));
        $app->DELETE(self::uri('/{user_id}'), self::action('removeUser'));
    }

    public static function uri(string $suffix) {
        return self::ROUTE . $suffix;
    }

    public static function action(string $function_name) {
        return self::class . '@' . $function_name;
    }

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

        if (!str_contains(env('APP_URL'), 'localhost')) {
            $login_link = env('CLIENT_URL') . '/token/' . $u->loginToken;
            $message = self::getString($input, 'message');
            if (str_contains($message, '[link]')) {
                $message = str_replace($message, '[link]', $login_link);
            } else {
                $message .= '\n' . $login_link;
            }
            $this->sendMail($name, $email, $message);
        }

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


    public function sendMail(string $name, string $email, string $message) {
        $mail = new PHPMailer();
        $mail->IsSMTP();
        $mail->CharSet = 'UTF-8';

        $mail->Host       = "email-smtp.eu-west-1.amazonaws.com"; // SMTP server example
        $mail->SMTPDebug  = 0;                     // enables SMTP debug information (for testing)
        $mail->SMTPAuth   = true;                  // enable SMTP authentication
        $mail->Port       = 25;                    // set the SMTP port for the GMAIL server
        $mail->SMTPSecure = 'tls';                            // Enable TLS encryption, `ssl` also accepted
        $mail->Username   = "AKIAI7F2LL6MVNEZCBFA"; // SMTP account username example
        $mail->Password   = "ArldKv8Vzopa51l1fhs5KhLv5mY5d6F8q3GXVxJAMxnC";

        //Recipients
        $mail->setFrom('noreply@customerpoint.net', 'Customer Point');
        $mail->addAddress($email, $name);     // Add a recipient

        //Content
        $mail->isHTML(true);                                  // Set email format to HTML
        $mail->Subject = 'Here is the subject';
        $mail->Body    = htmlspecialchars($message);
        $mail->AltBody    = $message;

        $mail->send();
        $mail->smtpClose();

        return response('{}');
    }

}