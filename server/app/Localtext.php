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

    public function text(){
        return $this->belongsTo(Text::class);
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'locale_id', 'value',
    ];

}