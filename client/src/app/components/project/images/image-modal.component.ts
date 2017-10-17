import { Component } from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Image} from '../../../../swagger/model/Image';
import {Modal} from '../../../ui/modal';

@Component({
    selector: 'app-project-image-modal',
    templateUrl: './image-modal.component.html',
    styleUrls: ['./image-modal.component.css']
})
export class ImageModalComponent {

  currentImage: Image = {
    imageId: null,
    name: null,
    width: 0,
    height: 0,
    fileName: null,
    conditions: []
  };


  modal = new Modal();
  width: number;
  height: number;

  constructor(private presenter: Presenter) {
  }

  showImage(image: Image) {
    this.currentImage = image;
    const rw = 0.9 * window.innerWidth / image.width;
    const rh = 0.9 * window.innerHeight / image.height;
    if (rw < 1 || rh < 1) {
      const r = Math.min(rw, rh);
      this.width = image.width * r;
      this.height = image.height * r;
    } else {
      this.width = image.width;
      this.height = image.height;
    }
    this.modal.show();
  }

  getImageUrl(image: Image) {
    return this.presenter.getImageUrl(image);
  }

  getModalLeft(): number {
    return (window.innerWidth - this.width - 2) / 2;
  }
}
