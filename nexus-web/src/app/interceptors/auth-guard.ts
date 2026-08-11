import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const hasSession = false;

  if (hasSession) {
    return true;
  } else {
    // Si no está logueado, lo pateamos al login
    router.navigate(['/login']);
    return false;
  }
};
