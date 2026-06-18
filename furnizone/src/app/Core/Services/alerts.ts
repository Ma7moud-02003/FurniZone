import { inject, Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class Alerts {
  private readonly toastr = inject(ToastrService);

  // إشعار نجاح العملية (مثلاً: تم الإضافة للسلة بنجاح)
  showSuccess(message: string, title: string = 'Success'): void {
    this.toastr.success(message, title, {
      toastClass: 'ngx-toastr !bg-emerald-300 !text-white rounded-xl shadow-sm', // يمكنك حقن كلاسات Tailwind هنا لتغيير التصميم ليطابق FurniZone!
    });
  }

  // إشعار خطأ (مثلاً: فشل الدفع أو مشكلة في السيرفر)
  showError(message: string, title: string = 'Error'): void {
    this.toastr.error(message, title, {
      toastClass: 'ngx-toastr !bg-rose-600 !text-white rounded-xl shadow-lg',
    });
  }

  // إشعار تنبيهي
  showWarning(message: string, title: string = 'Warning'): void {
    this.toastr.warning(message, title, {
      toastClass: 'ngx-toastr !bg-amber-500 !text-stone-900 rounded-xl shadow-lg',
    });
  }

  // إشعار معلومات عامة
  showInfo(message: string, title: string = 'Info'): void {
    this.toastr.info(message, title);
  }
}
