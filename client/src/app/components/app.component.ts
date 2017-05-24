import { Component } from '@angular/core';
import {Presenter} from "../logic/presenter";
import {MenuItem} from "../ui/menu-item";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor (private presenter: Presenter) {
    presenter.setAppComponent(this);
  }
}
