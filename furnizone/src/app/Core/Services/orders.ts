import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Orders {
  private http=inject(HttpClient);

  getMyOrders(){
    return this.http.get(`${api}/Orders`);
  }

}
