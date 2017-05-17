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
        DB::table('users')->insert([
            'name' => 'gabor',
            'email' => 'angyalgbr@gmail.com',
            'password' => password_hash('secret', PASSWORD_DEFAULT),
        ]);
    }
}