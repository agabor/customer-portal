import { Component } from '@angular/core';
import { Presenter } from "../../logic/presenter";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../../swagger/model/Project";
import { Tab } from "../../ui/tab";
import {ProjectLogic} from "../../logic/project-logic";

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

    tabVideos: Tab = new Tab('Videos');


    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        presenter.setProjectComponent(this);
    }

    ngOnInit() {
        let slug: string = this.route.snapshot.params['slug'];
        this.presenter.initProject(slug);
        this.showImages();
    }

    showImages(){
        this.tabVideos.setInactive();
        this.tabTexts.setInactive();
        this.tabFiles.setInactive();
        this.tabImages.setActive();
    }

    showTexts(){
        this.tabVideos.setInactive();
        this.tabImages.setInactive();
        this.tabFiles.setInactive();
        this.tabTexts.setActive();
    }

    showFiles() {
        this.tabVideos.setInactive();
        this.tabTexts.setInactive();
        this.tabImages.setInactive();
        this.tabFiles.setActive();
    }

    showVideos() {
        this.tabTexts.setInactive();
        this.tabImages.setInactive();
        this.tabFiles.setInactive();
        this.tabVideos.setActive();
    }

    setProject(project: Project) {
        this.project = project;
        this.projectLogic = new ProjectLogic(this.project);
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


}
