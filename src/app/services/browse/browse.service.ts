import { Injectable } from '@angular/core';
import { BrowseAlbum } from './browse-album';
import { BrowseArtist } from './browse-artists';
import { Observable } from 'rxjs';
import { BrowseTrack } from './browse-track';



@Injectable({
    providedIn: 'root',
})
export class BrowseService {

    emitAlbum: (album?: BrowseAlbum) => void;
    emitArtist: (artist?: BrowseArtist) => void;
    emitTrack: (track?: BrowseTrack) => void;

    currentAlbum: Observable<BrowseAlbum> = new Observable((observer) => {
        this.emitAlbum = (e) => observer.next(e);
    })

    currentArtist: Observable<BrowseArtist> = new Observable((observer) => {
        this.emitArtist = (e) => observer.next(e);
    })

    currentTrack: Observable<BrowseTrack> = new Observable((observer) => {
        this.emitTrack = (e) => observer.next(e);
    })

    constructor() { }

    selectArtist(artist: BrowseArtist) {
        console.log(`artist.id=${artist.id}`)
        if (this.emitArtist) {
            this.emitArtist(artist);
        }
    }

    selectAlbum(album: BrowseAlbum) {
        console.log(`album.id=${album.id}`)
        if (this.emitAlbum) {
            this.emitAlbum(album);
        }
    }

    selectTrack(track: BrowseTrack) {
        console.log(`track.id=${track.id}`)
        if (this.emitTrack) {
            this.emitTrack(track);
        }
    }
}