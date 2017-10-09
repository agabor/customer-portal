import {Component, Injector, ViewChild} from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Modal} from '../../../ui/modal';
import {Text} from '../../../../swagger/model/Text';
import {UsersComponent} from './users.component';
import {User} from '../../../../swagger/model/User';
import {NgForm} from "@angular/forms";

@Component({
    selector: 'app-user-modal',
    templateUrl: './user-modal.component.html'
})
export class UserModalComponent {

    @ViewChild('newUserForm') newUserForm: NgForm;

    modal = new Modal();
    newUser: User;
    usersComponent: UsersComponent; // = this.injector.get(UsersComponent);

    constructor (private injector: Injector) {
        this.newUser = {};
    }

    show() {
        this.modal.show();
    }

    save() {
        this.usersComponent.saveUser();
        this.newUser = {};
        this.newUserForm.form.markAsPristine();
        this.hide();
    }

    hide() {
        this.modal.hide();
    }

    setUsersComponent(usersComponent: UsersComponent) {
        this.usersComponent = usersComponent;
    }
}

