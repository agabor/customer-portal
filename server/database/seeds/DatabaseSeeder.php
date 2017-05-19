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
        $t->text_id = 'webpage_title';
        $t->min_length = 10;
        $t->max_length = 20;

        $p->texts()->save($t);

        $en_US = new \App\Locale(['locale_id' => 'en_US', 'name' => 'English']);
        $hu_HU = new \App\Locale(['locale_id' => 'hu_HU', 'name' => 'Hungarian']);
        $p->locales()->saveMany([
            $en_US,
            $hu_HU
        ]);

        $t->localtexts()->saveMany([
            new \App\Localtext([
                'locale_id' => $en_US->id,
                'value' => 'Sample Project Webpage'
            ]),
            new \App\Localtext([
                'locale_id' => $hu_HU->id,
                'value' => 'Pelda Projekt Weboldal'
            ])]);

        $i = new \App\Image();
        $i->image_id = 'facebook_icon';
        $i->name = 'Facebook Icon';
        $i->width = 500;
        $i->height = 512;
        $i->file_name = 'logo.png';
        $p->images()->save($i);

        $i->conditions()->saveMany([
            new \App\Imagecondition(['name' => 'fix_width', 'value' => 512]),
            new \App\Imagecondition(['name' => 'fix_height', 'value' => 512])
        ]);

        $f = new \App\File();
        $f->file_id = 'terms_and_conditions';
        $f->name = 'Terms and Conditions';
        $f->file_name = 'licence.pdf';
        $f->ext = ['doc', 'docx', 'pdf'];
        $f->max_size = 10000;
        $p->files()->save($f);

    }
}