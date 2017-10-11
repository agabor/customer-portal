import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Modal} from '../../../ui/modal';
import {Language} from '../../../../swagger/model/Language';
import {TextsComponent} from './texts.component';

@Component({
    selector: 'app-language-modal',
    templateUrl: './language-modal.component.html'
})
export class LanguageModalComponent {

  @ViewChild('languageForm') languageForm: NgForm;

  modal = new Modal();
  language: Language = {};
  textsComponent: TextsComponent;
  recognized = true;

  show(textsComponent: TextsComponent) {
    this.textsComponent = textsComponent;
    this.modal.show();
  }

  save() {
    this.textsComponent.addLanguage(this.language);
  }

  hide() {
    this.modal.hide();
  }
}

