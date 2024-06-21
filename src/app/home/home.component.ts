import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Gtag } from 'src';

declare var gtag : Gtag.Gtag;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent {

  constructor( private router: Router) {

  }

  tryInk(evt: any) {
    evt.preventDefault();
    gtag('event', "click", {
      event_category: "try ink",
      event_label: "alpha"
    });
    this.router.navigate(['/ink']);
  }

  tryDiscovery(evt: any) {
    evt.preventDefault();
    gtag('event', "click", {
      event_category: "try discovery",
      event_label: "alpha"
    });
    window.location.href = ('https://waitlist.tome.gg/discovery');
  }
}
