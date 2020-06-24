import { BrowserModule } from '@angular/platform-browser';
import { LOCALE_ID, NgModule } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { PagesModule } from './pages/pages.module';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RouterModule } from '@angular/router';
import localeEsPE from '@angular/common/locales/es-PE';
import { NgxSpinnerModule } from 'ngx-spinner';
// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { LocationStrategy, HashLocationStrategy } from '@angular/common';

registerLocaleData(localeEsPE, 'es-Pe');

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    PagesModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    NgxSpinnerModule,
    // NgbModule,
    BrowserAnimationsModule
  ],
  providers: [
    // { provide: HTTP_INTERCEPTORS, useClass: HttpErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: 'es-Pe' },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
