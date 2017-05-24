<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property string text_id
 * @property string name
 * @property integer min_length
 * @property integer max_length
 */
class Text extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function project(){
        return $this->belongsTo(Project::class);
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
        'min_length', 'max_length',
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