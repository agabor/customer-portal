import { Component } from '@angular/core';
import {VgAPI} from 'videogular2/core';
@Component({
    selector: 'project-videos',
    templateUrl: './videos.component.html'
})
export class VideosComponent {
    videos: Video[] = [
        new Video('Install App with Testflight', 'http://localhost:8000/testflight.mp4'),
        new Video('Play Store Beta testing', 'http://localhost:8000/sample.mp4'),
        new Video('Basic usage of the app', 'http://localhost:8000/testflight.mp4')
    ];
    currentVideo: Video[] = [this.videos[1]];
    api:VgAPI;
    select(video: Video){
        this.currentVideo[0] = video;
    }

    onPlayerReady(api:VgAPI) {
        this.api = api;
    }
}

class Video{
    constructor (public name:string, public link:string){

    }

}
