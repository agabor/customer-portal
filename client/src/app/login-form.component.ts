import { Component } from '@angular/core';

import { LoginData }    from './login-data';
import {Presenter} from "./presenter";

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css'],
    providers: [Presenter]
})
export class LoginFormComponent {


    constructor (private presenter: Presenter) {}

    model = new LoginData('', '');

    submitted = false;

    self = this;

    onSubmit() {
        this.submitted = true;
        this.presenter.login(this.model);
    }
}