import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentsService } from '../services/incidentsService';
import type { CreateIncidentRequest, AssignAmbulanceRequest } from '../services/incidentsService';

export const useIncidents = () => {
  const queryClient = useQueryClient();

  const {
    data: incidents,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['incidents'],
    queryFn: incidentsService.getAll,
    refetchInterval: 30000, // Refetch every 30 seconds for real-time updates
  });

  const createIncidentMutation = useMutation({
    mutationFn: incidentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  const assignAmbulanceMutation = useMutation({
    mutationFn: incidentsService.assignAmbulance,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  const resolveIncidentMutation = useMutation({
    mutationFn: incidentsService.resolve,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
      queryClient.invalidateQueries({ queryKey: ['ambulances'] });
    },
  });

  const updateIncidentMutation = useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: any }) =>
      incidentsService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  const activeIncidents = incidents?.filter(i => i.status !== 'RESOLVED') || [];
  const criticalIncidents = incidents?.filter(i => i.severity === 'CRITICAL' && i.status !== 'RESOLVED') || [];
  const resolvedIncidents = incidents?.filter(i => i.status === 'RESOLVED') || [];

  const stats = {
    total: incidents?.length || 0,
    active: activeIncidents.length,
    critical: criticalIncidents.length,
    resolved: resolvedIncidents.length,
    bySeverity: {
      CRITICAL: incidents?.filter(i => i.severity === 'CRITICAL').length || 0,
      HIGH: incidents?.filter(i => i.severity === 'HIGH').length || 0,
      MODERATE: incidents?.filter(i => i.severity === 'MODERATE').length || 0,
      LOW: incidents?.filter(i => i.severity === 'LOW').length || 0,
    },
  };

  return {
    incidents: incidents || [],
    activeIncidents,
    criticalIncidents,
    resolvedIncidents,
    stats,
    isLoading,
    error,
    refetch,
    createIncident: (data: CreateIncidentRequest) => createIncidentMutation.mutate(data),
    assignAmbulance: (data: AssignAmbulanceRequest) => assignAmbulanceMutation.mutate(data),
    resolveIncident: (id: number | string) => resolveIncidentMutation.mutate(id),
    updateIncident: (id: number | string, data: any) => updateIncidentMutation.mutate({ id, data }),
    isCreating: createIncidentMutation.isPending,
    isAssigning: assignAmbulanceMutation.isPending,
    isResolving: resolveIncidentMutation.isPending,
    isUpdating: updateIncidentMutation.isPending,
  };
};
