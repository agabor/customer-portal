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

    public function owningProject(){
        return $this->belongsTo(Project::class, 'owning_project_id');
    }

    public function values(){
        return $this->hasMany(Localtext::class);
    }

    public function saveTo(Project $project) {
        $project->versionedTexts()->save($this);
        $this->project()->associate($project);
        $this->save();
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'minLength', 'maxLength'
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