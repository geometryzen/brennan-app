import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../models/search-result';
import { RESULTS } from '../mocks/mock-artists';
import { SearchService } from '../services/search.service';

@Component({
    selector: 'brennan-search-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})

export class SearchResultsComponent implements OnInit {

    results: SearchResult[];
    selectedResult: SearchResult;

    constructor(private searchService: SearchService) { }

    getResults(): void {
        this.searchService.getResults().subscribe(results => this.results = results)
    }

    ngOnInit() {
        this.getResults()
    }

    onClickPlay(result: SearchResult): void {
        console.log(`Play: ${result.id} ${result.artist} `);
    }

    onClick(result: SearchResult): void {
        console.log(`Click: ${result.id} ${result.artist} `);
    }

    onClickOptions(result: SearchResult): void {
        console.log(`Options: ${result.id} ${result.artist} `);
    }

    onSelect(result: SearchResult): void {
        this.selectedResult = result;
    }
}