import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';
import { Utils } from 'src/app/services/utils';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  @ViewChild('numerodoc', { static: false }) numeroElement: ElementRef;
  @ViewChild('username', { static: false }) usernameElement: ElementRef;

  formInicio = true;
  formIngreso = false;
  formRecuperar = false;
  errors: string = null;
  respuesta: string = null;

  constructor(
    private entidadService: EntidadService,
    private router: Router,
    private utils: Utils,
    private spinner: NgxSpinnerService
  ) {

  }

  // Formulario
  loginForm: FormGroup;
  recoveryForm: FormGroup;

  submitted = false;

  // Data inicial y listados
  documentos = [{ iddocumento: 1, abreviatura: 'DNI' }, { iddocumento: 3, abreviatura: 'CARNET EXT.' },
  { iddocumento: 4, abreviatura: 'PASAPORTE Y OTROS' }
  ];

  ngOnInit() {

    this.loginForm = new FormGroup({
      iddocumento: new FormControl(1, [Validators.required]),
      username: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      navegador: new FormControl(navigator.userAgent)
    });

    this.recoveryForm = new FormGroup({
      iddocumento: new FormControl(1, [Validators.required]),
      numerodoc: new FormControl('', [Validators.required])
    });
  }

  focusNumerodoc(): void {
    this.loginForm.get('username').setValue('');
    this.loginForm.get('password').setValue('');
    this.formIngreso = false;
    this.formRecuperar = true;

    setTimeout(() => {
      this.numeroElement.nativeElement.focus();
    }, 100);
  }

  focusUsername(): void {
    this.formInicio = false;
    this.formIngreso = true;

    setTimeout(() => {
      this.usernameElement.nativeElement.focus();
    }, 100);
  }

  focusLogin(): void {
    this.recoveryForm.get('numerodoc').setValue('');
    this.formRecuperar = false;
    this.formIngreso = true;
    this.respuesta = '';
    setTimeout(() => {
      this.usernameElement.nativeElement.focus();
    }, 100);
  }

  authenticar(): void {
    let param: any;
    param = this.loginForm.getRawValue();

    this.spinner.show();
    this.entidadService.authenticate(param).subscribe((data) => {
      this.spinner.hide();

      if (data.type === 'success') {
        // this.spinner.hide();

        this.router.navigate(['/seleccione-sede']);
      } else {
        this.errors = data.data;
        setTimeout(() => {
          this.errors = null;
        }, 5000);
      }
    }, error => {
      this.errors = 'Error';
    });
  }

  recovery(): void {
    let param: any;
    param = this.recoveryForm.getRawValue();
    param.web = 'reservatuconsulta';

    this.spinner.show();
    this.entidadService.recoveryPassword(param).subscribe((data) => {
      this.spinner.hide();

      if (data.type === 'success') {
        this.recoveryForm.get('numerodoc').setValue('');
        this.spinner.hide();
        this.respuesta = data.data.email;
      } else {
        this.errors = data.data;
        setTimeout(() => {
          this.errors = null;
        }, 5000);
      }
    }, error => {
      this.errors = 'Error';
      this.spinner.hide();
      setTimeout(() => {
        this.errors = null;
      }, 5000);
    });
  }
}
