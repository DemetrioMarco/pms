export class SanitizanteModel{

    codigo:         string = '';
    descripcion:    string = '';
    precio_kilo:    number = 0;
    eventos_mes:    number = 0; 
    concentracion:  number = 0;
    gasto_solucion: number = 0;
    densidad:       number = 0;
    ml_g:           number = 0;
    carga_dia:      number = 0;
    pa:             number = 50000;
    cargas_dia:     number = 0;

    // calculos
    preparacion: number = 0;
    gasto_sol_mensual: number = 0;
    gasto_mensual_producto: number = 0;
    costo_mensual: number = 0;
    
}