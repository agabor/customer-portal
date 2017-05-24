import { Component } from '@angular/core';
import {Presenter} from "../logic/presenter";
import {MenuItem} from "../ui/menu-item";

@Component({
    selector: 'menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {

    items: MenuItem[] = [];
    activeItems: MenuItem[] = [];
    constructor (private presenter: Presenter) {
        presenter.setMenuComponent(this);
        this.add(new MenuItem('Home', 'home', true, 'glyphicon-home'));
        this.add(new MenuItem('Login', 'login', true, 'glyphicon-log-in'));
        this.add(new MenuItem('Projects', 'projects', false, 'glyphicon-tasks'));
        this.add(new MenuItem('Logout', 'logout', false, 'glyphicon-log-out'));
        if (presenter.isLoggedIn())
            this.setLoggedIn();
        else
            this.setLoggedOut();
    }

    private add(item: MenuItem){
        this.items.push(item);
    }

    private activate(path: string){
        this.getItem(path).active = true;
    }

    private deactivate(path: string){
        this.getItem(path).active = false;
    }

    private getItem(path: string): MenuItem {
        for(let item of this.items){
            if (item.path == path)
                return item;
        }
        return null;
    }

    private getActiveItems() : MenuItem[] {
        let result: MenuItem[] = [];

        for(let mi of this.items){
            if (mi.active)
                result.push(mi);
        }
        return result;
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
