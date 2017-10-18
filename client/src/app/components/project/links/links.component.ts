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
  static saved = true;
  saving = false;
  project: Project;
  @ViewChild(LinkModalComponent) linkModalComponent: LinkModalComponent;
  private editedLink: Link;

  constructor(private presenter: Presenter) {
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
    this.saving = true;
    this.presenter.saveLinks(() => {
      this.saving = false;
    });
    LinksComponent.saved = true;
  }

  reset() {
    const self = this;
    LinksComponent.saved = true;
    this.presenter.loadProject(this.presenter.activeProject.slug, function () {
      self.project = self.presenter.activeProject;
    });
  }

  isSaved() {
    return LinksComponent.saved;
  }


  onKey(event: any) {
    const s = String(event.key);
    if (s.length === 1 || s === 'Backspace' || s === 'Enter') {
      LinksComponent.saved = false;
    }
  }
}
