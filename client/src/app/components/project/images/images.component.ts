import {Component, OnInit, ViewChild} from '@angular/core';
import {Presenter} from '../../../logic/presenter';
import {Project} from '../../../../swagger/model/Project';
import {Image} from '../../../../swagger/model/Image';
import {Modal} from '../../../ui/modal';
import {ImageModalComponent} from "./image-modal.component";
import {NewImageModalComponent} from "./new-image-modal.component";
import {ProjectLogic} from '../../../logic/project-logic';

@Component({
    selector: 'app-project-images',
    templateUrl: './images.component.html'
})
export class ImagesComponent implements OnInit {
  static filter = false;
  project: Project = {
    name: null,
    slug: null,
    files: [],
    languages: [],
    texts: [],
    images: []
  };
  images: Image[] = [];

  @ViewChild(ImageModalComponent) imageModalComponent: ImageModalComponent;
  @ViewChild(NewImageModalComponent) newImageModalComponent: NewImageModalComponent;

  modal: Modal = new Modal();

  constructor(private presenter: Presenter) {
  }

  ngOnInit() {
    this.project = this.presenter.activeProject;
    this.images = this.project.images;
  }

  setProject(project: Project) {
    this.project = project;
  }

  public add() {
    this.newImageModalComponent.show();
  }

  toggleFilter() {
    ImagesComponent.filter = !ImagesComponent.filter;
    if (!ImagesComponent.filter) {
      this.images = this.project.images;
      return;
    }

    this.images = [];
    for (const i of this.project.images) {
      if (ProjectLogic.imageHasWarning(i)) {
        this.images.push(i);
      }
    }
  }
}
