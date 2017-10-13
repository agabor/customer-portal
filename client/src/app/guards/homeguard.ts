import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Presenter} from "../logic/presenter";

@Injectable()
export class HomeGuard implements CanActivate {

  constructor(private router: Router, private presenter: Presenter) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.presenter.isLoggedIn()) {
      this.router.navigate(['/projects']);
      return false;
    }

    // not logged in so redirect to login page with the return url
    this.router.navigate(['/login']);
    return false;
  }
}
