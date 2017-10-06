import {Component, OnInit} from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Project} from '../../../../swagger/model/Project';
import {Locale} from '../../../../swagger/model/Locale';
import {Tab} from '../../../ui/tab';
import {ProjectLogic} from '../../../logic/project-logic';
import {LocalText} from '../../../../swagger/model/LocalText';
import {Text} from '../../../../swagger/model/Text';
import {ActivatedRoute, Router} from '@angular/router';
import {TextModalComponent} from "./text-modal.component";

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
        locales: [],
        texts: [],
        images: []
    };

    projectLogic: ProjectLogic = new ProjectLogic(this.project);

    localeTabs: Tab[] = [];

    lang = 0;
    newTextDialog = false;
    editedText: Text;

    currentLocale: Locale;

    textEntries: TextEntry[] = [];

    saved = true;
    textModalComponent: TextModalComponent;

    getTextIndicator(entry: TextEntry) {
        if (ProjectLogic.hasWarning(entry.text, entry.localText)) {
            return 'glyphicon-remove';
        }
        return 'glyphicon-ok';
    }

    constructor (private presenter: Presenter, private route: ActivatedRoute, private router: Router) {
        presenter.setTextComponent(this);
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
        this.projectLogic = new ProjectLogic(this.project);
        this.localeTabs = [];
        for (const locale of this.project.locales) {
            this.localeTabs.push(new Tab(locale.name));
        }
        const lang = this.route.snapshot.params['lang'];
        this.lang = lang;
        if (!lang) {
            this.lang = 0;
        } else {
            this.lang = this.getLocaleIndex(lang);
        }
        this.setLocale(this.lang);
    }

    navigate(i: number) {
        this.setLocale(i);
        const slug = this.route.snapshot.params['slug'];
        this.router.navigate(['/projects/' + slug + '/texts/' + this.currentLocale.localeId]);
    }

    getLocaleIndex(localeId: string): number {
        let idx = 0;
        for (const loc of this.project.locales){
            if (loc.localeId === localeId) {
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
        this.currentLocale = this.project.locales[i];
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
            if (lt.localeCode === this.currentLocale.localeId) {
                return lt;
            }
        }
    }
    getTextValue(text) {
        for (const lt of text.values) {
            if (lt.locale_code === this.currentLocale.localeId) {
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
        this.newTextDialog = true;
        this.textModalComponent.setEmptyText();
        this.textModalComponent.show();
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
        this.textModalComponent.show();
    }

    public deleteText(text: Text) {
        const texts = this.presenter.activeProject.texts;
        const index = texts.indexOf(text, 0);
        if (index > -1) {
            texts.splice(index, 1);
        }
        this.setEntries();
    }

    setTextModalComponent(newTextModalComponent: TextModalComponent) {
        this.textModalComponent = newTextModalComponent;
    }

    saveText() {
        this.saved = false;
        const text = this.textModalComponent.model;
        if (this.newTextDialog) {
            this.newTextDialog = false;
            text.textId = TextModalComponent.slugify(text.name);
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
        this.id = text.textId + localText.localeCode;
    }
}
