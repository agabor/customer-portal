import { Component } from '@angular/core';
import { Presenter } from "../presenter";

@Component({
    templateUrl: './project-list.component.html'
})
export class ProjectListComponent {

    projects = null;

    constructor (private presenter: Presenter) {
        presenter.setProjectListComponent(this);
    }

}