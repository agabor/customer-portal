<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use JsonSerializable;

/**
 * @property integer id
 * @property string locale_id
 * @property string name
 */
class Locale extends Model
{
    public $timestamps = false;

    public function projects(){
        return $this->belongsToMany(Project::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'locale_id', 'name'
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'pivot'
    ];
}