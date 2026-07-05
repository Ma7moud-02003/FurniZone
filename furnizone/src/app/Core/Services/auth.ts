import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { api } from '../../../environments/environment';
import { SignUpInterface } from '../../Models/signUp.Model';
import { LoginInterface } from '../../Models/login.Model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http=inject(HttpClient);
  public isLogged=signal<boolean>(false);
  constructor(){
    if(localStorage.getItem('token')!==null){
    this.isLogged.set(true);
    }else{
      console.log('not not');
      
    }
  }
signUp(signUpForm:SignUpInterface){
const{userName,email,password}=signUpForm;
console.log(signUpForm);
return this.http.post(`${api}/Auth/signup`,{userName,email,password});
 }

signIn(loginForm:LoginInterface){
  const {email,password}=loginForm;
return this.http.post(`${api}/Auth/signin`,{email,password});
  }
  getTokn(){  
    return localStorage.getItem('token');
  }

  private router=inject(Router);
  logOut(){
    this.isLogged.set(false);
    localStorage.removeItem('token');
    localStorage.removeItem('role');

this.router.navigate(['/login'])
return this.http.post(`${api}/Auth/logout`,null);
  }
}
