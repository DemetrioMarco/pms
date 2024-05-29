import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class SapService {

    private _serviceUrl: string = 'http://35.174.29.99/ServiciosSAP/api/';
    private headers = new HttpHeaders()
    .set('Access-Control-Allow-Origin', '*')
    .set('Access-Control-Allow-Headers','Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With')
    .set('Access-Control-Allow-Methods','GET')
    .set('Allow','GET');

    constructor( private http: HttpClient){
    }

    getSociosNegocio(): Observable<any>{
        return this.http.get(`${ this._serviceUrl }Socio`, { headers: this.headers });
    }

    getProductos():Observable<any>{
        return this.http.get(`${ this._serviceUrl }Precios`, { headers: this.headers });
                    // .pipe(
                    //     map( this.crearArreglo )
                    // );
    }

    getSucursales():Observable<any>{
        return this.http.get(`${ this._serviceUrl }Sucursales`, { headers: this.headers });
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