<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property string name
 * @property string slug
 * @property \Carbon\Carbon created_at
 * @property \Carbon\Carbon updated_at
 */
class Project extends Model
{
    public function texts(){
        return $this->hasMany(Text::class);
    }

    public function images(){
        return $this->hasMany(Image::class);
    }

    public function files(){
        return $this->hasMany(File::class);

    }

    public function locales(){
        return $this->belongsToMany(Locale::class);
    }

    public function users(){
        return $this->belongsToMany(User::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'name', 'slug',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'created_at', 'updated_at', 'id', 'pivot'
    ];
}