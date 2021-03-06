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
 * @property \Traversable|\Countable values
 * @property \Traversable|\Countable versionedValues
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

    public function versionedValues(){
        return $this->hasMany(Localtext::class, 'owning_text_id');
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
        'id', 'project_id', 'project'
    ];

    public function getValue(Language $localelanguage) {
        /* @var Localtext $lt */
        foreach ($this->values as $lt) {
            if ($lt->language_id === $localelanguage->id)
                return $lt;
        }
        return null;
    }

    public function saveLocales(array $localTexts)
    {
        /* @var \App\Localtext $localText */
        foreach ($localTexts as $localText) {
            $this->saveLocale($localText);
        }
    }

    public function saveLocale(Localtext $localText)
    {
        $this->versionedValues()->save($localText);
        $localText->text()->associate($this);
        $localText->save();
    }
}