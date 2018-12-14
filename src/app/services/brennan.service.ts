import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { BrennanItem } from './brennan-item';
import { BrennanStatus } from './brennan-status';

@Injectable({
    providedIn: 'root',
})
export class BrennanService {

    private baseURL = "http://192.168.0.12/b2gci.fcgi"

    constructor(private http: HttpClient) { }

    play(id: number): Observable<string> {
        const url = `${this.baseURL}?playID&${id}&${Date.now()}`
        return this.http.get(url, { responseType: 'text' })
    }

    search(): Observable<BrennanItem[]> {
        return this.http.get<BrennanItem[]>(`${this.baseURL}?search&artists=Y&count=100`)
    }

    status(): Observable<BrennanStatus> {
        const url = `${this.baseURL}?status&${Date.now()}`
        return this.http.get<BrennanStatus>(url, { responseType: 'json' })
    }
}