import { Component } from '@angular/core';
import { LoginData }    from '../login-data';
import {Presenter} from "../logic/presenter";

@Component({
    templateUrl: './new-password.component.html',
    styleUrls: ['./login-form.component.css']
})
export class NewPasswordComponent {

  newPassword = '';
  repeatPassword = '';
  submitted = false;
  passwordLengthError = false;
  passwordMatchError = false;
  userError = false;

  constructor(private presenter: Presenter) {
  }


  onSubmit() {
    this.submitted = true;
    this.passwordLengthError = false;
    this.passwordMatchError = false;
    this.presenter.setPassword(this.newPassword);
  }

  showUserError() {
    this.userError = true;
  }
}
