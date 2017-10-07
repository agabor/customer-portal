<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use JsonSerializable;

/**
 * @property integer id
 * @property string fileId
 * @property string name
 * @property string description
 * @property string fileName
 * @property string extensions
 * @property array ext
 * @property integer size
 * @property integer maxSize
 */
class File extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];
    protected $appends = ['ext'];

    public function project(){
        return $this->belongsTo(Project::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'file_id', 'name', 'fileName', 'extensions', 'maxSize',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'project_id', 'extensions'
    ];

    public function getExtAttribute()
    {
        return json_decode($this->extensions);
    }


    public function setExtAttribute($value)
    {
        $this->extensions = json_encode($value);
    }
}