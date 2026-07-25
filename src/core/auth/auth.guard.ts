import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

/**
 * Route guard that checks the user's role against the required roles
 * declared in route data: { roles: ['Admin', 'Manager'] }
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = (route.data['roles'] as string[] | undefined) ?? [];

  return authService.currentUserRole$.pipe(
    map(role => {
      if (role && expectedRoles.some(r => r.toLowerCase() === role.toLowerCase())) {
        return true;
      }
      return router.createUrlTree(['/login']);
    })
  );
};
