

import { Component, computed, effect, inject, input, Input, OnInit, signal } from '@angular/core';
import { ProductDetailsService } from '../../Core/Services/product-details';
import { Subscription } from 'rxjs';
import { Product } from '../../Models/Product';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Cart } from '../../Core/Services/cart';
import { Alerts } from '../../Core/Services/alerts';
import { Reviews } from '../../Core/Services/reviews';
import { WishlistService } from '../../Core/Services/wishlist';
import { ProductCard } from '../Cards/product-card/product-card';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule,RouterModule,ProductCard],
  templateUrl: './product-details.html',
  styleUrl: './product-details.css',
})
export class ProductDetails implements OnInit {


  // ----- Input -----
  readonly id = input<string>();

    productsApi = inject(ProductDetailsService);
   private subs = new Subscription();
 
  // ----- Core state -----
   product = signal<Product | null>(null);
   isLoading = signal<boolean>(true);
   error = signal<string | null>(null);

  // ----- UI state -----
   quantity = signal<number>(1);
   isWishlisted = signal<boolean>(false);
   justAddedToCart = signal<boolean>(false);

  // ----- Derived state -----
  // بما أن الداتا تحتوي على صورة واحدة فقط كـ string، جعلنا الـ activeImage ترجع الـ imageUrl مباشرة
   activeImage = computed<string>(() => this.product()?.imageUrl ?? '');

// جوه كلاس الـ Component:
 private rev = inject(Reviews); // أو السيرفيس اللي فيها الدالة
// المتغيرات اللي هنربط بيها الـ Form (باستخدام Signals عشان الشغل المودرن)
 userRating = signal<number>(0);
 userComment = signal<string>('');
 isSubmittingReview = signal<boolean>(false);
   
  /** true = filled star. Floors the rating, so 4.8 renders as 4 filled + 1 empty */
   starRow = computed<boolean[]>(() => {
    const filled = Math.floor(this.product()?.averageRating ?? 0); // تعديل لـ averageRating
    return Array.from({ length: 5 }, (_, i) => i < filled);
  });

   formattedPrice = computed<string>(() =>
    (this.product()?.price ?? 0).toFixed(2)
  );

   formattedRating = computed<string>(() =>
    (this.product()?.averageRating ?? 0).toFixed(1) // تعديل لـ averageRating
  );

   canDecrement = computed<boolean>(() => this.quantity() > 1);

   canIncrement = computed<boolean>(() => {
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
   if (this.id()) {
    this.checkIfProductIsWishlisted(this.id()||'')
   }
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
  
    relatesProducts=signal<Product[]>([]);
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
          this.relatesProducts.set(data.data);
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

private readonly wishlistService = inject(WishlistService);

// 1. استدع دالة الفحص هذه عند جلب تفاصيل المنتج بنجاح (مثلاً داخل الـ ngOnInit أو بعد الـ fetch)
checkIfProductIsWishlisted(productId: string): void {
  console.log(productId);
  
  this.wishlistService.getMyFavourite().subscribe({
    next: (favorites: any) => {
      console.log(favorites);
      
      const items:any[]=favorites.data.items;
      // إذا وجدنا نفس الـ id في قائمة المفضلة، نجعله true، وإلا false
      const exists = items.some(item => item.productId=== productId);
      this.isWishlisted.set(exists);
    },
    error: () => this.isWishlisted.set(false)
  });
}

// 2. دالة الـ Toggle عند الضغط على زرار "Add to Wishlist" في ملف التفاصيل 🚀
toggleWishlist(): void {
  const product = this.product();
  if (!product) return;

  if (this.isWishlisted()) {
    // لو هو موجود فعلاً، نضغط عليه عشان نحذفه
    this.wishlistService.deleteOfWishList(product.id).subscribe({
      next: () => {
        this.isWishlisted.set(false);
        this.alerts.showSuccess('Removed from wishlist');
      }
    });
  } else {
    // لو مش موجود، نضغط عليه عشان نضيفه
    this.wishlistService.addToWishlist(product.id).subscribe({
      next: () => {
        this.isWishlisted.set(true);
        this.alerts.showSuccess('Added to wishlist');
      }
    });
  }
}

 cart = inject(Cart);
   alerts = inject(Alerts);
  
   private router=inject(Router);
  addToCart(id:string=this.id()||''): void {
    const product = this.product();
    if (!product) return;
    this.subs.add(
      this.cart.bottelInCart(id, this.quantity()).subscribe({
        next: (res) => {
          // تحديث السجنال: القيمة الحالية + الكمية الجديدة اللي اتمسكت من صفحة التفاصيل 🚀
          const updatedLength = this.cart.cartItemsLength() + this.quantity();
          this.cart.updateCartLength(updatedLength);

          // كود الألرت والأنيميشن الحالي بتاعك زي ما هو
          this.alerts.showSuccess('Product has been added to the cart');
          this.justAddedToCart.set(true);
          console.log('Add to cart success', { productId: product.id, quantity: this.quantity() });
       setTimeout(()=>{
        this.router.navigate(['/cart'])
       },600)
        },
        error: (err) => {
          console.error('Error adding to cart', err);
        }
      })
    );
  }



// دالة إرسال التقييم
submitReview(): void {
  const product = this.product();
  if (!product) return;

  if (this.userRating() === 0) {
    this.alerts.showWarning('Please select a star rating.');
    return;
  }

  if (!this.userComment().trim()) {
    this.alerts.showWarning('Please write a comment.');
    return;
  }

  this.isSubmittingReview.set(true);

  const reviewBody = {
    productId: product.id,
    rating: this.userRating(),
    comment: this.userComment().trim()
  };

  this.subs.add(
    this.rev.sendReviers(reviewBody).subscribe({
      next: (res) => {
        this.alerts.showSuccess('Thank you! Your review has been submitted.');
        
        // إعادة تصفير الفورم بعد النجاح
        this.userRating.set(0);
        this.userComment.set('');
        this.isSubmittingReview.set(false);
        this.fetchProductDetails(product.id); 
      }
    })
  );
}




}
