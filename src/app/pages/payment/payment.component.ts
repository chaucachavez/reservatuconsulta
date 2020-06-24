import { Component, OnInit } from '@angular/core';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';
import { URL_SERVICIOS } from 'src/app/config/config';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: []
})
export class PaymentComponent implements OnInit {

  detalle: any;
  nombre: string;
  url = URL_SERVICIOS;
  errors: string = null;

  constructor(
    private entidadService: EntidadService,
    private router: Router
  ) {

    if (this.entidadService.usuario) {
      const nombreCompleto = this.entidadService.usuario.name.split(' ');
      this.nombre = nombreCompleto[0];
    }

    if (this.entidadService.reservacion.pagado === '1') {
      this.detalle = {
        paciente: this.entidadService.usuario.apellidos + ', ' + this.entidadService.usuario.name,
        sede: this.entidadService.reservacion.nombresede,
        medico: this.entidadService.reservacion.hora.nombre,
        fecha: this.entidadService.reservacion.hora.inicioms,
        hora: this.entidadService.reservacion.hora.inicioms,
        urlPdf: this.url + '/comprobantes/' + this.entidadService.reservacion.filenamepdf
      };
    }
  }

  ngOnInit() {
    if (this.entidadService.estaLogueado()) {
      if (this.entidadService.reservacion.pagado !== '1') {
        this.router.navigate(['/seleccione-sede']);
      }
    } else {
      this.router.navigate(['/']);
    }
  }

  openUrl(url: string) {

    this.entidadService.logout()
      .subscribe(() => {
        window.open(url, '_parent');
      }, error => {
        // this.snackBar.open(error.error.error, 'Cerrar');
        setTimeout(() => {
          this.errors = 'Error';
        }, 5000);
      });
  }

}
