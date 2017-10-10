import { Component } from '@angular/core';
import {ImageData} from '../../../image-data';
import {Presenter} from '../../../logic/presenter';
import {Modal} from '../../../ui/modal';
import {Text} from '../../../../swagger/model/Text';
import {TextsComponent} from './texts.component';

@Component({
    selector: 'app-new-text-modal',
    templateUrl: './text-modal.component.html'
})
export class TextModalComponent {

    modal = new Modal();
    model: Text;
    textsComponent: TextsComponent;

    constructor (private presenter: Presenter) {
        this.setEmptyText();
    }

    show(textsComponent: TextsComponent) {
      this.textsComponent = textsComponent;
        this.modal.show();
    }

    save() {
        this.textsComponent.saveText();
    }

    hide() {
        this.modal.hide();
    }


    setEmptyText() {
        this.model = {
            name: '',
            description: '',
            minLength: 10,
            maxLength: 1000,
            values: []
        };
        for (const locale of this.presenter.activeProject.locales) {
            this.model.values.push({
                localeCode: locale.localeId,
                value: ''
            });
        }
    }
}

