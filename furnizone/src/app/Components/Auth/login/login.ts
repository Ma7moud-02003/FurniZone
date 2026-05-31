import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [CommonModule, RouterLink, ReactiveFormsModule,FormsModule],
  templateUrl: './login.html',
})

  export class Login {
 showPassword = signal(false);
  isLoading = signal(false);
  loginError = signal('');
  
  private fb = inject(FormBuilder);
  
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false],
  });
 
  get email() {
    return this.loginForm.get('email')!;
  }
 
  get password() {
    return this.loginForm.get('password')!;
  }
 
  togglePassword() {
    this.showPassword.update(v => !v);
  }

  // استخدم getter عادية للخطأ بتعتمد على حالة الـ control والـ touched بتاعة أنجلر
  get emailError(): string {
    if (!this.email.touched && !this.email.dirty) return '';
    if (this.email.hasError('required')) return 'Email is required';
    if (this.email.hasError('email')) return 'Please enter a valid email address';
    return '';
  }
 
  get passwordError(): string {
    if (!this.password.touched && !this.password.dirty) return '';
    if (this.password.hasError('required')) return 'Password is required';
    if (this.password.hasError('minlength')) return 'Password must be at least 6 characters';
    return '';
  }
 
  onSubmit() {
    // بدل السجنال، بنخلي أنجلر يعلم على الفورم كلها إنها اتلمست لو داس Submit
    this.loginForm.markAllAsTouched();
    this.loginError.set('');
 
    if (this.loginForm.invalid) return;
 
    this.isLoading.set(true);
 
    setTimeout(() => {
      this.isLoading.set(false);
    }, 1500);
  }
}
