export class Tab {
    public pillClass: string;
    public paneClass: string;

    setActive() {
        this.pillClass = 'active';
        this.paneClass = 'in active';
    }

    setInactive() {
        this.pillClass = '';
        this.paneClass = '';
    }
}