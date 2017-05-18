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
        $p->save();

        $t = new \App\Text();

        $t->name = 'Webpage Title';
        $t->text_id = 'webpage_title';
        $t->min_length = 10;
        $t->max_length = 20;

        $p->texts()->save($t);

        $t->localtexts()->saveMany([new \App\Localtext([
            'locale_id' => 'en_US',
            'value' => 'Sample Project Webpage'
        ]),
            new \App\Localtext([
                'locale_id' => 'hu_HU',
                'value' => 'Pelda Projekt Weboldal'
            ])]);
    }
}