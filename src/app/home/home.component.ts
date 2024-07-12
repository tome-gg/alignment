import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Gtag } from 'src';

declare var gtag : Gtag.Gtag;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor( private router: Router, private auth: AuthService) {

  }

  ngOnInit(): void {
    
  }

  tryInk(evt: any) {
    evt.preventDefault();

    this.auth.isAuthenticated$.subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          gtag('event', "click", {
            event_category: "try ink",
            event_label: "alpha"
          });
          this.router.navigate(['/ink']);
        } else {
          this.auth.loginWithPopup({
            authorizationParams: {
              redirect_uri: 'https://tome.gg/ink'
            }
          });
        }
      }, 
      error: (err) => {
        console.log('err', err);
      }
    })

    
  }

  tryDiscovery(evt: any) {
    evt.preventDefault();

    const self = this;
    this.auth.isAuthenticated$.subscribe({
      next: (isLoggedIn) => {
        if (isLoggedIn) {
          this.router.navigateByUrl('/journal/request-coaching');
        }
      }, 
      error: (err) => {
        console.log('err', err);
      }
    })

    this.auth.isAuthenticated$.subscribe(isAuthenticated => {
      if (!isAuthenticated) {
        this.auth.loginWithPopup();
      }
    })

    // gtag('event', "click", {
    //   event_category: "try discovery",
    //   event_label: "alpha"
    // });
    // window.location.href = ('https://waitlist.tome.gg/discovery');
  }
}
