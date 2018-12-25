import { Component, OnInit, OnDestroy } from '@angular/core';
import { ResponsiveService } from 'src/app/services/responsive/responsive.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  constructor(private responsiveService: ResponsiveService) { }

  private subscription: Subscription;

  title = 'Brennan B2';
  isMobile: boolean

  ngOnInit() {
    this.subscription = this.responsiveService.getMobileStatus().subscribe(isMobile => {
      this.isMobile = isMobile
      if (isMobile) {
        console.log('Mobile device detected')
      }
      else {
        console.log('Desktop detected')
      }
    });
    this.onWindowResize();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  onWindowResize() {
    console.log("onWindowResize()")
    this.responsiveService.checkWidth()
  }
}
