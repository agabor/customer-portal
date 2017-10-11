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

@Component({
    selector: 'app-project-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.css']
})
export class TextsComponent implements OnInit {
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

    localeTabs: Tab[] = [];

    lang = 0;
    editedText: Text;

    currentLanguage: Language;

    textEntries: TextEntry[] = [];

    saved = true;
    @ViewChild(TextModalComponent) textModalComponent: TextModalComponent;

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

    constructor (private presenter: Presenter, private route: ActivatedRoute, private router: Router) {
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
        this.projectLogic = new ProjectLogic(this.project);
        this.localeTabs = [];
        for (const locale of this.project.languages) {
            this.localeTabs.push(new Tab(locale.name));
        }
        const lang = this.route.snapshot.params['lang'];
        this.lang = lang;
        if (!lang) {
            this.lang = 0;
        } else {
            this.lang = this.getLanguageIndex(lang);
        }
        this.setLocale(this.lang);
    }

    navigate(i: number) {
        this.setLocale(i);
        const slug = this.route.snapshot.params['slug'];
        this.router.navigate(['/projects/' + slug + '/texts/' + this.currentLanguage.code]);
    }

    getLanguageIndex(localeId: string): number {
        let idx = 0;
        for (const loc of this.project.languages){
            if (loc.code === localeId) {
               return idx;
            }
            ++idx;
        }
        return -1;
    }

    setLocale(i: number) {
        let idx = 0;
        for (const tab of this.localeTabs) {
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
        for (const lt of text.values){
            if (lt.languageCode === this.currentLanguage.code) {
                return lt;
            }
        }
        return { languageCode: this.currentLanguage.code, value: '' };
    }

    getTextValue(text) {
        for (const lt of text.values) {
            if (lt.locale_code === this.currentLanguage.code) {
                return lt.value;
            }
        }
        return '';
    }

    getBadgeLocaleText(localeIdx: number): string {
        const count = this.projectLogic.getLocaleTextWarningCount(localeIdx);
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }

    save() {
        this.saved = true;
        this.saving = true;
        this.presenter.saveProjectTexts(() => {
            this.saving = false;
        });
    }

    onKey(event: any) {
        const s = String(event.key);
        if (s.length === 1 || s === 'Backspace' || s === 'Enter') {
            this.saved = false;
        }
    }

    changed() {
        this.saved = false;
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
            self.saved = true;
            self.setEntries();
        });
    }

    public edit(text: Text) {
        this.editedText = text;
        this.textModalComponent.model =  {
            name: text.name,
            description: text.description,
            minLength: text.minLength,
            maxLength: text.maxLength,
            values: []
        };
        this.textModalComponent.show(this);
    }

    public deleteText(text: Text) {
        const texts = this.presenter.activeProject.texts;
        const index = texts.indexOf(text, 0);
        if (index > -1) {
            texts.splice(index, 1);
        }
        this.saved = false;
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
        this.saved = false;
        const text = this.textModalComponent.model;
        if (this.editedText == null) {
            const baseID = TextsComponent.slugify(text.name);
            text.textId = baseID;
            let idx = 2;
            while (this.isIdInUse(text.textId)) {
              text.textId = baseID + idx;
              idx += 1;
            }
            this.presenter.activeProject.texts.push(text);
            this.setEntries();
        } else {
            this.editedText.name = text.name;
            this.editedText.description = text.description;
            this.editedText.minLength = text.minLength;
            this.editedText.maxLength = text.maxLength;
        }
        this.textModalComponent.hide();
    }
}

class TextEntry {

    id: string;

    constructor(public text: Text, public localText: LocalText) {
        this.id = text.textId + localText.languageCode;
    }
}
