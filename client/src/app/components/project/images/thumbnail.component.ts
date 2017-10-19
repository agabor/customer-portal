import {Component, Input, OnInit} from '@angular/core';
import {Image} from '../../../../swagger/model/Image';
import {Presenter} from '../../../logic/presenter';
import {ImageModalComponent} from './image-modal.component';
import {Project} from '../../../../swagger/model/Project';

@Component({
    selector: 'app-thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent implements OnInit {
  @Input() image: Image;
  @Input() project: Project;
  @Input() imageModalComponent: ImageModalComponent;

  fileIsOver: Image = null;
  file: File;
  editing = false;
  widthWarning: string = null;
  heightWarning: string = null;

  constructor(private presenter: Presenter) {
  }

  ngOnInit() {
    this.setWarnings();
  }

  private setWarnings() {
    this.widthWarning = null;
    this.heightWarning = null;
    if (this.image.fileName != null && this.image.fileName.length !== 0) {
      this.setWidthWarning();
      this.setHeightWarning();
    }
  }

  private setHeightWarning() {
    const baseWarning = 'The height of this image is ' + this.image.height;
    if (this.image.minHeight != null && this.image.maxHeight != null) {
      if (this.image.height < this.image.minHeight || this.image.height > this.image.maxHeight) {
        if (this.image.minHeight === this.image.maxHeight) {
          this.heightWarning = baseWarning
            + ' but it should be ' + this.image.maxHeight + '.';
        } else {
          this.heightWarning = baseWarning
            + ' but it should be between ' + this.image.minHeight + ' and ' + this.image.maxHeight + '.';
        }
      }
    } else {
      if (this.image.minHeight != null && this.image.height < this.image.minHeight) {
        this.heightWarning = baseWarning + ' but it should be minimum '
          + this.image.minHeight + '.';
      }
      if (this.image.maxHeight != null && this.image.height > this.image.maxHeight) {
        this.heightWarning = baseWarning + ' but it should be maximum '
          + this.image.maxHeight + '.';
      }
    }
  }

  private setWidthWarning() {
    const baseWarning = 'The width of this image is ' + this.image.width;
    if (this.image.minWidth != null && this.image.maxWidth != null) {
      if (this.image.width < this.image.minWidth || this.image.width > this.image.maxWidth) {
        if (this.image.minWidth === this.image.maxWidth) {
          this.widthWarning = baseWarning + 'but it should be '  + this.image.maxWidth + '.';
        } else {
          this.widthWarning = baseWarning
            + ' but it should be between ' + this.image.minWidth + ' and ' + this.image.maxWidth + '.';
        }
      }
    } else {
      if (this.image.minWidth != null && this.image.width < this.image.minWidth) {
        this.widthWarning = baseWarning + ' but it should be minimum '
          + this.image.minWidth + '.';
      }
      if (this.image.maxWidth != null && this.image.width > this.image.maxWidth) {
        this.widthWarning = baseWarning + ' but it should be maximum '
          + this.image.maxWidth + '.';
      }
    }
  }

  getImageUrl() {
    return this.presenter.getImageUrl(this.image);
  }

  showImage() {
    this.imageModalComponent.showImage(this.image);
  }

  public load() {
    const element = <HTMLImageElement>document.getElementById('img' + this.image.imageId);
    this.image.width = element.naturalWidth;
    this.image.height = element.naturalHeight;
  }

  public deleteImage() {
    this.presenter.deleteImage(this.image);
  }

  public edit() {
    this.editing = !this.editing;
  }

  public save() {
    this.presenter.updateImage(this.image);
  }

  public fileOver(fileIsOver: boolean) {
    if (fileIsOver) {
      this.fileIsOver = this.image;
    } else {
      if (this.fileIsOver === this.image) {
        this.fileIsOver = null;
      }
    }
    console.log('fileIsOver ' + fileIsOver + ' ' + this.image.imageId);
  }
  fileChange(event) {
    let fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      let file: File = fileList[0];
      this.onFileDrop(file);
    }
  }
  public onFileDrop(file: File) {

    if (!(file.name.endsWith('.jpg') || file.name.endsWith('.png') || file.name.endsWith('.gif') || file.name.endsWith('.svg'))){
      return;
    }

    if (file.size / 1024 / 1024 > 2) {
      alert("The file is too large. Maximal image size is 2 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event: any) => {
      this.image.fileName = event.target.result;
    };
    reader.readAsDataURL(file);
    this.presenter.uploadImage(file, this.image, (image: Image) => {
      this.image = image;
      this.setWarnings();
    });
  }

}
