import {Component, OnInit} from '@angular/core';
import {Presenter} from "../../logic/presenter";
import {Project} from "../../../swagger/model/Project";
import {Image} from "../../../swagger/model/Image";
import {Modal} from "../../ui/modal";

@Component({
    selector: 'project-files',
    templateUrl: './files.component.html',
    styleUrls: ['./files.component.css']
})
export class FilesComponent implements OnInit{
    project: Project = {
        name: null,
        slug: null,
        files: [],
        languages: [],
        texts: [],
        images: []
    };

    modal = new Modal();
    public fileIsOver = false;
    private file: File;

    constructor (private presenter: Presenter) {
    }

    ngOnInit() {
        this.project = this.presenter.activeProject;
    }

    public fileOver(fileIsOver: boolean): void {
        this.fileIsOver = fileIsOver;
        console.log('fileIsOver ' + fileIsOver);
    }

    public onFileDrop(file: File): void {
        console.log('Got file! ' + file.name);
    }

}
