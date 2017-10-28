import {Component} from '@angular/core';

@Component({
  selector: 'app-password-input',
  templateUrl: './password-input.component.html',
  styleUrls: ['./login-form.component.css']
})
export class PasswordInputComponent {
  newPassword = '';
  repeatPassword = '';
  isValid(): boolean {
    return this.repeatPassword === this.newPassword && this.newPassword.length >= 6;
  }
}
