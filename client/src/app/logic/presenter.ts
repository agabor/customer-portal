import {LoginData} from '../login-data';
import {Inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {AppComponent} from '../components/app.component';
import {DefaultApi} from '../../swagger/api/DefaultApi';
import {ProjectBase} from '../../swagger/model/ProjectBase';
import {ProjectListComponent} from '../components/project-list/project-list.component';
import {LoginFormComponent} from '../components/login-form.component';
import {ProjectComponent} from '../components/project/project.component';
import {MenuComponent} from '../components/menu.component';
import {Project} from '../../swagger/model/Project';
import {Image} from '../../swagger/model/Image';
import {Body} from '../../swagger/model/Body';
import {Text} from '../../swagger/model/text';
import {URLSearchParams, Http} from '@angular/http';
import {BASE_PATH} from 'swagger';
import {User} from '../../swagger/model/User';
import {Link} from '../../swagger/model/Link';
import {Language} from '../../swagger/model/Language';

@Injectable()
export class Presenter {
    projects: ProjectBase[] = null;
    appComponent: AppComponent = null;
    private projectListComponent: ProjectListComponent;
    private loginFormComponent: LoginFormComponent;
    private projectComponent: ProjectComponent;
    activeProject: Project = null;
    private menuComponent: MenuComponent;
    private _isLoggedIn = false;
    private user: User;
    private loggedInWithToken = false;

    constructor (protected http: Http, private api: DefaultApi, private router: Router,
                 @Inject(BASE_PATH) private basePath: string) {
        this._isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.loggedInWithToken = localStorage.getItem('loggedInWithToken') === 'true';
        if (this._isLoggedIn) {
            this.user = {
                id: parseInt(localStorage.getItem('user_id'), 10),
                name: localStorage.getItem('user_name'),
                email: localStorage.getItem('user_email')
            };
            this.loadProjects();
        }
    }

    login(model: LoginData) {
        const res = this.api.loginPost(model.email, model.password);
        res.subscribe(user => {
            this.setLoggedIn(user);
        }, error => {
            if (error.json().error === 'user_not_found') {
                this.loginFormComponent.showUserError();
            } else {
                this.loginFormComponent.showPasswordError();
            }
        });
    }


    private setLoggedIn(user) {
        this.user = user;
        this._isLoggedIn = true;
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('user_id', this.user.id.toString());
        localStorage.setItem('user_name', this.user.name);
        localStorage.setItem('user_email', this.user.email);
        this.loadProjects();
        this.menuComponent.setLoggedIn();
        this.router.navigate(['/projects']);
    }

    tokenLogin(login_token: string) {
      const res = this.api.tokenLoginTokenGet(login_token);
      res.subscribe(user => {
        this.setLoggedIn(user);
        this.loggedInWithToken = true;
        localStorage.setItem('loggedInWithToken', 'true');
      }, error => {
        console.log(error.json());
      });
    }

    loadProjects() {
        const res = this.api.projectsGet();
        res.subscribe(data => {
            this.projects = data;
            this.setProjects();
        }, error => {
            console.log(error.json());
            this.router.navigate(['/logout']);
        });
    }

    setAppComponent(appComponent: AppComponent) {
        this.appComponent = appComponent;
    }

    isLoggedIn() {
        return this._isLoggedIn;
    }

    setProjectListComponent(projectListComponent: ProjectListComponent) {
        this.projectListComponent = projectListComponent;
        this.setProjects();
    }

    private setProjects() {
        if (this.projectListComponent != null) {
            this.projectListComponent.projects = this.projects;
        }
    }

    logout() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user_name');
        localStorage.removeItem('user_email');
        this.menuComponent.setLoggedOut();
        this.api.logoutPost();
    }

    setLoginFormComponent(loginFormComponent: LoginFormComponent) {
        this.loginFormComponent = loginFormComponent;
    }

    getProject(slug: string): ProjectBase {
      for ( const p of this.projects){
          if (p.slug === slug) {
              return p;
          }
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
            this.loadProject(slug);
        }
    }

    loadProject(slug: string, callback?: () => void) {
        const res = this.api.projectsIdGet(slug);
        res.subscribe(data => {
            this.activeProject = data;
            this.setProject();
            if (callback) {
                callback();
            }
        }, error => {
            console.log(error.json());
        });
    }

    private setProject() {
        this.projectComponent.setProject(this.activeProject);
    }

    setMenuComponent(menuComponent: MenuComponent) {
        this.menuComponent = menuComponent;
    }

    showProject(slug: string) {
        if (this.activeProject != null && this.activeProject.slug === slug) {
            this.navigateToProject(slug);
            return;
        }
        const res = this.api.projectsIdGet(slug);
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
        if (image.fileName != null && image.fileName.startsWith('data')) {
            return image.fileName;
        }
        if (image.imageId == null) {
            return '';
        }
        return  this.getImagePath(image);
    }

    saveProjectTexts(onDone: () => void) {
        const res = this.api.projectsIdTextsPut(this.activeProject.slug, new TextsBody(this.activeProject.texts));
        res.subscribe(data => {
            console.log(data);
            onDone();
        }, error => {
            console.log(error);
        });
    }

    uploadImage(file: File, image: Image, callback: (Image) => void) {
        const res = this.api.projectsIdImagesImageIdPost(this.activeProject.slug, image.imageId, file);
        res.subscribe(data => {
            console.log(data);
            callback(data);
        }, error => {
            console.log(error);
        });
    }

    private getImagePath(image: Image) {
        return this.basePath + '/projects/' + this.activeProject.slug + '/images/' + image.imageId;
    }

    newImage(image: Image) {
        const res = this.api.projectsIdImagesPatch(this.activeProject.slug, image.name, image.description,
          image.minWidth, image.maxWidth, image.minHeight, image.maxHeight);
        res.subscribe(data => {
            this.activeProject.images.push(data);
        }, error => {
            console.log(error.json());
        });
    }

    deleteImage(image: Image) {
        const res = this.api.projectsIdImagesImageIdDelete(this.activeProject.slug, image.imageId);
        res.subscribe(data => {
            const idx = this.activeProject.images.indexOf(image);
            this.activeProject.images.splice(idx, 1);
        }, error => {
            console.log(error.json());
        });
    }

    updateImage(image: Image) {
      const res = this.api.projectsIdImagesImageIdPatch(this.activeProject.slug, image.imageId, image.name,
        image.description, image.minWidth, image.maxWidth, image.minHeight, image.maxHeight);
      res.subscribe(data => {
        console.log(data);
      }, error => {
        console.log(error);
      });
    }

    getUser() {
        return this.user;
    }

    addUser(newUser: User) {
        const res = this.api.projectsIdUsersPost(this.activeProject.slug, newUser.name, newUser.email);
        res.subscribe(user => {
            this.activeProject.users.push(user);
        }, error => {
            console.log(error.json());
        });
    }

    modifyUser(user: User) {
        const res = this.api.projectsIdUsersUserIdPost(this.activeProject.slug, user.id, user.name, user.email);
        res.subscribe(data => {
        }, error => {
            console.log(error.json());
        });
    }

    deleteUser(user: User) {
        const res = this.api.projectsIdUsersUserIdDelete(this.activeProject.slug, user.id);
        res.subscribe(data => {
            const index = this.activeProject.users.indexOf(user);
            if (index > -1) {
                this.activeProject.users.splice(index, 1);
            }
        }, error => {
            console.log(error.json());
        });
    }

  addLink(link: Link) {
    const res = this.api.projectsIdLinksPost(this.activeProject.slug, link.name, link.icon, link.url);
    res.subscribe(newLink => {
      this.activeProject.links.push(newLink);
    }, error => {
      console.log(error.json());
    });
  }

  updateLink(link: Link) {
    const res = this.api.projectsIdLinksLinkIdPost(this.activeProject.slug, link.id, link.name, link.icon, link.url);
    res.subscribe(data => {

    }, error => {
      console.log(error.json());
    });
  }

  deleteLink(link: Link) {
    const res = this.api.projectsIdLinksLinkIdDelete(this.activeProject.slug, link.id);
    res.subscribe(data => {
      const index = this.activeProject.links.indexOf(link);
      if (index > -1) {
        this.activeProject.links.splice(index, 1);
      }
    }, error => {
      console.log(error.json());
    });
  }

  addProject(project: ProjectBase) {
    const res = this.api.projectsPatch(project.name);
    res.subscribe(newProject => {
      this.projects.push(newProject);
    }, error => {
      console.log(error.json());
    });
  }

  deleteProject(project: Project) {
    const res = this.api.projectsIdDelete(project.slug);
    res.subscribe(data => {
      const index = this.projects.indexOf(project);
      if (index > -1) {
        this.projects.splice(index, 1);
      }
    }, error => {
      console.log(error.json());
    });
  }

  updateProject(project: Project) {
    const res = this.api.projectsIdPost(project.slug, project.name);
    res.subscribe(newProject => {
      project.slug = newProject.slug;
    }, error => {
      console.log(error.json());
    });
  }

  addLanguage(language: Language, callback: () => void, error: () => void) {
    const res = this.api.projectsIdLanguagesPost(this.activeProject.slug, language.code);
    res.subscribe(newLang => {
      this.activeProject.languages.push(newLang);
      callback();
    }, () => {
      error();
    });
  }

  removeLanguage(language: Language) {
    const res = this.api.projectsIdLanguagesDelete(this.activeProject.slug, language.code);
    res.subscribe(() => {
    }, error => {
      console.log(error);
    });
  }

  setPassword(password: string) {
      const res = this.api.setPasswordPost(password);
    res.subscribe(data => {
      console.log(data);
      this.loggedInWithToken = false;
      localStorage.removeItem('loggedInWithToken');
      this.router.navigate(['/projects']);
    }, error => {
      console.log(error);
    });
  }

  isLoggedInWithToken() {
    return this.loggedInWithToken;
  }
}

class TextsBody implements Body {
    constructor(public sources: Text[]) {

    }
}
