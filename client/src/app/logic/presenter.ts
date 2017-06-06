import {LoginData} from "../login-data";
import {ImageData} from "../image-data";
import {Inject, Injectable} from "@angular/core";
import { Router} from "@angular/router";
import {AppComponent} from "../components/app.component";
import {DefaultApi} from "../../swagger/api/DefaultApi";
import {ProjectBase} from "../../swagger/model/ProjectBase";
import {ProjectListComponent} from "../components/project-list.component";
import {LoginFormComponent} from "../components/login-form.component";
import {ProjectComponent} from "../components/project/project.component";
import {MenuComponent} from "../components/menu.component";
import {Project} from "../../swagger/model/Project";
import {Image} from "../../swagger/model/Image";
import {ImagesComponent} from "../components/project/images/images.component";
import {ImageModalComponent} from "../components/project/images/image-modal.component";
import {Body} from "../../swagger/model/Body";
import {Text} from "../../swagger/model/text";
import {RequestOptions, Headers, URLSearchParams, Http} from "@angular/http";
import {BASE_PATH} from "swagger";
import {NewImageModalComponent} from "app/components/project/images/new-image-modal.component";

@Injectable()
export class Presenter {
    newImageModalComponent: NewImageModalComponent;

    jwt:string = null;
    projects: ProjectBase[] = null;
    appComponent: AppComponent = null;
    private projectListComponent: ProjectListComponent;
    private loginFormComponent: LoginFormComponent;
    private projectComponent: ProjectComponent;
    activeProject: Project = null;
    private menuComponent: MenuComponent;
    private imagesComponent: ImagesComponent;
    private imageModalComponent: ImageModalComponent;

    constructor (protected http: Http, private api: DefaultApi, private router: Router, @Inject(BASE_PATH) private basePath: string) {
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

    initProject(slug: string) {
        if (this.activeProject != null) {
            this.setProject();
        } else {
            let res = this.api.projectsIdGet(this.jwt, slug);
            res.subscribe(data => {
                this.activeProject = data;
                this.setProject();
            }, error => {
                console.log(error.json());
            });
        }
    }

    private setProject() {
        this.projectComponent.setProject(this.activeProject);
    }



    setMenuComponent(menuComponent: MenuComponent) {
        this.menuComponent = menuComponent;
    }

    showProject(slug: string) {
        if (this.activeProject != null && this.activeProject.slug == slug) {
            this.navigateToProject(slug);
            return;
        }
        let res = this.api.projectsIdGet(this.jwt, slug);
        res.subscribe(data => {
            this.activeProject = data;
            this.navigateToProject(slug);
        }, error => {
            console.log(error.json());
        });
    }

    private navigateToProject(slug: string) {
        this.router.navigate(['/projects/' + slug]);
    }

    getImageUrl(image: Image) {
        if (image.fileName != null && image.fileName.startsWith('data'))
            return image.fileName;
        if (image.imageId == null)
            return '';
        return  this.getImagePath(image) + "?token=" + this.jwt;
    }

    setImageComponent(imagesComponent: ImagesComponent) {
        this.imagesComponent = imagesComponent;
    }

    showImage(image: Image) {
        this.imageModalComponent.showImage(image);
    }

    setImageModalComponent(imageModalComponent: ImageModalComponent) {
        this.imageModalComponent = imageModalComponent;
    }

    saveProject() {
        let res = this.api.projectsIdTextsPut(this.jwt, this.activeProject.slug, new TextsBody(this.activeProject.texts));
        res.subscribe(data => {
            console.log(data);
        }, error => {
            console.log(error.json());
        });
    }

    uploadImage(file: File, image: Image) {
        let res = this.api.projectsIdImagesImageIdPost(this.jwt, this.activeProject.slug, image.imageId, file);
        res.subscribe(data => {
            console.log(data);
        }, error => {
            console.log(error.json());
        });
    }

    private getImagePath(image: Image) {
        return this.basePath + '/projects/' + this.activeProject.slug + '/images/' + image.imageId;
    }

    setNewImageModalComponent(newImageModalComponent: NewImageModalComponent) {
        this.newImageModalComponent = newImageModalComponent;
    }

    showNewImageModal(){
        this.newImageModalComponent.show();
    }

    newImage(model: ImageData) {
        let res = this.api.projectsIdImagesPatch(this.jwt, this.activeProject.slug, model.name, model.description, model.width, model.height);
        res.subscribe(data => {
            this.activeProject.images.push(data);
            this.newImageModalComponent.hide();
        }, error => {
            console.log(error.json());
        });
    }

    deleteImage(image: Image) {
        let res = this.api.projectsIdImagesImageIdDelete(this.jwt, this.activeProject.slug, image.imageId);
        res.subscribe(data => {
            let idx = this.activeProject.images.indexOf(image);
            this.activeProject.images.splice(idx, 1);
        }, error => {
            console.log(error.json());
        });
    }
}

class TextsBody implements Body {
    constructor(public sources: Text[]){

    }
}