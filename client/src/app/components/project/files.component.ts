import { Component } from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Image} from "../../../swagger/model/Image";
import {Modal} from "../../ui/modal";

@Component({
    selector: 'project-files',
    templateUrl: './files.component.html'
    //styleUrls: ['./files.component.css']
})
export class FilesComponent {
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
        //presenter.setImageComponent(this);
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
    }


}
