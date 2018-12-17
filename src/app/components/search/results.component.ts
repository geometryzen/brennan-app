import { Component, OnInit } from '@angular/core';
import { BrennanItem } from '../../services/brennan/brennan-item';
import { BrennanService } from '../../services/brennan/brennan.service';
import { BrowseService } from 'src/app/services/browse/browse.service';

@Component({
    selector: 'brennan-search-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})

export class SearchResultsComponent implements OnInit {

    results: BrennanItem[];
    selectedResult: BrennanItem;

    constructor(private browseService: BrowseService, private brennanService: BrennanService) { }

    getSearchResults(): void {
        this.brennanService.search().subscribe(results => this.results = results)
    }

    ngOnInit() {
        this.getSearchResults()
    }

    onOptions(result: BrennanItem): void {
        console.log(`Options: ${result.id} ${result.artist} `);
    }

    onPlay(result: BrennanItem): void {
        console.log(`Play: ${result.id} ${result.artist} `);
        this.brennanService.playID(result.id).subscribe(
            (response) => { console.log(response) },
            (err) => { console.log("Play error") },
            () => { console.log("Play complete") });
        this.brennanService.status().subscribe((status) => { console.log(status) });
    }

    onRename(result: BrennanItem): void {
        console.log(`Rename: ${result.id} ${result.artist} `);
    }

    onSelect(result: BrennanItem): void {
        // console.log(`Select: ${result.id} ${result.artist} `);
        this.selectedResult = result;
        this.browseService.selectArtist({ id: result.id, name: result.artist })
    }
}