export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
export type IncidentStatus = 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';

export interface Incident {
  id: number | string;
  type: string;
  severity: IncidentSeverity;
  lat: number;
  lng: number;
  status: IncidentStatus;
  address: string;
  assignedAmbulanceId?: number;
  createdAt: string;
  updatedAt?: string;
  description?: string;
}

export interface CreateIncidentRequest {
  type: string;
  address: string;
  severity: IncidentSeverity;
  lat?: number;
  lng?: number;
  description?: string;
}

export interface AssignAmbulanceRequest {
  incidentId: number | string;
  ambulanceId: number;
}
