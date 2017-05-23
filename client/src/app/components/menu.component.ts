import { Component } from '@angular/core';
import {Presenter} from "../presenter";
import {MenuItem} from "../menu-item";

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {

    menuItems: MenuItem[] = null;

    constructor (private presenter: Presenter) {
        presenter.setMenuComponent(this);
    }
}
