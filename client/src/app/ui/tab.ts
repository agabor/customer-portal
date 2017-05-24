export class Tab {
    public pillClass: string;
    public paneClass: string;
    public name: string;

    constructor(name: string) {
        this.name = name;
    }

    setActive() {
        this.pillClass = 'active';
        this.paneClass = 'tab-pane in active';
    }

    setInactive() {
        this.pillClass = '';
        this.paneClass = 'tab-pane';
    }
}