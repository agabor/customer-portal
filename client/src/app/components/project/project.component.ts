import { Component } from '@angular/core';
import { Presenter } from "../../logic/presenter";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../swagger/model/Project";
import { Tab } from "../../ui/tab";
import {Image} from "../../../swagger/model/Image";
import {Text} from "../../../swagger/model/Text";
import {Locale} from "../../../swagger/model/Locale";
import {current} from "codelyzer/util/syntaxKind";
import {ProjectLogic} from "../../logic/project-logic";
import {LocalText} from "../../../swagger/model/LocalText";

@Component({
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent {

    project: Project = {
        name : null,
        slug:null,
        files: [],
        locales: [],
        texts: [],
        images: []
    };

    projectLogic: ProjectLogic = new ProjectLogic(this.project);


    tabImages: Tab = new Tab('Images');

    tabTexts: Tab = new Tab('Texts');

    tabFiles: Tab = new Tab('Files');

    localeTabs: Tab[] = [];

    currentLocale: Locale;

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        presenter.setProjectComponent(this);
    }

    ngOnInit() {
        let slug: string = this.route.snapshot.params['slug'];
        this.presenter.initProject(slug);
        this.showImages();
    }

    showImages(){
        this.tabTexts.setInactive();
        this.tabFiles.setInactive();
        this.tabImages.setActive();
    }

    showTexts(){
        this.tabImages.setInactive();
        this.tabFiles.setInactive();
        this.tabTexts.setActive();
    }

    showFiles() {
        this.tabTexts.setInactive();
        this.tabImages.setInactive();
        this.tabFiles.setActive();
    }


    setProject(project: Project) {
        this.project = project;
        this.projectLogic = new ProjectLogic(this.project);
        this.localeTabs = [];
        for (let locale of project.locales) {
            this.localeTabs.push(new Tab(locale.name))
        }
        this.setLocale(1);
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

    getBadgeText() : string {
        let count = this.projectLogic.getTextWarningCount();
        if (count == 0)
            return '';
        return '<span class="badge">' +  count +'</span>';
    }
    getBadgeImage() : string {
        let count = this.projectLogic.getImageWarningCount();
        if (count == 0)
            return '';
        return '<span class="badge">' +  count +'</span>';
    }
    getBadgeFile() : string {
        let count = this.projectLogic.getFileWarningCount();
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
