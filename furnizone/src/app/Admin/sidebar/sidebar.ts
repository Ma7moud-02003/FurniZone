import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
interface NavItem {
  label: string;
  route: string;
  icon: string;
}
@Component({
  selector: 'app-sidebar',
  imports: [CommonModule,RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
   navItems: NavItem[] = [
 
    {
      label: 'Categories',
      route: '/admin/categories',
      icon: 'M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5',
    },
    {
      label: 'Products',
      route: '/admin/products',
      icon: 'M20.25 7.5l-.625 10.632a2.25 2.25 0 01-2.247 2.118H6.622a2.25 2.25 0 01-2.247-2.118L3.75 7.5m8.25-3v3m-3.75 0V6.108c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V7.5M3.375 7.5h17.25',
    },
    {
      label: 'Orders',
      route: '/admin/orders',
      icon: 'M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z',
    },
  ];
}
