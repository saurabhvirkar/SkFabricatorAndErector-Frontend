import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';

/**
 * Route guard that checks the user's role against required roles.
 * Allows access to any authenticated user if no specific roles are declared.
 * SuperAdmin always has access to all protected portal routes.
 */
export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = (route.data['roles'] as string[] | undefined) ?? [];

  return authService.currentUserRole$.pipe(
    map(role => {
      if (!role) {
        return router.createUrlTree(['/ops/sec-portal']);
      }
      if (
        expectedRoles.length === 0 ||
        role.toLowerCase() === 'superadmin' ||
        expectedRoles.some(r => r.toLowerCase() === role.toLowerCase())
      ) {
        return true;
      }
      return router.createUrlTree(['/ops/sec-portal']);
    })
  );
};
