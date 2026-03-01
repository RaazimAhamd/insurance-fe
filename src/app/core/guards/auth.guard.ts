import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {

  const router = inject(Router);
  const token = sessionStorage.getItem('token');

  if (token === 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6') {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};
