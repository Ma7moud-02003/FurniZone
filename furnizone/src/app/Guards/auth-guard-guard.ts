import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Alerts } from '../Core/Services/alerts';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alerts = inject(Alerts);
  const token = localStorage.getItem('token'); 
  if (token) {
    return true;
  } else {
    alerts.showWarning('Please login first to access this page.');
    router.navigate(['/login']);
    return false;
  }
}