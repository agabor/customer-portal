import {Component, Inject, ViewChild} from '@angular/core';
import { Presenter } from '../../logic/presenter';
import { Project } from '../../../swagger/model/Project';
import {User} from '../../../swagger/model/User';
import {APP_BASE_HREF} from '@angular/common';

@Component({
    selector: 'app-project-users',
    templateUrl: './users.component.html'
})
export class UsersComponent {
    project: Project;
    newUser: User = {};
    @ViewChild('newUserForm') newUserForm: any;

    constructor (private presenter: Presenter, @Inject(APP_BASE_HREF) private appBasePath: string) {
        this.project = presenter.activeProject;
    }

    onSubmit() {
        this.presenter.addUser(this.newUser);
        this.newUser = {};
        this.newUserForm.form.markAsPristine();
    }
    getLoginLink(user: User) {
       return this.appBasePath + '/token/' + user.loginToken;
    }
}
