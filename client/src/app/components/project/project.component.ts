import {Component, OnInit, ViewChild} from '@angular/core';
import { Presenter } from '../../logic/presenter';
import {ActivatedRoute, Router} from '@angular/router';
import {Project} from '../../../swagger/model/Project';
import { Tab } from '../../ui/tab';
import {ProjectLogic} from '../../logic/project-logic';
import {User} from "../../../swagger/model/User";
import {TextsComponent} from "./texts/texts.component";

@Component({
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit {

    project: Project = {
        name: null,
        slug: null,
        files: [],
        languages: [],
        texts: [],
        images: []
    };

    projectLogic: ProjectLogic = new ProjectLogic(this.project);

    tabImages: Tab = new Tab('Images');

    tabTexts: Tab = new Tab('Texts');

    tabFiles: Tab = new Tab('Files');

    tabLinks: Tab = new Tab('Links');

    tabUsers: Tab = new Tab('Users');

    tabs: Tab[] = [this.tabImages, this.tabTexts, this.tabFiles, this.tabLinks, this.tabUsers];

    constructor(private route: ActivatedRoute, private router: Router, private presenter: Presenter) {
        presenter.setProjectComponent(this);
    }

    ngOnInit() {
        const slug = this.route.snapshot.params['slug'];
        this.presenter.initProject(slug);
        switch (this.route.firstChild.snapshot.url[0].path) {
            case 'images':
                this.showTab(this.tabImages);
                break;
            case 'texts':
                this.showTab(this.tabTexts);
                break;
            case 'files':
                this.showTab(this.tabFiles);
                break;
            case 'links':
                this.showTab(this.tabLinks);
                break;
            case 'users':
                this.showTab(this.tabUsers);
                break;
            default:
                this.showTab(this.tabImages);
                break;
        }
    }

    private navigate(part: string): Promise<boolean> {
        return this.router.navigate(['/projects/' + this.project.slug + part]);
    }

    showImages() {
        this.navigate('/images').then(success => {
          if (success) {
            this.showTab(this.tabImages);
          }
        });
    }

    showTexts() {
        this.navigate('/texts').then(success => {
          if (success) {
            this.showTab(this.tabTexts);
          }
        });
    }

    showFiles() {
        this.navigate('/files').then(success => {
          if (success) {
            this.showTab(this.tabFiles);
          }
        });
    }

    showLinks() {
        this.navigate('/links').then(success => {
          if (success) {
            this.showTab(this.tabLinks);
          }
        });
    }
    showUsers() {
        this.navigate('/users').then(success => {
          if (success) {
            this.showTab(this.tabUsers);
          }
        });
    }

    showTab(tab: Tab) {
        for (const t of this.tabs){
            if (t === tab) {
                t.setActive();
            } else {
                t.setInactive();
            }
        }
    }

    setProject(project: Project) {
        this.project = project;
        this.projectLogic = new ProjectLogic(this.project);
    }


    getBadgeText(): string {
        const count = this.projectLogic.getTextWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }
    getBadgeImage(): string {
        const count = this.projectLogic.getImageWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }
    getBadgeFile(): string {
        const count = this.projectLogic.getFileWarningCount();
        if (count === 0) {
            return '';
        }
        return '<span class="badge">' +  count + '</span>';
    }
}
