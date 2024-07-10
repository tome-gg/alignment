import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { combineLatest, filter, map, tap } from 'rxjs';
import { AuthService } from '@auth0/auth0-angular';
import { DateTime } from 'luxon';

export const authGuard: CanActivateFn = (route, state) => {
  const authService: AuthService = inject(AuthService);

  return combineLatest([authService.isAuthenticated$, authService.idTokenClaims$])
  .pipe(
    filter(([isAuthenticated, tokenClaims]) => isAuthenticated && Boolean(tokenClaims)),
    map(([isAuthenticated, tokenClaims]) => {
      
      const expiryDate = DateTime.fromMillis((tokenClaims?.exp ?? 0) * 1000);
      
      if (expiryDate < DateTime.now()) {
        authService.loginWithRedirect();
        return false;
      }

      if (!isAuthenticated) {
        authService.loginWithRedirect();
        return false;
      }

      return true;
    })
);
};
