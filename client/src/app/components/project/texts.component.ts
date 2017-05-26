import { Component } from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Image} from "../../../swagger/model/Image";
import {Modal} from "../../ui/modal";
import {Locale} from "../../../swagger/model/Locale";
import {Tab} from "../../ui/tab";
import {ProjectLogic} from "../../logic/project-logic";
import {LocalText} from "../../../swagger/model/LocalText";

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
    getTextIndicator(text: Text, localText: LocalText){
        if (this.projectLogic.hasWarning(text, localText))
            return '<span class="glyphicon glyphicon-remove"></span>';
        return '<span class="glyphicon glyphicon-ok"></span>'
    }

}
