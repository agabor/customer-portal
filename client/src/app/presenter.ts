
import {URLSearchParams, Http, Headers, RequestOptions} from "@angular/http"
import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Menu} from "./menu";
import {MenuItem} from "./menu-item";
import {AppComponent} from "./app.component";

@Injectable()
export class Presenter {
    constructor (private http: Http, private router: Router) {
        this.menu.add(new MenuItem('Home', '', true));
        this.menu.add(new MenuItem('Login', 'login', true));
        this.menu.add(new MenuItem('Projects', 'projects', false));
    }

    jwt = null;
    projects = null;
    menu: Menu = new Menu();
    appComponent: AppComponent = null;

    login(model: LoginData){
        let data = new URLSearchParams();
        data.append('user_name', model.name);
        data.append('password', model.password);

        this.http
            .post('http://localhost:8000/api/v1/login', data)
            .subscribe(data => {
                this.jwt = data.json().jwt;
                this.loadProjects();
                this.menu.deactivate('login');
                this.menu.activate('projects');
                this.appComponent.menuItems = this.activeMenuItems();
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

    activeMenuItems() : MenuItem[] {
        let result: MenuItem[] = [];

        for(let mi of this.menu.items){
            if (mi.active)
                result.push(mi);
        }

        return result;
    }

    setAppComponent(appComponent: AppComponent) {
        this.appComponent = appComponent;
    }

    isLoggedIn() {
        return this.jwt != null;
    }
}