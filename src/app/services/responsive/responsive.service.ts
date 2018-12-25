import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

export type ScreenWidth = 'sm' | 'md' | 'lg'

@Injectable({
    providedIn: 'root',
})
export class ResponsiveService {

    private isMobile = new Subject<boolean>();

    public screenWidth: ScreenWidth;

    changedIsMobile$ = this.isMobile.asObservable();

    constructor() {
        this.checkWidth();
    }

    setIsMobile(isMobile: boolean) {
        this.isMobile.next(isMobile);
    }

    getMobileStatus(): Observable<boolean> {
        return this.isMobile.asObservable();
    }

    public checkWidth(): void {
        const width = window.innerWidth;
        if (width <= 768) {
            this.screenWidth = 'sm';
            this.setIsMobile(true);
        } else if (width > 768 && width <= 992) {
            this.screenWidth = 'md';
            this.setIsMobile(false);
        } else {
            this.screenWidth = 'lg';
            this.setIsMobile(false);
        }
    }

}