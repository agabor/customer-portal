<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property integer project_id
 * @property string image_id
 * @property string name
 * @property integer width
 * @property integer height
 * @property integer preferredWidth
 * @property integer preferredHeight
 * @property string file_name
 */
class Image extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function conditions(){
        return $this->hasMany(Imagecondition::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'image_id', 'name', 'width', 'height', 'file_name',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'project_id'
    ];
}