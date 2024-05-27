import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { SapService } from '../../servicios/sap.service';
import { FirebaseService } from '../../servicios/firebase.service';

import { ArticuloModel } from '../../models/articulo.model';
import { PerfilModel } from '../../models/perfil.model';

import Swal from 'sweetalert2';
import { ArticulosService } from '../../servicios/articulos.service';
import { Utils } from '../../servicios/utils.service';

@Component({
  selector: 'app-pms',
  templateUrl: './pms.component.html',
  styleUrls: ['./pms.component.css']
})
export class PmsComponent implements OnInit, OnDestroy {

  perfil = new PerfilModel();
  articulo = new ArticuloModel();
  procedimientos:  any;
  aplicaciones:    any;

  loading: boolean;
  artEdit: string = '';
  
  sanitiDirecto: boolean = false;

  constructor(private _serviceSAP:       SapService, 
              private _serviceFirebase:  FirebaseService, 
              private pmsService:        ArticulosService,
              private route:             ActivatedRoute, 
              private router:            Router,
              private _utils:            Utils
  ) { 
                
    this.loading = true;
    
    this.cargarProductos(); 
    
    const id = this.route.snapshot.paramMap.get('id') || '';
    this.cargarPerfil(id);
    
    const idart = localStorage.getItem('idArticulo');

    if(idart !== null){
      this.pmsService.getArticulo(idart).subscribe( (art:any) => {
        this.articulo = art;
        this.articulo.id = idart;
        this.loading = false;
      })
    } else{
      this.loading = false;
    }   
            
  }

  ngOnInit(): void {    
    this.procedimientos = this._utils.procedimientos;
    this.aplicaciones    = this._utils.aplicaciones;
  }

  ngOnDestroy(): void {
    localStorage.removeItem('idArticulo');
    console.log('destroy');
    
  }

  productos: any[] = [];
  desengrasantes: any[] = [];
  sanitizantes: any[] = [];
  desincrustante: any[] = [];

  articulos: any[] = [];

  lavanderia = false;
  intervencion = false;

  precioListaDesengrasante = '';
  precioListaDesincrustante = '';
  precioListaSAnitizante = '';

  guardar(form: NgForm){

    this.perfil.fecha = new Date().toDateString();

    this.realizarCalculos();

    this.validarPrecio();

    Swal.fire({
       title: 'Espere',
       text: 'Guardando información',
       icon: 'info',
       allowOutsideClick: false
     });

    Swal.showLoading();
    let peticion: Observable<any>;
        if( this.articulo.id ){
       peticion = this.pmsService.actualizarPms(this.articulo);
     }else{
       peticion = this.pmsService.crearPms(this.articulo);
     }

      peticion.subscribe( resp => {
        this.cargarProductosAperfil();
        this._serviceFirebase.actualizarPerfil(this.perfil).subscribe();
    
        Swal.fire({
         title: this.articulo.area,
         text: 'Se actualizó correctamente',
         icon: 'success'
       }).then( resp => {
         this.router.navigateByUrl(`/psm/${this.perfil.id}`);
       });
     });

  }

  realizarCalculos(){
    
    if( this.articulo.aplicacion !== 'lavanderia' ){

       this.articulo.desengrasante.preparacion =             this.articulo.desengrasante.dilucion / 100;
       this.articulo.desengrasante.gasto_sol_mensual =       this.articulo.desengrasante.gasto_solucion *          this.articulo.desengrasante.eventos_mes;
       this.articulo.desengrasante.gasto_mensual_producto =  this.articulo.desengrasante.preparacion *             this.articulo.desengrasante.densidad * this.articulo.desengrasante.gasto_sol_mensual;
       this.articulo.desengrasante.costo_mensual =           this.articulo.desengrasante.gasto_mensual_producto *  this.articulo.desengrasante.precio_kilo;
   
       this.articulo.desincrustante.preparacion =             this.articulo.desincrustante.dilucion / 100;
       this.articulo.desincrustante.gasto_sol_mensual =       this.articulo.desincrustante.gasto_solucion *          this.articulo.desincrustante.eventos_mes;
       this.articulo.desincrustante.gasto_mensual_producto =  this.articulo.desincrustante.preparacion *             this.articulo.desincrustante.densidad * this.articulo.desincrustante.gasto_sol_mensual;
       this.articulo.desincrustante.costo_mensual =           this.articulo.desincrustante.gasto_mensual_producto *  this.articulo.desincrustante.precio_kilo;
   
       this.articulo.sanitizante.gasto_sol_mensual =       this.articulo.sanitizante.gasto_solucion *  this.articulo.sanitizante.eventos_mes;
       this.articulo.sanitizante.gasto_mensual_producto =  ((this.articulo.sanitizante.concentracion * this.articulo.sanitizante.gasto_sol_mensual) / this.articulo.sanitizante.pa) * this.articulo.sanitizante.densidad;
       this.articulo.sanitizante.costo_mensual =           this.articulo.sanitizante.gasto_mensual_producto * this.articulo.sanitizante.precio_kilo;
   
       this.perfil.pve += this.articulo.desengrasante.costo_mensual + this.articulo.desincrustante.costo_mensual + this.articulo.sanitizante.costo_mensual;
      
    } else {

      this.articulo.desengrasante.preparacion = 0;
      this.articulo.desengrasante.gasto_solucion =         (this.articulo.desengrasante.ml_g *  this.articulo.desengrasante.carga_dia) / 1000;
      this.articulo.desengrasante.gasto_sol_mensual =       this.articulo.desengrasante.gasto_solucion * this.articulo.desengrasante.eventos_mes;
      this.articulo.desengrasante.gasto_mensual_producto =  this.articulo.desengrasante.densidad * this.articulo.desengrasante.gasto_sol_mensual;
      this.articulo.desengrasante.costo_mensual =           this.articulo.desengrasante.gasto_mensual_producto * this.articulo.desengrasante.precio_kilo;

      this.articulo.sanitizante.preparacion = 0;
      this.articulo.sanitizante.gasto_solucion =         (this.articulo.sanitizante.ml_g *                   this.articulo.sanitizante.carga_dia) / 1000;
      this.articulo.sanitizante.gasto_sol_mensual =       this.articulo.sanitizante.gasto_solucion *         this.articulo.sanitizante.eventos_mes;
      this.articulo.sanitizante.gasto_mensual_producto =  this.articulo.sanitizante.densidad *               this.articulo.sanitizante.gasto_sol_mensual;
      this.articulo.sanitizante.costo_mensual =           this.articulo.sanitizante.gasto_mensual_producto * this.articulo.sanitizante.precio_kilo;

      this.perfil.pve += this.articulo.desengrasante.costo_mensual + this.articulo.sanitizante.costo_mensual;
    }


  }

