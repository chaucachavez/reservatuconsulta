import { HttpHeaders, HttpParams } from '@angular/common/http';
import { URL_SERVICIOS } from '../config/config';
import { Observable } from 'rxjs';

export class ServiceBase {

    public url = URL_SERVICIOS;
    public token = '';
    public http;

    constructor() {

    }

    getQuery(query: string, param?: any): Observable<any> {

        let token = '';
        if (localStorage.getItem('tokenPF')) {
            token = localStorage.getItem('tokenPF');
        }

        const headers = new HttpHeaders({
            Authorization: token
        });

        let params = new HttpParams();

        if (param) {
            for (let i in param) {
                params = params.append(i, String(param[i]));
            }
        }

        return this.http.get(`${this.url}/${query}`, { headers, params });
    }

    postQuery(query: string, object?: any): Observable<any> {

        let headers = new HttpHeaders({
            // Authorization: token,
            'Content-Type': 'application/json'
        });

        let token = null;
        if (localStorage.getItem('tokenPF')) {
            token = localStorage.getItem('tokenPF');
            headers = headers.set('AuthorizationToken', token);
            headers = headers.set('Authorization', token);
        }

        return this.http.post(`${this.url}/${query}`, object, { headers });
    }

    getDownloadProxy(query: string, object?: any): Observable<any> {
        const headers = new HttpHeaders();
        return this.http.get(`${query}`, { headers, responseType: 'blob' });
    }

    putQuery(query: string, object?: any): Observable<any> {

        let token = '';
        if (localStorage.getItem('tokenPF')) {
            token = localStorage.getItem('tokenPF');
        }

        const headers = new HttpHeaders({
            Authorization: token,
            'Content-Type': 'application/json'
        });

        return this.http.put(`${this.url}/${query}`, object, { headers });
    }

    deleteQuery(query: string, object?: any): Observable<any> {

        let token = '';
        if (localStorage.getItem('tokenPF')) {
            token = localStorage.getItem('tokenPF');
        }

        const headers = new HttpHeaders({
            Authorization: token,
            'Content-Type': 'application/json'
        });

        return this.http.delete(`${this.url}/${query}`, { headers });
    }
}
