import { Routes } from '@angular/router';
import { authGuard } from './Guards/auth-guard-guard';
import { AdminLayout } from './Admin/admin-layout/admin-layout';
import { adminGuard } from './Admin/Guards/admin.guard';

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
         path: 'myRev', canActivate:[authGuard],
        loadComponent: () => import('./Components/my-rev/my-rev').then(m => m.MyRev)
    },
     {
         path: 'checkout', canActivate:[authGuard],
        loadComponent: () => import('./Components/checkout/checkout').then(m => m.Checkout)
    },
     {
         path: 'my-orders', canActivate:[authGuard],
        loadComponent: () => import('./Components/my-orders/my-orders').then(m => m.MyOrders)
    },
   
     {
         path: 'catogs', canActivate:[authGuard],
        loadComponent: () => import('./Components/catogs/catogs').then(m => m.Catogs)
    },
   // admin
  {  
    path: 'admin',
    component:AdminLayout,
    canActivate:[adminGuard],
    children: [
      { path: '', redirectTo: 'categories', pathMatch: 'full' },
 
      {
        path: 'categories',
        loadComponent: () =>
          import('./Admin/catogs/catogs').then((m) => m.Catogs),
        
      },
        {
        path: 'orders',
        loadComponent: () =>
          import('./Admin/orders/orders').then((m) => m.Orders),
        
      },
 
    
    ],
  },
    
]