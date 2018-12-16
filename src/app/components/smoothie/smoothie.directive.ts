import { OnInit, OnDestroy, ElementRef, NgZone, Directive, ViewChild } from '@angular/core';
import { SmoothieChart } from '../../libs/smoothie/SmoothieChart'
import { TimeSeries } from 'src/app/libs/smoothie/TimeSeries';
import { Observable, interval, Subscription } from 'rxjs';
import { BrennanService } from 'src/app/services/brennan/brennan.service';
import { ViewContainerData } from '@angular/core/src/view';

const delayMillis = 500;

@Directive({
    selector: '[brennan-smoothie]'
})
export class SmoothieDirective implements OnInit, OnDestroy {

    private vuLine: TimeSeries;
    private subscription: Subscription;

    constructor(private canvasRef: ElementRef<HTMLCanvasElement>, private zone: NgZone, private brennanService: BrennanService) {
        const canvas = canvasRef.nativeElement;
        canvas.width = 320;
        const smoothie = new SmoothieChart({ maxValue: 100, minValue: 0 })
        smoothie.streamTo(canvas, 500)
        this.vuLine = new TimeSeries()
        smoothie.addTimeSeries(this.vuLine)
    }

    ngOnInit() {
        this.subscription = interval(delayMillis).subscribe((n) => {
            this.brennanService.status().subscribe(status => {
                const vu = status.vu;
                const t = Date.now();
                this.vuLine.append(t + 0, vu[4]);
                this.vuLine.append(t + 100, vu[3]);
                this.vuLine.append(t + 200, vu[2]);
                this.vuLine.append(t + 300, vu[1]);
                this.vuLine.append(t + 400, vu[0]);
            })
        });
        window.addEventListener('resize', this.resize, false)
    }

    ngOnDestroy() {
        this.subscription.unsubscribe()
    }

    resize = () => {
        // Not ideal to assume the container...
        const canvas = this.canvasRef.nativeElement
        canvas.width = canvas.parentElement.clientWidth
    }
}