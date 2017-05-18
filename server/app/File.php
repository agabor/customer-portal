<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use JsonSerializable;

/**
 * @property integer id
 * @property integer project_id
 * @property string file_id
 * @property string name
 * @property string file_name
 * @property string extensions
 * @property integer max_size
 */
class File extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function setExtensions(array $extensions){
        $this->extensions = json_encode($extensions);
    }

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
        'file_id', 'name', 'file_name', 'extensions', 'max_size',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'project_id', 'extensions'
    ];

    function jsonSerialize()
    {
        $arr = parent::jsonSerialize();
        $arr['ext'] = json_decode($this->extensions);
        return $arr;
    }
}