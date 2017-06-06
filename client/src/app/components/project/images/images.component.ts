import { Component } from '@angular/core';
import {Presenter} from "../../../logic/presenter";
import {Project} from "../../../../swagger/model/Project";
import {Image} from "../../../../swagger/model/Image";
import {Modal} from "../../../ui/modal";

@Component({
    selector: 'project-images',
    templateUrl: './images.component.html'
})
export class ImagesComponent {
    project: Project = {
        name : null,
        slug:null,
        files: [],
        locales: [],
        texts: [],
        images: []
    };


    modal:Modal = new Modal();

    constructor (private presenter: Presenter) {
        presenter.setImageComponent(this);
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
    }


    setProject(project: Project) {
        this.project = project;
    }

    public add(){
        this.presenter.showNewImageModal()
    }
}
