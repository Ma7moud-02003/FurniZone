import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
    private http = inject(HttpClient);

addToWishlist(productId:string):Observable<any>{
return this.http.post(`${api}/Wishlist/items`,{productId});
  }

  getMyFavourite():Observable<any>{
    return this.http.get(`${api}/Wishlist`);
  }
deleteOfWishList(id: string): Observable<any> {  // دا ام ال الايدي بتاع المنتج 
  console.log(id); 
  
  return this.http.delete(`${api}/Wishlist/items/${id}`); 
}
}  