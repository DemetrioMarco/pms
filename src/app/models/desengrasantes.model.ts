export class DesengrasantesModel{

    descripcion: string = '';
    codigo: string = '';
    precio_kilo: number = 0;
    eventos_mes: number = 0; 
    dilucion: number = 0;
    gasto_solucion: number = 0;
    densidad: number = 0;

    // lavanderia
    dia_operacion: number = 0;
    ml_g : number = 0;
    kg: number = 0;
    pzas_carga: number = 0;
    pzas_dia: number = 0;

    //TODO: carga por día se puede capturar directo o pzas_carga * pzas_dia
    carga_dia: number = 0;

    // calculos
    preparacion: number = 0;
    gasto_sol_mensual: number = 0;
    gasto_mensual_producto: number = 0;
    costo_mensual: number = 0;


}