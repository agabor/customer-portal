import { Component } from '@angular/core';
import {VgAPI} from 'videogular2/core';
@Component({
    selector: 'project-videos',
    templateUrl: './videos.component.html',
    styleUrls: ['./videos.component.css']
})
export class VideosComponent {
    videos: Video[] = [
        new Video('Install App with Testflight', 'http://localhost:8000/testflight.mp4', 'This video demonstrates how to install an app with TestFlight.'),
        new Video('Play Store Beta testing', 'http://localhost:8000/sample.mp4', 'This video demonstrates how to use Google Play beta testing.'),
        new Video('Basic usage of the app', 'http://localhost:8000/testflight.mp4', 'This video demonstartes the basic usage of your app.')
    ];
    currentVideo: Video = this.videos[0];
    api:VgAPI;
    select(video: Video){
        this.currentVideo = video;
    }

    onPlayerReady(api:VgAPI) {
        this.api = api;
    }

    videoTag(){
        return '<source type="video/mp4" src="'+this.currentVideo.link+'">'
    }
}

class Video{
    constructor (public name:string, public link:string, public description: string){

    }

}
