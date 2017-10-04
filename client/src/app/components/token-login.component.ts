import {Component, OnInit} from '@angular/core';
import { LoginData } from '../login-data';
import {Presenter} from '../logic/presenter';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-token-login',
    templateUrl: './token-login.component.html'
})
export class TokenLoginComponent implements OnInit {

    login_token: string;

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
    }

    ngOnInit() {
        this.login_token = this.route.snapshot.params['login_token'];
        this.presenter.tokenLogin(this.login_token);
    }
}
