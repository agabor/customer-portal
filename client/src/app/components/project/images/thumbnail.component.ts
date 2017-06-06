import {Component, Input} from "@angular/core";
import {Image} from "../../../../swagger/model/Image";
import {Presenter} from "../../../logic/presenter";
@Component({
    selector: 'thumbnail',
    templateUrl: './thumbnail.component.html',
    styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent {
    @Input() image: Image;

    fileIsOver: Image = null;
    file: File;

    constructor(private presenter: Presenter){
    }

    getImageUrl() {
        return this.presenter.getImageUrl(this.image);
    }

    showImage(){
        this.presenter.showImage(this.image);
    }

    public load(){
        let element = <HTMLImageElement>document.getElementById('img'+this.image.imageId);
        this.image.width = element.naturalWidth;
        this.image.height = element.naturalHeight;
    }

    public deleteImage() {
        this.presenter.deleteImage(this.image);
    }

    public fileOver(fileIsOver: boolean): void {
        if (fileIsOver) {
            this.fileIsOver = this.image;
        } else {
            if (this.fileIsOver == this.image)
                this.fileIsOver = null;
        }
        console.log('fileIsOver ' + fileIsOver + ' ' + this.image.imageId);
    }

    public onFileDrop(file: File,): void {
        let reader = new FileReader();

        reader.onload = (event:any) => {
            this.image.fileName = event.target.result;
        };
        reader.readAsDataURL(file);
        this.presenter.uploadImage(file, this.image);
    }

}