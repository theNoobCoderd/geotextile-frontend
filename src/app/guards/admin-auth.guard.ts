import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Blocks /admin routes unless a Supabase session exists. This only checks
 * "signed in", not "is an admin" — the real admin check happens server-side
 * (list-orders / update-order-status verify against the `admins` table via
 * RLS). A signed-in non-admin will simply see a 403 from those calls.
 */
export const adminAuthGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isAuthenticated) {
    return true;
  }
  return router.parseUrl('/admin/login');
};
