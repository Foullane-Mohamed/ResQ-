import { incidentsService } from '@/services/incidentsService';
import api from '@/services/api';
import { mockApiResponse, mockIncidents } from '@/test/utils';
import type { Incident } from '@/types';

// Mock the api module
jest.mock('@/services/api');
const mockedApi = api as jest.Mocked<typeof api>;

describe('IncidentsService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should fetch all incidents', async () => {
      mockedApi.get.mockResolvedValueOnce(mockApiResponse(mockIncidents));

      const result = await incidentsService.getAll();

      expect(mockedApi.get).toHaveBeenCalledWith('/incidents');
      expect(result).toEqual(mockIncidents);
    });

    it('should handle API errors', async () => {
      const errorMessage = 'Failed to fetch incidents';
      mockedApi.get.mockRejectedValueOnce(new Error(errorMessage));

      await expect(incidentsService.getAll()).rejects.toThrow(errorMessage);
    });
  });

  describe('getById', () => {
    it('should fetch incident by id', async () => {
      const incident = mockIncidents[0];
      mockedApi.get.mockResolvedValueOnce(mockApiResponse(incident));

      const result = await incidentsService.getById(1);

      expect(mockedApi.get).toHaveBeenCalledWith('/incidents/1');
      expect(result).toEqual(incident);
    });

    it('should handle not found error', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Incident not found'));

      await expect(incidentsService.getById(999)).rejects.toThrow('Incident not found');
    });
  });

  describe('create', () => {
    const newIncident = {
      type: 'Accident de vélo',
      severity: 'MODERATE' as const,
      lat: 48.8566,
      lng: 2.3522,
      address: '789 Rue de Rivoli, Paris',
    };

    it('should create new incident', async () => {
      const createdIncident: Incident = {
        id: 3,
        ...newIncident,
        status: 'PENDING',
        createdAt: '2023-11-28T15:00:00Z',
      };

      mockedApi.post.mockResolvedValueOnce(mockApiResponse(createdIncident));

      const result = await incidentsService.create(newIncident);

      expect(mockedApi.post).toHaveBeenCalledWith('/incidents', newIncident);
      expect(result).toEqual(createdIncident);
    });

    it('should handle validation errors', async () => {
      mockedApi.post.mockRejectedValueOnce(new Error('Validation failed'));

      await expect(incidentsService.create(newIncident)).rejects.toThrow('Validation failed');
    });
  });

  describe('update', () => {
    const updateData = {
      status: 'IN_PROGRESS' as const,
      assignedAmbulanceId: 2,
    };

    it('should update incident', async () => {
      const updatedIncident = { ...mockIncidents[0], ...updateData };
      mockedApi.patch.mockResolvedValueOnce(mockApiResponse(updatedIncident));

      const result = await incidentsService.update(1, updateData);

      expect(mockedApi.patch).toHaveBeenCalledWith('/incidents/1', updateData);
      expect(result).toEqual(updatedIncident);
    });

    it('should handle update errors', async () => {
      mockedApi.patch.mockRejectedValueOnce(new Error('Update failed'));

      await expect(incidentsService.update(1, updateData)).rejects.toThrow('Update failed');
    });
  });

  describe('delete', () => {
    it('should delete incident', async () => {
      mockedApi.delete.mockResolvedValueOnce(mockApiResponse({}));

      await incidentsService.delete(1);

      expect(mockedApi.delete).toHaveBeenCalledWith('/incidents/1');
    });

    it('should handle delete errors', async () => {
      mockedApi.delete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(incidentsService.delete(1)).rejects.toThrow('Delete failed');
    });
  });

  describe('assign', () => {
    it('should assign ambulance to incident', async () => {
      const assignedIncident = { ...mockIncidents[0], assignedAmbulanceId: 2, status: 'IN_PROGRESS' as const };
      mockedApi.patch.mockResolvedValueOnce(mockApiResponse(assignedIncident));

      const result = await incidentsService.assign(1, 2);

      expect(mockedApi.patch).toHaveBeenCalledWith('/incidents/1/assign', { ambulanceId: 2 });
      expect(result).toEqual(assignedIncident);
    });

    it('should handle assignment errors', async () => {
      mockedApi.patch.mockRejectedValueOnce(new Error('Assignment failed'));

      await expect(incidentsService.assign(1, 2)).rejects.toThrow('Assignment failed');
    });
  });
});
