import {Component, ViewChild} from '@angular/core';
import {Presenter} from '../logic/presenter';
import {PasswordInputComponent} from './password-input.component';
import {Location} from '@angular/common';

@Component({
    templateUrl: './change-password.component.html',
    styleUrls: ['./login-form.component.css']
})
export class ChangePasswordComponent {
  oldPassword: string;
  passwordError = false;
  @ViewChild(PasswordInputComponent) passwordInputComponent: PasswordInputComponent;

  constructor(private presenter: Presenter, private location: Location) {
  }

  onSubmit() {
    this.presenter.changePassword(this.oldPassword, this.passwordInputComponent.newPassword, () => {
      this.passwordError = false;
      alert('Your password has been changed.');
      this.location.back();
    }, () => {
      this.passwordError = true;
    });
  }

}
