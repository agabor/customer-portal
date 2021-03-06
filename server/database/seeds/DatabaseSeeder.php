<?php

use App\Image;
use App\User;
use Illuminate\Database\Seeder;
use Illuminate\Http\UploadedFile;
use Symfony\Component\HttpFoundation\File\UploadedFile as SymfonyUploadedFile;

/**
 * @property \App\Language $hu
 * @property \App\Language $en
 * @property \App\Language $de
 */
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->hu = App\Language::forCode('hu');
        $this->en = App\Language::forCode('en');
        $this->de = App\Language::forCode('de');

        $u = new User();
        $u->name = 'gabor';
        $u->email = 'angyalgabor@outlook.com';
        $u->password = password_hash('secret', PASSWORD_DEFAULT);
        $u->save();

        $this->addAutomento($u);
        $this->addSampleProject($u);


    }

    protected function addSampleProject(User $u)
    {

        $p = new \App\Project();
        $p->name = 'Sample Project';
        $p->slug = 'sample_project';
        $u->projects()->save($p, ['admin' => true]);

        $t = new \App\Text();

        $t->name = 'Webpage Title';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'webpage_title';
        $t->minLength = 10;
        $t->maxLength = 20;

        $p->texts()->save($t);

        $p->languages()->attach($this->en);
        $p->languages()->attach($this->hu);

        $t->saveLocales([
            new \App\Localtext([
                'language_id' => $this->en->id,
                'value' => 'Sample Project Webpage'
            ]),
            new \App\Localtext([
                'language_id' => $this->hu->id,
                'value' => 'Pelda Projekt Weboldal'
            ])
        ]);

        $i = new \App\Image();
        $i->imageId = 'facebook_icon';
        $i->name = 'Facebook Icon';
        $i->description = 'This image will appear on Facebook, when users log in to your application.';
        $i->width = 512;
        $i->height = 512;
        $i->minWidth = 512;
        $i->maxWidth = 512;
        $i->minHeight = 512;
        $i->maxHeight = 512;
        $i->fileName = '';
        $i->saveTo($p);

        $i = new \App\Image();
        $i->imageId = 'play_store_banner';
        $i->name = 'Play Store Banner';
        $i->description = 'This image will appear in the Google Play store as a banner.';
        $i->width = 1024;
        $i->height = 500;
        $i->minWidth = 1024;
        $i->maxWidth = 1024;
        $i->minHeight = 500;
        $i->maxHeight = 500;
        $i->fileName = '';
        $i->saveTo($p);

        $f = new \App\File();
        $f->fileId = 'terms_and_conditions';
        $f->name = 'Terms and Conditions';
        $f->description = 'Terms and conditions will be readable on your website. You can not start a webshop without this!';
        $f->size = 127;
        $f->fileName = 'licence.pdf';
        $f->ext = ['doc', 'docx', 'pdf'];
        $f->maxSize = 10000;
        $p->files()->save($f);
        $p->calculateState();
    }

    /**
     * @param $u
     */
    protected function addAutomento(User $u)
    {
        $p = new \App\Project();
        $p->name = 'Autómentő';
        $p->slug = 'automento';
        $u->projects()->save($p, ['admin' => true]);

        $p->languages()->saveMany([
            $this->hu,
            $this->en,
            $this->de
        ]);

        $i = new \App\Image();
        $i->imageId = 'facebook_icon';
        $i->name = 'Facebook Icon';
        $i->description = 'This image will appear on Facebook, when users log in to your application.';
        $i->width = 512;
        $i->height = 512;
        $i->minWidth = 512;
        $i->maxWidth = 512;
        $i->minHeight = 512;
        $i->maxHeight = 512;
        $i->saveTo($p);


        $i = new \App\Image();
        $i->imageId = 'play_store_banner';
        $i->name = 'Play Store Banner';
        $i->description = 'This image will appear in the Google Play store as a banner.';
        $i->width = 1024;
        $i->height = 500;
        $i->minWidth = 1024;
        $i->maxWidth = 1024;
        $i->minHeight = 500;
        $i->maxHeight = 500;
        $i->saveTo($p);

        $t = new \App\Text();

        $t->name = 'Title';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'title';
        $t->startGroup = 'Store szövegek';
        $t->minLength = 3;
        $t->maxLength = 30;
        $p->texts()->save($t);
        $t->saveLocales([
            new \App\Localtext([
                'language_id' => $this->hu->id,
                'value' => 'Autómentő Kereső'
            ]),
            new \App\Localtext([
                'language_id' => $this->en->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'language_id' => $this->de->id,
                'value' => ''
            ])
        ]);

        $t = new \App\Text();

        $t->name = 'Short description';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'short_description';
        $t->minLength = 10;
        $t->maxLength = 80;
        $p->texts()->save($t);
        $t->saveLocales([
            new \App\Localtext([
                'language_id' => $this->hu->id,
                'value' => 'Az Autómentő kereső rendszer hivatalos, sofőröknek készült mobilapplikációja.'
            ]),
            new \App\Localtext([
                'language_id' => $this->en->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'language_id' => $this->de->id,
                'value' => ''
            ])
        ]);


        $t = new \App\Text();

        $t->name = 'Full description';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'full_description';
        $t->minLength = 100;
        $t->maxLength = 4000;
        $p->texts()->save($t);
        $t->saveLocales([
            new \App\Localtext([
                'language_id' => $this->hu->id,
                'value' => 'Az Autómentő kereső regisztrált céges partnereként minden, a rendszerbe bejegyzett sofőr ingyenesen letöltheti készülékére az applikációt. A sofőrök egy egyszerű bejelentkezés után aktívvá válnak járművükkel (pozíciójukkal) a bajbajutott személyeknek az automentokereso.hu weboldal térképén. A károsultak igény szerint segítséget kérhetnek a közelben tartózkodó autómentő sofőrtől, megtekinthetik annak céges profilját és autóparkját. A segélykérést követően a sofőr pontosan látja a bajbajutott pozícióját, valamint a továbbiakban könnyen felvehetik egymással a kapcsolatot, hogy mielőbb egyeztessék és megoldják a felmerült problémát.
Az automentokereso.hu weboldalon a károsultak autómentők, esetkocsik és gépszállítók közül választhatnak a felmerült problémájuk szerint. A rendszer használata és a kiválasztott szolgáltatóval való kapcsolatfelvétel számukra ingyenes.'
            ]),
            new \App\Localtext([
                'language_id' => $this->en->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'language_id' => $this->de->id,
                'value' => ''
            ])
        ]);

        $data = [
            ['app_name', 'Autómentő Kereső', 'App szövegek'],
            ['app_name_part_1', 'Autómentő'],
            ['app_name_part_2', 'Kereső'],
            ['action_sign_in', 'Bejelentkezés'],
            ['error_invalid_username', 'Hibás felhasználó név'],
            ['error_invalid_password', 'A jelszó túl rövid'],
            ['error_incorrect_password', 'Hibás jelszó'],
            ['error_field_required', 'This field is required'],
            ['settings', 'Jelszó módosítás'],
            ['logout', 'Kijelentkezés'],
            ['name', 'Név'],
            ['password', 'Jelszó'],
            ['back', 'Vissza'],
            ['no_message', 'A bajbajutottak segítségkérő üzeneteit és a földrajzi pozíciójukat itt találod majd az első üzenet beérkezését követően.'],
            ['warning_already_logged_in', 'Ön már bejelentkezett egy másik készülékről.'],
            ['warning_forced_logout', 'Hiba lépett fel a hálózati kapcsolatban, ezért a szerver kiléptette önt.'],
            ['no_connection_error', 'A szerver nem elérhető'],
            ['error_passwords_do_not_match', 'A két jelszó nem egyezik meg.'],
            ['reconnect', 'A szerver nem elérhető. Újracsatlakozáshoz kattintson az OK gombra.'],
            ['position_desc', 'A segélykérő pozíciója:\n%s szélességi fok (latitude): %s\n%s hosszúsági fok (longitude): %s'],
        ];

        foreach ($data as $item) {
            $t = new \App\Text();
            $t->name = ucfirst(str_replace('_', ' ', $item[0]));
            $t->textId = $item[0];
            if (isset($item[2]))
                $t->startGroup = $item[2];
            $t->description = '';
            $t->minLength = 2;
            $t->maxLength = mb_strlen($item[1]) * 1.5;
            $p->texts()->save($t);
            $t->saveLocales([
                new \App\Localtext([
                    'language_id' => $this->hu->id,
                    'value' => $item[1]
                ]),
                new \App\Localtext([
                    'language_id' => $this->en->id,
                    'value' => ''
                ]),
                new \App\Localtext([
                    'language_id' => $this->de->id,
                    'value' => ''
                ])
            ]);
        }

        $f = new \App\File();
        $f->fileId = 'design';
        $f->name = 'Látványterv';
        $f->description = 'Az alkalmazás látványterve';
        $f->size = 7890;
        $f->fileName = 'automento.psd';
        $f->ext = ['psd'];
        $f->maxSize = 10000;
        $p->files()->save($f);

        $f = new \App\File();
        $f->fileId = 'font';
        $f->name = 'Font';
        $f->description = 'Az alkalmazásban használt font';
        $f->size = 42;
        $f->fileName = 'Montserrat-Bold.ttf';
        $f->ext = ['psd'];
        $f->maxSize = 10000;
        $p->files()->save($f);

        $l = new \App\Link();
        $l->name = 'Google Play Store';
        $l->icon = 'fa-google';
        $l->url = 'https://play.google.com/store/apps/details?id=hu.markcon.automento';
        $p->links()->save($l);

        $l = new \App\Link();
        $l->name = 'App Store';
        $l->icon = 'fa-apple';
        $l->url = 'https://itunes.apple.com/us/app/aut%C3%B3ment%C5%91/id1212371710?ls=1&mt=8';
        $p->links()->save($l);

        $l = new \App\Link();
        $l->name = 'Web Page';
        $l->icon = 'fa-globe';
        $l->url = 'https://automentokereso.hu/';
        $p->links()->save($l);

        $l = new \App\Link();
        $l->name = 'Facebook';
        $l->icon = 'fa-facebook';
        $l->url = 'https://www.facebook.com/automentokereso/';
        $p->links()->save($l);

        $p->calculateState();
    }
}