import {Component, ViewChild} from '@angular/core';
import {Modal} from '../../../ui/modal';
import {LinksComponent} from './links.component';
import {NgForm} from '@angular/forms';
import {Link} from '../../../../swagger/model/Link';

@Component({
    selector: 'app-link-modal',
    templateUrl: './link-modal.component.html'
})
export class LinkModalComponent {

    @ViewChild('newLinkForm') newLinkForm: NgForm;

    modal = new Modal();
    link: Link = {};
    linksComponent: LinksComponent;

    show(linksComponent: LinksComponent) {
      this.linksComponent = linksComponent;
        this.modal.show();
    }

    save() {
        this.hide();
        this.linksComponent.saveLink();
        this.link = {};
        this.newLinkForm.form.markAsPristine();
    }

    hide() {
        this.modal.hide();
    }
}

