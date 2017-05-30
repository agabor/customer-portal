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

    public fileIsOver: Image = null;

    private file: File;

    public fileOver(fileIsOver: boolean, image: Image): void {
        if (fileIsOver) {
            this.fileIsOver = image;
        } else {
            if (this.fileIsOver == image)
                this.fileIsOver = null;
        }
        console.log('fileIsOver ' + fileIsOver + ' ' + image.imageId);
    }

    public onFileDrop(file: File, image: Image): void {
        let reader = new FileReader();

        reader.onload = (event:any) => {
            image.fileName = event.target.result;
        };
        reader.readAsDataURL(file);
        this.presenter.uploadImage(file, image);
    }

    public load(image: Image){
        let element = <HTMLImageElement>document.getElementById('img'+image.imageId);
        image.width = element.naturalWidth;
        image.height = element.naturalHeight;
    }

}
