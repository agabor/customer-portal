import { Component } from '@angular/core';
import { Presenter } from "../logic/presenter";
import {ProjectBase} from "../../swagger/model/ProjectBase";

@Component({
    templateUrl: './project-list.component.html'
})
export class ProjectListComponent {

    projects: ProjectBase[] = null;

    constructor (private presenter: Presenter) {
        presenter.setProjectListComponent(this);
    }

    showProject(slug: string) {
        this.presenter.showProject(slug);
    }

}