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
 * @property integer preferredWidth
 * @property integer preferredHeight
 * @property string fileName
 */
class Image extends Model
{
    public $timestamps = false;

    protected $touches = ['project'];

    public function project(){
        return $this->belongsTo(Project::class);
    }

    public function conditions(){
        return $this->hasMany(Imagecondition::class);
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
        'id', 'project_id', 'project'
    ];

    public function dirPath() : string {
        return storage_path($this->project->slug . '/' . $this->imageId);
    }
    public function filePath() : string {
        return $this->dirPath() . '/' . $this->fileName;
    }

    public function setFile(UploadedFile $uploadedFile)
    {
        $clientOriginalName = $uploadedFile->getClientOriginalName();

        if ($this->fileName != null && $this->fileName != '')
            if (file_exists($this->filePath()))
                unlink($this->filePath());

        $directory = $this->dirPath();
        if (!file_exists($directory)) {
            mkdir($directory, 0777, true);
        }
        $uploadedFile->move($directory, $clientOriginalName);
        $this->fileName = $clientOriginalName;
        $size = getimagesize($this->filePath());
        $this->width = $size[0];
        $this->height = $size[1];
        $this->save();
    }

    public function hasFile()
    {
        $fileName = $this->fileName;
        return $fileName != null && strlen($this->fileName) != 0;
    }
}