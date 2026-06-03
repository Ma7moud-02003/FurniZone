import { CommonModule } from '@angular/common';
import { Component, HostListener, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-nav',
  imports: [CommonModule,RouterModule],
  templateUrl: './nav.html',
 
})
export class Nav {
    isMenuOpen = signal(false);
  isScrolled = signal(false);
  searchQuery = signal('');
  cartCount = signal(3);
  wishlistCount = signal(5);
 
  navLinks = signal([
    { label: 'Home', path: '/home' },
    { label: 'Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
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
}
