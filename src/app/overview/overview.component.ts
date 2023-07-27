import { Component } from '@angular/core';
import { getGtagFn } from 'ngx-google-analytics';

const gtag = getGtagFn(window, []);
@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {

  isOpen: boolean = false;
  serviceSelected: boolean = false;

  openTawkChat() {
    (window as any).Tawk_API.popup();
  }

  selectService(event: Event, serviceType: 'find_a_mentor'|'1on1'|'group'|'direction_discovery'|'rapid'|'interactive_case_studies') {
    event.preventDefault();
    this.serviceSelected = true;
    this.isOpen = false;
    
    gtag('event', 'SHOW_INTEREST', {
      'event_category': 'SERVICES',
      'event_label': serviceType
     });

     window.scrollTo({
      top: 0
     })
  }

  track(eventName: string) {
    gtag('event', eventName, {
    'event_category': 'BUTTON_CLICK' })
  }

  ngAfterViewInit(): void {
      (<any>window).twttr.widgets.load();
  }
}
