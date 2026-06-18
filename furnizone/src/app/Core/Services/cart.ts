import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Cart {
  private http=inject(HttpClient);

  bottelInCart(pdId:string,quantity:number):Observable<any>{
return this.http.post(`${api}/Cart/items`,{
  productId:pdId,quantity:quantity
})
  }

  getMyCart():Observable<any>{
    return this.http.get(`${api}/Cart`)
  }

  editeCart(id:string,quantity:number):Observable<any>{
return this.http.put(`${api}/Cart/items/${id}`,{quantity})
  }

  
}
