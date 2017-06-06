import {Component, Input} from "@angular/core";
import {Image} from "../../../../swagger/model/Image";
import {Presenter} from "../../../logic/presenter";
@Component({
    selector: 'thumbnail',
    templateUrl: './thumbnail.component.html'
    //styleUrls: ['./thumbnail.component.css']
})
export class ThumbnailComponent {
    @Input() image: Image;

    constructor(private presenter: Presenter){
    }

    getImageUrl(image: Image) {
        return this.presenter.getImageUrl(image);
    }

    showImage(image: Image){
        this.presenter.showImage(image);
    }

    public load(image: Image){
        let element = <HTMLImageElement>document.getElementById('img'+image.imageId);
        image.width = element.naturalWidth;
        image.height = element.naturalHeight;
    }

    public deleteImage(image: Image) {
        this.presenter.deleteImage(image);
    }
}