  cargarProductosAperfil(){
    
    if(this.perfil.pms){
      this.perfil.pms.forEach( id => {
        this.articulos.push(id);
      });
    }

    this.articulos.push(this.articulo.id);
    this.perfil.pms = this.articulos;
   
  }

  cargarProductos(){
    this._serviceSAP.getProductos().subscribe( data =>  {
      this.productos = data
      this.cargarDesengrasantes();
      this.cargarDesincrustantes();
      this.cargarSanitizantes();
    });
  }

  selecAplicacion(value:string){

    if(value === 'lavanderia'){
      this.lavanderia = true;
      this.intervencion = false;
    } else if(value === 'intervencion'){
      this.intervencion = true;
      this.lavanderia = true;
    } else{
      this.lavanderia = false;
      this.intervencion = false;
    }

  }

  private cargarDesengrasantes(){
    let desengrasanteArr: any[]=[];
    
    for(let pr of this.productos ){
      let clasificacion: string = pr['clasificacion'];

      if( clasificacion.indexOf('DESENGRASANTE') >= 0){
        desengrasanteArr.push(pr);
      }
    }

    this.desengrasantes = desengrasanteArr;
  }

  private cargarDesincrustantes(){
    let desincrustanteArr: any[]=[];
    
    for(let pr of this.productos ){
      let clasificacion: string = pr['clasificacion'];

      if( clasificacion.indexOf('DESINCRUSTANTE') >= 0){
        desincrustanteArr.push(pr);
      }
    }

    this.desincrustante = desincrustanteArr;

  }

  private cargarSanitizantes(){
    let sanitizanteArr: any[]=[];
    
    for(let pr of this.productos ){
      let clasificacion: string = pr['clasificacion'];

      if( clasificacion.indexOf('SANITIZANTE') >= 0){
        sanitizanteArr.push(pr);
      }
    }

    this.sanitizantes = sanitizanteArr;

  }

  getPrecio( producto: any){

    if( producto === ""){
      this.precioListaDesengrasante = ''
    }else{

      for( let d of this.desengrasantes ){
  
        let cod = d['codigo'];
        if( cod.indexOf(producto) >= 0 ){
          this.precioListaDesengrasante = d['precioLista'];
          this.articulo.desengrasante.descripcion = d['nombre'];
          this.articulo.desengrasante.densidad = d['densidad'];
        }
      }
    }
  
  }

  getPrecioDesincrustante( producto: any){

    if( producto === ""){
      this.precioListaDesincrustante = ''
    }else{

      for( let d of this.desincrustante ){
  
        let cod = d['codigo'];
        if( cod.indexOf(producto) >= 0 ){
          this.precioListaDesincrustante = d['precioLista']
          this.articulo.desincrustante.descripcion = d['nombre'];
          this.articulo.desincrustante.densidad = d['densidad'];
        }
      }
    }
  
  }
  
  getPrecioSanitizante( producto: any){

    if( producto === ""){
      this.precioListaSAnitizante = ''
    }else{

      for( let d of this.sanitizantes ){
  
        let cod = d['codigo'];
        if( cod.indexOf(producto) >= 0 ){
          this.precioListaSAnitizante = d['precioLista']
          this.articulo.sanitizante.descripcion = d['nombre'];
          this.articulo.sanitizante.densidad = d['densidad'];
          this.articulo.sanitizante.pa = d['principioActivo'] || 50000;
        }
      }
    }
  
  }

  cargarPerfil(id: string){
    this._serviceFirebase.getPerfil( id )
    .subscribe( (resp: any) => {
      this.perfil = resp;
      this.perfil.id = id;
    });
  }

  validarPrecio(){

   const valorPermitido = parseFloat( this.precioListaDesengrasante ) -  (parseFloat( this.precioListaDesengrasante ) * 30)/100;

    if( valorPermitido > this.articulo.desengrasante.precio_kilo ){
      console.log('El precio de lista es mayor');
      alert('el precio es menor a lo permitido ' + valorPermitido);
    }
  }
  
}
