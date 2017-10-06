import { Component } from '@angular/core';
import {ImageData} from '../../../image-data';
import {Presenter} from '../../../logic/presenter';
import {Modal} from '../../../ui/modal';
import {Text} from '../../../../swagger/model/Text';

@Component({
    selector: 'app-new-text-modal',
    templateUrl: './new-text-modal.component.html'
})
export class NewTextModalComponent {

    modal = new Modal();
    model: Text = {
        name: '',
        description: '',
        minLength: 10,
        maxLength: 1000,
        values: []
    };

    static slugify(text: string): string {
        return text.toString().toLowerCase()
            .replace(/\s+/g, '_')           // Replace spaces with -
            .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
            .replace(/\-\-+/g, '_')         // Replace multiple - with single -
            .replace(/^-+/, '')             // Trim - from start of text
            .replace(/-+$/, '');            // Trim - from end of text
    }

    constructor (private presenter: Presenter) {
        presenter.setNewTextModalComponent(this);
        for (const locale of this.presenter.activeProject.locales) {
            this.model.values.push({
                localeCode: locale.localeId,
                value: ''
            });
        }
    }

    show() {
        this.modal.show();
    }

    save() {
        this.model.textId = NewTextModalComponent.slugify(this.model.name);
        this.presenter.newText(this.model);
    }

    hide() {
        this.modal.hide();
    }
}

