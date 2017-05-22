import { Component } from '@angular/core';
import { LoginData }    from '../login-data';
import {Presenter} from "../presenter";

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

    model = new LoginData('', '');
    submitted = false;
    passwordError = false;
    userError = false;

    constructor (private presenter: Presenter) {
        presenter.setLoginFormComponent(this);
    }


    onSubmit() {
        this.submitted = true;
        this.userError = false;
        this.passwordError = false;
        this.presenter.login(this.model);
    }

    showUserError() {
        this.userError = true;
    }

    showPasswordError() {
        this.passwordError = true;
    }
}