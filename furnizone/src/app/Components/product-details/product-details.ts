

import { Component, computed, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { ProductDetailsService } from '../../Core/Services/product-details';
import { Subscription } from 'rxjs';
import { Product } from '../../Models/Product';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Cart } from '../../Core/Services/cart';
import { Alerts } from '../../Core/Services/alerts';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,RouterModule],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {


  // ----- Input -----
  readonly id = input<string>();

  private readonly productsApi = inject(ProductDetailsService);
  private readonly subs = new Subscription();

  // ----- Core state -----
  readonly product = signal<Product | null>(null);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);

  // ----- UI state -----
  readonly quantity = signal<number>(1);
  readonly isWishlisted = signal<boolean>(false);
  readonly justAddedToCart = signal<boolean>(false);

  // ----- Derived state -----
  // بما أن الداتا تحتوي على صورة واحدة فقط كـ string، جعلنا الـ activeImage ترجع الـ imageUrl مباشرة
  readonly activeImage = computed<string>(() => this.product()?.imageUrl ?? '');

  /** true = filled star. Floors the rating, so 4.8 renders as 4 filled + 1 empty */
  readonly starRow = computed<boolean[]>(() => {
    const filled = Math.floor(this.product()?.averageRating ?? 0); // تعديل لـ averageRating
    return Array.from({ length: 5 }, (_, i) => i < filled);
  });

  readonly formattedPrice = computed<string>(() =>
    (this.product()?.price ?? 0).toFixed(2)
  );

  readonly formattedRating = computed<string>(() =>
    (this.product()?.averageRating ?? 0).toFixed(1) // تعديل لـ averageRating
  );

  readonly canDecrement = computed<boolean>(() => this.quantity() > 1);

  readonly canIncrement = computed<boolean>(() => {
    const stock = this.product()?.stock; // تعديل لـ stock
    return stock == null ? true : this.quantity() < stock;
  });

  constructor() {
    // Refetch whenever `id` changes
    effect(() => {
      console.log(this.id());
      const productId = this.id();
      if (productId) {
        this.fetchProductDetails(productId);
      }
    });

  }

    ngOnInit(): void {
   
    }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  fetchProductDetails(productId: string): void {
    this.isLoading.set(true);
    this.error.set(null);
    console.log('Fetching product details...');

    this.subs.add(
      this.productsApi.getProductDetails(productId).subscribe({
        next: (res: any) => {
          console.log(res);
          const data = res.data;
          this.product.set(data as Product);
          this.fetchRelatingProducts()
          this.quantity.set(1);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('We couldn’t load this product. Please try again.');
          this.isLoading.set(false);
        },
      })
    );
  }
  
    relatesProducts=signal<any[]>([]);
    fetchRelatingProducts(): void {
    this.isLoading.set(true);
    this.error.set(null);
    console.log('Fetching product details...');
      console.log(this.product()?.categoryId);
   
   if(this.id()){
     this.subs.add(
      this.productsApi.getRelateProducts(this.product()?.categoryId||'').subscribe({
        next: (res: any) => {
          console.log('related',res);
          const data = res.data;
          this.relatesProducts.set(data.dataq);
          console.log(this.relatesProducts());
          
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('We couldn’t load this product. Please try again.');
          this.isLoading.set(false);
        },
      })
    );
   }
  }

  retry(): void {
   
    this.fetchProductDetails(this.id()||'');
  }

  increment(): void {
    if (this.canIncrement()) this.quantity.update((q) => q + 1);
  }

  decrement(): void {
    if (this.canDecrement()) this.quantity.update((q) => q - 1);
  }

  onQuantityInput(event: Event): void {
    const raw = Number((event.target as HTMLInputElement).value);
    if (!Number.isFinite(raw)) return;
    const max = this.product()?.stock ?? Infinity; // تعديل لـ stock
    this.quantity.set(Math.min(Math.max(1, Math.trunc(raw)), max));
  }

  toggleWishlist(): void {
    this.isWishlisted.update((v) => !v);
  }

  private cart=inject(Cart);
  private alerts=inject(Alerts);
  addToCart(): void {
    const product = this.product();
    if (!product) return;
this.subs.add(
  this.cart.bottelInCart(product.id,this.quantity()).subscribe({
    next:()=>{
this.alerts.showSuccess('Product has been added to the cart');
this.justAddedToCart.set(true);
   console.log('Add to cart', { productId: product.id, quantity: this.quantity() });
    }
  })
)
}
}
