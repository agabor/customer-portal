import { Component } from '@angular/core';
import { Presenter } from "../presenter";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../swagger/model/Project";
import { Tab } from "../ui/tab";
import {Image} from "../../swagger/model/Image";
import {Text} from "../../swagger/model/Text";
import {Locale} from "../../swagger/model/Locale";
import {current} from "codelyzer/util/syntaxKind";

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

    currentImage: Image = {
        imageId: null,
        name: null,
        width: 0,
        height: 0,
        preferredWidth: 0,
        preferredHeight: 0,
        fileName: null,
        conditions: []
    };

    modal:Modal = new Modal();

    tabImages: Tab = new Tab('Images');

    tabTexts: Tab = new Tab('Texts');

    tabFiles: Tab = new Tab('Files');

    localeTabs: Tab[] = [];

    currentLocale: Locale;

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        let slug: string = route.snapshot.params['slug'];
        presenter.setProjectComponent(this, slug);
        this.showImages();
    }

    getImageUrl(image: Image) {
        return this.presenter.getImageUrl(image);
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

    showImage(image: Image){
        this.currentImage = image;
        this.modal.show();
    }

    setProject(project: Project) {
        this.project = project;
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
}

class Modal {
    hClass: string = 'modal fade';
    hStyle: string = 'display: none;';
    shown: boolean = false;
    show(){
        this.hClass = 'modal fade in';
        this.hStyle = 'display: block;';
        this.shown = true;
    }
    hide(){
        this.hClass = 'modal fade';
        this.hStyle = 'display: none;';
        this.shown = false;
    }
}

