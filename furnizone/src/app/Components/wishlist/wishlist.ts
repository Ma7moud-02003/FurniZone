import { Component, inject, signal } from '@angular/core';
import { Cart } from '../../Core/Services/cart';
import { Alerts } from '../../Core/Services/alerts';
import { WishlistService } from '../../Core/Services/wishlist';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { WishlistItem } from '../../Models/WishList';

@Component({
  selector: 'app-wishlist',
  imports: [CommonModule,FormsModule],
  templateUrl: './wishlist.html',
  styleUrl: './wishlist.css',
})
export class Wishlist {
 private readonly wishlistService = inject(WishlistService);
  private readonly cartService = inject(Cart);
  private readonly alerts = inject(Alerts);

  // مصفوفة العناصر المفضلة
  readonly favoriteItems = signal<WishlistItem[]>([]);
  readonly isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.loadFavorites();
  }

loadFavorites(): void {
  this.wishlistService.getMyFavourite().subscribe({
    next: (res) => {
      const data=res.data.items;
      // التأكد أن الداتا تم تخزينها كمصفوفة دائماً لتجنب خطأ الـ iterator
      if (Array.isArray(data)) {
        
        this.favoriteItems.set(data);
      } else if (data) {
        this.favoriteItems.set([data]); // لو راجع كائن واحد حوله لمصفوفة
      }
      this.isLoading.set(false);
    },
    error: (err) => {
      this.alerts.showError('Failed to load wishlist');
      this.isLoading.set(false);
    }
  });
}

  // حذف منتج من المفضلة
  removeItem(id: string): void {
    this.wishlistService.deleteOfWishList(id).subscribe({
      next: () => {
        // تحديث المصفوفة محلياً فوراً لحذف الكارت من الـ UI بدون ريفريش
        this.favoriteItems.update(items => items.filter(item => item.id !== id));
        this.alerts.showSuccess('Removed from wishlist');
      }
    });
  }

 addToCart(item: any): void {
  // استخدمنا هنا item.productId بناءً على الداتا بتاعتك 🚀
  this.cartService.bottelInCart(item.productId, 1).subscribe({
    next: () => {
      const updatedLength = this.cartService.cartItemsLength() + 1;
      this.cartService.updateCartLength(updatedLength);
      this.alerts.showSuccess('Product added to cart');
    }
  });
}
}
