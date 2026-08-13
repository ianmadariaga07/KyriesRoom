import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const hasSession = false;

  if (hasSession) {
    return true;
  } else {
    //Si no esta logueado, lo mandamos al login
    router.navigate(['/login']);
    return false;
  }
};
