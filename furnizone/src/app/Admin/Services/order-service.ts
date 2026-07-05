import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { OrderFilters, OrderStatus, PagedResult, UpdateOrderStatusPayload } from '../Models/order.model';
import { Observable } from 'rxjs';
import { Order } from '../../Models/Order';


@Injectable({
  providedIn: 'root',
})
export class OrderService {
  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${api}/Orders`;
 
  getOrders(filters: OrderFilters): Observable<PagedResult<Order>> {
    let params = new HttpParams()
      .set('PageNumber', filters.pageNumber)
      .set('PageSize', filters.pageSize);
 
    if (filters.status !== null) {
      params = params.set('Status', filters.status);
    }
    if (filters.userId.trim()) {
      params = params.set('UserId', filters.userId.trim());
    }
    if (filters.fromDate) {
      params = params.set('FromDate', filters.fromDate);
    }
    if (filters.toDate) {
      params = params.set('ToDate', filters.toDate);
    }
    if (filters.sortBy.trim()) {
      params = params.set('SortBy', filters.sortBy.trim());
    }
    if (filters.sortDescending) {
      params = params.set('SortDescending', filters.sortDescending);
    }
 
    return this.http.get<PagedResult<Order>>(`${this.baseUrl}/all`, { params });
  }
 
  updateOrderStatus(id: string, status: OrderStatus): Observable<void> {
    const payload: UpdateOrderStatusPayload = { status };
    return this.http.put<void>(`${this.baseUrl}/${id}/status`, payload);
  }
}
