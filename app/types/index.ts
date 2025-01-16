export interface Rectangle {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MeasurementRecord {
  id: string;
  rectangles: [Rectangle, Rectangle];
  distance: number;
  createdAt: string;
}

export interface Point {
  x: number;
  y: number;
}
