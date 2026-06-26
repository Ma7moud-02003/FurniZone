import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { AbstractControl, FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../Core/Services/auth';
import { Subscription } from 'rxjs';
import { LoginInterface } from '../../../Models/login.Model';
import { Alerts } from '../../../Core/Services/alerts';

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
    rememberMe:['']
    
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

  
  private auth=inject(Auth);
  private rout=inject(Router);
  private subs=new Subscription();
  private alerts=inject(Alerts);
  onSubmit() {
    // بدل السجنال، بنخلي أنجلر يعلم على الفورم كلها إنها اتلمست لو داس Submit
    this.loginForm.markAllAsTouched();
    this.loginError.set('');
    if (this.loginForm.invalid) return;
    this.isLoading.set(true);
    this.subs.add(
      this.auth.signIn(this.loginForm.value as LoginInterface).subscribe({
        next:(res:any)=>{
        console.log(res);
        this.alerts.showSuccess('تم تسجيل دخولك بنجاح');
        const token=res.data.token;
          localStorage.setItem('token',token);
        this.auth.isLogged.set(true);
      this.rout.navigate(['/home'])
        },error:()=>{
          
          this.isLoading.set(false);
        }
      })
    )
 
  }
}
