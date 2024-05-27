import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './paginas/home/home.component';
import { PerfilComponent } from './paginas/perfil/perfil.component';
import { PmsComponent } from './paginas/pms/pms.component';
import { PsmComponent } from './paginas/psm/psm.component';

const routes: Routes = [
  { path:'home', component: HomeComponent },
  { path:'perfil/:id', component: PerfilComponent },
  { path:'psm/:id', component: PsmComponent },
  { path:'pms/:id', component: PmsComponent },
  { path:'**', pathMatch:'full', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
