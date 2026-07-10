import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Alerts } from '../Core/Services/alerts';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  const alerts = inject(Alerts);
  const token = localStorage.getItem('token'); 
  const role = localStorage.getItem('role');

  if (token) {
   
    if (role === 'admin') {
alerts.showWarning('Access denied. As an admin, you cannot browse regular user pages.');
      router.navigate(['/admin']); 
      return false;
    }

    return true;
  } else {
    alerts.showWarning('Please login first to access this page.');
    router.navigate(['/login']);
    return false;
  }
}