import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Presenter} from "../logic/presenter";

@Injectable()
export class PasswordSetGuard implements CanActivate {

  constructor(private router: Router, private presenter: Presenter) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.presenter.isLoggedInWithToken()) {
      this.router.navigate(['/password']);
      return false;
    }
    return true;
  }
}
