export interface Incident {
    id?: string | number;
    type: string;
    description: string;
    severity?: string;
    status?: string;
    latitude: number;
    longitude: number;
    weather?: string;
    createdAt?: string | Date;
}
