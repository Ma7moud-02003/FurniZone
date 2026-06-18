import { Routes } from '@angular/router';

export const routes: Routes = [

    // Auth
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
    
    // Hoooooom
     {
        path:'home',
        loadComponent:()=>import('./Components/home/home').then(m=>m.Home)
    },

    // Products
    {
        path:'pd_details/:id',
        loadComponent:()=>import('./Components/product-details/product-details').then(m=>m.ProductDetails)
    },
     {
        path:'cart',
        loadComponent:()=>import('./Components/my-cart/my-cart').then(m=>m.MyCart)
    },


];