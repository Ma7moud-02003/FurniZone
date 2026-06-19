import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth-guard-guard';

export const routes: Routes = [

    // Auth
    {
        path: '', redirectTo: 'login', pathMatch: 'full'
    },
    {
        path: 'login',
        
         loadComponent: () => import('./Components/Auth/login/login').then(m => m.Login)

    },
     {
        path:'register',
        loadComponent:()=>import('./Components/Auth/register/register').then(m=>m.Register)
    },
     {
        path:'home',
        loadComponent:()=>import('./Components/home/home').then(m=>m.Home)
    },
     {
        path: 'products', canActivate:[authGuard],
        loadComponent: () => import('./Components/products/products').then(m => m.Products)
    },
    {
         path: 'pd_details/:id', canActivate:[authGuard],
        loadComponent: () => import('./Components/product-details/product-details').then(m => m.ProductDetails)
    },
      {
         path: 'cart',canActivate:[authGuard],
        loadComponent: () => import('./Components/my-cart/my-cart').then(m => m.MyCart)
    },
     {
         path: 'wishlist', canActivate:[authGuard],
        loadComponent: () => import('./Components/wishlist/wishlist').then(m => m.Wishlist)
    },
     {
         path: 'myRevs', canActivate:[authGuard],
        loadComponent: () => import('./Components/my-rev/my-rev').then(m => m.MyRev)
    },
     {
         path: 'checkout', canActivate:[authGuard],
        loadComponent: () => import('./Components/checkout/checkout').then(m => m.Checkout)
    },
    
];