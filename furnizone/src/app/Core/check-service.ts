import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CheckService {
  private http=inject(HttpClient);

  postOrder():Observable<any>{
    return this.http.post(`${api}/Orders`,{});
  }

    postPaymentOrder(id:string):Observable<any>{
    return this.http.post(`${api}/Payments/order/${id}`,{});
  }

  getMyOrders(){
    return this.http.get(`${api}/Orders`)
  }
  getSingleOrder(id:string){
    return this.http.get(`${api}/Orders/${id}`);
  }

}
