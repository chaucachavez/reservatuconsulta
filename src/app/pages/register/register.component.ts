import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';
import { FormGroup, Validators, FormControl, ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styles: []
})
export class RegisterComponent implements OnInit {

  @ViewChild('nombre', { static: false }) nombreElement: ElementRef;

  registerForm: FormGroup;
  submitted = false;
  errors: string = null;

  documentos: any[] = [
    { iddocumento: 1, abreviatura: 'DNI' },
    { iddocumento: 3, abreviatura: 'CARNET EXT.' },
    { iddocumento: 4, abreviatura: 'PASAPORTE y OTROS' }
  ];

  constructor(
    private entidadService: EntidadService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {

  }

  ngOnInit() {
    this.registerForm = this.createForm();

    setTimeout(() => {
      this.nombreElement.nativeElement.focus();
    }, 100);

    this.registerForm.get('iddocumento').valueChanges.subscribe((data) => {
      if (data === 1) { // DNI
        this.registerForm.get('numerodoc').setValidators([Validators.required, Validators.minLength(8), Validators.maxLength(8)]);
      } else {
        this.registerForm.get('numerodoc').setValidators([Validators.required]);
      }
      this.registerForm.get('numerodoc').updateValueAndValidity();
    });
  }

  createForm(): FormGroup {
    return new FormGroup({
      iddocumento: new FormControl('', Validators.required),
      numerodoc: new FormControl(null, Validators.required),
      nombre: new FormControl('', Validators.required),
      apellidopat: new FormControl(null, Validators.required),
      apellidomat: new FormControl(null),
      celular: new FormControl(null, [Validators.required, Validators.minLength(9), Validators.maxLength(9)]),
      sexo: new FormControl('', Validators.required),
      email: new FormControl(null, [Validators.required, Validators.email]),
      fechanacimiento: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
      passwordrepeat: new FormControl(null, [Validators.required, confirmPasswordValidator]),
      terminos: new FormControl(true, Validators.requiredTrue),
    });
  }

  get f() { return this.registerForm.controls; }

  authenticar(): void {

    const param = {
      iddocumento: this.registerForm.get('iddocumento').value,
      username: this.registerForm.get('numerodoc').value,
      password: this.registerForm.get('password').value,
      navegador: navigator.userAgent
    };

    this.entidadService.authenticate(param).subscribe((data) => {
      this.submitted = false;
      console.log('subscribe', data);
      if (data.type === 'success') {
        this.router.navigate(['/seleccione-sede']);
      } else {
        alert(data.data);
      }
    }, error => {
      this.submitted = false;
      alert('Error');
    });
  }

  save(): void {

    this.submitted = true;

    if (this.registerForm.invalid) {
      return;
    }

    let param: any;
    param = this.registerForm.getRawValue();

    // 1986-07-08
    const d = param.fechanacimiento.substr(8, 2);
    const m = param.fechanacimiento.substr(5, 2);
    const y = param.fechanacimiento.substr(0, 4);
    param.fechanacimiento = d + '/' + m + '/' + y;
    this.spinner.show();
    this.entidadService.createPaciente({ entidad: param }).subscribe((data) => {
      this.submitted = false;
      this.spinner.hide();
      if (data.type === 'success') {
        this.authenticar();
      } else {
        this.errors = data.data.message;
        setTimeout(() => {
          this.errors = null;
        }, 5000);
      }
    }, error => {
      this.submitted = false;
      this.errors = 'Error';
      this.spinner.hide();
      setTimeout(() => {
        this.errors = null;
      }, 5000);
    });
  }
}

export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

  if (!control.parent || !control) {
    return null;
  }

  const password = control.parent.get('password');
  const passwordConfirm = control.parent.get('passwordrepeat');

  if (!password || !passwordConfirm) {
    return null;
  }

  if (passwordConfirm.value === '') {
    return null;
  }

  if (password.value === passwordConfirm.value) {
    return null;
  }

  return { passwordsNotMatching: true };
}
