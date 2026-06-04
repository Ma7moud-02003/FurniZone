import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '../Core/Services/auth';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const auth=inject(Auth);
  // جلب التوكن من التخزين المحلي
  const token = auth.getTokn();
  // إذا كان التوكن موجودًا، نقوم بتعديل الـ Request وإضافة الـ Header
  if (token) {
    const clonedReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedReq);
  }

  // إذا لم يكن موجودًا، يمر الطلب كما هو
  return next(req);
};