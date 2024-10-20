import { Component, OnInit } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from '@auth0/auth0-angular';
import { Gtag } from 'src';
import { environment } from 'src/environments/environment';

declare var gtag : Gtag.Gtag;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {

  constructor( private router: Router, private auth: AuthService, private meta: Meta) {

  }

  ngOnInit(): void {
    this.meta.addTags([
      { name: 'title', content: 'Coaching and Mentoring | Tome.gg' },
      { name: 'description', content: 'Coaching and mentoring for mid- to senior-level software engineers.' }
    ]);
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
              redirect_uri: `${environment.baseUrl}/ink`
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
        this.auth.loginWithPopup({
          authorizationParams: {
            redirect_uri: `${environment.baseUrl}/journal/request-coaching`
          }
        });
      }
    })

    // gtag('event', "click", {
    //   event_category: "try discovery",
    //   event_label: "alpha"
    // });
    // window.location.href = ('https://waitlist.tome.gg/discovery');
  }
}
