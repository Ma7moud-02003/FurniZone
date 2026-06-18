import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { Cart } from '../../Core/Services/cart';
import { Subscription } from 'rxjs';
import { CartItem } from '../../Models/Cart';
import { CommonModule } from '@angular/common';
const TAX_RATE = 0.08; // 8 %
@Component({
  selector: 'app-my-cart',
  imports: [CommonModule],
  templateUrl: './my-cart.html',
  styleUrl: './my-cart.css',
})
export class MyCart implements OnInit , OnDestroy{
private readonly cart = inject(Cart);
  private readonly subs = new Subscription();

  // ── Core state ──────────────────────────────────────────────
  readonly cartId = signal<string | null>(null);
  readonly cartItems = signal<CartItem[]>([]);
  readonly isLoading = signal<boolean>(true);
  readonly error = signal<string | null>(null);
  readonly clearConfirm = signal<boolean>(false);

  // ── Derived / computed ───────────────────────────────────────
  readonly isEmpty = computed<boolean>(() => this.cartItems().length === 0);

  readonly subtotal = computed<number>(() =>
    this.cartItems().reduce(
      (acc, item) => acc + item.productPrice * item.quantity,
      0
    )
  );

  readonly tax = computed<number>(() =>
    parseFloat((this.subtotal() * TAX_RATE).toFixed(2))
  );

  readonly total = computed<number>(() =>
    parseFloat((this.subtotal() + this.tax()).toFixed(2))
  );

  readonly totalItemCount = computed<number>(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantity, 0)
  );

  // ── Lifecycle ────────────────────────────────────────────────
  ngOnInit(): void {
    this.loadCart();
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  // ── Data fetching ────────────────────────────────────────────
  loadCart(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.subs.add(
      this.cart.getMyCart().subscribe({
        next: (res) => {
          const data=res.data;
          this.cartId.set(data.id);
          this.cartItems.set(data.items ?? []);
          this.isLoading.set(false);
        },
        error: () => {
          this.error.set('Failed to load your cart. Please try again.');
          this.isLoading.set(false);
        },
      })
    );
  }

  // ── Quantity controls ─────────────────────────────────────────
  increment(itemId: string,quantity:number): void {
    this.cartItems.update((items) =>
      items.map((item) =>
        item.id === itemId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
    const newQ=quantity+1;
    TODO: this.subs.add(this.cart.editeCart(itemId, newQ).subscribe({
      next:()=>{
        console.log('updated');
        
      }
    })
  )
  }

  decrement(itemId: string): void {
    const item = this.cartItems().find((i) => i.id === itemId);
    if (!item) return;
    if (item.quantity <= 1) {
      this.removeItem(itemId);
      return;
    }
    this.cartItems.update((items) =>
      items.map((i) =>
        i.id === itemId ? { ...i, quantity: i.quantity - 1 } : i
      )
    );
    // TODO: this.cart.updateQuantity(itemId, newQty).subscribe()
  }

  // ── Remove / clear ────────────────────────────────────────────
  removeItem(itemId: string): void {
    this.cartItems.update((items) => items.filter((i) => i.id !== itemId));
    // TODO: this.cart.removeItem(itemId).subscribe()
  }

  clearCart(): void {
    if (!this.clearConfirm()) {
      this.clearConfirm.set(true);
      setTimeout(() => this.clearConfirm.set(false), 3000);
      return;
    }
    this.cartItems.set([]);
    this.clearConfirm.set(false);
    // TODO: this.cart.clearCart().subscribe()
  }

  // ── Formatting helpers ────────────────────────────────────────
  fmt(value: number): string {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }
}
