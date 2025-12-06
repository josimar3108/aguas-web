export interface Incident {
  id: string;
  type: string;
  description: string;
  latitude: number;
  longitude: number;
  address?: string;
  weather?: string;
  temperature?: number;
  fecha: string;
  status: string;
  severity?: string;
}
