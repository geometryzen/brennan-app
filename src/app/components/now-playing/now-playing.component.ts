import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { BrennanService } from 'src/app/services/brennan.service';
// import 'rxjs/add/observable/interval';

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

    ngOnInit() {
        interval(delay).subscribe((n) => {
            this.brennanService.status().subscribe(status => {
                this.track = status.track
                this.artist = status.artist
                this.album = status.album
                this.timeLeft = formatTimeLeft(parseInt(status.timeLeft))
            })
        });
    }
}
