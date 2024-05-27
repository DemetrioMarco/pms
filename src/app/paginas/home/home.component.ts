import { Component, OnInit } from '@angular/core';

import { FirebaseService } from 'src/app/servicios/firebase.service';
import { PerfilModel } from '../../models/perfil.model';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  perfiles: PerfilModel[] = [];
  cargando = false;

  constructor( private _serviceFirebase: FirebaseService) { }

  ngOnInit(): void {

    this.cargando = true;
    this._serviceFirebase.getPerfiles()
      .subscribe( resp => {
        this.perfiles = resp
        this.cargando = false;
      } );
  }

  borrarPerfil( perfil: any, i: number){
    
    Swal.fire({
      title: '¿Esta seguro',
      text: `Está seguro que desea borrar el perfil de ${ perfil.socio }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if(resp.value){
        this.perfiles.splice(i,1);
        this._serviceFirebase.borrarPerfil( perfil.id ).subscribe();
      }
    });

  }

}
