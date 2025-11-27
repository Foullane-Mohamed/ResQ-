import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ambulancesService } from '../services/ambulancesService';
import type { CreateAmbulanceRequest, UpdateAmbulanceStatusRequest, AmbulanceStatus } from '../types';
import { findNearestAmbulance } from '../../../lib/utils';

export const useAmbulances = (filter?: AmbulanceStatus | 'ALL') => {
  const queryClient = useQueryClient();

  const {
    data: ambulances,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['ambulances'],
    queryFn: ambulancesService.getAll,
    refetchInterval: 30000, // Real-time updates
  });

  const createAmbulanceMutation = useMutation({
    mutationFn: ambulancesService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ambulancesService.updateStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  const deleteAmbulanceMutation = useMutation({
    mutationFn: ambulancesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  // Filtered ambulances
  const filteredAmbulances = filter && filter !== 'ALL'
    ? ambulances?.filter(a => a.status === filter) || []
    : ambulances || [];

  // Computed values
  const availableAmbulances = ambulances?.filter(a => a.status === 'AVAILABLE') || [];
  const busyAmbulances = ambulances?.filter(a => a.status === 'BUSY') || [];
  const maintenanceAmbulances = ambulances?.filter(a => a.status === 'MAINTENANCE') || [];

  // Statistics
  const stats = {
    total: ambulances?.length || 0,
    available: availableAmbulances.length,
    busy: busyAmbulances.length,
    maintenance: maintenanceAmbulances.length,
    byType: {
      A: ambulances?.filter(a => a.type === 'A').length || 0,
      B: ambulances?.filter(a => a.type === 'B').length || 0,
      C: ambulances?.filter(a => a.type === 'C').length || 0,
    },
  };

  // Helper function to find nearest available ambulance
  const findNearest = (location: { lat: number; lng: number }) => {
    if (!ambulances) return null;
    return findNearestAmbulance(location, ambulances);
  };

  return {
    ambulances: filteredAmbulances,
    allAmbulances: ambulances || [],
    availableAmbulances,
    busyAmbulances,
    maintenanceAmbulances,
    stats,
    isLoading,
    error,
    refetch,
    findNearest,
    createAmbulance: (data: CreateAmbulanceRequest) => createAmbulanceMutation.mutate(data),
    updateStatus: (data: UpdateAmbulanceStatusRequest) => updateStatusMutation.mutate(data),
    deleteAmbulance: (id: number) => deleteAmbulanceMutation.mutate(id),
    isCreating: createAmbulanceMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isDeleting: deleteAmbulanceMutation.isPending,
  };
};
