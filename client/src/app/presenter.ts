import {LoginData} from "./login-data";
import {Injectable} from "@angular/core";
import {Router} from "@angular/router";
import {AppComponent} from "./components/app.component";
import {DefaultApi} from "../swagger/api/DefaultApi";
import {ProjectBase} from "../swagger/model/ProjectBase";
import {ProjectListComponent} from "./components/project-list.component";
import {LoginFormComponent} from "./components/login-form.component";
import {ProjectComponent} from "./components/project.component";
import {MenuComponent} from "./components/menu.component";

@Injectable()
export class Presenter {

    jwt:string = null;
    projects: ProjectBase[] = null;
    appComponent: AppComponent = null;
    private projectListComponent: ProjectListComponent;
    private loginFormComponent: LoginFormComponent;
    private projectComponent: ProjectComponent;
    private activeProjectSlug: string;
    private menuComponent: MenuComponent;

    constructor (private api: DefaultApi, private router: Router) {
        this.jwt = localStorage.getItem('jwt');
        if (this.jwt != null) {
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
            this.menuComponent.setLoggedIn();
        }, error => {
            if (error.json().error == 'user_not_found')
                this.loginFormComponent.showUserError();
            else
                this.loginFormComponent.showPasswordError();
        });
    }



    loadProjects() {
        let res = this.api.projectsGet(this.jwt);
        res.subscribe(data => {
            this.projects = data;
            this.setProjects();
            this.setActiveProject();
        }, error => {
            console.log(error.json());
        });
    }

    setAppComponent(appComponent: AppComponent) {
        this.appComponent = appComponent;
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
        let jwt = this.jwt;
        this.jwt = null;
        localStorage.removeItem('jwt');
        this.menuComponent.setLoggedOut();
        this.api.logoutPost(jwt);
    }

    setLoginFormComponent(loginFormComponent: LoginFormComponent) {
        this.loginFormComponent = loginFormComponent;
    }

    getProject(slug: string):ProjectBase {
      for( let p of this.projects){
          if (p.slug == slug)
              return p;
      }
      return null;
    }

    setProjectComponent(projectComponent: ProjectComponent) {
        this.projectComponent = projectComponent;
    }

    setActiveProjectSlug(slug: string) {
        this.activeProjectSlug = slug;
        if (this.projects != null) {
            this.setActiveProject();
        } else {
            this.loadProjects()
        }
    }

    private setActiveProject() {
        if (this.projectComponent != null)
            this.projectComponent.project = this.getProject(this.activeProjectSlug);
    }

    setMenuComponent(menuComponent: MenuComponent) {
        this.menuComponent = menuComponent;
    }
}