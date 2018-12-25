import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'brennan-actions',
    templateUrl: './actions.component.html',
    styleUrls: ['./actions.component.scss']
})
export class ActionsComponent implements OnInit, OnDestroy {

    private subscription: Subscription;
    private isMobile: boolean;

    constructor(private responsiveService: ResponsiveService) {
    }

    subPanel = 0

    ngOnInit(): void {
        this.subscription = this.responsiveService.getMobileStatus().subscribe(isMobile => {
            this.isMobile = isMobile
            if (isMobile) {
                console.log('Mobile device detected')
            }
            else {
                console.log('Desktop detected')
            }
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null
        }
        throw new Error("Method not implemented.");
    }

    onSelectSubPanel(subPanel: number) {
        this.subPanel = subPanel
    }
}