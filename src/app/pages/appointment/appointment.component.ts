import { Component, OnInit, NgZone } from '@angular/core';
import { CitamedicaService } from 'src/app/services/citamedica.service';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Utils } from 'src/app/services/utils';
import { NgxSpinnerService } from 'ngx-spinner';

declare function init_appointment();
declare var $: any;

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styles: []
})
export class AppointmentComponent implements OnInit {

  horarioForm: FormGroup;

  nombre: string;
  turnos: any[] = [];
  loadTurnos = false;
  today: number = Date.now();
  errors: string = null;

  constructor(
    private entidadService: EntidadService,
    private citamedicaService: CitamedicaService,
    private router: Router,
    private utils: Utils,
    private ngZone: NgZone,
    private spinner: NgxSpinnerService
  ) {
    init_appointment();
    if (this.entidadService.usuario) {
      const nombreCompleto = this.entidadService.usuario.name.split(' ');
      this.nombre = nombreCompleto[0];
    }
  }

  ngOnInit() {

    if (this.entidadService.reservacion.pagado === '1') {
      this.router.navigate(['/reservacion-realizada']);
    }

    this.horarioForm = this.createForm();

    window['angularComponentReference'] = {
      component: this,
      zone: this.ngZone,
      loadAngularFunction: (data: any) => this.indexTurnos(data),
    };
  }

  indexTurnos(fecha: string): void {
    if (!fecha) {
      this.turnos = [];
      this.horarioForm.reset();
      return;
    }

    this.loadTurnos = true;
    this.horarioForm.get('fecha').setValue(fecha);
    this.horarioForm.get('hora').setValue(null);
    const param = {
      fecha,
      idperfil: 3,
      idsede: this.entidadService.reservacion.idsede
    };

    this.spinner.show();
    this.citamedicaService.turnos(param)
      .subscribe((data: any) => {
        this.spinner.hide();
        const milisegundosactual = new Date().getTime();

        data.forEach((row) => {
          row.horas.forEach((hora) => {
            hora.inicioms = this.utils.formatoMs(fecha, hora.inicio);
            hora.finms = this.utils.formatoMs(fecha, hora.fin);
          });

          const horasValida = row.horas.filter((hora) => {
            return hora.inicioms > milisegundosactual;
          });

          row.horas = horasValida;
        });

        const dataHoras = data.filter((row) => {
          return row.horas.length > 0;
        });

        this.turnos = dataHoras;

        setTimeout(() => {
          this.checkTurnos();
        }, 100);

        this.loadTurnos = false;
      });
  }

  selectHora(turno: string): void {
    this.horarioForm.get('hora').setValue(turno);
  }

  createForm(): FormGroup {
    return new FormGroup({
      fecha: new FormControl(null, Validators.required),
      hora: new FormControl(null, Validators.required)
    });
  }

  next(): void {
    if (!this.horarioForm.get('fecha').value) {
      this.errors = 'Elige fecha';
      setTimeout(() => {
        this.errors = null;
      }, 5000);

      return;
    }

    if (!this.horarioForm.get('hora').value) {
      this.errors = 'Elige médico y turno';
      setTimeout(() => {
        this.errors = null;
      }, 5000);

      return;
    }

    this.entidadService.reservacion.fecha = this.horarioForm.get('fecha').value;
    this.entidadService.reservacion.hora = this.horarioForm.get('hora').value;
    this.entidadService.saveReservacion();

    this.router.navigate(['/reservar-y-pagar']);
  }

  checkTurnos(): void {
    const allInputs = $('.pick-turn-mod__dates input');
    $('.pick-turn-mod__dates').each(function () {
      $(this).find('button').each(function () {
        $(this).on('click', function (e) {
          e.preventDefault();
          allInputs.attr('checked', false);
          $(this).siblings().attr('checked', true);
        });
      });
    });
  }

}
