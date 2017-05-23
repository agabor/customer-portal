import { Component } from '@angular/core';
import { Presenter } from "../presenter";
import {ActivatedRoute} from "@angular/router";
import {Project} from "../../swagger/model/Project";

@Component({
    templateUrl: './project.component.html'
})
export class ProjectComponent {

    project: Project;

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        let slug: string = route.snapshot.params['slug'];
        presenter.setProjectComponent(this);
    }

}