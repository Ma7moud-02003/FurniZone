import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { ApiResponse } from '../../Models/product.Model';

export interface ProductFilters {
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private http = inject(HttpClient);

  getProducts(filters: ProductFilters = {}) {
    let params = new URLSearchParams();

    if (filters.categoryId) params.set('CategoryId', filters.categoryId);
    if (filters.minPrice != null) params.set('MinPrice', filters.minPrice.toString());
    if (filters.maxPrice != null) params.set('MaxPrice', filters.maxPrice.toString());
    if (filters.searchTerm) params.set('SearchTerm', filters.searchTerm);
    if (filters.sortBy) params.set('SortBy', filters.sortBy);
    if (filters.sortDescending != null) params.set('SortDescending', filters.sortDescending.toString());
    params.set('PageNumber', (filters.pageNumber ?? 1).toString());
    params.set('PageSize', (filters.pageSize ?? 8).toString());

    return this.http.get<ApiResponse>(`${api}/Products?${params.toString()}`);
  }

  getProductById(id: string) {
    return this.http.get<any>(`${api}/Products/${id}`);
  }
}