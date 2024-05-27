import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SapService {

    constructor( private http: HttpClient){
    }

    getSociosNegocio():Observable<any>{
        return this.http.get('http://35.174.29.99/ServiciosSAP/api/Socio');
    }

    getProductos():Observable<any>{
        return this.http.get('http://35.174.29.99/ServiciosSAP/api/Precios');
                    // .pipe(
                    //     map( this.crearArreglo )
                    // );
    }

    getSucursales():Observable<any>{
        return this.http.get('http://35.174.29.99/ServiciosSAP/api/Sucursales');
    }

    // private crearArreglo( productosObj: any){

    //     const productos: any[] = [];

    //     if( productosObj === null ){ return []; }
        
    //     Object.keys( productosObj ).forEach( key => {

    //         const producto = productosObj[key];
            
    //         productos.push(producto);
    //     });

    //     return productos;

    // }
}