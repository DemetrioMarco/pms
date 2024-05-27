import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { FirebaseService } from '../../servicios/firebase.service';
import { ArticulosService } from '../../servicios/articulos.service';
import { DatosService } from '../../servicios/datos.service';

import { PerfilModel } from '../../models/perfil.model';

import Swal from 'sweetalert2';
import { ArticuloModel } from '../../models/articulo.model';

@Component({
  selector: 'app-psm',
  templateUrl: './psm.component.html',
  styleUrls: ['./psm.component.css']
})
export class PsmComponent implements OnInit {

  perfil = new PerfilModel();
  articulos: ArticuloModel[] = [];

  totalDesengrasante: number = 0;
  totalDesincrustante: number = 0;
  totalSanitizante: number = 0;
  
  constructor( private route: ActivatedRoute, private _serviceFirebase: FirebaseService, private articulosService: ArticulosService, private datosService: DatosService){
    
    const id = this.route.snapshot.paramMap.get('id') || '';
    
    this.cargarPerfil(id);
    this.cargarArticulos(id);
    
  };
  
  ngOnInit(): void {

  }
  
  //* Cargar los productos del PSM
  cargarArticulos(id: string){

    this.articulosService.getArticulosPms(id).subscribe( (resp:any) => {

      const arreglo:any[] = resp;

      if(arreglo == undefined){
        return;
      }
      
      arreglo.forEach( (ar: any) =>{

        let articulo: ArticuloModel = new ArticuloModel();
        this.articulosService.getArticulo(ar).subscribe((data:any) => {
          
          articulo = data;
          articulo.id = ar;
          this.articulos.push(articulo);
          this.totalDesengrasante += articulo.desengrasante.costo_mensual;
          this.totalDesincrustante += articulo.desincrustante.costo_mensual;
          this.totalSanitizante += articulo.sanitizante.costo_mensual;
        
          
        });
      });


    });
  }

  //? Guardar id en el localStorage y se elimina al cambiar de página (Destroyer)
  enviarArticulos(id: string){
    localStorage.setItem('idArticulo',id);
  }
  
  cargarPerfil(id: string): void{
    this._serviceFirebase.getPerfil( id )
    .subscribe( (resp: any) => {
      this.perfil = resp;
      this.perfil.id = id;
    });
  }
  
