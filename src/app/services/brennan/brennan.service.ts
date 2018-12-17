import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { BrennanItem } from './brennan-item';
import { BrennanStatus } from './brennan-status';
import { BrennanAlbum } from './brennan-album';

function appendTimeNow(url: string): string {
    return `${url}&time=${Date.now()}`
}

@Injectable({
    providedIn: 'root',
})
export class BrennanService {

    private baseURL = "http://192.168.0.12/b2gci.fcgi"

    constructor(private http: HttpClient) { }

    albums(artistId: number): Observable<BrennanAlbum[]> {
        return this.http.get<BrennanAlbum[]>(`${this.baseURL}?listartist&id=${artistId}`)
    }

    tracks(albumId: number): Observable<BrennanAlbum[]> {
        return this.http.get<BrennanAlbum[]>(`${this.baseURL}?listalbum&id=${albumId}`)
    }

    back(): Observable<string> {
        const url = appendTimeNow(`${this.baseURL}?back`)
        return this.http.get(url, { responseType: 'text' })
    }

    getCurrentArt(): Observable<Blob> {
        const url = appendTimeNow(`${this.baseURL}?getCurrentArt`)
        return this.http.get(url, { responseType: 'blob' })
    }

    next(): Observable<string> {
        const url = appendTimeNow(`${this.baseURL}?next`);
        return this.http.get(url, { responseType: 'text' })
    }

    play(): Observable<string> {
        const url = appendTimeNow(`${this.baseURL}?play`);
        return this.http.get(url, { responseType: 'text' })
    }

    playID(id: number): Observable<string> {
        const url = `${this.baseURL}?playID&${id}&${Date.now()}`
        return this.http.get(url, { responseType: 'text' })
    }

    search(): Observable<BrennanItem[]> {
        return this.http.get<BrennanItem[]>(`${this.baseURL}?search&artists=Y&count=100`)
    }

    setRandom(random: boolean): Observable<string> {
        const r = random ? 1 : 0;
        const url = appendTimeNow(`${this.baseURL}?setRandom&random=${r}`)
        return this.http.get(url, { responseType: 'text' })
    }

    status(): Observable<BrennanStatus> {
        const url = `${this.baseURL}?status&${Date.now()}`
        return this.http.get<BrennanStatus>(url, { responseType: 'json' })
    }

    vol(value: number): Observable<string> {
        const url = appendTimeNow(`${this.baseURL}?vol${value}`)
        return this.http.get(url, { responseType: 'text' })
    }
}