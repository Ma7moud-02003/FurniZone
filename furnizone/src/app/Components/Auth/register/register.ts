import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [
     ReactiveFormsModule,
CommonModule,
RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);

  // 1. الـ Signals الأساسية لحالة الصفحة والـ Password Visibility
  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);
  registerError = signal('');

  // 2. تتبع الـ Fields اللي حصلها Blur (عشان الـ HTML مستخدم ميثود (blur)="markTouched(...)")
  private touchedFields = signal<{ [key: string]: boolean }>({});

  // 3. بناء الفورم مع الـ Validation والـ Password Match Custom Validator
  registerForm: FormGroup = this.fb.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', [Validators.pattern(/^01[0125][0-9]{8}$/)]], // رقم مصري اختياري كمثال
    password: ['', [
      Validators.required,
      Validators.minLength(8),
      Validators.pattern(/(?=.*[A-Z])(?=.*[0-9])/) // شرط حرف كابيتال ورقم واحد على الأقل
    ]],
    confirmPassword: ['', [Validators.required]],
    agreeTerms: [false, [Validators.requiredTrue]]
  }, { validators: this.passwordMatchValidator });

  // 4. الـ Getters الأساسية للوصول للـ controls بسهولة داخل الـ TS والـ HTML
  get email() { return this.registerForm.get('email')!; }
  get password() { return this.registerForm.get('password')!; }
  get confirmPassword() { return this.registerForm.get('confirmPassword')!; }
  get agreeTerms() { return this.registerForm.get('agreeTerms')!; }

  // 5. ميثود لتسجيل أن الحقل تم لمسه (عند الـ Blur في الـ HTML)
  markTouched(fieldName: string): void {
    this.touchedFields.update(prev => ({ ...prev, [fieldName]: true }));
    // برضه بنسمع في الـ Form Control الأصلي بتاع أنجلر
    this.registerForm.get(fieldName)?.markAsTouched();
  }

  // ميثود للتشيك هل الحقل اتلمس ولا لأ (مستخدمة في تشيك الشروط بالـ HTML)
  isTouched(fieldName: string): boolean {
    return !!this.touchedFields()[fieldName] || !!this.registerForm.get(fieldName)?.touched;
  }

  // 6. الميثود السحرية اللي مستخدمة في الـ HTML للتشيك ع الأخطاء ديناميكياً وترجع Signal
  getFieldError(fieldName: string) {
    return computed(() => {
      // الـ computed هيعيد الحساب تلقائياً لما الـ Form value تتغير أو الـ field يتلمس
      this.touchedFields(); 
      const control = this.registerForm.get(fieldName);
      
      if (!control || (!control.touched && !this.isTouched(fieldName))) return '';

      if (control.hasError('required')) return 'This field is required';
      if (control.hasError('email')) return 'Please enter a valid email address';
      if (control.hasError('minlength')) {
        const requiredLength = control.errors?.['minlength']?.requiredLength;
        return `Must be at least ${requiredLength} characters`;
      }
      if (control.hasError('pattern') && fieldName === 'password') {
        return 'Password must contain at least 1 uppercase letter and 1 number';
      }
      if (control.hasError('pattern') && fieldName === 'phone') {
        return 'Please enter a valid phone number';
      }
      if (control.hasError('passwordMismatch') && fieldName === 'confirmPassword') {
        return 'Passwords do not match';
      }

      return '';
    });
  }

  // 7. حساب قوة الباسورد (Password Strength) بناءً ع الشروط
  passwordStrength = computed(() => {
    // استخدمت الـ valueChanges كـ سجنال عبر تحويل بسيط، أو مباشرة قراءة القيمة من الفورم داخل الـ computed
    // عشان الـ computed يلقط التغيير مع كل حرف يكتبه المستخدم:
    const pass = this.registerForm.value.password || '';
    if (!pass) return 0;

    let strength = 0;
    if (pass.length >= 8) strength++; // شرط الطول
    if (/[A-Z]/.test(pass)) strength++; // شرط حرف كابيتال
    if (/[0-9]/.test(pass)) strength++; // شرط رقم
    if (/[^A-Za-z0-9]/.test(pass)) strength++; // شرط رمز خاص

    return strength === 0 ? 1 : strength; // الحد الأدنى 1 لو بدأ يكتب
  });

  // تحديد كلاس اللون للـ bars بتاعة القوة بناءً ع الدرجة
  passwordStrengthColor = computed(() => {
    const strength = this.passwordStrength();
    if (strength === 1) return 'bg-red-500';
    if (strength === 2) return 'bg-yellow-500';
    if (strength === 3) return 'bg-blue-500';
    return 'bg-green-600'; // لو 4 (قوي جداً)
  });

  // تحديد الكلمة (Label) اللي هتظهر في الـ HTML
  passwordStrengthLabel = computed(() => {
    const strength = this.passwordStrength();
    if (strength === 1) return 'Weak';
    if (strength === 2) return 'Fair';
    if (strength === 3) return 'Good';
    return 'Strong';
  });

  // 8. الـ Toggle لظهور وإخفاء الباسورد
  togglePassword(): void {
    this.showPassword.update(v => !v);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(v => !v);
  }

  // 9. Custom Validator لمطابقة كلمة المرور مع التأكيد
  private passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (password && confirmPassword && password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }
    
    // لو مفيش مشكلة بنشيل خطأ الماتش بس بنحافظ على الأخطاء التانية لو موجودة
    if (confirmPassword?.hasError('passwordMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null;
  }

  // 10. عند عمل Submit للفورم
  onSubmit(): void {
    this.registerError.set('');

    // علم على كل الحقول إنها اتلمست عشان يظهر الأخطاء لو داس Submit علطول
    Object.keys(this.registerForm.controls).forEach(key => {
      this.markTouched(key);
    });

    if (this.registerForm.invalid) return;

    this.isLoading.set(true);

    // محاكاة لـ API Call
    setTimeout(() => {
      this.isLoading.set(false);
      console.log('Form Submitted Successfully!', this.registerForm.value);
      
      // مثال لعرض خطأ من الـ API لو السيرفر رفض التسجيل:
      // this.registerError.set('This email is already registered.');
    }, 1500);
  }
}
