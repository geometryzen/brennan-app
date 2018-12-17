import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { BrennanService } from 'src/app/services/brennan/brennan.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToneModalComponent } from 'src/app/dialogs/tone/tone-modal.component';
import { BrowseService } from 'src/app/services/browse/browse.service';

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

    constructor(private brennanService: BrennanService, private browseService: BrowseService, private modalService: NgbModal) { }

    track = ""
    trackId = -1
    artist = ""
    artistId = -1
    album = ""
    albumId = -1
    timeLeft = ""
    playing = -1
    random: boolean = false
    source = ""
    volume = 32 // 0..64
    bass: string
    treble: string

    @ViewChild("currentArt") currentArt: ElementRef<HTMLImageElement>;
    @ViewChild("volumeInput") volumeInput: ElementRef<HTMLInputElement>;

    private _window: Window;

    ngOnInit() {
        interval(delay).subscribe((n) => {
            this.brennanService.status().subscribe(status => {
                this.track = status.track
                this.trackId = parseInt(status.trackid)
                this.artist = status.artist
                this.artistId = parseInt(status.artistid)
                this.timeLeft = formatTimeLeft(parseInt(status.timeLeft))
                this.playing = status.playing
                this.source = status.source
                this.volume = parseInt(status.volume)
                this.random = parseInt(status.random) == 1
                this.bass = status.bass
                this.treble = status.treble

                // console.log(status)

                const albumId = parseInt(status.albumid)
                if (this.albumId != albumId) {
                    this.brennanService.getCurrentArt().subscribe(image => {
                        this.currentArt.nativeElement.src = window.URL.createObjectURL(image);
                        this.albumId = albumId;
                        this.album = status.album
                    })
                }
            })
        });
    }

    onBack() {
        this.brennanService.back().subscribe((response) => { })
    }

    onPausePlay() {
        this.brennanService.play().subscribe((response) => { })
    }

    onNext() {
        this.brennanService.next().subscribe((response) => { })
    }

    onInputVolume() {
        this.brennanService.vol(parseInt(this.volumeInput.nativeElement.value)).subscribe(() => { })
    }

    onChangeVolume() {
    }

    onRandomToggle() {
        this.brennanService.setRandom(!this.random).subscribe(() => { })
    }

    onToneControl() {
        console.log("onToneControl() bass=" + this.bass + " treble=" + this.treble);
        const modalRef = this.modalService.open(ToneModalComponent);
        modalRef.componentInstance.title = 'About';
        // $('#toneModal').modal();			
        // $("#bassSlider").val(nowPlaying.bass);
        // $("#trebleSlider").val(nowPlaying.treble);
    }

    onSelectArtist() {
        this.browseService.selectArtist({ id: this.artistId, name: this.artist })
    }

    onSelectAlbum() {
        this.browseService.selectArtist({ id: this.artistId, name: this.artist })
        this.browseService.selectAlbum({ id: this.albumId, name: this.album })
    }

    onSelectTrack() {
        this.browseService.selectArtist({ id: this.artistId, name: this.artist })
        this.browseService.selectAlbum({ id: this.albumId, name: this.album })
        this.browseService.selectTrack({ id: this.trackId, name: this.track })
    }
}
