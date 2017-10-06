<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property string textId
 * @property string name
 * @property string description
 * @property string startGroup
 * @property integer minLength
 * @property integer maxLength
 */
class Text extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function project(){
        return $this->belongsTo(Project::class, 'project_id');
    }

    public function values(){
        return $this->hasMany(Localtext::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'textId', 'name', 'description', 'startGroup', 'minLength', 'maxLength'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'project_id', 'owning_project_id'
    ];
}