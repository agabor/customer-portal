import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Presenter} from "../logic/presenter";

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router, private presenter: Presenter) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

      if (this.presenter.isLoggedInWithToken()) {
        this.router.navigate(['/password']);
        return false;
      }
        if (this.presenter.isLoggedIn()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login']);
        return false;
    }
}
