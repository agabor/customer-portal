import { Component } from '@angular/core';
import { Presenter } from '../../logic/presenter';
import { Project } from '../../../swagger/model/Project';

@Component({
    selector: 'app-project-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css']
})
export class LinksComponent {
    project: Project;
    constructor (private presenter: Presenter) {
        this.project = presenter.activeProject;
    }
}
