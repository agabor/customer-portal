export class Modal {
    hClass = 'modal fade';
    hStyle = 'display: none;';
    shown = false;
    show() {
        this.hClass = 'modal fade in';
        this.hStyle = 'display: block;';
        this.shown = true;
    }
    hide() {
        this.hClass = 'modal fade';
        this.hStyle = 'display: none;';
        this.shown = false;
    }
}
