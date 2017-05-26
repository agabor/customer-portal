import { ElementRef, HostListener, Directive} from '@angular/core';

@Directive({
    selector: 'textarea[autosize]'
})

export class Autosize {
    @HostListener('input',['$event.target'])
    onInput(textArea: HTMLTextAreaElement): void {
        this.adjust();
    }
    constructor(public element: ElementRef){
    }
    ngAfterContentChecked(): void{
        this.adjust();
    }

    adjust(): void{
        this.element.nativeElement.style.overflow = 'hidden';
        this.element.nativeElement.style.height = 'auto';
        let scrollHeight = this.element.nativeElement.scrollHeight;
        if (scrollHeight < 32)
            scrollHeight = 32;
        this.element.nativeElement.style.height = scrollHeight + "px";
    }
}
