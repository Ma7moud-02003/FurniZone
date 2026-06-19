import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { api } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Reviews {
  private http = inject(HttpClient);
sendReviers(review:any):Observable<any>{
return this.http.post(`${api}/Reviews`,{...review});
  }
  editeRev(revId:string,review:any):Observable<any>{

return this.http.put(`${api}/Reviews/${revId}`,{...review});
  }

   deleteRev(revId:string):Observable<any>{

return this.http.delete(`${api}/Reviews/${revId}`);
  }

  getMyRev():Observable<any>{
    return this.http.get(`${api}/Reviews/my-reviews`)
  }



}
