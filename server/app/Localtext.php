<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property integer language_id
 * @property string value
 * @property Language language
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
        'language_id', 'value',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'text_id', 'owning_text_id', 'language_id', 'language'
    ];

    public function getLocaleCodeAttribute()
    {
        return $this->language->localeId;
    }
}