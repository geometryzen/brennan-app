import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { BrennanItem } from './brennan-item';
import { BrennanStatus } from './brennan-status';
import { BrennanAlbum } from './brennan-album';

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

    search(): Observable<BrennanItem[]> {
        const url = appendTime(`${this.baseURL}?search&artists=Y&count=100`)
        return this.http.get<BrennanItem[]>(url)
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