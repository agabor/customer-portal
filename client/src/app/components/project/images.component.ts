import { Component } from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Image} from "../../../swagger/model/Image";
import {Modal} from "../../ui/modal";

@Component({
    selector: 'project-images',
    templateUrl: './images.component.html'
    //styleUrls: ['./images.component.css']
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

    constructor (private presenter: Presenter) {
        presenter.setImageComponent(this);
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
    }

    showImage(image: Image){
        this.currentImage = image;
        this.modal.show();
    }

    setProject(project: Project) {
        this.project = project;
    }

    getImageUrl(image: Image) {
        return this.presenter.getImageUrl(image);
    }
}
