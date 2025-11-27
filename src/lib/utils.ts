import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: string | Date): string {
  return new Date(date).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString();
}

export function formatDateTime(date: string | Date): string {
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  })}`;
}

export function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}

export function findNearestAmbulance(incident: { lat: number; lng: number }, ambulances: Array<{ id: number; lat: number; lng: number; status: string }>) {
  const available = ambulances.filter(amb => amb.status === 'AVAILABLE');

  if (available.length === 0) return null;

  return available.reduce((nearest, current) => {
    const currentDistance = calculateDistance(incident.lat, incident.lng, current.lat, current.lng);
    const nearestDistance = calculateDistance(incident.lat, incident.lng, nearest.lat, nearest.lng);

    return currentDistance < nearestDistance ? current : nearest;
  });
}
