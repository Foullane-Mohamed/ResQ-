import type { User } from '../services/authService';

export type Permission =
  | 'VIEW_AMBULANCE_MAP'
  | 'CREATE_INCIDENT'
  | 'ASSIGN_AMBULANCE'
  | 'FILTER_AMBULANCES'
  | 'MODIFY_AMBULANCE_STATUS'
  | 'VIEW_INCIDENT_HISTORY'
  | 'RECEIVE_CRITICAL_NOTIFICATIONS'
  | 'VIEW_FLEET_STATUS'
  | 'ADD_REMOVE_VEHICLES'
  | 'MANAGE_VEHICLE_AVAILABILITY'
  | 'FULL_ADMIN_ACCESS';

export const ROLE_PERMISSIONS: Record<string, Permission[]> = {
  ADMIN: [
    'FULL_ADMIN_ACCESS',
    'VIEW_AMBULANCE_MAP',
    'CREATE_INCIDENT',
    'ASSIGN_AMBULANCE',
    'FILTER_AMBULANCES',
    'MODIFY_AMBULANCE_STATUS',
    'VIEW_INCIDENT_HISTORY',
    'RECEIVE_CRITICAL_NOTIFICATIONS',
    'VIEW_FLEET_STATUS',
    'ADD_REMOVE_VEHICLES',
    'MANAGE_VEHICLE_AVAILABILITY',
  ],
  REGULATEUR: [
    'VIEW_AMBULANCE_MAP',
    'CREATE_INCIDENT',
    'ASSIGN_AMBULANCE',
    'FILTER_AMBULANCES',
    'MODIFY_AMBULANCE_STATUS',
    'VIEW_INCIDENT_HISTORY',
    'RECEIVE_CRITICAL_NOTIFICATIONS',
  ],
  CHEF_DE_PARC: [
    'VIEW_FLEET_STATUS',
    'ADD_REMOVE_VEHICLES',
    'MANAGE_VEHICLE_AVAILABILITY',
    'VIEW_AMBULANCE_MAP',
  ],
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;

  const userPermissions = ROLE_PERMISSIONS[user.role] || [];
  return userPermissions.includes(permission) || userPermissions.includes('FULL_ADMIN_ACCESS');
};

export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user) return [];
  return ROLE_PERMISSIONS[user.role] || [];
};

export const canAccessPage = (user: User | null, page: string): boolean => {
  if (!user) return false;

  const pagePermissions: Record<string, Permission[]> = {
    dashboard: ['VIEW_AMBULANCE_MAP', 'VIEW_FLEET_STATUS'],
    map: ['VIEW_AMBULANCE_MAP'],
    fleet: ['VIEW_FLEET_STATUS', 'MANAGE_VEHICLE_AVAILABILITY'],
    incidents: ['VIEW_INCIDENT_HISTORY', 'CREATE_INCIDENT'],
  };

  const requiredPermissions = pagePermissions[page] || [];
  return requiredPermissions.some(permission => hasPermission(user, permission));
};
