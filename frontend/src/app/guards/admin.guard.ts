/**
 * admin.guard.ts
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../services/account.service';

export const adminGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.isLoggedIn() && accountService.currentUser?.role === 'admin') {
    return true;
  }

  router.navigate(['/']);
  return false;
};
