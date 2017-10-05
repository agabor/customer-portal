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
        preferredWidth: 0,
        preferredHeight: 0,
        fileName: null,
        conditions: []
    };


    modal = new Modal();

    constructor (private presenter: Presenter) {
        presenter.setImageModalComponent(this);
    }

    showImage(image: Image) {
        this.currentImage = image;
        this.modal.show();
    }

    getImageUrl(image: Image) {
        return this.presenter.getImageUrl(image);
    }

    getModalLeft(): number {
        return (window.innerWidth - this.currentImage.width - 2) / 2;
    }
}
