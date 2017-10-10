import {Component, ViewChild} from '@angular/core';
import { Presenter } from '../../logic/presenter';
import {ProjectBase} from '../../../swagger/model/ProjectBase';
import {ProjectModalComponent} from './project-modal.component';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['../project-list.component.css']
})
export class ProjectListComponent {

    projects: ProjectBase[] = null;
    @ViewChild(ProjectModalComponent) projectModalComponent: ProjectModalComponent;

    constructor (private presenter: Presenter) {
        presenter.setProjectListComponent(this);
    }

    showProject(slug: string) {
        this.presenter.showProject(slug);
    }

  edit(project) {}
  deleteProject(project) {}

  saveProject() {
    this.presenter.addProject(this.projectModalComponent.project);
  }

  add() {
    this.projectModalComponent.show(this);
  }
}
