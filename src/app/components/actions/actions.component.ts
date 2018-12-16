import { Component } from '@angular/core';

@Component({
    selector: 'brennan-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent {
    
    subPanel = 0

    onSelectSubPanel(subPanel: number) {
        this.subPanel = subPanel
    }
}