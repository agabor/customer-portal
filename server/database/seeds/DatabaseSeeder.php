<?php

use App\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $u = new User();
        $u->name = 'gabor';
        $u->email = 'angyalgbr@gmail.com';
        $u->password = password_hash('secret', PASSWORD_DEFAULT);
        $u->save();

        $this->addSampleProject($u);

        $p = new \App\Project();
        $p->name = 'Autómentő';
        $p->slug = 'automento';
        $u->projects()->save($p);

        $hu_HU = new \App\Locale(['localeId' => 'hu_HU', 'name' => 'Hungarian']);
        $en_US = new \App\Locale(['localeId' => 'en_US', 'name' => 'English']);
        $de_DE = new \App\Locale(['localeId' => 'de_DE', 'name' => 'German']);
        $p->locales()->saveMany([
            $hu_HU,
            $en_US,
            $de_DE
        ]);

        $i = new \App\Image();
        $i->imageId = 'facebook_icon';
        $i->name = 'Facebook Icon';
        $i->description = 'This image will appear on Facebook, when users log in to your application.';
        $i->width = 512;
        $i->height = 512;
        $i->preferredWidth = 512;
        $i->preferredHeight = 512;
        $i->fileName = 'http://localhost:8000/ikon.png';
        $p->images()->save($i);

        $i = new \App\Image();
        $i->imageId = 'play_store_banner';
        $i->name = 'Play Store Banner';
        $i->description = 'This image will appear in the Google Play store as a banner.';
        $i->width = 1024;
        $i->height = 500;
        $i->preferredWidth = 1024;
        $i->preferredHeight = 500;
        $i->fileName = 'http://localhost:8000/banner.png';
        $p->images()->save($i);

        $t = new \App\Text();

        $t->name = 'Title';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'title';
        $t->startGroup = 'Store szövegek';
        $t->minLength = 3;
        $t->maxLength = 30;
        $p->texts()->save($t);
        $t->values()->saveMany([new \App\Localtext([
                'locale_id' => $hu_HU->id,
                'value' => 'Autómentő Kereső'
            ]),
            new \App\Localtext([
                'locale_id' => $en_US->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'locale_id' => $de_DE->id,
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
        $t->values()->saveMany([new \App\Localtext([
            'locale_id' => $hu_HU->id,
            'value' => 'Az Autómentő kereső rendszer hivatalos, sofőröknek készült mobilapplikációja.'
        ]),
            new \App\Localtext([
                'locale_id' => $en_US->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'locale_id' => $de_DE->id,
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
        $t->values()->saveMany([new \App\Localtext([
            'locale_id' => $hu_HU->id,
            'value' => 'Az Autómentő kereső regisztrált céges partnereként minden, a rendszerbe bejegyzett sofőr ingyenesen letöltheti készülékére az applikációt. A sofőrök egy egyszerű bejelentkezés után aktívvá válnak járművükkel (pozíciójukkal) a bajbajutott személyeknek az automentokereso.hu weboldal térképén. A károsultak igény szerint segítséget kérhetnek a közelben tartózkodó autómentő sofőrtől, megtekinthetik annak céges profilját és autóparkját. A segélykérést követően a sofőr pontosan látja a bajbajutott pozícióját, valamint a továbbiakban könnyen felvehetik egymással a kapcsolatot, hogy mielőbb egyeztessék és megoldják a felmerült problémát.
Az automentokereso.hu weboldalon a károsultak autómentők, esetkocsik és gépszállítók közül választhatnak a felmerült problémájuk szerint. A rendszer használata és a kiválasztott szolgáltatóval való kapcsolatfelvétel számukra ingyenes.'
        ]),
            new \App\Localtext([
                'locale_id' => $en_US->id,
                'value' => ''
            ]),
            new \App\Localtext([
                'locale_id' => $de_DE->id,
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
            $t->maxLength = 100;
            $p->texts()->save($t);
            $t->values()->saveMany([new \App\Localtext([
                'locale_id' => $hu_HU->id,
                'value' => $item[1]
            ]),
                new \App\Localtext([
                    'locale_id' => $en_US->id,
                    'value' => ''
                ]),
                new \App\Localtext([
                    'locale_id' => $de_DE->id,
                    'value' => ''
                ])
            ]);
        }

        $p->calculateState();

    }

    protected function addSampleProject(User $u)
    {

        $p = new \App\Project();
        $p->name = 'Sample Project';
        $p->slug = 'sample_project';
        $u->projects()->save($p);

        $t = new \App\Text();

        $t->name = 'Webpage Title';
        $t->description = 'This text will appear in the titlebar of the browser, an on the fron page of your website.';
        $t->textId = 'webpage_title';
        $t->minLength = 10;
        $t->maxLength = 20;

        $p->texts()->save($t);

        $en_US = new \App\Locale(['localeId' => 'en_US', 'name' => 'English']);
        $hu_HU = new \App\Locale(['localeId' => 'hu_HU', 'name' => 'Hungarian']);
        $p->locales()->saveMany([
            $en_US,
            $hu_HU
        ]);

        $t->values()->saveMany([
            new \App\Localtext([
                'locale_id' => $en_US->id,
                'value' => 'Sample Project Webpage'
            ]),
            new \App\Localtext([
                'locale_id' => $hu_HU->id,
                'value' => 'Pelda Projekt Weboldal'
            ])]);

        $i = new \App\Image();
        $i->imageId = 'facebook_icon';
        $i->name = 'Facebook Icon';
        $i->description = 'This image will appear on Facebook, when users log in to your application.';
        $i->width = 512;
        $i->height = 512;
        $i->preferredWidth = 512;
        $i->preferredHeight = 512;
        $i->fileName = '';
        $p->images()->save($i);

        $i = new \App\Image();
        $i->imageId = 'play_store_banner';
        $i->name = 'Play Store Banner';
        $i->description = 'This image will appear in the Google Play store as a banner.';
        $i->width = 1024;
        $i->height = 500;
        $i->preferredWidth = 1024;
        $i->preferredHeight = 500;
        $i->fileName = '';
        $p->images()->save($i);

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
}