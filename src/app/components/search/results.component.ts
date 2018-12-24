import { ChangeDetectionStrategy, Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BrennanSearchItem } from '../../services/brennan/brennan-search-item';
import { BrennanService, isAlbum, isTrack, isArtist, isPlaylist, isRadio, isVideo } from '../../services/brennan/brennan.service';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { BrennanSearchOptions } from 'src/app/services/brennan/brennan-search-options';
import { Category, SearchHardDiskService } from 'src/app/services/search-hdd/search-hdd.service';
import { Subscription } from 'rxjs';

interface SearchItem {
    id: number;
    name: string;
}

function toSearchItem(x: BrennanSearchItem): SearchItem {
    if (isAlbum(x.id)) {
        return { id: x.id, name: x.artist }
    }
    else if (isTrack(x.id)) {
        return { id: x.id, name: x.track }
    }
    else if (isArtist(x.id)) {
        return { id: x.id, name: x.artist }
    }
    else if (isPlaylist(x.id)) {
        return { id: x.id, name: "TOOD: playlist" }
    }
    else if (isRadio(x.id)) {
        return { id: x.id, name: x.radio }
    }
    else if (isVideo(x.id)) {
        return { id: x.id, name: x.video }
    }
    else {
        return { id: x.id, name: `Unknown: ${x.id}` }
    }
}

@Component({
    selector: 'brennan-search-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.scss']
})


export class SearchResultsComponent implements OnInit, OnDestroy {

    results: SearchItem[];
    selectedResult: SearchItem;
    subscription: Subscription;
    category: Category;

    constructor(private browseService: BrowseService, private brennanService: BrennanService, private searchHardDriveService: SearchHardDiskService) { }

    getSearchResults(): void {
        const options: BrennanSearchOptions = {
            artists: this.category === 'artists',
            albums: this.category === 'albums',
            tracks: this.category === 'tracks',
            radio: this.category === 'radio',
            video: this.category === 'video'
        }
        this.brennanService.search(options).subscribe(results => this.results = results.map(toSearchItem))
    }

    ngOnInit() {
        this.getSearchResults()
        this.subscription = this.searchHardDriveService.changedCategory$.subscribe(
            category => {
                if (this.category !== category) {
                    this.category = category;
                    this.getSearchResults()
                }
            });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            // prevent memory leak when component destroyed
            this.subscription.unsubscribe();
            this.subscription = null
        }
    }

    onOptions(result: SearchItem): void {
        console.log(`Options: ${result.id} ${result.name} `);
    }

    onPlay(result: SearchItem): void {
        console.log(`Play: ${result.id} ${result.name} `);
        this.brennanService.playID(result.id).subscribe(
            (response) => { console.log(response) },
            (err) => { console.log("Play error") },
            () => { console.log("Play complete") });
        this.brennanService.status().subscribe((status) => { console.log(status) });
    }

    onRename(result: SearchItem): void {
        console.log(`Rename: ${result.id} ${result.name} `);
    }

    onSelect(result: SearchItem): void {
        // console.log(`Select: ${result.id} ${result.artist} `);
        this.selectedResult = result;
        this.browseService.selectArtist({ id: result.id, name: result.name })
    }
}