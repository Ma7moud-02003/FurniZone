import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { CategoriesApiResponse } from '../../Models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private http = inject(HttpClient);

  getCategories() {
    return this.http.get<CategoriesApiResponse>(`${api}/Categories`);
  }
}