import { RouterModule, Routes } from '@angular/router';
import { PagesComponent } from './pages.component';
import { HomeComponent } from './home/home.component';
import { LocationComponent } from './location/location.component';
import { AppointmentComponent } from './appointment/appointment.component';
import { DetailsComponent } from './details/details.component';
import { PaymentComponent } from './payment/payment.component';
import { RegisterComponent } from './register/register.component';

const pagesRoutes: Routes = [
    {
        path: '',
        component: PagesComponent,
        children: [
            {
                path: '', component: HomeComponent
            },
            {
                path: 'seleccione-sede', component: LocationComponent
            },
            {
                path: 'seleccione-fecha', component: AppointmentComponent
            },
            {
                path: 'reservar-y-pagar', component: DetailsComponent
            },
            {
                path: 'reservacion-realizada', component: PaymentComponent
            },
            {
                path: 'registro', component: RegisterComponent
            },
            {
                path: '', redirectTo: 'seleccione-sede', pathMatch: 'full'
            }
        ]
    }
];

export const PAGES_ROUTES = RouterModule.forChild(pagesRoutes);
