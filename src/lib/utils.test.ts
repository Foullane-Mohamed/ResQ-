import { cn, formatTime, formatDate, formatDateTime, calculateDistance, findNearestAmbulance } from '@/lib/utils';

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('px-2 py-1', 'bg-red-500')).toBe('px-2 py-1 bg-red-500');
    });

    it('should handle conditional classes', () => {
      expect(cn('px-2', true && 'py-1', false && 'bg-blue-500')).toBe('px-2 py-1');
    });

    it('should merge tailwind classes', () => {
      expect(cn('px-2 px-4')).toBe('px-4');
    });
  });

  describe('formatTime', () => {
    it('should format time correctly', () => {
      const date = new Date('2023-11-28T14:30:00Z');
      const formatted = formatTime(date);
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });

    it('should format time from string', () => {
      const formatted = formatTime('2023-11-28T14:30:00Z');
      expect(formatted).toMatch(/\d{1,2}:\d{2}/);
    });
  });
  describe('formatDate', () => {
    it('should format date correctly', () => {
      const date = new Date('2023-11-28T14:30:00Z');
      const formatted = formatDate(date);
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2023');
    });

    it('should format date from string', () => {
      const formatted = formatDate('2023-11-28T14:30:00Z');
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2023');
    });
  });

  describe('formatDateTime', () => {
    it('should format date and time correctly', () => {
      const date = new Date('2023-11-28T14:30:00Z');
      const formatted = formatDateTime(date);
      expect(formatted).toBeTruthy();
      expect(formatted).toContain('2023');
      expect(formatted.length).toBeGreaterThan(10);
    });
  });

  describe('calculateDistance', () => {
    it('should calculate distance between two points', () => {
      // Paris to Lyon (approximately 390km)
      const parisLat = 48.8566;
      const parisLng = 2.3522;
      const lyonLat = 45.7640;
      const lyonLng = 4.8357;

      const distance = calculateDistance(parisLat, parisLng, lyonLat, lyonLng);
      expect(distance).toBeGreaterThan(380);
      expect(distance).toBeLessThan(410);
    });

    it('should return 0 for same coordinates', () => {
      const distance = calculateDistance(48.8566, 2.3522, 48.8566, 2.3522);
      expect(distance).toBe(0);
    });
  });

  describe('findNearestAmbulance', () => {
    const incident = { lat: 48.8566, lng: 2.3522 };
    const ambulances = [
      { id: 1, lat: 48.8606, lng: 2.3376, status: 'AVAILABLE' },
      { id: 2, lat: 48.8506, lng: 2.3622, status: 'AVAILABLE' },
      { id: 3, lat: 48.9000, lng: 2.4000, status: 'BUSY' },
      { id: 4, lat: 48.8566, lng: 2.3522, status: 'AVAILABLE' }, // Same location
    ];

    it('should find the nearest available ambulance', () => {
      const nearest = findNearestAmbulance(incident, ambulances);
      expect(nearest?.id).toBe(4); // Same location should be nearest
    });

    it('should return null if no ambulances are available', () => {
      const busyAmbulances = ambulances.map(amb => ({ ...amb, status: 'BUSY' }));
      const nearest = findNearestAmbulance(incident, busyAmbulances);
      expect(nearest).toBeNull();
    });

    it('should ignore busy ambulances', () => {
      const mixedAmbulances = [
        { id: 1, lat: 48.8566, lng: 2.3522, status: 'BUSY' }, // Closest but busy
        { id: 2, lat: 48.8606, lng: 2.3376, status: 'AVAILABLE' },
      ];
      const nearest = findNearestAmbulance(incident, mixedAmbulances);
      expect(nearest?.id).toBe(2);
    });
  });
});
