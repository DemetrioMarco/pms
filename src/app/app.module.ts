import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PsmComponent } from './paginas/psm/psm.component';

import localeEs from '@angular/common/locales/es';

import { registerLocaleData } from '@angular/common';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { PmsComponent } from './paginas/pms/pms.component';
import { HomeComponent } from './paginas/home/home.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { LoadingComponent } from './componentes/shared/loading/loading.component';

registerLocaleData(localeEs);


@NgModule({
  declarations: [
    AppComponent,
    PsmComponent,
    PerfilComponent,
    PmsComponent,
    HomeComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule, 
    HttpClientModule,
    SweetAlert2Module.forRoot()
  ],
  providers: [ 
    {
      provide: LOCALE_ID,
      useValue: 'es-MXN'
    }
   ],
  bootstrap: [AppComponent]
})
export class AppModule { }
