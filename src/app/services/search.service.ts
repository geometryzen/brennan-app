import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, of } from 'rxjs';

import { SearchResult } from '../models/search-result';

@Injectable({
    providedIn: 'root',
})
export class SearchService {

    constructor(private http: HttpClient) { }

    getResults(): Observable<SearchResult[]> {
        return this.http.get<SearchResult[]>("http://192.168.0.12/b2gci.fcgi?search&artists=Y&count=100")
    }
}