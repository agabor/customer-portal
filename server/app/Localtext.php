<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property integer locale_id
 * @property string value
 * @property Language locale
 */
class Localtext extends Model
{
    public $timestamps = false;
    protected $appends = ['localeCode'];

    public function text(){
        return $this->belongsTo(Text::class);
    }

    public function owningText(){
        return $this->belongsTo(Text::class, 'owning_text_id');
    }

    public function language(){
        return $this->belongsTo(Language::class);
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
        'id', 'text_id', 'owning_text_id', 'locale_id', 'locale'
    ];

    public function getLocaleCodeAttribute()
    {
        return $this->locale->localeId;
    }
}