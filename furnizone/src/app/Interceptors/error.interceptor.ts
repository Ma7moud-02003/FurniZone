import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      // هنا بنشيك على نوع الخطأ القادم من السيرفر
      if (error.status === 401) {
        console.error('غير مصرح لك بالدخول (Unauthorized) - توجيه لصفحة تسجيل الدخول');
        // مثال: لو التوكن انتهى، امسحه ووديه لصفحة الـ login
        localStorage.removeItem('token');
        router.navigate(['/login']);
      } else if (error.status === 403) {
        alert('ليس لديك الصلاحية للوصول (Forbidden)');
      } else if (error.status === 500) {
        alert('مشكلة في السيرفر الداخلي (Internal Server Error)');
      } else {
        alert('حدث خطأ غير متوقع:');
      }

      // تمرير الخطأ للـ Component في حال كنت تريد التعامل معه هناك أيضاً
      return throwError(() => error);
    })
  );
};