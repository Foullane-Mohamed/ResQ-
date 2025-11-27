export type AmbulanceStatus = 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type IncidentStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface Ambulance {
  id: number;
  name: string;
  status: AmbulanceStatus;
  lat: number;
  lng: number;
  type: string; 
  crew?: string[];
}

export interface Incident {
  id: number;
  type: string;
  severity: IncidentSeverity;
  lat: number;
  lng: number;
  status: IncidentStatus;
  address: string;
  assignedAmbulanceId?: number; 
  createdAt: string;
}