import { Component, OnInit } from '@angular/core';
import { SearchResult } from '../../models/search-result';
import { BrennanService } from '../../services/brennan.service';

@Component({
    selector: 'brennan-search-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})

export class SearchResultsComponent implements OnInit {

    results: SearchResult[];
    selectedResult: SearchResult;

    constructor(private brennanService: BrennanService) { }

    getSearchResults(): void {
        this.brennanService.search().subscribe(results => this.results = results)
    }

    ngOnInit() {
        this.getSearchResults()
    }

    onOptions(result: SearchResult): void {
        console.log(`Options: ${result.id} ${result.artist} `);
    }

    onPlay(result: SearchResult): void {
        console.log(`Play: ${result.id} ${result.artist} `);
        this.brennanService.play(result.id).subscribe((response) => { console.log(response) });
    }

    onRename(result: SearchResult): void {
        console.log(`Rename: ${result.id} ${result.artist} `);
    }

    onSelect(result: SearchResult): void {
        console.log(`Select: ${result.id} ${result.artist} `);
        this.selectedResult = result;
    }
}