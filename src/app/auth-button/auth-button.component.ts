import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';

// Import the AuthService type from the SDK
import { AuthService } from '@auth0/auth0-angular';

@Component({
  selector: 'app-auth-button',
  templateUrl: './auth-button.component.html'
})
export class AuthButtonComponent implements OnInit {
  // Inject the authentication service into your component through the constructor
  constructor(@Inject(DOCUMENT) public document: Document, public auth: AuthService) {}

  ngOnInit(): void {
    // this.auth.isAuthenticated$.subscribe((isAuthenticated) => {
    //   if (isAuthenticated === false) {
    //     // auth0 log out
    //   }
    // });
  }

  logout() {

    const federated = false;
    this.auth.logout({ logoutParams: { federated, returnTo: document.location.origin } })
  }
}