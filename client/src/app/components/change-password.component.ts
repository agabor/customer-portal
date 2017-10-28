import {Component, ViewChild} from '@angular/core';
import { LoginData }    from '../login-data';
import {Presenter} from "../logic/presenter";
import {PasswordInputComponent} from './password-input.component';

@Component({
    templateUrl: './change-password.component.html',
    styleUrls: ['./login-form.component.css']
})
export class ChangePasswordComponent {
  @ViewChild(PasswordInputComponent) passwordInputComponent: PasswordInputComponent;

  constructor(private presenter: Presenter) {
  }

  onSubmit() {
  }

}
