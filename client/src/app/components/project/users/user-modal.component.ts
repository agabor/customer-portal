import {Component, ViewChild} from '@angular/core';
import {Modal} from '../../../ui/modal';
import {UsersComponent} from './users.component';
import {User} from '../../../../swagger/model/User';
import {NgForm} from '@angular/forms';
import {Project} from '../../../../swagger/model/Project';
import {Presenter} from '../../../logic/presenter';

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html'
})
export class UserModalComponent {

    @ViewChild('newUserForm') newUserForm: NgForm;

    modal = new Modal();
    user: User = {};
    project: Project = {};
    isNewUser = true;
    usersComponent: UsersComponent;
    message: string;

    constructor(private presenter: Presenter) {
      this.project = presenter.activeProject;
    }

    show() {
      this.message = 'Dear ' + this.user.name + ',\n' +
        'Please participate in the project named ' + this.project.name + '. You can register by clicking [link].';
        this.modal.show();
    }

    save() {
        this.hide();
        this.usersComponent.saveUser();
        this.user = {};
        this.newUserForm.form.markAsPristine();
    }

    hide() {
        this.modal.hide();
    }

    setUsersComponent(usersComponent: UsersComponent) {
        this.usersComponent = usersComponent;
    }
}

