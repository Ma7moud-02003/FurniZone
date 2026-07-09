import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../Core/Services/auth';
import { Cart } from '../../Core/Services/cart';

@Component({
  selector: 'app-nav',
  imports: [CommonModule,RouterModule],
  templateUrl: './nav.html',
 
})
export class Nav implements OnInit{


// حقن السيرفيس الخاصة بالسلة
  private cartService = inject(Cart);

  // عمل اسم مختصر للـ Signal لسهولة الاستخدام في الـ HTML
  readonly cartCount = this.cartService.cartItemsLength;
  
 isProfileMenuOpen = signal<boolean>(false);
  isMenuOpen = signal(false);
  isScrolled = signal(false);
  searchQuery = signal('');

  wishlistCount = signal(5);
   ngOnInit(): void {
     console.log(this.isLogged());
     this.isLogged=this.auth.isLogged;
   }
  private auth=inject(Auth);
  isLogged=signal<boolean>(false);
 
  navLinks = signal([
    { label: 'Home', path: '/home' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/catogs' },
  ]);
 
  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 10);
  }
 
  toggleMenu() {
    this.isMenuOpen.update(v => !v);
  }
 
  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.searchQuery.set(value);
  }

  logOut(){
  
    this.auth.logOut();
  }
}
