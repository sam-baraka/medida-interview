/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useRef, useEffect, useState, useCallback } from 'react';
import { Rectangle, Point } from '../types';

interface CanvasProps {
  rectangles: Rectangle[];
  onRectangleDrawn: (rectangle: Rectangle) => void;
  onClear: () => void;
  readonly?: boolean;
}

interface HistoryState {
  past: Rectangle[][];
  present: Rectangle[];
  future: Rectangle[][];
}

export default function Canvas({ rectangles, onRectangleDrawn, onClear, readonly = false }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPoint, setStartPoint] = useState<Point | null>(null);
  const [currentRect, setCurrentRect] = useState<Rectangle | null>(null);
  const [currentPoint, setCurrentPoint] = useState<Point | null>(null);
  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: rectangles,
    future: []
  });

  useEffect(() => {
    setHistory(prev => ({
      ...prev,
      present: rectangles
    }));
  }, [rectangles]);

  const undo = useCallback(() => {
    if (history.past.length === 0) return;
    
    const newPast = history.past.slice(0, -1);
    const newPresent = history.past[history.past.length - 1];
    const newFuture = [history.present, ...history.future];
    
    setHistory({
      past: newPast,
      present: newPresent,
      future: newFuture
    });
    
    // Update parent component
    onRectangleDrawn(newPresent[newPresent.length - 1]);
  }, [history, onRectangleDrawn]);

  const redo = useCallback(() => {
    if (history.future.length === 0) return;
    
    const newFuture = history.future.slice(1);
    const newPresent = history.future[0];
    const newPast = [...history.past, history.present];
    
    setHistory({
      past: newPast,
      present: newPresent,
      future: newFuture
    });
    
    // Update parent component
    onRectangleDrawn(newPresent[newPresent.length - 1]);
  }, [history, onRectangleDrawn]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' && (e.metaKey || e.ctrlKey)) {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    
    // Calculate position considering any scaling
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const createRect = (start: Point, end: Point): Rectangle => {
    return {
      x: Math.min(start.x, end.x),
      y: Math.min(start.y, end.y),
      width: Math.abs(end.x - start.x),
      height: Math.abs(end.y - start.y)
    };
  };

  const handleStart = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (readonly || history.present.length >= 2) return;
    if ('touches' in e) e.preventDefault(); // Prevent scrolling on touch

    setIsDrawing(true);
    setStartPoint(getMousePos(e));
  };

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || readonly || history.present.length >= 2) return;
    if ('touches' in e) e.preventDefault(); // Prevent scrolling on touch

    const pos = getMousePos(e);
    setCurrentPoint(pos);
    if (startPoint) {
      const newRect = createRect(startPoint, pos);
      setCurrentRect(newRect);
      drawCanvas([...history.present, newRect]);
    }
  };

  const handleEnd = () => {
    if (!isDrawing || !currentRect || !startPoint) return;

    setIsDrawing(false);
    setCurrentRect(null);
    setStartPoint(null);
    
    const newRectangles = [...history.present, currentRect];
    setHistory({
      past: [...history.past, history.present],
      present: newRectangles,
      future: []
    });
    
    drawCanvas(newRectangles);
    onRectangleDrawn(newRectangles[newRectangles.length - 1]);
  };

  const handleCancel = () => {
    setIsDrawing(false);
    setCurrentRect(null);
    setStartPoint(null);
    setCurrentPoint(null);
    drawCanvas(history.present);
  };

  const drawCanvas = useCallback((rectangles: Rectangle[]) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid
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

    // Draw rectangles
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
  }, []);

  // Update canvas when history changes
  useEffect(() => {
    drawCanvas(history.present);
  }, [history.present, drawCanvas]);

  const handleClear = () => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: [],
      future: []
    }));
    onClear();
  };

  return (
    <div className="relative">
      <div className="relative group">
        <canvas
          ref={canvasRef}
          width={800}
          height={600}
          data-testid="drawing-canvas"
          className="w-full h-full border-2 border-gray-200 rounded-lg bg-white cursor-crosshair shadow-inner touch-none"
          onMouseDown={handleStart}
          onMouseMove={handleMove}
          onMouseUp={handleEnd}
          onMouseLeave={handleCancel}
          onTouchStart={handleStart}
          onTouchMove={handleMove}
          onTouchEnd={handleEnd}
          onTouchCancel={handleCancel}
        />
        {history.present.length < 2 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-gray-400 text-sm bg-white/80 px-4 py-2 rounded-full">
              Click and drag to draw a rectangle
            </p>
          </div>
        )}
      </div>
      {!readonly && (
        <>
          <button
            onClick={handleClear}
            className="absolute top-4 right-4 px-4 py-2 bg-white text-red-600 rounded-lg hover:bg-red-50 transition-colors border border-red-200 shadow-sm"
          >
            Clear Canvas
          </button>
          <div className="absolute top-4 left-4 space-x-2">
            <button
              onClick={undo}
              disabled={history.past.length === 0}
              className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="undo-button"
              title="Undo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M9 14L4 9l5-5" />
                <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
              </svg>
            </button>
            <button
              onClick={redo}
              disabled={history.future.length === 0}
              className="p-2 bg-white text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors border border-indigo-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              data-testid="redo-button"
              title="Redo"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 14l5-5-5-5" />
                <path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13" />
              </svg>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
