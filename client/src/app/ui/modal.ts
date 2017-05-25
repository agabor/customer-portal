export class Modal {
    hClass: string = 'modal fade';
    hStyle: string = 'display: none;';
    shown: boolean = false;
    show(){
        this.hClass = 'modal fade in';
        this.hStyle = 'display: block;';
        this.shown = true;
    }
    hide(){
        this.hClass = 'modal fade';
        this.hStyle = 'display: none;';
        this.shown = false;
    }
}