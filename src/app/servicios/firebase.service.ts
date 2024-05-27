import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';

import { PerfilModel } from '../models/perfil.model';



@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private url = 'https://cotizador-pms-default-rtdb.firebaseio.com'

  constructor( private http: HttpClient) { }

  // Perfil
  crearPerfil( perfil: PerfilModel){

    return this.http.post(`${ this.url }/perfiles.json`, perfil)
              .pipe(
                map( (resp: any) => {
                  perfil.id = resp.name;
                  return perfil;
                })
              );
  }

  actualizarPerfil( perfil: PerfilModel ){
    
    const perfilTemp = {
      ...perfil
    };

    delete perfilTemp.id;

    return this.http.put(`${ this.url }/perfiles/${ perfil.id }.json`,perfilTemp);

  }

  borrarPerfil( id: string ){
    return this.http.delete(`${ this.url }/perfiles/${ id }.json`);
  }

  getPerfil( id:string ){
    return this.http.get(`${ this.url }/perfiles/${ id }.json`);
  }

  getPerfiles(){
    return this.http.get(`${ this.url }/perfiles.json`)
            .pipe(
              map( this.crearArreglo )
            );
  }

  private crearArreglo( perfilObj: any ){

    const perfiles: PerfilModel[] = [];

    if( perfilObj === null ){ return [] ;}

    Object.keys( perfilObj ).forEach( key => {

      const perfil: PerfilModel = perfilObj[key];
      perfil.id = key;

      perfiles.push(perfil);
    });

    return perfiles;
  }



    
}
