import { Component } from '@angular/core';
import {ImageData} from "../../../image-data";
import {Presenter} from "../../../logic/presenter";
import {Modal} from "../../../ui/modal";

@Component({
    selector: 'new-image-modal',
    templateUrl: './new-image-modal.component.html'
})
export class NewImageModalComponent {

    modal:Modal = new Modal();
    model:ImageData = new ImageData('', '', 100,100);

    constructor (private presenter: Presenter) {
        presenter.setNewImageModalComponent(this);
    }

    show() {
        this.modal.show()
    }
    save(){
        this.presenter.newImage(this.model);
    }

    hide() {
        this.modal.hide()
    }
}

