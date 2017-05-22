import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {Menu} from "./menu";
import {MenuItem} from "./menu-item";
import {AppComponent} from "./components/app.component";
import {DefaultApi} from "../swagger/api/DefaultApi";
import {ProjectBase} from "../swagger/model/ProjectBase";
import {ProjectListComponent} from "./components/project-list.component";
import {LoginFormComponent} from "./components/login-form.component";

@Injectable()
export class Presenter {

    jwt:string = null;
    projects: ProjectBase[] = null;
    menu: Menu = new Menu();
    appComponent: AppComponent = null;
    private projectListComponent: ProjectListComponent;
    private loginFormComponent: LoginFormComponent;

    constructor (private api: DefaultApi, private router: Router) {
        this.menu.add(new MenuItem('Home', 'home', true));
        this.menu.add(new MenuItem('Login', 'login', true));
        this.menu.add(new MenuItem('Projects', 'projects', false));
        this.menu.add(new MenuItem('Logout', 'logout', false));
        this.jwt = localStorage.getItem('jwt');
        if (this.jwt != null) {
            this.setLoggedInMenu();
            this.loadProjects();
        }
    }

    login(model: LoginData){
        let data = new URLSearchParams();
        data.append('user_name', model.name);
        data.append('password', model.password);

        let res= this.api.loginPost(model.name, model.password);
        res.subscribe(data => {
            this.jwt = data.jwt;
            localStorage.setItem('jwt', data.jwt);
            this.loadProjects();
            this.router.navigate(['/projects']);
            this.setLoggedInMenu();
        }, error => {
            if (error.json().error == 'user_not_found')
                this.loginFormComponent.showUserError();
            else
                this.loginFormComponent.showPasswordError();
        });
    }

    private setLoggedInMenu() {
        this.menu.deactivate('login');
        this.menu.activate('projects');
        this.menu.activate('logout');
        if (this.appComponent != null)
            this.appComponent.menuItems = this.activeMenuItems();
    }

    private setLoggedOutMenu() {
        this.menu.activate('login');
        this.menu.deactivate('projects');
        this.menu.deactivate('logout');
        if (this.appComponent != null)
            this.appComponent.menuItems = this.activeMenuItems();
    }

    loadProjects() {
        let res = this.api.projectsGet(this.jwt);
        res.subscribe(data => {
            this.projects = data;
            this.setProjects();
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
        this.appComponent.menuItems = this.activeMenuItems();
    }

    isLoggedIn() {
        return this.jwt != null;
    }

    setProjectListComponent(projectListComponent: ProjectListComponent) {
        this.projectListComponent = projectListComponent;
        this.setProjects();
    }

    private setProjects() {
        if (this.projectListComponent != null)
        this.projectListComponent.projects = this.projects;
    }

    logout() {
        this.jwt = null;
        localStorage.removeItem('jwt');
        this.setLoggedOutMenu();
    }

    setLoginFormComponent(loginFormComponent: LoginFormComponent) {
        this.loginFormComponent = loginFormComponent;
    }
}