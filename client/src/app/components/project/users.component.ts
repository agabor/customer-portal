import { Component } from '@angular/core';
import { Presenter } from '../../logic/presenter';
import { Project } from '../../../swagger/model/Project';

@Component({
    selector: 'app-project-users',
    templateUrl: './users.component.html'
})
export class UsersComponent {
    project: Project;
    constructor (private presenter: Presenter) {
        this.project = presenter.activeProject;
    }
}
