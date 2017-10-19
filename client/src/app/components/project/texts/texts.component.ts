import {Component, OnInit, ViewChild} from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Project} from '../../../../swagger/model/Project';
import {Language} from '../../../../swagger/model/Language';
import {Tab} from '../../../ui/tab';
import {ProjectLogic} from '../../../logic/project-logic';
import {LocalText} from '../../../../swagger/model/LocalText';
import {Text} from '../../../../swagger/model/Text';
import {ActivatedRoute, Router} from '@angular/router';
import {TextModalComponent} from './text-modal.component';
import {LanguageModalComponent} from './language-modal.component';

@Component({
    selector: 'app-project-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.css']
})
export class TextsComponent implements OnInit {
  static saved = true;
  saving = false;
  project: Project = {
    name: null,
    slug: null,
    files: [],
    languages: [],
    texts: [],
    images: []
  };

  projectLogic: ProjectLogic = new ProjectLogic(this.project);

  languageTabs: Tab[] = [];

  lang = 0;
  editedText: Text;

  currentLanguage: Language;

  textEntries: TextEntry[] = [];

  @ViewChild(TextModalComponent) textModalComponent: TextModalComponent;
  @ViewChild(LanguageModalComponent) languageModalComponent: LanguageModalComponent;

  static slugify(text: string): string {
    return text.toString().toLowerCase()
      .replace(/\s+/g, '_')           // Replace spaces with -
      .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
      .replace(/\-\-+/g, '_')         // Replace multiple - with single -
      .replace(/^-+/, '')             // Trim - from start of text
      .replace(/-+$/, '');            // Trim - from end of text
  }

  getTextIndicator(entry: TextEntry) {
    if (ProjectLogic.hasWarning(entry.text, entry.localText)) {
      return 'glyphicon-remove';
    }
    return 'glyphicon-ok';
  }

