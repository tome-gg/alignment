import { Component } from '@angular/core';
import { HasuraService } from '../core/services/hasura.service';

var gtag = window.gtag;

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.sass']
})
export class OverviewComponent {

  isOpen: boolean = false;
  serviceSelected: boolean = false;

  constructor() {

  }

  openTawkChat() {
    (window as any).Tawk_API.popup();
  }

  selectService(event: Event, serviceType: 'find_a_mentor'|'1on1'|'group'|'direction_discovery'|'rapid'|'interactive_case_studies') {
    event.preventDefault();
    this.serviceSelected = true;
    this.isOpen = false;
    
    gtag('event', 'show_interest', {
      'event_category': 'services',
      'event_label': serviceType
     });

     window.scrollTo({
      top: 0
     })
  }

  ngAfterViewInit(): void {
      // (<any>window).twttr.widgets.load();
  }
}
