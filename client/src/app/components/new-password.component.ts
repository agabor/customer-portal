import {Component, ViewChild} from '@angular/core';
import {Presenter} from '../logic/presenter';
import {PasswordInputComponent} from './password-input.component';

@Component({
    templateUrl: './new-password.component.html',
    styleUrls: ['./login-form.component.css']
})
export class NewPasswordComponent {
  @ViewChild(PasswordInputComponent) passwordInputComponent: PasswordInputComponent;

  constructor(private presenter: Presenter) {
  }

  onSubmit() {
    this.presenter.setPassword(this.passwordInputComponent.newPassword);
  }
}
