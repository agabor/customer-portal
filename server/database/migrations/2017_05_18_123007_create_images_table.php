<?php

use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateImagesTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('images', function (Blueprint $table) {
            $table->increments('id');
            $table->text('imageId');
            $table->text('name');
            $table->text('description');
            $table->integer('width');
            $table->integer('height');
            $table->integer('minWidth');
            $table->integer('maxWidth');
            $table->integer('minHeight');
            $table->integer('maxHeight');
            $table->text('fileName');
            $table->unsignedInteger('project_id')->nullable()->index();
            $table->foreign('project_id')->references('id')->on('projects')->onDelete('cascade');
            $table->unsignedInteger('owning_project_id')->index();
            $table->foreign('owning_project_id')->references('id')->on('projects')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::drop('images');
    }
}
