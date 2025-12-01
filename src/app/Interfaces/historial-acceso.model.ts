export type ResultadoAcceso = 'exitoso'|'fallido'|'bloqueado';

export interface HistorialAcceso {
    id: number;
    fecha: string;
    usuario: string;
    ip: string;
    navegador: string;
    resultado: ResultadoAcceso | string;
    intentos: number;
    ubicacion?: string;
}
