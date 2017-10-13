import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import {Presenter} from '../logic/presenter';

@Injectable()
export class LogoutGuard implements CanActivate {

    constructor(private router: Router, private presenter: Presenter) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.presenter.isLoggedIn()) {
            this.presenter.logout();
            this.router.navigate(['/login']);
            return false;
        }

        return false;
    }
}
