import { Component } from '@angular/core';
import {Presenter} from "../presenter";
import {MenuItem} from "../menu-item";

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {

    items: MenuItem[] = [];
    activeItems: MenuItem[] = [];
    add(item: MenuItem){
        this.items.push(item);
    }
    activate(path: string){
        this.getItem(path).active = true;
    }

    deactivate(path: string){
        this.getItem(path).active = false;
    }

    getItem(path: string): MenuItem {
        for(let item of this.items){
            if (item.path == path)
                return item;
        }
        return null;
    }

    getActiveItems() : MenuItem[] {
        let result: MenuItem[] = [];

        for(let mi of this.items){
            if (mi.active)
                result.push(mi);
        }
        return result;
    }

    constructor (private presenter: Presenter) {
        presenter.setMenuComponent(this);
        this.add(new MenuItem('Home', 'home', true));
        this.add(new MenuItem('Login', 'login', true));
        this.add(new MenuItem('Projects', 'projects', false));
        this.add(new MenuItem('Logout', 'logout', false));
        this.activeItems = this.getActiveItems();
    }

    public setLoggedIn() {
        this.deactivate('login');
        this.activate('projects');
        this.activate('logout');
        this.activeItems = this.getActiveItems();
    }

    public setLoggedOut() {
        this.activate('login');
        this.deactivate('projects');
        this.deactivate('logout');
        this.activeItems = this.getActiveItems();
    }
}
