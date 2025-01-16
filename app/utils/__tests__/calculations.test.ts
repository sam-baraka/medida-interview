import { calculateCenter, calculateDistance, formatDistance, formatTimestamp } from '../calculations';
import { Rectangle } from '../../types';

describe('Calculation Utils', () => {
  describe('calculateCenter', () => {
    it('should correctly calculate the center of a rectangle', () => {
      const rectangle: Rectangle = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      const center = calculateCenter(rectangle);
      expect(center).toEqual({ x: 50, y: 50 });
    });

    it('should handle non-zero starting positions', () => {
      const rectangle: Rectangle = {
        x: 50,
        y: 50,
        width: 100,
        height: 100
      };

      const center = calculateCenter(rectangle);
      expect(center).toEqual({ x: 100, y: 100 });
    });
  });

  describe('calculateDistance', () => {
    it('should calculate correct distance between two rectangles', () => {
      const rect1: Rectangle = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      const rect2: Rectangle = {
        x: 100,
        y: 100,
        width: 100,
        height: 100
      };

      const distance = calculateDistance(rect1, rect2);
      // Distance between (50,50) and (150,150) = sqrt(2) * 100
      expect(distance).toBeCloseTo(141.42, 2);
    });

    it('should handle overlapping rectangles', () => {
      const rect1: Rectangle = {
        x: 0,
        y: 0,
        width: 100,
        height: 100
      };

      const rect2: Rectangle = {
        x: 50,
        y: 50,
        width: 100,
        height: 100
      };

      const distance = calculateDistance(rect1, rect2);
      // Distance between (50,50) and (100,100) = sqrt(2) * 50
      expect(distance).toBeCloseTo(70.71, 2);
    });
  });

  describe('formatDistance', () => {
    it('should format distance to 2 decimal places', () => {
      expect(formatDistance(123.4567)).toBe('123.46');
      expect(formatDistance(123)).toBe('123.00');
      expect(formatDistance(123.4)).toBe('123.40');
    });
  });

  describe('formatTimestamp', () => {
    it('should format timestamp correctly', () => {
      const timestamp = '2025-01-16T09:00:00Z';
      const formatted = formatTimestamp(timestamp);
      expect(typeof formatted).toBe('string');
      expect(formatted.length).toBeGreaterThan(0);
    });
  });
});
