import { Component } from '@angular/core';
import { Presenter } from "./presenter";

@Component({
    selector: 'project-list',
    templateUrl: './project-list.component.html'
})
export class ProjectListComponent {

    projects = null;

    constructor (private presenter: Presenter) {
        this.projects = presenter.projects;
    }

}