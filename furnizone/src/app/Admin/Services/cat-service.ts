import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { Category, CategoryPayload } from '../../Models/category.model';

@Injectable({
  providedIn: 'root',
})
export class CatService {
  
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${api}/Categories`;
 
  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(this.baseUrl);
  }
 
  addCategory(name: string): Observable<Category> {
    const payload: CategoryPayload = { name };
    return this.http.post<Category>(this.baseUrl, payload);
  }
 
  updateCategory(id: string, name: string): Observable<Category> {
    const payload: CategoryPayload = { name };
    return this.http.put<Category>(`${this.baseUrl}/${id}`, payload);
  }
  deleteCategory(id: string): Observable<Category> {
    return this.http.delete<Category>(`${this.baseUrl}/${id}`);
  }
}
