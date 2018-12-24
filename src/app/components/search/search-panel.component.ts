import { Component } from '@angular/core';

@Component({
    selector: 'brennan-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent {

    searchSubPanel = 0
    
    selectSearchSubPanel(searchSubPanel: number) {
        this.searchSubPanel = searchSubPanel
    }

    onCategoryChange(category: string): void {
        console.log(`onCategoryChange(${category})`)
    }
}