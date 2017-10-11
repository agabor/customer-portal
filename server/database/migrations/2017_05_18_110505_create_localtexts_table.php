<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateLocaltextsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('localtexts', function (Blueprint $table) {
            $table->increments('id');
            $table->unsignedInteger('language_id')->index();
            $table->foreign('language_id')->references('id')->on('languages')->onDelete('cascade');
            $table->text('value');
            $table->unsignedInteger('text_id')->nullable()->index();
            $table->foreign('text_id')->references('id')->on('texts')->onDelete('cascade');
            $table->unsignedInteger('owning_text_id')->index();
            $table->foreign('owning_text_id')->references('id')->on('texts')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('localtexts');
    }
}
