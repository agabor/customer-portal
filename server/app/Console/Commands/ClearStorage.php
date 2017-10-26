<?php

namespace App\Console\Commands;

use App\Project;
use App\User;
use Illuminate\Console\Command;

class ClearStorage extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'clear:storage';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Remove all project related files';


    /**
     * Execute the console command.
     *
     * @return mixed
     */
    public function handle()
    {
        foreach (Project::all() as $project) {
            $project->delete();
        }
    }
}