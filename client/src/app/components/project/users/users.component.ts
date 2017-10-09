import {Component, Inject, Injector, ViewChild} from '@angular/core';
import { Presenter } from '../../../logic/presenter';
import { Project } from '../../../../swagger/model/Project';
import {User} from '../../../../swagger/model/User';
import {APP_BASE_HREF} from '@angular/common';
import {UserModalComponent} from './user-modal.component';

@Component({
    selector: 'app-project-users',
    templateUrl: './users.component.html'
})
export class UsersComponent {
    editedUser: User;
    project: Project;
    @ViewChild(UserModalComponent) userModalComponent: UserModalComponent;

    constructor (private presenter: Presenter, @Inject(APP_BASE_HREF) private appBasePath: string) {
        this.project = presenter.activeProject;
    }

    getLoginLink(user: User) {
       return this.appBasePath + '/token/' + user.loginToken;
    }

    saveUser() {
        if (this.editedUser == null) {
            this.presenter.addUser(this.userModalComponent.newUser);
        }
    }

    add() {
        this.editedUser = null;
        this.userModalComponent.usersComponent = this;
        this.userModalComponent.show();
    }

    edit(user: User) {
        this.editedUser = user;
        this.userModalComponent.usersComponent = this;
        this.userModalComponent.newUser = user;
        this.userModalComponent.show();
    }

    deleteUser(user: User) {
    }
}