  constructor(private presenter: Presenter, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {
    this.project = this.presenter.activeProject;
    this.projectLogic = new ProjectLogic(this.project);
    this.setLanguageTabs();
    const lang = this.route.snapshot.params['lang'];
    this.lang = -1;
    if (lang) {
      this.lang = this.getLanguageIndex(lang);
    }
    if (this.lang === -1) {
      this.lang = 0;
    }
    this.setLanguage(this.lang);
  }

  private setLanguageTabs() {
    this.languageTabs = [];
    for (const language of this.project.languages) {
      this.languageTabs.push(new Tab(language.name));
    }
  }

  navigate(i: number) {
    this.setLanguage(i);
    this.router.navigate(['/projects/' + this.project.slug + '/texts/' + this.currentLanguage.code]);
  }

  getLanguageIndex(languageId: string): number {
    let idx = 0;
    for (const loc of this.project.languages) {
      if (loc.code === languageId) {
        return idx;
      }
      ++idx;
    }
    return -1;
  }

  setLanguage(i: number) {
    let idx = 0;
    for (const tab of this.languageTabs) {
      if (i === idx) {
        tab.setActive();
      } else {
        tab.setInactive();
      }
      ++idx;
    }
    this.currentLanguage = this.project.languages[i];
    this.setEntries();
  }

  setEntries() {
    const entries = [];
    for (const text of this.project.texts) {
      entries.push(new TextEntry(text, this.getLocalText(text)));
    }
    this.textEntries = entries;
  }

  private getLocalText(text: Text): LocalText {
    for (const lt of text.values) {
      if (lt.languageCode === this.currentLanguage.code) {
        return lt;
      }
    }
    const lt = {languageCode: this.currentLanguage.code, value: ''};
    text.values.push(lt);
    return lt;
  }

  getTextValue(text) {
    for (const lt of text.values) {
      if (lt.languageCode === this.currentLanguage.code) {
        return lt.value;
      }
    }
    return '';
  }

  getBadgeLocaleText(languageIdx: number): string {
    const count = this.projectLogic.getLocaleTextWarningCount(languageIdx);
    if (count === 0) {
      return '';
    }
    return '<span class="badge">' + count + '</span>';
  }

  save() {
    TextsComponent.saved = true;
    this.saving = true;
    this.presenter.saveProjectTexts(() => {
      this.saving = false;
    });
  }

  onKey(event: any) {
    const s = String(event.key);
    if (s.length === 1 || s === 'Backspace' || s === 'Enter') {
      TextsComponent.saved = false;
    }
  }

  changed() {
    TextsComponent.saved = false;
  }

  isSaved(): boolean {
    return TextsComponent.saved;
  }

  public add() {
    this.editedText = null;
    this.textModalComponent.setEmptyText();
    this.textModalComponent.show(this);
  }

  public reset() {
    const self = this;
    this.presenter.loadProject(this.presenter.activeProject.slug, function () {
      self.project = self.presenter.activeProject;
      TextsComponent.saved = true;
      self.setEntries();
    });
  }

  public edit(text: Text) {
    this.editedText = text;
    this.textModalComponent.model = {
      name: text.name,
      description: text.description,
      startGroup: text.startGroup,
      minLength: text.minLength,
      maxLength: text.maxLength,
      values: []
    };
    this.textModalComponent.show(this);
  }

  public resetText(text: Text) {
    this.presenter.resetTextVaule(text, this.currentLanguage);
  }

  public deleteText(text: Text) {
    if (!confirm('Are you sure you want to delete this text?')) {
      return;
    }
    const texts = this.presenter.activeProject.texts;
    const index = texts.indexOf(text, 0);
    if (index > -1) {
      texts.splice(index, 1);
    }
    this.presenter.deleteText(text);
    TextsComponent.saved = false;
    this.setEntries();
  }

  isIdInUse(textId: string): boolean {
    for (const text of this.presenter.activeProject.texts) {
      if (text.textId === textId) {
        return true;
      }
    }
    return false;
  }

  saveText() {
    const text = this.textModalComponent.model;
    if (this.editedText == null) {
      const baseID = TextsComponent.slugify(text.name);
      text.textId = baseID;
      let idx = 2;
      while (this.isIdInUse(text.textId)) {
        text.textId = baseID + idx;
        idx += 1;
      }
      this.presenter.addText(text, () => {
        this.setEntries();
      });
    } else {
      TextsComponent.saved = false;
      this.editedText.name = text.name;
      this.editedText.description = text.description;
      this.editedText.startGroup = text.startGroup;
      this.editedText.minLength = text.minLength;
      this.editedText.maxLength = text.maxLength;
      this.presenter.updateText(this.editedText);
    }
    this.textModalComponent.hide();
  }

  addNewLanguage() {
    this.languageModalComponent.show(this);
  }

  removeLanguage() {
    const language = this.currentLanguage;
    if (confirm('Are you sure that you want to remove the ' + language.name + ' language?')) {
      for (const text of this.project.texts) {
        const newValues = [];
        for (const lt of text.values) {
          if (lt.languageCode !== language.code) {
            newValues.push(lt);
          }
        }
        text.values = newValues;
      }
      this.project.languages.splice(this.project.languages.indexOf(language), 1);
      this.setLanguageTabs();
      if (this.lang === this.project.languages.length) {
        this.lang -= 1;
      }
      this.setLanguage(this.lang);
    this.presenter.removeLanguage(language);
    }
  }

  addLanguage(language: Language) {
    this.presenter.addLanguage(language, () => {
      this.setLanguageTabs();
      this.setLanguage(this.languageTabs.length - 1);
      this.languageModalComponent.language = {};
      this.languageModalComponent.recognized = true;
      this.languageModalComponent.languageForm.form.markAsPristine();
      this.languageModalComponent.hide();
    }, () => {
      this.languageModalComponent.recognized = false;
    });
  }
}

class TextEntry {

    id: string;

    constructor(public text: Text, public localText: LocalText) {
        this.id = text.textId + localText.languageCode;
    }
}
