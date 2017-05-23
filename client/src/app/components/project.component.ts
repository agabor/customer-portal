import { Component } from '@angular/core';
import { Presenter } from "../presenter";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../swagger/model/Project";
import { Tab } from "../ui/tab";
import {Image} from "../../swagger/model/Image";

@Component({
    templateUrl: './project.component.html'
})
export class ProjectComponent {

    project: Project = {
        name : null,
        slug:null,
        files: null,
        locales: null,
        texts: null,
        images: null
    };

    tabImages: Tab = new Tab();

    tabTexts: Tab = new Tab();

    tabFiles: Tab = new Tab();

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
}


