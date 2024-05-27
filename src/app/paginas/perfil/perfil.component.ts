import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { SapService } from '../../servicios/sap.service';
import { FirebaseService } from '../../servicios/firebase.service';

import Swal  from 'sweetalert2';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

import { PerfilModel } from 'src/app/models/perfil.model';
import { Observable } from 'rxjs';
import { Utils } from '../../servicios/utils.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  perfil = new PerfilModel();
  sucursales: any[] = [];
  giros: any;
  sistemas: any;
  perfiles:any;

  constructor(  private _serviceFirebase: FirebaseService, 
                private _serviceSap: SapService,
                private route: ActivatedRoute,
                private _utils: Utils) { 

    const id = this.route.snapshot.paramMap.get('id') || '';

    if( id !== 'nuevo' ){
      
      this._serviceFirebase.getPerfil( id )
        .subscribe( (resp: any) => {
          this.perfil = resp;
          this.perfil.id = id;
        });
    }

    this.cargarSocios();

    this._serviceSap.getSucursales().subscribe( sucursal => {
      this.sucursales = sucursal;
      this.sucursales.push({'Sucursal': 'IMPLEMENTACIÓN'});
    });
    
  }

  ngOnInit(): void {

    this.giros = this._utils.giros;
    this.sistemas = this._utils.sistemas;
    this.perfiles = this._utils.perfiles;
  }

   socios = [];
   sociosSel : any[] = [];

   socio: any;

   checkArray: any[]= [];
   tieneReferencia: boolean = false;
   tieneMarcas: boolean = false;
   tieneSocio:boolean =false;

  buscarSocioCod( termino: string){
     let sociosArr:any[] = [];

     for( let socio of this.socios ){
       let nombre: string = socio['numeroSocioNegocio'];  
       nombre = nombre.toLocaleLowerCase();

       if( nombre.indexOf( termino ) >= 0){
         sociosArr.push( socio )
       }
     }
     
     this.sociosSel =  sociosArr;
}

  getSocio( codigo: string){

     this.socio = '';
     codigo = codigo.toLocaleLowerCase();

     for(let s of this.socios){
       let cod: string = s['numeroSocioNegocio'];
       cod = cod.toLocaleLowerCase();

       if( cod.indexOf(codigo) >= 0){
         this.socio = s;
       }

     }

  }

  consultorValido: boolean = false;
  socioValido: boolean = false;

   campoInvalido(form: NgForm){

     if(this.perfil.socio === ''){
       this.socioValido = true;
     }

    if(form.control.get('consultor')?.invalid ){
      this.consultorValido = true;
    }

    
  }

  guardar( form: NgForm){
    
   if( form.invalid ){
    this.campoInvalido(form);
    return;
   }

   Swal.fire({
     title: 'Espere',
     text: 'Guardando información',
     icon: 'info',
     allowOutsideClick: false
   });
   Swal.showLoading();


   if(this.perfil.sistemaInocuidadCalidad.length == 0){
    this.perfil.sistemaInocuidadCalidad = [''];
   }

   let peticion: Observable<any>;
   
   this.perfil.fecha = new Date().toDateString();

   console.log(this.perfil);
    if( this.perfil.id ){
       peticion = this._serviceFirebase.actualizarPerfil( this.perfil );
     }else{
       peticion = this._serviceFirebase.crearPerfil( this.perfil );
     }
    peticion.subscribe( resp => {
      Swal.fire({
         title: this.perfil.socio,
         text: 'Se actualizó correctamente',
         icon: 'success'
       }).then( resp => {
        // this.router.navigateByUrl(`/psm/${ this.perfil.id }`);
       });
    });
 }
 
  cargarNumero( cod: string ){

    
     this.getSocio(cod);

     this.perfil.cod = cod;
     this.perfil.socio = this.socio.razonSocial;
     this.perfil.cliente_prospecto = this.socio.tipo;

  }
  
   cargarSocios(){
     this._serviceSap.getSociosNegocio().subscribe( data => {
       this.socios = data;
       }, err => {
       console.log( err.message);
      });
   }
   
  
 onCheckboxSistemas(e: any) {

  if(this.perfil.sistemaInocuidadCalidad){
    this.perfil.sistemaInocuidadCalidad.forEach( sis => {
      this.checkArray.push(sis);
    });
  }
     
    if( e.target.checked) {
      this.checkArray.push(e.target.value)
    }else{

      let i: number = 0;
      
      this.checkArray.forEach( item => {
        if(item == e.target.value){
        
          this.checkArray.splice(i,1);
          return
        }
         i++;
      });    
    }

    this.perfil.sistemaInocuidadCalidad = this.checkArray;

 }


  public downloadPDF(): void {
    const DATA = document.getElementById('htmlData')!;
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2
    };
    html2canvas(DATA, options).then((canvas) => {
      const img = canvas.toDataURL('image/PNG');
      // Add image Canvas to PDF
      const bufferX = 15;
      const bufferY = 15;
      const imgProps = (doc as any).getImageProperties(img);
      const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      doc.addImage(img, 'PNG', bufferX, bufferY, pdfWidth, pdfHeight, undefined, 'FAST');
      return doc;
    }).then((docResult) => {
      docResult.save(`Perfil_del_cliente_DNS-FO-005_${this.perfil.socio}.pdf`);
    });
  }

 }