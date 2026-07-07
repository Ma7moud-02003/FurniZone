import { Component, inject, input, OnDestroy, OnInit, signal } from '@angular/core';
import { Product } from '../../../Models/product.Model';
import { Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { Cart } from '../../../Core/Services/cart';
import { Alerts } from '../../../Core/Services/alerts';
import { WishlistService } from '../../../Core/Services/wishlist';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-product-card',
  imports: [RouterModule,CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.css',
})
export class ProductCard implements OnInit,OnDestroy{
private cart = inject(Cart);  
  private alerts = inject(Alerts);
  private router = inject(Router);
  private wishlistService = inject(WishlistService);
  
  item = input.required<Product>();
  subs = new Subscription();
  favoriteProductIds = signal<string[]>([]);

  ngOnInit(): void {
    this.loadFavorites();
  }

  addToCart(id: string): void {
    this.subs.add(
      this.cart.bottelInCart(id, 1).subscribe({
        next: (res) => {
          this.alerts.showSuccess('Product has been added to the cart');
          setTimeout(() => {
            this.router.navigate(['/cart']);
          }, 600);
        },
        error: (err) => {
          console.error('Error adding to cart', err);
        }
      })
    );
  }

  loadFavorites() {
    this.subs.add(
      this.wishlistService.getMyFavourite().subscribe({
        next: (favorites: any) => {
          const items: any[] = favorites?.data?.items || [];
          const ids = items.map(item => item.productId);
          this.favoriteProductIds.set(ids);
        }
      })
    );
  }

  checkIfProductIsWishlisted(productId: string): boolean {
    return this.favoriteProductIds().includes(productId);
  }

  toggleWishlist(id: string): void {
    const currentIds = this.favoriteProductIds();

    if (currentIds.includes(id)) {
      this.favoriteProductIds.set(currentIds.filter(favId => favId !== id));
      
      this.subs.add(
        this.wishlistService.deleteOfWishList(id).subscribe({
          next: () => {
            this.alerts.showSuccess('Removed from wishlist');
          },
          error: () => {
            this.favoriteProductIds.set(currentIds);
          }
        })
      );
    } else {
      this.favoriteProductIds.set([...currentIds, id]);
    console.log(id);
    
      this.subs.add(
        this.wishlistService.addToWishlist(id).subscribe({
          next: () => {
            this.alerts.showSuccess('Added to wishlist');
          },
          error: () => {
            this.favoriteProductIds.set(currentIds);
          }
        })
      );
    }
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}