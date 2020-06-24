import { Component, OnInit } from '@angular/core';
import { EntidadService } from '../services/entidad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(
    private entidadService: EntidadService,
    private router: Router,
  ) { }

  ngOnInit() {

    if (this.entidadService.reservacion.pagado === '1') {
      this.router.navigate(['/reservacion-realizada']);
    } else {
      this.router.navigate(['/']);
    }
  }

}
