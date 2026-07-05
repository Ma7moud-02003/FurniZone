import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../Core/Services/alerts';
import { Auth } from '../Core/Services/auth';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const rout=inject(Router);
  const auth=inject(Auth)
  const router = inject(Router);
const alerts=inject(Alerts);
  return next(req).pipe(
    catchError((error) => {
      // هنا بنشيك على نوع الخطأ القادم من السيرفر
      if (error.status === 401) {
        alerts.showError('Unauthorized You Have no Access');
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        alerts.showError('Forbidden denied to access');
        auth.logOut();
      } else if (error.status === 500) {
        alerts.showError('Internal Server Error)');
      } else {
        alerts.showError('Un Accepted Error');
      }
      return throwError(() => error);
    })
  );
};