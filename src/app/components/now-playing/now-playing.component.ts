import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { BrennanService } from 'src/app/services/brennan.service';

// import 'rxjs/add/observable/interval';
// import 'rxjs/add/operator/takeWhile';

const delay = 500; // every 0.5 sec

function formatTimeLeft(seconds: number): string {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    const ss = "0" + s;
    return `${m}:${ss.substr(-2)}`;
}

@Component({
    selector: 'brennan-now-playing',
    templateUrl: './now-playing.component.html',
    styleUrls: ['./now-playing.component.scss']
})
export class NowPlayingComponent implements OnInit {

    constructor(private brennanService: BrennanService) { }

    track = ""
    artist = ""
    album = ""
    timeLeft = ""

    @ViewChild("currentArt") currentArt: ElementRef;

    private _window: Window;

    ngOnInit() {
        interval(delay).subscribe((n) => {
            this.brennanService.status().subscribe(status => {
                this.track = status.track
                this.artist = status.artist
                this.album = status.album
                this.timeLeft = formatTimeLeft(parseInt(status.timeLeft))

                this.brennanService.getCurrentArt().subscribe(image => {
                    this.currentArt.nativeElement.src = window.URL.createObjectURL(image);
                })
            })
        });
    }
}
