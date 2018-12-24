import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { BrennanSearchItem } from './brennan-search-item';
import { BrennanPreset } from './brennan-preset';
import { BrennanStatus } from './brennan-status';
import { BrennanAlbum } from './brennan-album';
import { BrennanSearchOptions } from './brennan-search-options';

export function isAlbum(id: number): boolean {
    return ((id >= 1000000) && (id < 2000000));
}

export function isTrack(id: number): boolean {
    return ((id >= 2000000) && (id < 3000000));
}

export function isArtist(id: number): boolean {
    return ((id >= 3000000) && (id < 4000000));
}

export function isPlaylist(id: number): boolean {
    return ((id >= 4000000) && (id < 5000000));
}

export function isRadio(id: number): boolean {
    return ((id >= 5000000) && (id < 6000000));
}

export function isVideo(id: number): boolean {
    return ((id >= 8000000) && (id < 9000000));
}

export function isUSBAlbum(id: number): boolean {
    return ((id >= 9000000) && (id < 10000000));
}

export function isUSBTrack(id: number): boolean {
    return ((id >= 10000000) && (id < 11000000));
}

export function isUSBArtist(id: number): boolean {
    return ((id >= 11000000) && (id < 12000000));
}

function appendFlag(name: string, flag: boolean, url: string): string {
    if (flag === true) {
        return `${url}&${name}=Y`
    }
    else if (flag === false) {
        return `${url}&${name}=N`
    }
    else {
        return url;
    }
}
function appendTime(url: string): string {
    return `${url}&time=${Date.now()}`
}

@Injectable({
    providedIn: 'root',
})
export class BrennanService {

    private baseURL = "http://192.168.1.77/b2gci.fcgi"
    // private baseURL = "http://192.168.0.12/b2gci.fcgi"

    constructor(private http: HttpClient) { }

    albums(artistId: number): Observable<BrennanAlbum[]> {
        const url = appendTime(`${this.baseURL}?listartist&id=${artistId}`)
        return this.http.get<BrennanAlbum[]>(url)
    }

    tracks(albumId: number): Observable<BrennanAlbum[]> {
        const url = appendTime(`${this.baseURL}?listalbum&id=${albumId}`);
        return this.http.get<BrennanAlbum[]>(url)
    }

    back(): Observable<string> {
        const url = appendTime(`${this.baseURL}?back`)
        return this.http.get(url, { responseType: 'text' })
    }

    getCurrentArt(): Observable<Blob> {
        const url = appendTime(`${this.baseURL}?getCurrentArt`)
        return this.http.get(url, { responseType: 'blob' })
    }

    next(): Observable<string> {
        const url = appendTime(`${this.baseURL}?next`);
        return this.http.get(url, { responseType: 'text' })
    }

    play(): Observable<string> {
        const url = appendTime(`${this.baseURL}?play`);
        return this.http.get(url, { responseType: 'text' })
    }

    playID(id: number): Observable<string> {
        const url = appendTime(`${this.baseURL}?playID&${id}`)
        return this.http.get(url, { responseType: 'text' })
    }

    playPreset(index: number): Observable<string> {
        const id = index += 6000000;
        const url = appendTime(`${this.baseURL}?playID&${id}`)
        return this.http.get(url, { responseType: 'text' })
    }

    presets(): Observable<BrennanPreset[]> {
        const url = appendTime(`${this.baseURL}?getPresets`)
        return this.http.get<BrennanPreset[]>(url)
    }

    search(options: BrennanSearchOptions): Observable<BrennanSearchItem[]> {
        let url = `${this.baseURL}?search&count=1000`
        url = appendFlag('artists', options.artists, url);
        url = appendFlag('albums', options.albums, url);
        url = appendFlag('tracks', options.tracks, url);
        url = appendFlag('radio', options.radio, url);
        url = appendFlag('video', options.video, url);
        url = appendTime(url);
        console.log(`search using URL: ${url}`)
        return this.http.get<BrennanSearchItem[]>(url)
    }

    setRandom(random: boolean): Observable<string> {
        const r = random ? 1 : 0;
        const url = appendTime(`${this.baseURL}?setRandom&random=${r}`)
        return this.http.get(url, { responseType: 'text' })
    }

    status(): Observable<BrennanStatus> {
        const url = appendTime(`${this.baseURL}?status}`)
        return this.http.get<BrennanStatus>(url, { responseType: 'json' })
    }

    vol(value: number): Observable<string> {
        const url = appendTime(`${this.baseURL}?vol${value}`)
        return this.http.get(url, { responseType: 'text' })
    }
}