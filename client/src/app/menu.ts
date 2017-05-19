import {MenuItem} from "./menu-item";
export class Menu {
    items: MenuItem[] = [];
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
}