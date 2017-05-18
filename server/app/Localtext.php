<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property string locale_id
 * @property string value
 */
class Localtext extends Model
{
    public $timestamps = false;
    protected $appends = ['locale_code'];

    public function text(){
        return $this->belongsTo(Text::class);
    }

    public function locale(){
        return $this->belongsTo(Locale::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'locale_id', 'value',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'text_id', 'locale_id', 'locale'
    ];

    public function getLocaleCodeAttribute()
    {
        return $this->locale->locale_id;
    }
}