import { Component } from '@angular/core';
import { BrennanPreset } from 'src/app/services/brennan/brennan-preset';
import { BrowseService } from 'src/app/services/browse/browse.service';
import { BrennanService } from 'src/app/services/brennan/brennan.service';

@Component({
    selector: 'brennan-presets',
    templateUrl: './presets.component.html',
    styleUrls: ['./presets.component.scss']
})
export class PresetsComponent {

    presets: BrennanPreset[];
    selectedPreset: BrennanPreset;

    constructor(private browseService: BrowseService, private brennanService: BrennanService) { }

    cachePresets(): void {
        this.brennanService.presets().subscribe(presets => this.presets = presets)
    }

    ngOnInit() {
        this.cachePresets()
    }

    onPlay(index: number, preset: BrennanPreset): void {
        console.log(`Play [${index}]: ${preset.name} ${preset.url} `);
        this.brennanService.playPreset(index).subscribe(
            (response) => { console.log(response) },
            (err) => { console.log("Play error") },
            () => { console.log("Play complete") });
        this.brennanService.status().subscribe((status) => { console.log(status) });
    }

}
