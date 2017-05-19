
import {URLSearchParams, Http, Headers, RequestOptions} from "@angular/http"
import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";

@Injectable()
export class Presenter {
    constructor (private http: Http, private router: Router) {}

    jwt = null;
    projects = null;

    login(model: LoginData){
        let data = new URLSearchParams();
        data.append('user_name', model.name);
        data.append('password', model.password);

        this.http
            .post('http://localhost:8000/api/v1/login', data)
            .subscribe(data => {
                this.jwt = data.json().jwt;
                this.loadProjects();
            }, error => {
                console.log(error.json());
            });
    }

    loadProjects() {
        let headers = new Headers({ 'token': this.jwt });
        let options = new RequestOptions({ headers: headers });

        this.http
            .get('http://localhost:8000/api/v1/projects',options)
            .subscribe(data => {
                this.projects = data.json();
                this.router.navigate(['/projects']);
            }, error => {
                console.log(error.json());
            });
    }
}