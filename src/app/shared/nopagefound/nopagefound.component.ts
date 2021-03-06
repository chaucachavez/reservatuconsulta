import { Component, OnInit } from '@angular/core';
import { EntidadService } from 'src/app/services/entidad.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nopagefound',
  templateUrl: './nopagefound.component.html',
  styles: []
})
export class NopagefoundComponent implements OnInit {

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
