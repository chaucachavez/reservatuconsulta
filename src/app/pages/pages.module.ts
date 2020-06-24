import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppointmentComponent } from './appointment/appointment.component';
import { ProgressComponent } from './progress/progress.component';
import { DetailsComponent } from './details/details.component';
import { HomeComponent } from './home/home.component';
import { LocationComponent } from './location/location.component';
import { PaymentComponent } from './payment/payment.component';
import { PagesComponent } from './pages.component';
import { SharedModule } from '../shared/shared.module';
import { RegisterComponent } from './register/register.component';
import { PAGES_ROUTES } from './pages.routes';
import { CommonModule } from '@angular/common';
import { NgxSpinnerModule } from 'ngx-spinner';

@NgModule({
    declarations: [
        AppointmentComponent,
        ProgressComponent,
        DetailsComponent,
        HomeComponent,
        LocationComponent,
        PaymentComponent,
        PagesComponent,
        RegisterComponent
    ],
    exports: [
        AppointmentComponent,
        ProgressComponent,
        DetailsComponent,
        HomeComponent,
        LocationComponent,
        PaymentComponent,
        PagesComponent,
        RegisterComponent
    ],
    imports: [
        CommonModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgxSpinnerModule,
        PAGES_ROUTES
    ]
})
export class PagesModule { }
