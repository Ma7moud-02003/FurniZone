import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../Core/Services/alerts';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
const alerts=inject(Alerts);
  return next(req).pipe(
    catchError((error) => {
      // هنا بنشيك على نوع الخطأ القادم من السيرفر
      if (error.status === 401) {
        console.error('غير مصرح لك بالدخول (Unauthorized) - توجيه لصفحة تسجيل الدخول');
        alerts.showError('غير مصرح لك بالدخول (Unauthorized) - توجيه لصفحة تسجيل الدخول');
        // مثال: لو التوكن انتهى، امسحه ووديه لصفحة الـ login
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        alerts.showError('ليس لديك الصلاحية للوصول (Forbidden)');
      } else if (error.status === 500) {
        alerts.showError('مشكلة في السيرفر الداخلي (Internal Server Error)');
      } else {
        alerts.showError('حدث خطأ غير متوقع:');
      }
      return throwError(() => error);
    })
  );
};