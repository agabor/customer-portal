<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property integer projectId
 * @property string imageId
 * @property string name
 * @property string description
 * @property integer width
 * @property integer height
 * @property integer preferredWidth
 * @property integer preferredHeight
 * @property string fileName
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
        'imageId', 'name', 'width', 'height', 'fileName',
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