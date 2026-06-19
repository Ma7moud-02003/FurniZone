import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding, withInMemoryScrolling } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './Interceptors/auth.interceptor';
import { errorHandlerInterceptor } from './Interceptors/error.interceptor';
import { provideToastr } from 'ngx-toastr';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withComponentInputBinding(), // ميزة الـ Inputs للأقسام
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }) // ميزة السكرول تطلعك فوق ✨
    ),
    provideHttpClient(withInterceptors([authInterceptor, errorHandlerInterceptor])),
     // في ملف الـ app.config.ts
    provideRouter(routes, withComponentInputBinding()),
    provideToastr({
      timeOut: 3000, // مدة ظهور الإشعار (3 ثوانٍ)
      positionClass: 'toast-top-right', // مكان الظهور
      preventDuplicates: true, // منع تكرار نفس الإشعار
      progressBar: true, // إظهار شريط تقدم الوقت بالأسفل
      closeButton: true, // زر إغلاق الإشعار
    }),


  ]
};
