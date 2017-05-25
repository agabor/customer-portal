import { Component } from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Image} from "../../../swagger/model/Image";
import {Modal} from "../../ui/modal";

@Component({
    selector: 'project-images',
    templateUrl: './images.component.html',
    styleUrls: ['./images.component.css']
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

    showImage(image: Image){
        this.presenter.showImage(image);
    }

    setProject(project: Project) {
        this.project = project;
    }

    getImageUrl(image: Image) {
        return this.presenter.getImageUrl(image);
    }
}