  eliminarArticulo(id: string, area: string, i: number){
    
    Swal.fire({
      title: '¿Esta seguro',
      text: `Está seguro que desea borrar el articulo de ${ area }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {
      if(resp.value){
        this.articulosService.eliminarArticulo(id, this.perfil);
        this.articulos.splice(i,1);
      }
    });
    
  }
  
  equipos: string =''
  datosModal( equipo:string){
    this.equipos = equipo;
  }


  //? Funcion para crear Propuesta por área
  propPorArea: any[] = [];
  totalArea: number = 0;
  presupuestoPorArea(){
    let arrayTemp = [];
    this.propPorArea = [];
    this.totalArea = 0;

    for(let i = 0; i< this.articulos.length; i++){
      arrayTemp = this.propPorArea.filter( resp => resp["area"] == this.articulos[i]["area"]);

      if(arrayTemp.length > 0 ){
        this.propPorArea[this.propPorArea.indexOf(arrayTemp[0])]["Obj"].push(this.articulos[i]);
        
      }else{
        this.propPorArea.push({
          "area": this.articulos[i]["area"], 
          "Obj":[this.articulos[i]], 
          "Total": 0
        })
      }
   }   

    let suma: number = 0;
    for(let i = 0; i < this.propPorArea.length; i++){
      suma = 0;
      this.propPorArea[i]["Obj"].forEach( (d:any) => {
      suma += d["desengrasante"].costo_mensual;
      suma += d["desincrustante"].costo_mensual;  
      suma += d["sanitizante"].costo_mensual;
       
     });

     this.propPorArea[i].Total = suma;
    }

    this.propPorArea.forEach( t => this.totalArea += t.Total );
    
  }

  propPorProducto: any[] = [];
  totalProductos: number = 0;
  presupuestoPorProductos(){
    let arrayTemp: any[] = [];
    let arrayAux = [];
    this.propPorProducto = [];
    this.totalProductos = 0;

    //! Creamos un arreglo con todos los productos sin importar el área
    for( let i = 0; i < this.articulos.length; i++ ){
      if(this.articulos[i]["desengrasante"].descripcion !== ''){
        arrayTemp.push({
          "producto": this.articulos[i]["desengrasante"].descripcion , 
          "Costo Mensual":this.articulos[i]["desengrasante"].costo_mensual,
          "Kg Mensual":this.articulos[i]["desengrasante"].gasto_mensual_producto
        });
      }
      if(this.articulos[i]["desincrustante"].descripcion !== ''){
        arrayTemp.push({
          "producto": this.articulos[i]["desincrustante"].descripcion, 
          "Costo Mensual":this.articulos[i]["desincrustante"].costo_mensual,
          "Kg Mensual":this.articulos[i]["desincrustante"].gasto_mensual_producto
        });
      }
      if(this.articulos[i]["sanitizante"].descripcion !== ''){
        arrayTemp.push({
          "producto": this.articulos[i]["sanitizante"].descripcion, 
          "Costo Mensual":this.articulos[i]["sanitizante"].costo_mensual,
          "Kg Mensual":this.articulos[i]["sanitizante"].gasto_mensual_producto
        });
      }  
    }
    
    for(let i = 0; i < arrayTemp.length; i++){
      
      arrayAux = this.propPorProducto.filter( resp => resp["producto"] == arrayTemp[i]["producto"]);
      if(arrayAux.length > 0){ 
        this.propPorProducto[this.propPorProducto.indexOf(arrayAux[0])]["Costo"] += arrayTemp[i]["Costo Mensual"];
        this.propPorProducto[this.propPorProducto.indexOf(arrayAux[0])]["Kg"] += arrayTemp[i]["Kg Mensual"];
      }else{
        this.propPorProducto.push({
          "producto": arrayTemp[i]["producto"],
          "Costo": arrayTemp[i]["Costo Mensual"],
          "Kg": arrayTemp[i]["Kg Mensual"],
        });
      }
    }

    this.propPorProducto.forEach( t=> this.totalProductos += t.Costo);
 
  }


  propAreaProducto: any[] = [];
  totalAreaProducto: number = 0;
  presupuestoAreaProducto(){
    let arrayTemp: any[] = [];
    let arrayAux: any[] = [];
    let arrayArea: any [] = [];
    let arrayProd: any[] = [];
    let arrayAreaProd: any [] = [];
    this.propAreaProducto = [];
    this.totalAreaProducto = 0;

    //! Dividiendo por área
    for(let i = 0; i< this.articulos.length; i++){
      arrayTemp = arrayArea.filter( resp => resp["area"] == this.articulos[i]["area"]);

      if(arrayTemp.length > 0 ){
        arrayArea[arrayArea.indexOf(arrayTemp[0])]["Productos"].push(this.articulos[i]);
        
      }else{
        arrayArea.push({
          "area": this.articulos[i]["area"], 
          "Productos":[this.articulos[i]]
        })
      }
   }   

   //! Clasificando por producto dentro del área
    for( let j = 0; j < arrayArea.length; j++){
      arrayProd = [];
      arrayArea[j]["Productos"].forEach( (p:any) => {
        if(p.desengrasante.descripcion !==''){
          arrayProd.push({
            "descripcion": p.desengrasante.descripcion,
            "precio": p.desengrasante.precio_kilo,
            "Gasto_Mensual": p.desengrasante.gasto_mensual_producto,
            "Costo_Mensual": p.desengrasante.costo_mensual
          });
        }

        if(p.desincrustante.descripcion !==''){
          arrayProd.push({
            "descripcion": p.desincrustante.descripcion,
            "precio": p.desincrustante.precio_kilo,
            "Gasto_Mensual": p.desincrustante.gasto_mensual_producto,
            "Costo_Mensual": p.desincrustante.costo_mensual
          });
        }

        if(p.sanitizante.descripcion !==''){
          arrayProd.push({
            "descripcion": p.sanitizante.descripcion,
            "precio": p.sanitizante.precio_kilo,
            "Gasto_Mensual": p.sanitizante.gasto_mensual_producto,
            "Costo_Mensual": p.sanitizante.costo_mensual
          });
        }
        
      });
      arrayAreaProd.push({
        "Area": arrayArea[j].area,
        "Producto":arrayProd
      });
    }

    for( let j = 0; j < arrayAreaProd.length; j++ ){
      arrayProd = [];

      arrayAreaProd[j]["Producto"].forEach( (p:any) => {
     
        arrayAux = arrayProd.filter( resp => resp["descripcion"] == p["descripcion"]);

        if( arrayAux.length > 0){
          arrayProd[arrayProd.indexOf(arrayAux[0])]["Gasto_Mensual"] += p["Gasto_Mensual"];
          arrayProd[arrayProd.indexOf(arrayAux[0])]["Costo_Mensual"] += p["Costo_Mensual"];
        }else{
          arrayProd.push({
            
              "descripcion": p["descripcion"],
              "precio":p["precio"],
              "Gasto_Mensual":p["Gasto_Mensual"],
              "Costo_Mensual": p["Costo_Mensual"]
            
          })
        }

      });
       this.propAreaProducto.push({
        "Area": arrayArea[j].area,
        "Producto":arrayProd
       });
    }
      
    this.propAreaProducto.forEach( p => {
      p.Producto.forEach( (t:any) => {
        this.totalAreaProducto += t.Costo_Mensual
       }
      );
    })

  }
}