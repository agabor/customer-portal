import {Component, ViewChild} from '@angular/core';
import {Modal} from '../../../ui/modal';
import {LinksComponent} from './links.component';
import {NgForm} from '@angular/forms';
import {Link} from '../../../../swagger/model/Link';
import {IconSelectorComponent} from './icon-selector.component';

@Component({
    selector: 'app-link-modal',
    templateUrl: './link-modal.component.html'
})
export class LinkModalComponent {

  @ViewChild('newLinkForm') newLinkForm: NgForm;
  @ViewChild(IconSelectorComponent) iconSelector: IconSelectorComponent;

  modal = new Modal();
  link: Link = { icon: '' };
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

  chooseIcon() {
    this.iconSelector.iconSelected = (icon: string) => {
      this.link.icon = icon;
    };
    this.iconSelector.modal.show();
  }

  get iconSuffix(): string {
    if (this.link.icon == null || this.link.icon.length < 3) {
      return '';
    }
    return this.link.icon.substr(3);
  }
  set iconSuffix(theIcon: string) {
    this.link.icon = 'fa-' + theIcon;
  }

  get isIconValid(): boolean {
    return /^[a-z0-9\-]*$/.test(this.iconSuffix);
  }
}

