import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path:'',redirectTo:'login',pathMatch:'full'
    },
     {
        path:'login',
              loadComponent:()=>import('./Components/Auth/login/login').then(m=>m.Login)

    },
     {
        path:'register',
        loadComponent:()=>import('./Components/Auth/register/register').then(m=>m.Register)
    },
     {
        path:'home',
        loadComponent:()=>import('./Components/home/home').then(m=>m.Home)
    }
];