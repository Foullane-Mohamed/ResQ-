export type AmbulanceStatus = 'AVAILABLE' | 'BUSY' | 'MAINTENANCE';
export type AmbulanceType = 'A' | 'B' | 'C';

export interface Ambulance {
  id: number;
  name: string;
  status: AmbulanceStatus;
  lat: number;
  lng: number;
  type: AmbulanceType;
  crew?: string[];
  lastUpdate?: string;
}

export interface CreateAmbulanceRequest {
  name: string;
  type: AmbulanceType;
  lat: number;
  lng: number;
  crew?: string[];
}

export interface UpdateAmbulanceStatusRequest {
  id: number;
  status: AmbulanceStatus;
}

export interface UpdateAmbulanceLocationRequest {
  id: number;
  lat: number;
  lng: number;
}
