
import {URLSearchParams, Http, Headers, RequestOptions} from "@angular/http"
import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Menu} from "./menu";
import {MenuItem} from "./menu-item";
import {AppComponent} from "./app.component";
import {DefaultApi} from "../swagger/api/DefaultApi";
import {ProjectBase} from "../swagger/model/ProjectBase";

@Injectable()
export class Presenter {
    constructor (private api: DefaultApi, private router: Router) {
        this.menu.add(new MenuItem('Home', '', true));
        this.menu.add(new MenuItem('Login', 'login', true));
        this.menu.add(new MenuItem('Projects', 'projects', false));
    }

    jwt = null;
    projects: ProjectBase[] = null;
    menu: Menu = new Menu();
    appComponent: AppComponent = null;

    login(model: LoginData){
        let data = new URLSearchParams();
        data.append('user_name', model.name);
        data.append('password', model.password);

        let res= this.api.loginPost(model.name, model.password);
        res.subscribe(data => {
            this.jwt = data.jwt;
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

        let res = this.api.projectsGet(this.jwt);
        res.subscribe(data => {
            this.projects = data;
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