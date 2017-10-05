import { Component } from '@angular/core';
import {Presenter} from '../logic/presenter';
import {MenuItem} from '../ui/menu-item';
import {User} from '../../swagger/model/User';

@Component({
    selector: 'app-menu',
    templateUrl: './menu.component.html',
    styleUrls: ['./menu.component.css']
})
export class MenuComponent {

    private user: User = null;
    items: MenuItem[] = [];
    activeItems: MenuItem[] = [];
    dropdownIsOpen = false;

    constructor (private presenter: Presenter) {
        presenter.setMenuComponent(this);
        this.add(new MenuItem('Pricing', 'pricing', true, 'glyphicon glyphicon-shopping-cart'));
        this.add(new MenuItem('Login', 'login', true, 'glyphicon-log-in'));
        this.add(new MenuItem('Projects', 'projects', false, 'glyphicon-tasks'));
        if (presenter.isLoggedIn()) {
            this.setLoggedIn();
        } else {
            this.setLoggedOut();
        }
    }

    private add(item: MenuItem) {
        this.items.push(item);
    }

    private activate(path: string) {
        this.getItem(path).active = true;
    }

    private deactivate(path: string) {
        this.getItem(path).active = false;
    }

    private getItem(path: string): MenuItem {
        for (const item of this.items){
            if (item.path === path) {
                return item;
            }
        }
        return null;
    }

    private getActiveItems(): MenuItem[] {
        const result: MenuItem[] = [];

        for (const mi of this.items){
            if (mi.active) {
                result.push(mi);
            }
        }
        return result;
    }


    public setLoggedIn() {
        this.user = this.presenter.getUser();
        this.deactivate('login');
        this.activate('projects');
        this.activeItems = this.getActiveItems();
    }

    public setLoggedOut() {
        this.user = null;
        this.activate('login');
        this.deactivate('projects');
        this.activeItems = this.getActiveItems();
    }

    dropdown() {
        this.dropdownIsOpen = !this.dropdownIsOpen;
    }
}
