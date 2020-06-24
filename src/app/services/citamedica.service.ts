import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceBase } from './serviceBase';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CitamedicaService extends ServiceBase {

  constructor(public http: HttpClient) {
    super();
  }

  // Metodos
  turnos(params?: any): Observable<any> {
    return this.getQuery('osi/citamedica/medico/disponibilidad', params).pipe(
      map(data => {
        return data.data;
      }));
  }

  CreatePagar(objeto) {
    return this.postQuery('osi/citamedica/pagar', objeto).pipe(
      map(data => {
        return data;
      })
    );
  }
}
