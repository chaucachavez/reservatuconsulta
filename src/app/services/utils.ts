import { Injectable } from '@angular/core';
@Injectable({
    providedIn: 'root'
})
export class Utils {
    public convertError(value: any): string {

        let mensaje = '';
        if (typeof value === 'string') {
            mensaje = value;
            return mensaje;
        }

        if (value.hasOwnProperty('error') && value.error.hasOwnProperty('error') && typeof value.error.error === 'string') {
            mensaje = value.error.error;
            return mensaje;
        }

        if (value.hasOwnProperty('error') && value.error.hasOwnProperty('error') && typeof value.error.error === 'object') {
            for (const prop in value.error.error) {
                if (value.error.error.hasOwnProperty(prop)) {
                    mensaje += ' ' + value.error.error[prop];
                }
            }
            return mensaje;
        }

        if (value.hasOwnProperty('error') && value.error.hasOwnProperty('message') && typeof value.error.message === 'string') {
            mensaje = value.error.message;
            return mensaje;
        }

        if (typeof value === 'object') {
            for (const prop in value) {
                if (value.hasOwnProperty(prop)) {
                    mensaje += ' ' + value[prop];
                }
            }
        }

        return mensaje;
    }

    public formatoMs(fecha, hora) {
        // fecha: 24/02/2016
        // formato: "dd/MM/yyyy H:mm:ss"
        let d;
        let m;
        let y;

        if (fecha === '') {

        } else {
            d = fecha.substr(0, 2);
            m = fecha.substr(3, 2) - 1;
            y = fecha.substr(6, 4);
        }

        let milisegundos;

        if (hora === '') {
            milisegundos = new Date(y, m, d).getTime();
        } else {
            const h = hora.substr(0, 2);
            const min = hora.substr(3, 2);
            const seg = hora.substr(6, 2);
            milisegundos = new Date(y, m, d, h, min, seg).getTime();
        }

        return milisegundos;
    }


}
