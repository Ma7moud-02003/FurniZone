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
}  //  نتا عبيط يبني هو عايز القيمه  مشهتفرق  
// دا الايدي بتاع المنتج تمم   ليه بقا  حلووووووووووووووووووووووووووووووووووووووووووو اوي اجيبه 
// منين ونا برا ال ويشليست  يبني برا انا بعرض المنتجات 
// بشيل بالايدي بتاع الويش ليست 
//  عشان انا جوا عارض الويشليستس 
// بص الاندبوينت دي  انا بعرضها برا اه مفيشاش ام الايدي ال نتا طالبه  هااااااا انا ام اعمل اي بقا  ابعتلك اي من برا 
// يعم يحرق ام الكونسبت انا عايز ابعتلك الايدي بتاع المنتج ف كل حاله  عشان دا ال متاح معايا ف كل حاله  
//  ماشي يفنان بعد المتش بقا 
//  يبنني بعد المتش نشوف الدنيا  هرفع دلوفتي سلاااااااااااااااااااااااااااااااااااااام 