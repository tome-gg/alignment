import { Injectable } from '@angular/core';
import { AuthService as AngularAuthService } from '@auth0/auth0-angular';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  constructor(private auth: AngularAuthService) {
   }

  loginWithRedirect() {
    this.auth.loginWithRedirect();
  }


  isAuthenticated() {
    return this.auth.isAuthenticated$;
  }
}
