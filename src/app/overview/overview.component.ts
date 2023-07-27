import { Component } from '@angular/core';

var gtag: any;

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

  selectService(serviceType: 'find_a_mentor'|'1on1'|'group'|'direction_discovery'|'rapid'|'interactive_case_studies') {
    this.serviceSelected = true;
    this.isOpen = false;
    gtag('event', 'SHOW_INTEREST', {
      'event_category': 'SERVICES',
      'event_label': serviceType
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
