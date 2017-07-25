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

    tabLinks: Tab = new Tab('Links');

    tabs: Tab[] = [this.tabImages, this.tabTexts, this.tabFiles, this.tabVideos, this.tabLinks];

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        presenter.setProjectComponent(this);
    }

    ngOnInit() {
        const slug: string = this.route.snapshot.params['slug'];
        this.presenter.initProject(slug);
        this.showImages();
    }

    showImages() {
        this.showTab(this.tabImages);
    }

    showTexts() {
        this.showTab(this.tabTexts);
    }

    showFiles() {
        this.showTab(this.tabFiles);
    }

    showVideos() {
        this.showTab(this.tabVideos);
    }
    showLinks() {
        this.showTab(this.tabLinks);
    }

    showTab(tab: Tab) {
        for (const t of this.tabs){
            if (t === tab) {
                t.setActive();
            } else {
                t.setInactive();
            }
        }
    }

    setProject(project: Project) {
        this.project = project;
        this.projectLogic = new ProjectLogic(this.project);
    }


    getBadgeText(): string {
        const count = this.projectLogic.getTextWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }
    getBadgeImage(): string {
        const count = this.projectLogic.getImageWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }
    getBadgeFile(): string {
        const count = this.projectLogic.getFileWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }


}
