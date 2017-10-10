import { Component } from '@angular/core';
import {ImageData} from '../../../image-data';
import {Presenter} from '../../../logic/presenter';
import {Modal} from '../../../ui/modal';

@Component({
    selector: 'app-new-image-modal',
    templateUrl: './new-image-modal.component.html'
})
export class NewImageModalComponent {

    modal = new Modal();
    model = new ImageData('', '', 100, 100);

    constructor (private presenter: Presenter) {
    }

    show() {
        this.modal.show();
    }
    save() {
        this.presenter.newImage(this.model);
        this.hide();
    }

    hide() {
        this.modal.hide();
    }
}

