import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Alerts } from '../Core/Services/alerts';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const alerts = inject(Alerts);

  // 1. جلب التوكن من الـ Local Storage
  const token = localStorage.getItem('token');

  // 2. التحقق من وجود التوكن
  if (token) {
    return true; // التوكن موجود، عدي يا بطل 🔓
  } else {
    // 3. التوكن مش موجود، ارمي تنبيه ورجعه لصفحة اللوجن 🔒
    alerts.showWarning('Please login first to access this page.');
    router.navigate(['/login']);
    return false;
  }
}