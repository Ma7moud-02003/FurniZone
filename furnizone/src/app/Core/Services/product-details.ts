import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductDetailsService
 {
  private http=inject(HttpClient);
  getProductDetails(id:string){
return this.http.get(`${api}/Products/${id}`);
  }

 getRelateProducts(categoryId: string) {
  return this.http.get(`${api}/Products?CategoryId=${categoryId}`);
}

  getAllProducts(){
   return this.http.get(`${api}/Products`);
  }
}
