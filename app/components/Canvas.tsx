'use client';

import { useRef, useEffect, useState, MouseEvent } from 'react';
import { Rectangle, Point } from '../types';

interface CanvasProps {
  rectangles: Rectangle[];
  onRectangleDrawn: (rectangle: Rectangle) => void;
  onClear: () => void;
  readonly?: boolean;
}

export default function Canvas({ rectangles, onRectangleDrawn, onClear, readonly = false }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Add grid pattern
    const gridSize = 20;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvas.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvas.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // Draw existing rectangles with gradient fill
    rectangles.forEach((rect, index) => {
      ctx.save();
      
      // Create gradient
      const gradient = ctx.createLinearGradient(
        rect.x, rect.y, 
        rect.x + rect.width, rect.y + rect.height
      );
      
      if (index === 0) {
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.2)');
        ctx.strokeStyle = '#4F46E5';
      } else {
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)');
        ctx.strokeStyle = '#9333EA';
      }
      
      ctx.fillStyle = gradient;
      ctx.lineWidth = 2;
      
      // Draw rectangle with rounded corners
      const radius = 4;
      ctx.beginPath();
      ctx.moveTo(rect.x + radius, rect.y);
      ctx.lineTo(rect.x + rect.width - radius, rect.y);
      ctx.quadraticCurveTo(rect.x + rect.width, rect.y, rect.x + rect.width, rect.y + radius);
      ctx.lineTo(rect.x + rect.width, rect.y + rect.height - radius);
      ctx.quadraticCurveTo(rect.x + rect.width, rect.y + rect.height, rect.x + rect.width - radius, rect.y + rect.height);
      ctx.lineTo(rect.x + radius, rect.y + rect.height);
      ctx.quadraticCurveTo(rect.x, rect.y + rect.height, rect.x, rect.y + rect.height - radius);
      ctx.lineTo(rect.x, rect.y + radius);
      ctx.quadraticCurveTo(rect.x, rect.y, rect.x + radius, rect.y);
      ctx.closePath();
      
      ctx.fill();
      ctx.stroke();
      
      // Draw center point
      const centerX = rect.x + rect.width / 2;
      const centerY = rect.y + rect.height / 2;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, 3, 0, Math.PI * 2);
      ctx.fillStyle = index === 0 ? '#4F46E5' : '#9333EA';
      ctx.fill();
      
      ctx.restore();
    });

    // Draw line between centers if two rectangles exist
    if (rectangles.length === 2) {
      const center1 = {
        x: rectangles[0].x + rectangles[0].width / 2,
        y: rectangles[0].y + rectangles[0].height / 2
      };
      const center2 = {
        x: rectangles[1].x + rectangles[1].width / 2,
        y: rectangles[1].y + rectangles[1].height / 2
      };

      ctx.beginPath();
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = '#6366F1';
      ctx.moveTo(center1.x, center1.y);
      ctx.lineTo(center2.x, center2.y);
      ctx.stroke();
      ctx.setLineDash([]);
    }
  }, [rectangles]);

  const getMousePos = (e: MouseEvent): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (readonly || rectangles.length >= 2) return;
    
    setIsDrawing(true);
    setStartPoint(getMousePos(e));
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDrawing || !startPoint || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    const currentPoint = getMousePos(e);

    // Redraw canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Redraw grid
    const gridSize = 20;
    ctx.strokeStyle = '#f0f0f0';
    ctx.lineWidth = 1;
    
    for (let x = 0; x <= canvasRef.current.width; x += gridSize) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvasRef.current.height);
      ctx.stroke();
    }
    
    for (let y = 0; y <= canvasRef.current.height; y += gridSize) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvasRef.current.width, y);
      ctx.stroke();
    }

    // Redraw existing rectangles
    rectangles.forEach((rect, index) => {
      ctx.save();
      const gradient = ctx.createLinearGradient(
        rect.x, rect.y, 
        rect.x + rect.width, rect.y + rect.height
      );
      
      if (index === 0) {
        gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
        gradient.addColorStop(1, 'rgba(79, 70, 229, 0.2)');
        ctx.strokeStyle = '#4F46E5';
      } else {
        gradient.addColorStop(0, 'rgba(147, 51, 234, 0.1)');
        gradient.addColorStop(1, 'rgba(147, 51, 234, 0.2)');
        ctx.strokeStyle = '#9333EA';
      }
      
      ctx.fillStyle = gradient;
      ctx.lineWidth = 2;
      
      ctx.fillRect(rect.x, rect.y, rect.width, rect.height);
      ctx.strokeRect(rect.x, rect.y, rect.width, rect.height);
      
      ctx.restore();
    });

    // Draw current rectangle
    const width = currentPoint.x - startPoint.x;
    const height = currentPoint.y - startPoint.y;
    
    ctx.save();
    const gradient = ctx.createLinearGradient(
      startPoint.x, startPoint.y,
      startPoint.x + width, startPoint.y + height
    );
    gradient.addColorStop(0, 'rgba(79, 70, 229, 0.1)');
    gradient.addColorStop(1, 'rgba(79, 70, 229, 0.2)');
    
    ctx.fillStyle = gradient;
    ctx.strokeStyle = '#4F46E5';
    ctx.lineWidth = 2;
    
    ctx.fillRect(startPoint.x, startPoint.y, width, height);
    ctx.strokeRect(startPoint.x, startPoint.y, width, height);
    ctx.restore();
  };

  const handleMouseUp = (e: MouseEvent) => {
    if (!isDrawing || !startPoint) return;

    const endPoint = getMousePos(e);
    const newRect: Rectangle = {
      x: Math.min(startPoint.x, endPoint.x),
      y: Math.min(startPoint.y, endPoint.y),
      width: Math.abs(endPoint.x - startPoint.x),
      height: Math.abs(endPoint.y - startPoint.y)
    };

    onRectangleDrawn(newRect);
    setIsDrawing(false);
    setStartPoint(null);
  };

  return (
    <div className="relative">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          data-testid="drawing-canvas"
          className="w-full h-full border-2 border-gray-200 rounded-lg bg-white cursor-crosshair shadow-inner"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={() => setIsDrawing(false)}
        />
        {!readonly && rectangles.length < 2 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-gray-400 text-sm bg-white/80 px-4 py-2 rounded-full">
              Click and drag to draw a rectangle
            </p>
          </div>
        )}
      </div>
      {!readonly && (
        <button
          onClick={onClear}
          className="absolute top-4 right-4 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-red-200 shadow-sm"
        >
          Clear Canvas
        </button>
      )}
    </div>
  );
}
