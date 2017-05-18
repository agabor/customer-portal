<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocaleProjectTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('locale_project', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('locale_id')->index();
            $table->foreign('locale_id')->references('id')->on('locales')->onDelete('cascade');
            $table->unsignedInteger('project_id')->index();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('locale_project');
    }
}
