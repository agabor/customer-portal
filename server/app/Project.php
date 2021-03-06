<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

/**
 * @property integer id
 * @property string name
 * @property string slug
 * @property integer warnings
 * @property integer progress
 * @property \Carbon\Carbon created_at
 * @property \Carbon\Carbon updated_at
 * @property array texts
 * @property \Traversable versionedImages
 * @property \Traversable|\Countable images
 * @property \Traversable|\Countable files
 * @property \Traversable|\Countable languages
 * @property \Traversable|\Countable users
 * @property \Traversable|\Countable links
 * @property boolean admin
 */
class Project extends Model
{
    protected $appends = ['admin'];

    public function texts() : HasMany {
        return $this->hasMany(Text::class, 'project_id');
    }

    public function images() : HasMany {
        return $this->hasMany(Image::class, 'project_id');
    }

    public function versionedImages() : HasMany {
        return $this->hasMany(Image::class, 'owning_project_id');
    }

    public function versionedImagesForId(string $id) : \Traversable {
        /* @var $img Image */
        foreach ($this->versionedImages as $img){
            if ($img->imageId === $id)
                yield $img;
        }
    }

    public function files() : HasMany {
        return $this->hasMany(File::class);

    }

    public function links() : HasMany {
        return $this->hasMany(Link::class);

    }

    public function languages() : BelongsToMany {
        return $this->belongsToMany(Language::class);
    }

    public function users() : BelongsToMany {
        return $this->belongsToMany(User::class)->withPivot('admin');
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

    public function calculateState()
    {
        $this->load(['texts','images','files']);
        $warnings = 0;
        foreach ($this->texts as $text) {
            $warnings += self::getTextWarnings($text);
        }
        foreach ($this->images as $image) {
            if (self::imageHasWarning($image))
                ++$warnings;
        }
        foreach ($this->files as $file) {
            if (self::fileHasWarning($file))
                ++$warnings;
        }
        $this->warnings = $warnings;
        $fields = count($this->images) + count($this->files) + count($this->texts) * count($this->languages);
        if ($fields === 0)
            $this->progress = 0;
        else
            $this->progress = ($fields - $warnings) * 100 / $fields;
        $this->save();
    }

    private static function getTextWarnings(Text $text) : int
    {
        $warnings = 0;
        foreach ($text->values as $localText){
            if (self::hasWarning($text, $localText))
                ++$warnings;
        }
        return $warnings;
    }

    private static function hasWarning(Text $text, Localtext $localText)
    {
        $len = mb_strlen($localText->value);
        return $len == 0 || $len < $text->minLength || $len > $text->maxLength;
    }

    private static function imageHasWarning(Image $image) : bool
    {
        return $image->fileName == null || strlen($image->fileName) == 0
            || $image->width < $image->minWidth || $image->width > $image->maxWidth
            || $image->height < $image->minHeight || $image->height > $image->maxHeight;
    }

    private static function fileHasWarning(File $file) : bool
    {
        return $file->fileName == null || strlen($file->fileName) == 0;
    }

    public function hasImageWithId(string $imageId) : bool {
        foreach ($this->images as $img){
            if ($img->imageId == $imageId)
                return true;
        }
        return false;
    }

    public function getImageWithId(string $imageId) : Image
    {
        foreach ($this->images as $img){
            if ($img->imageId == $imageId)
                return $img;
        }
        return null;
    }


    public function dirPath() : string {
        return storage_path($this->slug);
    }

    public function delete()
    {
        /* @var $img Image */
        foreach ($this->versionedImages as $img) {
            $img->delete();
        }
        try {
            rmdir($this->dirPath());
        } catch (\Exception $e) {
        }
        return parent::delete();
    }

    public function getText(string $textId) //: Text?
    {
        /* @var \App\Text $text */
        foreach ($this->texts as $text)
            if ($text->textId === $textId)
                return $text;
        return null;
    }

    public function setSlug()
    {
        $base_slug = slugify($this->name);
        $slug = $base_slug;
        $idx = 1;
        while ($this->projectSlugExists($slug)){
            $slug = $base_slug . (++$idx);
        }
        $this->slug = $slug;
    }

    private function projectSlugExists(string $slug) : bool
    {
        /* @var Project $project*/
        foreach (Project::all() as $project)
            if ($project->slug == $slug)
                return true;
        return false;
    }


    public function getAdminAttribute()
    {
        $id = Auth::user()->id;
        /* @var User $user */
        foreach ($this->users as $user) {
            if ($user->id === $id) {
                 return $user->pivot->admin != 0;
            }
        }
        return false;
    }
}