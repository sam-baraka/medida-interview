import { Rectangle, Point } from '../types';

export const calculateCenter = (rect: Rectangle): Point => ({
  x: rect.x + rect.width / 2,
  y: rect.y + rect.height / 2,
});

export const calculateDistance = (rect1: Rectangle, rect2: Rectangle): number => {
  const center1 = calculateCenter(rect1);
  const center2 = calculateCenter(rect2);
  
  return Math.sqrt(
    Math.pow(center2.x - center1.x, 2) + Math.pow(center2.y - center1.y, 2)
  );
};

export const formatDistance = (distance: number): string => {
  return distance.toFixed(2);
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};
