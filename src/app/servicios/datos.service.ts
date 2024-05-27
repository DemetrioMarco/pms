import { EventEmitter, Injectable, Output } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DatosService {

  @Output() envioArticulos: EventEmitter<any> = new EventEmitter();

  constructor() {
   }
}
