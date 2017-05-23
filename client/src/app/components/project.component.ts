import { Component } from '@angular/core';
import { Presenter } from "../presenter";
import {ActivatedRoute} from "@angular/router";
import {ProjectBase} from "../../swagger/model/ProjectBase";

@Component({
    templateUrl: './project.component.html'
})
export class ProjectComponent {

    project: ProjectBase = {name: ''};

    constructor(private route: ActivatedRoute, private presenter: Presenter) {
        let slug: string = route.snapshot.params['slug'];
        presenter.setProjectComponent(this);
        presenter.setActiveProjectSlug(slug);
    }

}