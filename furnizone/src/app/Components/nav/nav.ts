import { CommonModule } from '@angular/common';
import { Component, computed, HostListener, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Auth } from '../../Core/Services/auth';
import { Cart } from '../../Core/Services/cart';
import { ProductsService } from '../../Core/Services/products-service';
import { Product } from '../../Models/product.Model';

@Component({
  selector: 'app-nav',
  imports: [CommonModule,RouterModule],
  templateUrl: './nav.html',
 
})
export class Nav implements OnInit{



 isProfileMenuOpen = signal<boolean>(false);
  isMenuOpen = signal(false);
  isScrolled = signal(false);
  

  
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
 
 private productService=inject(ProductsService)
  searchQuery = signal<string>('');
  searchResults = signal<Product[]>([]);
  isSearching = signal<boolean>(false);
  onSearch(event: Event) {
    const input = event.target as HTMLInputElement;
    const value = input.value.trim();
    this.searchQuery.set(value);
    if (!value) {
      this.searchResults.set([]);
      return;
    }

    this.isSearching.set(true);
    this.productService.searchProducts(value, 1, 10).subscribe({
      next: (res: any) => {
        console.log(res);
        const data=res.data.data;
        this.searchResults.set(data); 
        this.isSearching.set(false);
      },
      error: () => {
        this.isSearching.set(false);
      }
    });
  }

  clearSearch() {
    this.searchQuery.set('');
    this.searchResults.set([]);
  }

  logOut(){
    this.auth.logOut();
  }
}
