import api from '../../../services/api';
import type { Incident, CreateIncidentRequest, AssignAmbulanceRequest } from '../types';

export class IncidentsService {
  async getAll(): Promise<Incident[]> {
    const response = await api.get('/incidents');
    return response.data;
  }

  async getById(id: number | string): Promise<Incident> {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  }

  async create(data: CreateIncidentRequest): Promise<Incident> {
    // Simulate geocoding if coordinates not provided
    if (!data.lat || !data.lng) {
      data.lat = 33.5731 + (Math.random() - 0.5) * 0.1;
      data.lng = -7.5898 + (Math.random() - 0.5) * 0.1;
    }

    const incident = {
      ...data,
      id: Date.now().toString(),
      status: 'PENDING' as const,
      createdAt: new Date().toISOString(),
    };

    const response = await api.post('/incidents', incident);
    return response.data;
  }

  async update(id: number | string, data: Partial<Incident>): Promise<Incident> {
    const response = await api.patch(`/incidents/${id}`, {
      ...data,
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  async assignAmbulance({ incidentId, ambulanceId }: AssignAmbulanceRequest): Promise<Incident> {
    const response = await api.patch(`/incidents/${incidentId}`, {
      assignedAmbulanceId: ambulanceId,
      status: 'IN_PROGRESS',
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }

  async resolve(id: number | string): Promise<Incident> {
    const response = await api.patch(`/incidents/${id}`, {
      status: 'RESOLVED',
      updatedAt: new Date().toISOString(),
    });
    return response.data;
  }
}

export const incidentsService = new IncidentsService();
