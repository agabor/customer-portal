import { Component } from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Modal} from '../../../ui/modal';
import {Image} from '../../../../swagger/model/Image';

@Component({
    selector: 'app-new-image-modal',
    templateUrl: './new-image-modal.component.html'
})
export class NewImageModalComponent {

    modal = new Modal();
    image: Image = {name: '', description: '', minWidth: 100, maxWidth: 100, minHeight: 100, maxHeight: 100};

    constructor (private presenter: Presenter) {
    }

    show() {
        this.modal.show();
    }
    save() {
        this.presenter.newImage(this.image);
        this.hide();
    }

    hide() {
        this.modal.hide();
    }
}

