import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { map } from 'rxjs/operators';
import { ArticuloModel } from '../models/articulo.model';
import { FirebaseService } from './firebase.service';
import { PsmComponent } from '../paginas/psm/psm.component';
import { analyzeAndValidateNgModules } from '@angular/compiler';
import { PerfilModel } from '../models/perfil.model';

@Injectable({
  providedIn: 'root'
})
export class ArticulosService {

  private url = 'https://cotizador-pms-default-rtdb.firebaseio.com';

  constructor( private http: HttpClient, private perfilService: FirebaseService) { }

  // Pms - productos
  crearPms( articulo: ArticuloModel){
    
    return this.http.post(`${ this.url }/pms.json`, articulo)
              .pipe(
                map( (resp: any) => {
                  articulo.id = resp.name;
                  return articulo;
                })
              );
              

  }

  actualizarPms( articulo: ArticuloModel){
    const articuloTemp = {
      ...articulo
    };

    delete articuloTemp.id;

    return this.http.put(`${ this.url }/pms/${ articulo.id }.json`, articuloTemp);
  }

  getArticulo( id: string){
    return this.http.get(`${ this.url }/pms/${ id }.json`);
  }

  getArticulosPms(id: string){
    return this.perfilService.getPerfil(id)
            .pipe(
              map(
                 this.crearArregloArticulos
                
              )
            );
  }


  private crearArregloArticulos( artObj: any){
    const articulosArr: any[] = artObj.pms;
  //   const articulosArr: any[] = [];
       
  //   artObj.pms.forEach((id:any) => {
  //     articulosArr.push(id);
  //   });
    
    return articulosArr;
  
  }

  eliminarArticulo(idArticulo: string, perfil: PerfilModel){

    return this.http.delete(`${ this.url }/pms/${ idArticulo }.json`).subscribe( data => {
      this.eliminarArticuloPSM(perfil, idArticulo);
    });
  }


  eliminarArticuloPSM(perfil : PerfilModel, idArticulo: string){

    const arrayPsm = perfil.pms.filter( item => item !== idArticulo); // regresa todos los articulos que sean distintos 

    
   perfil.pms = arrayPsm;
   console.log(perfil.pms);

   this.perfilService.actualizarPerfil(perfil).subscribe();
  }

}
