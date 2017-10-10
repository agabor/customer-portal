import {Component, ViewChild} from '@angular/core';
import {NgForm} from '@angular/forms';
import {ProjectBase} from '../../../swagger/model/ProjectBase';
import {Modal} from '../../ui/modal';
import {ProjectListComponent} from './project-list.component';

@Component({
    selector: 'app-project-modal',
    templateUrl: './project-modal.component.html'
})
export class ProjectModalComponent {

    @ViewChild('projectForm') projectForm: NgForm;

    modal = new Modal();
    project: ProjectBase = {};
    projectlistComponent: ProjectListComponent;

    show(projectlistComponent: ProjectListComponent) {
      this.projectlistComponent = projectlistComponent;
        this.modal.show();
    }

    save() {
        this.hide();
        this.projectlistComponent.saveProject();
        this.project = {};
        this.projectForm.form.markAsPristine();
    }

    hide() {
        this.modal.hide();
    }
}

