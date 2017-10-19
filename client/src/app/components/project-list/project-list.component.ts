import {Component, ViewChild} from '@angular/core';
import { Presenter } from '../../logic/presenter';
import {ProjectBase} from '../../../swagger/model/ProjectBase';
import {ProjectModalComponent} from './project-modal.component';
import {Project} from '../../../swagger/model/Project';

@Component({
    templateUrl: './project-list.component.html',
    styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent {
  editedProject: Project;

    projects: ProjectBase[] = null;
    @ViewChild(ProjectModalComponent) projectModalComponent: ProjectModalComponent;

    constructor (private presenter: Presenter) {
        presenter.loadProjects((projects: ProjectBase[]) =>{
          this.projects = projects;
        })
    }

    showProject(slug: string) {
        this.presenter.showProject(slug);
    }

  edit(project: ProjectBase) {
      this.editedProject = project;
    this.projectModalComponent.project = {name: project.name};
    this.projectModalComponent.show(this);
  }

  deleteProject(project: Project) {
    if (confirm('Are you sure that you want to delete the project named ' + project.name + '?')) {
      this.presenter.deleteProject(project);
    }
  }

  saveProject() {
      if (this.editedProject == null) {
        this.presenter.addProject(this.projectModalComponent.project);
      } else {
        this.editedProject.name = this.projectModalComponent.project.name;
        this.presenter.updateProject(this.editedProject);
      }
  }

  add() {
    this.projectModalComponent.show(this);
  }
}
