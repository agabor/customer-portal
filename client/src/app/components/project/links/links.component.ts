import {Component, ViewChild} from '@angular/core';
import { Presenter } from '../../../logic/presenter';
import { Project } from '../../../../swagger/model/Project';
import {LinkModalComponent} from './link-modal.component';
import {Link} from '../../../../swagger/model/Link';

@Component({
    selector: 'app-project-links',
    templateUrl: './links.component.html',
    styleUrls: ['./links.component.css']
})
export class LinksComponent {
    project: Project;
    @ViewChild(LinkModalComponent) linkModalComponent: LinkModalComponent;
    private editedLink: Link;

    constructor (private presenter: Presenter) {
        this.project = presenter.activeProject;
    }

  saveLink() {
      if (this.editedLink == null) {
        this.presenter.addLink(this.linkModalComponent.link);
      } else {
        this.presenter.updateLink(this.linkModalComponent.link);
        this.editedLink.name = this.linkModalComponent.link.name;
        this.editedLink.icon = this.linkModalComponent.link.icon;
        this.editedLink.url = this.linkModalComponent.link.url;
      }
  }

  add() {
    this.editedLink = null;
      this.linkModalComponent.show(this);
  }

  edit(link: Link) {
    this.editedLink = link;
    this.linkModalComponent.link = {id: link.id, name: link.name, icon: link.icon, url: link.url};
    this.linkModalComponent.show(this);
  }

  deleteLink(link: Link) {
    if (confirm('Are you sure that you want to delete the link named ' + link.name + '?')) {
      this.presenter.deleteLink(link);
    }
  }

  save() {
    this.presenter.saveLinks();
  }
  reset() {
    const self = this;
    this.presenter.loadProject(this.presenter.activeProject.slug, function () {
      self.project = self.presenter.activeProject;
    });
  }

  isSaved() {
    return false;
  }
}
