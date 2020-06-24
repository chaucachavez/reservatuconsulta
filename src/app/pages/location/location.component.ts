import { Component, OnInit } from '@angular/core';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';
import { SedeService } from 'src/app/services/sede.service';
import { FormGroup, FormArray, FormControl, Validators } from '@angular/forms';

declare function init_location();

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html',
  styles: []
})
export class LocationComponent implements OnInit {

  sedeForm: FormGroup;

  nombre: string;
  sedes: any[] = [];
  loadSede = false;
  errors: string = null;

  constructor(
    private entidadService: EntidadService,
    private sedeService: SedeService,
    private router: Router,
  ) {
    init_location();
    if (this.entidadService.usuario) {
      const nombreCompleto = this.entidadService.usuario.name.split(' ');
      this.nombre = nombreCompleto[0];
    }
  }

  ngOnInit() {

    if (this.entidadService.estaLogueado()) {
      if (this.entidadService.reservacion.pagado === '1') {
        this.router.navigate(['/reservacion-realizada']);
      }
    } else {
      this.router.navigate(['/']);
    }

    this.sedeForm = this.createForm();
    this.indexSedes();
  }

  indexSedes(): void {
    this.loadSede = true;
    this.sedeService.index({preciocm: '1'})
      .subscribe((data: any) => {
        this.sedes = data.filter(row => {
          return row.comercial === '1';
        });
        this.loadSede = false;
      }, error => {
        // swal('Upss!', error.error.error, 'error');
      });
  }

  createForm(): FormGroup {

    const idsede = this.entidadService.reservacion.idsede || null;

    return new FormGroup({
      idsede: new FormControl(idsede, Validators.required)
    });
  }

  salir(): void {
    this.entidadService.logout()
      .subscribe(() => this.router.navigate(['/']), error => {
        // this.snackBar.open(error.error.error, 'Cerrar');
        setTimeout(() => {
          this.errors = 'Error';
        }, 5000);
      });
  }

  next(): void {
    if (!this.sedeForm.get('idsede').value) {
      this.errors = 'Eliga una sede para su atención';
      setTimeout(() => {
        this.errors = null;
      }, 5000);

      return;
    }

    const nombresede = this.sedes.filter(row => {
      return row.idsede === this.sedeForm.get('idsede').value;
    })[0].nombre;

    const preciocm = this.sedes.filter(row => {
      return row.idsede === this.sedeForm.get('idsede').value;
    })[0].preciocm;

    this.entidadService.reservacion.idsede = this.sedeForm.get('idsede').value;
    this.entidadService.reservacion.nombresede = nombresede;
    this.entidadService.reservacion.preciocm = preciocm;
    this.entidadService.saveReservacion();

    this.router.navigate(['/seleccione-fecha']);
  }
}
