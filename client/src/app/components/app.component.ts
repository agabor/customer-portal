import { Component } from '@angular/core';
import {Presenter} from "../presenter";
import {MenuItem} from "../menu-item";

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
