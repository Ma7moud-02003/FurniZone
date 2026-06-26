import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Alerts } from '../../Core/Services/alerts';
import { Subscription } from 'rxjs';
import { CheckService } from '../../Core/check-service';

@Component({
  selector: 'app-checkout',
  imports: [],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout {

private router = inject(Router);
  private ordersService = inject(CheckService);
  private alerts = inject(Alerts);
  private subs = new Subscription();

  // السجنالز بتاعتك زي ما هي
   fullName = signal<string>('');
   email = signal<string>('');
   phone = signal<string>('');
   streetAddress = signal<string>('');
   city = signal<string>('');
   postalCode = signal<string>('');
   isProcessing = signal<boolean>(false);

   checkoutItems = signal<any[]>([]);
   subtotal = signal<number>(0);
   shipping = signal<number>(0);
   tax = signal<number>(0);
   total = signal<number>(0);
   totalItems = signal<number>(0);

  // 1. انقل جلب الـ state هنا جوه الـ constructor 🚀
  constructor() {
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      items: any[];
      subtotal: number;
      shipping: number;
      tax: number;
      total: number;
      totalItems: number;
    };

    // تعبئة السجنالز بالداتا لو موجودة
    if (state && state.items) {
      this.checkoutItems.set(state.items);
      this.subtotal.set(state.subtotal);
      this.shipping.set(state.shipping);
      this.tax.set(state.tax);
      this.total.set(state.total);
      this.totalItems.set(state.totalItems);
    }
  }

  // 2. جوه الـ ngOnInit سيب التشيك والحماية فقط
  ngOnInit(): void {
    if (this.checkoutItems().length === 0) {
      this.alerts.showWarning('Your checkout session has expired or cart is empty.');
      this.router.navigate(['/cart']);
    }
  }

  // دالة زرار Place Order
  handlePlaceOrder(): void {
    this.isProcessing.set(true);
    // 3. إنشاء الطلب الأساسي
    this.subs.add(
      this.ordersService.postOrder().subscribe({
        next: (orderRes) => {
          const newOrderId = orderRes?.id || orderRes?.data?.id;
          if (newOrderId) {
            // 4. لو الطلب نجع، بنعمل الدفع فوراً بـ ID الطلب المرتجع
            this.processPayment(newOrderId);
          } else {
            this.alerts.showError('Could not retrieve Order ID.');
            this.isProcessing.set(false);
          }
        },
        error: () => {
          this.alerts.showError('Failed to place order.');
          this.isProcessing.set(false);
        }
      })
    );
  }

  private processPayment(orderId: string): void {
    this.subs.add(
      this.ordersService.postPaymentOrder(orderId).subscribe({
        next: () => {
          this.alerts.showSuccess('Order placed and payment successful! 🎉');
          this.isProcessing.set(false);
         setTimeout(() => {
           this.router.navigate(['/my-orders']); 
         }, 400);// توجهه لصفحة طلباته
        },
        error: () => {
          this.alerts.showError('Payment simulation failed.');
          this.isProcessing.set(false);
        }
      })
    );
  }

  placeOrder(){
    this.subs.add(
      this.ordersService.postOrder().subscribe({
        next:()=>{
          console.log('done');
          this.alerts.showSuccess('Order has delivered successfully');
          
        }
      })
    )
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
