<?php

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
        $u = new \App\User();
        $u->name = 'gabor';
        $u->email = 'angyalgbr@gmail.com';
        $u->password = password_hash('secret', PASSWORD_DEFAULT);
        $u->save();

        $p = new \App\Project();
        $p->name = 'Sample Project';
        $p->slug = 'sample_project';
        $u->projects()->save($p);

        $t = new \App\Text();

        $t->name = 'Webpage Title';
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
        $i->width = 500;
        $i->height = 512;
        $i->preferredWidth = 512;
        $i->preferredHeight = 512;
        $i->fileName = 'logo.png';
        $p->images()->save($i);

        $f = new \App\File();
        $f->fileId = 'terms_and_conditions';
        $f->name = 'Terms and Conditions';
        $f->fileName = 'licence.pdf';
        $f->ext = ['doc', 'docx', 'pdf'];
        $f->maxSize = 10000;
        $p->files()->save($f);

    }
}