import { Component } from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Locale} from "../../../swagger/model/Locale";
import {Tab} from "../../ui/tab";
import {ProjectLogic} from "../../logic/project-logic";
import {LocalText} from "../../../swagger/model/LocalText";
import {Text} from "../../../swagger/model/Text";

@Component({
    selector: 'project-texts',
    templateUrl: './texts.component.html',
    styleUrls: ['./texts.component.css']
})
export class TextsComponent {
    project: Project = {
        name : null,
        slug:null,
        files: [],
        locales: [],
        texts: [],
        images: []
    };

    projectLogic: ProjectLogic = new ProjectLogic(this.project);

    localeTabs: Tab[] = [];

    currentLocale: Locale;

    textEntries: TextEntry[] = [];

    constructor (private presenter: Presenter) {
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
        this.projectLogic = new ProjectLogic(this.project);
        this.localeTabs = [];
        for (let locale of this.project.locales) {
            this.localeTabs.push(new Tab(locale.name))
        }
        this.setLocale(0);
    }

    setLocale(i: number) {
        let idx = 0;
        for (let tab of this.localeTabs) {
            if (i == idx)
                tab.setActive();
            else
                tab.setInactive();
            ++idx;
        }
        this.currentLocale = this.project.locales[i];
        let entries = [];
        for (let text of this.project.texts) {
            entries.push(new TextEntry(text, this.getLocalText(text) ))
        }
        this.textEntries = entries;
    }

    private getLocalText(text: Text) : LocalText {
        for (let lt of text.values){
            if (lt.localeCode == this.currentLocale.localeId)
                return lt;
        }
    }
    getTextValue(text) {
        for(let lt of text.values) {
            if (lt.locale_code == this.currentLocale.localeId)
                return lt.value;
        }
        return '';
    }

    getBadgeLocaleText(localeIdx: number) : string {
        let count = this.projectLogic.getLocaleTextWarningCount(localeIdx);
        if (count == 0)
            return '';
        return '<span class="badge">' +  count +'</span>';
    }
    getTextIndicator(entry: TextEntry){
        if (this.projectLogic.hasWarning(entry.text, entry.localText))
            return 'glyphicon-remove';
        return 'glyphicon-ok'
    }

}

class TextEntry {

    id : string;

    constructor(public text: Text, public localText: LocalText){
        this.id = text.textId + localText.localeCode;
    }
}