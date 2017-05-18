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
            $table->unsignedInteger('locale_id')->index();
            $table->foreign('locale_id')->references('id')->on('locales')->onDelete('cascade');
            $table->text('value');
            $table->unsignedInteger('text_id')->index();
            $table->foreign('text_id')->references('id')->on('texts')->onDelete('cascade');
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
