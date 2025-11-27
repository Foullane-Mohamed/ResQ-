import api from '../../../services/api';
import type { Ambulance, CreateAmbulanceRequest, UpdateAmbulanceStatusRequest, UpdateAmbulanceLocationRequest } from '../types';

export class AmbulancesService {
  async getAll(): Promise<Ambulance[]> {
    const response = await api.get('/ambulances');
    return response.data;
  }

  async getById(id: number): Promise<Ambulance> {
    const response = await api.get(`/ambulances/${id}`);
    return response.data;
  }

  async create(data: CreateAmbulanceRequest): Promise<Ambulance> {
    const ambulance = {
      ...data,
      id: Date.now(),
      status: 'AVAILABLE' as const,
      lastUpdate: new Date().toISOString(),
    };

    const response = await api.post('/ambulances', ambulance);
    return response.data;
  }

  async updateStatus({ id, status }: UpdateAmbulanceStatusRequest): Promise<Ambulance> {
    const response = await api.patch(`/ambulances/${id}`, {
      status,
      lastUpdate: new Date().toISOString(),
    });
    return response.data;
  }

  async updateLocation({ id, lat, lng }: UpdateAmbulanceLocationRequest): Promise<Ambulance> {
    const response = await api.patch(`/ambulances/${id}`, {
      lat,
      lng,
      lastUpdate: new Date().toISOString(),
    });
    return response.data;
  }

  async delete(id: number): Promise<void> {
    await api.delete(`/ambulances/${id}`);
  }
}

export const ambulancesService = new AmbulancesService();
