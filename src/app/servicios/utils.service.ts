import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class Utils {

    sistemas: Array<any> = [
        {nombre: 'BPM',       value:'bpm'      },
        {nombre: 'HACCP',     value:'haccp'    },
        {nombre: 'TIF',       value:'tif'      },
        {nombre: 'ISO 9000',  value:'iso9000'  },
        {nombre: 'AIF',       value:'aif'      },
        {nombre: 'SILLIKER',  value:'silliker' },
        {nombre: 'ISO 22000', value:'iso22000' }
    ]
   
    perfiles: Array<any> = [
        {nombre: 'Amante de la Sanidad', value:'amante'},
        {nombre: 'Visionario',           value:'visionario'},
        {nombre: 'Atrapado',             value:'atrapado'},
        {nombre: 'Oportunista',          value:'oportunista'},
        {nombre: 'Cochino',              value:'cochino'},
    ]

    giros: Array<any> = [
        { nombre: 'BEBIDAS',                           value:'bebidas'},
        { nombre: 'FRITURAS Y BOTANAS ',               value:'frituras_botanas'},
        { nombre: 'CARNICOS',                          value:'carnicos'},
        { nombre: 'CONSERVAS',                         value:'conservas'},
        { nombre: 'DERIVADOS DE CEREAL',               value:'derivados_cereal'},
        { nombre: 'FARMACEUTICA',                      value:'farmaceutica'},
        { nombre: 'FRUTAS, VEGETALES Y LEGUMINOSAS' ,  value:'frutas_vegetales_leguminosas'},
        { nombre: 'INSTITUCIONAL',                     value:'institucional'},
        { nombre: 'LACTEOS',                           value:'lacteos'},
        { nombre: 'ALIMENTOS INDUSTRIALIZADOS',        value:'alimentos_industrializados'},
        { nombre: 'TRANSPORTE, GRADO ALIMENTICIOS',    value:'transporte_grado_alimenticios'}
    ]

    procedimientos: Array<any> = [
        { nombre: 'Pre-Operacional', value:'Pre-Operacional' },
        { nombre: 'Sanidad',         value:'Sanidad' },
        { nombre: 'Operativo',       value:'Operativo' },
    ]
    
    aplicaciones: Array<any> = [
        { nombre: 'CIP',                   value:'cip'},
        { nombre: 'Directa',               value:'directa'},
        { nombre: 'Inmersión',             value:'inmersion'},
        { nombre: 'Intervención MP/PT',    value:'intervencion'},
        { nombre: 'Inundación',            value:'inundacion'},
        { nombre: 'Lavandería',            value:'lavanderia'},
        { nombre: 'Nebulización',          value:'nebulizacion'},
        { nombre: 'Recirculación',         value:'receirculacion'},
    ]
}