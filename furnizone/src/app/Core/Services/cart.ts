import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { api } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cart {
 private http = inject(HttpClient);
  
  // الـ Signal الحالي بتاعك
  cartItemsLength = signal<number>(0);

  constructor() {
    
  }

  // دالة مساعدة لتحديث قيمة الـ Signal والـ LocalStorage معاً
  updateCartLength(newLength: number) {
    this.cartItemsLength.set(newLength);
    localStorage.setItem('cartItemsLength', JSON.stringify(newLength));
  }

  bottelInCart(pdId: string, quantity: number): Observable<any> {
    return this.http.post(`${api}/Cart/items`, {
      productId: pdId,
      quantity: quantity
    });
  }

  getMyCart(): Observable<any> {
    return this.http.get(`${api}/Cart`);
  }

  editeCart(id: string, quantity: number): Observable<any> {
    return this.http.put(`${api}/Cart/items/${id}`, { quantity });
  }

  clearCart(): Observable<any> {
    return this.http.delete(`${api}/Cart`);
  }

  deleteItem(id: string): Observable<any> {
    return this.http.delete(`${api}/Cart/items/${id}`);
  }
  
}
