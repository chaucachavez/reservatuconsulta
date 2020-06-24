import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceBase } from './serviceBase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SedeService extends ServiceBase {

  constructor(public http: HttpClient) {
    super();
  }

  // Metodos
  index(params?: any): Observable<any> {
    return this.getQuery('osi/sede', params).pipe(
      map(data => {
        return data.data;
      }));
  }

  show(id: string, params?: any): Observable<any> {
    return this.getQuery(`osi/sede/${id}`, params);
  }

}
