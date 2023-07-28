import { Component } from '@angular/core';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: []
})
export class PageBookingComponent {
  openTawkChat() {
    (window as any).Tawk_API.popup();
  }
}
