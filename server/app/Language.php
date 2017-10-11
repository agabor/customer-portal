<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use JsonSerializable;
use Matriphe\ISO639\ISO639;

/**
 * @property integer id
 * @property string code
 * @property string name
 */
class Language extends Model
{
    public $timestamps = false;

    public function projects(){
        return $this->belongsToMany(Project::class);
    }

    static public function forCode(string $code) {
        $locale = Language::where('code', $code)->first();
        if ($locale != null)
            return $locale;
        $iso = new ISO639();
        $langName = $iso->languageByCode1($code);
        if (strlen($langName) === 0)
            return null;
        $locale = new Language(['code' => $code, 'name' => $langName]);
        $locale->save();
        return $locale;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'code', 'name'
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