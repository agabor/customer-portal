import { Component } from '@angular/core';

import { LoginData }    from './login-data';

@Component({
    selector: 'login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.css']
})
export class LoginFormComponent {

    model = new LoginData('', '');

    submitted = false;

    onSubmit() { this.submitted = true; }
}