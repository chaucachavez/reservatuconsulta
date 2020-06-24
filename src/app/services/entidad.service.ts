import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceBase } from './serviceBase';
import { map } from 'rxjs/operators';
import { Utils } from './utils';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EntidadService extends ServiceBase {

  token: string;
  usuario: any;
  settings: any;
  modulos: any[] = [];
  sedes: any[] = [];
  sedeDefault: any;

  reservacion: any = {
    pagado: null,
    idsede: null,
    nombresede: null,
    preciocm: null,
    fecha: null,
    hora: null,
    user_message: null,
    filenamepdf: null
  };

  constructor(
    public http: HttpClient,
    private utils: Utils
  ) {
    super();
    this.cargarStorage();
  }

  estaLogueado(): boolean {
    this.cargarStorage();
    return (this.token.length > 5) ? true : false;
  }

  authenticate(objeto: any): Observable<any> {
    return this.postQuery(`osi/authenticate`, objeto).pipe(
      map(data => {
        if (data.type === 'success') {
          const user = {
            id: data.data.entidad.identidad,
            name: data.data.entidad.nombres,
            email: null,
            idempresa: null,
            imgperfil: data.data.entidad.imgperfil,
            apellidos: data.data.entidad.apellidos
          };

          const reservacion = {
            pagado: null,
            idsede: null,
            nombresede: null,
            preciocm: null,
            fecha: null,
            hora: null,
            user_message: null,
            filenamepdf: null
          };

          localStorage.setItem('tokenPF', data.data.token);
          localStorage.setItem('usuarioPF', JSON.stringify(user));

          localStorage.setItem('reservacionPF', JSON.stringify(reservacion));
          this.cargarStorage();
        }

        return data;
      })
    );
  }

  cargarStorage(): void {
    if (localStorage.getItem('tokenPF')) {
      this.token = localStorage.getItem('tokenPF');
      this.usuario = JSON.parse(localStorage.getItem('usuarioPF'));
      // this.settings = JSON.parse(localStorage.getItem('settingsPF'));
      // this.modulos = JSON.parse(localStorage.getItem('modulosPF'));
      // this.sedes = JSON.parse(localStorage.getItem('sedesPF'));
      // this.sedeDefault = parseInt(localStorage.getItem('sedeDefaultPF'), 10);
      this.reservacion = JSON.parse(localStorage.getItem('reservacionPF'));
    } else {
      this.token = '';
      this.usuario = null;
      this.reservacion = {
        pagado: null,
        idsede: null,
        nombresede: null,
        preciocm: null,
        fecha: null,
        hora: null,
        user_message: null,
        filenamepdf: null
      };
      // this.settings = null;
      // this.modulos = [];
      // this.sedes = [];
      // this.sedeDefault = null;
    }
  }

  refreshToken(token: string): void {
    localStorage.setItem('tokenPF', token);
    this.token = localStorage.getItem('tokenPF');
  }

  saveReservacion() {
    localStorage.setItem('reservacionPF', JSON.stringify(this.reservacion));
  }

  createPaciente(objeto) {
    return this.postQuery('osi/entidad/paciente', objeto).pipe(
      map(data => {
        return data;
      })
    );
  }

  recoveryPassword(objeto) {
    return this.postQuery('osi/entidad/recovery', objeto).pipe(
      map(data => {
        return data;
      })
    );
  }

  guardarStorage(id: string, token: string, usuario: any, modulos?: any[]): void {
    // localStorage.setItem('id', id);
    localStorage.setItem('tokenPF', token);
    localStorage.setItem('usuarioPF', JSON.stringify(usuario));

    if (modulos) {
      localStorage.setItem('modulosPF', JSON.stringify(modulos));
    }

    this.token = token;
    this.usuario = usuario;

    if (modulos) {
      this.modulos = modulos;
    }
  }

  logout(): Observable<any> {
    return this.postQuery('logout').pipe(
      map(data => {
        this.token = '';
        this.usuario = null;
        localStorage.removeItem('tokenPF');
        localStorage.removeItem('usuarioPF');
        localStorage.removeItem('reservacionPF');
      })
    );
  }

  clearStorage(): void {
    console.log('CLEAR storage y propiedades');

    this.token = '';
    this.usuario = null;
    this.settings = null;
    this.modulos = [];
    this.sedes = [];
    this.sedeDefault = null;
    // localStorage.removeItem('id');
    localStorage.removeItem('tokenPF');
    localStorage.removeItem('usuarioPF');
    localStorage.removeItem('settingsPF');
    localStorage.removeItem('modulosPF');
    localStorage.removeItem('sedesPF');
    localStorage.removeItem('sedeDefaultPF');
  }

  updateImgPerfil(imgperfil): void {
    this.usuario.imgperfil = imgperfil;
    console.log(this.usuario.id, this.token, this.usuario);
    this.guardarStorage(this.usuario.id, this.token, this.usuario);
  }

  empresaToken(objeto: any): Observable<any> {
    return this.postQuery('empresatoken', objeto).pipe(
      map(data => {
        return data.data;
      })
    );
  }

  verify(token: string): Observable<any> {
    return this.getQuery('users/verify/' + token).pipe(
      map(data => {
        return data.data;
      })
    );
  }

  forgot(objeto: any): Observable<any> {
    return this.postQuery('users/forgot', objeto).pipe(
      map(data => {
        return data.data;
      })
    );
  }

  reset(token: string, objeto: any): Observable<any> {
    return this.postQuery('users/reset/' + token, objeto).pipe(
      map(data => {
        return data.data;
      })
    );
  }

  me(token: string): Observable<any> {
    return this.getQuery(`users/me/${token}`).pipe(
      map(data => {
        return data.data;
      })
    );
  }

  meUpdate(token: string, objeto: any): Observable<any> {
    return this.postQuery(`users/me/${token}/update`, objeto).pipe(
      map(data => {
        return data.data;
      })
    );
  }
}
