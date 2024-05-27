import { DesengrasantesModel } from './desengrasantes.model';
import { DesincrustanteModel } from './desincrustante.model';
import { SanitizanteModel } from './sanitizante.model';

export class ArticuloModel{

    id?: string = '';
    area: string = '';
    equipo: string = '';
    procedimiento: string = '';
    aplicacion: string = '';

    desengrasante = new DesengrasantesModel();

    desincrustante = new DesincrustanteModel();
    
    sanitizante = new SanitizanteModel();
}