export type AccionTipo = 'login'|'logout'|'create'|'update'|'delete'|'status-change'|'config-change';

export interface HistorialAccion {
    id: number;
    fecha: string;
    administrador: string;
    accion: AccionTipo | string;
    modulo: string;
    descripcion: string;
}
