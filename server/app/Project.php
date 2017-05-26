<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

/**
 * @property integer id
 * @property string name
 * @property string slug
 * @property integer warnings
 * @property integer progress
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

    public function calculateState(){
        $warnings = 0;
        foreach ($this->texts as $text){
            $warnings += self::getTextWarnings($text);
        }
        foreach ($this->images as $image){
            if (self::imageHasWarning($image))
                ++$warnings;
        }
        foreach ($this->files as $file){
            if (self::fileHasWarning($file))
                ++$warnings;
        }
        $this->warnings = $warnings;
        $fields = count($this->images) + count($this->files) + count($this->texts) * count($this->locales);
        $this->progress = ($fields - $warnings) * 100 / $fields;
        $this->save();
    }

    private static function getTextWarnings(Text $text) : int
    {
        $warnings = 0;
        foreach ($text-> values as $localText){
            if (self::hasWarning($text, $localText))
                ++$warnings;
        }
        return $warnings;
    }

    private static function hasWarning(Text $text, Localtext $localText)
    {
        $len = strlen($localText->value);
        return $len == 0 || $len < $text->minLength || $len > $text->maxLength;
    }

    private static function imageHasWarning(Image $image) : bool
    {
        return $image->fileName == null || strlen($image->fileName) == 0;
    }

    private static function fileHasWarning(File $file) : bool
    {
        return $file->fileName == null || strlen($file->fileName) == 0;
    }
}