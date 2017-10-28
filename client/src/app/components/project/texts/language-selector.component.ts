import {Modal} from '../../../ui/modal';
import {Component, Input} from '@angular/core';
import {Language} from '../../../../swagger/model/Language';
import {Presenter} from '../../../logic/presenter';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.css']
})
export class LanguageSelectorComponent {
  modal = new Modal();
  languageSelected: (language: Language) => void;
  languages: Language[];

  constructor(private presenter: Presenter) {
  }

  selectLanguage(language: Language) {
    this.modal.hide();
    this.languageSelected(language);
  }

  projectHasLanguage(language: Language) {
    for ( const l of this.presenter.activeProject.languages) {
      if (l.code === language.code) {
        return true;
      }
    }
    return false;
  }
}
