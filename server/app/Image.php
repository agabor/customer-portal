<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Http\UploadedFile;

/**
 * @property integer id
 * @property integer projectId
 * @property string imageId
 * @property string name
 * @property string description
 * @property integer width
 * @property integer height
 * @property integer minWidth
 * @property integer maxWidth
 * @property integer minHeight
 * @property integer maxHeight
 * @property string fileName
 * @property Project project
 */
class Image extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function project(){
        return $this->belongsTo(Project::class, 'project_id');
    }
    public function owningProject(){
        return $this->belongsTo(Project::class, 'owning_project_id');
    }


    public function saveTo(Project $project) {
        $project->versionedImages()->save($this);
        $this->project()->associate($project);
        $this->save();
    }

    public function copy() : Image {
        $copy = new Image();
        $copy->imageId = $this->imageId;
        $copy->name = $this->name;
        $copy->width = $this->width;
        $copy->height = $this->height;
        $copy->minWidth = $this->minWidth;
        $copy->maxWidth = $this->maxWidth;
        $copy->minHeight = $this->minHeight;
        $copy->maxHeight = $this->maxHeight;
        $copy->fileName = $this->fileName;
        return $copy;
    }

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'imageId', 'name', 'width', 'height', 'fileName',
    ];

    /**
     * The attributes excluded from the model's JSON form.
     *
     * @var array
     */
    protected $hidden = [
        'id', 'project_id', 'project', 'owning_project_id'
    ];

    public function setFile(UploadedFile $uploadedFile)
    {
        if ($this->fileName === null || strlen($this->fileName) === 0) {
            $this->fileName = $this->guidv4(random_bytes(16))  . '.' . strtolower($uploadedFile->getClientOriginalExtension());
        }
        $size = getimagesize($uploadedFile->getPathname());
        $this->width = $size[0];
        $this->height = $size[1];
        $this->save();
    }

    function guidv4($data)
    {
        assert(strlen($data) == 16);

        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10

        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
    }

    public function hasFile()
    {
        $fileName = $this->fileName;
        return $fileName != null && strlen($this->fileName) != 0;
    }
}