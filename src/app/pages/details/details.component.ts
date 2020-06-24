import { Component, OnInit } from '@angular/core';
import { EntidadService } from 'src/app/services/entidad.service';
import { CitamedicaService } from 'src/app/services/citamedica.service';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

declare let Culqi: any;

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styles: []
})
export class DetailsComponent implements OnInit {

  nombre: string;
  detalle: any;
  errors: string = null;

  constructor(
    private entidadService: EntidadService,
    private citamedicaService: CitamedicaService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {
    if (this.entidadService.usuario) {
      const nombreCompleto = this.entidadService.usuario.name.split(' ');
      this.nombre = nombreCompleto[0];
    }

    document.addEventListener('payment_event', (customEvent: any) => {
      this.save(customEvent.detail.token, customEvent.detail.email);
    }, false);

    document.addEventListener('payment_error', (customEvent: any) => {
      this.errors = customEvent.detail;
      setTimeout(() => {
        this.errors = null;
      }, 10000);

    }, false);

    if (this.entidadService.usuario && this.entidadService.reservacion.hora) {
      const nombreCompleto = this.entidadService.usuario.name.split(' ');
      this.nombre = nombreCompleto[0];

      this.detalle = {
        paciente: this.entidadService.usuario.apellidos + ', ' + this.entidadService.usuario.name,
        sede: this.entidadService.reservacion.nombresede,
        medico: this.entidadService.reservacion.hora.nombre,
        fecha: this.entidadService.reservacion.hora.inicioms,
        hora: this.entidadService.reservacion.hora.inicioms
      };
    } else {
      console.log('A');
      this.router.navigate(['/seleccione-sede']);
    }
  }

  ngOnInit() {
    console.log('Go');
    // this.spinner.show();
    if (this.entidadService.reservacion.pagado === '1') {
      this.router.navigate(['/reservacion-realizada']);
    }
  }

  openPagar(): void {
    const preciocm = parseFloat(this.entidadService.reservacion.preciocm) * 100;
    console.log(preciocm, typeof (preciocm));

    // Culqi.publicKey = 'pk_test_e2BMGObO66ErOpr0';
    Culqi.publicKey = 'pk_live_YxGA84Y1Utew9trF';
    Culqi.options({
      style: {
        logo: 'https://sistemas.centromedicoosi.com/apiosi/public/img/osi/logo_pago.png',
        maincolor: '#00AF41'
      }
    });

    Culqi.settings({
      title: 'Centro Médico OSI',
      currency: 'PEN',
      description: 'Servicio: Teleconsulta médica orientadora',
      amount: preciocm
    });

    Culqi.open();
  }

  next(): void {
    this.router.navigate(['/reservacion-realizada']);
  }

  save(tokenId: string, email: string): void {
    const param = {
      idtoken: tokenId,
      idsede: parseInt(this.entidadService.reservacion.idsede, 10),
      idmedico: this.entidadService.reservacion.hora.idmedico,
      idpaciente: this.entidadService.usuario.id,
      fecha: this.entidadService.reservacion.fecha,
      inicio: this.entidadService.reservacion.hora.inicio,
      fin: this.entidadService.reservacion.hora.fin,
      idestado: 4, // pendiente
      idreferencia: 16, // Pagina web
      idatencion: 70, // Portal paciente
      email
    };

    this.spinner.show();
    this.citamedicaService.CreatePagar({ citamedica: param }).subscribe((data) => {
      this.spinner.hide();

      if (data.type === 'success') {
        console.log('array.data', data.data);
        this.entidadService.reservacion.pagado = '1';
        this.entidadService.reservacion.user_message = data.data.user_message;
        this.entidadService.reservacion.filenamepdf = data.data.filenamepdf;
        this.entidadService.saveReservacion();
        this.router.navigate(['/reservacion-realizada']);
      } else {
        this.errors = data.data;
        setTimeout(() => {
          this.errors = null;
        }, 10000);
      }
    }, error => {
      this.spinner.hide();
      setTimeout(() => {
        this.errors = null;
      }, 10000);
    });




  }

}
