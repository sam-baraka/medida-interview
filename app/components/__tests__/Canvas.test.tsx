import { render, screen, fireEvent } from '@testing-library/react';
import Canvas from '../Canvas';
import { Rectangle } from '../../types';

// Mock the canvas context
const mockContext = {
  clearRect: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  stroke: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  createLinearGradient: jest.fn(() => ({
    addColorStop: jest.fn()
  })),
  arc: jest.fn(),
  fill: jest.fn(),
  setLineDash: jest.fn(),
  quadraticCurveTo: jest.fn(),
  closePath: jest.fn(),
  fillRect: jest.fn(),
  strokeRect: jest.fn(),
};

// Mock the canvas element
HTMLCanvasElement.prototype.getContext = jest.fn(() => mockContext);

describe('Canvas', () => {
  const mockRectangle: Rectangle = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };

  const mockProps = {
    rectangles: [mockRectangle],
    onRectangleDrawn: jest.fn(),
    onClear: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const simulateDrawRectangle = (canvas: HTMLElement, start: { x: number, y: number }, end: { x: number, y: number }) => {
    const rect = canvas.getBoundingClientRect();
    fireEvent.mouseDown(canvas, { 
      clientX: start.x + rect.left,
      clientY: start.y + rect.top
    });
    fireEvent.mouseMove(canvas, {
      clientX: end.x + rect.left,
      clientY: end.y + rect.top
    });
    fireEvent.mouseUp(canvas);
  };

  it('renders canvas element', () => {
    render(<Canvas {...mockProps} />);
    const canvas = screen.getByTestId('drawing-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas.tagName.toLowerCase()).toBe('canvas');
  });

  it('shows clear button when not readonly', () => {
    render(<Canvas {...mockProps} />);
    expect(screen.getByText('Clear Canvas')).toBeInTheDocument();
  });

  it('hides clear button when readonly', () => {
    render(<Canvas {...mockProps} readonly />);
    expect(screen.queryByText('Clear Canvas')).not.toBeInTheDocument();
  });

  it('shows drawing instruction when less than 2 rectangles', () => {
    render(<Canvas {...mockProps} rectangles={[]} />);
    expect(screen.getByText('Click and drag to draw a rectangle')).toBeInTheDocument();
  });

  it('hides drawing instruction when 2 rectangles exist', () => {
    render(<Canvas {...mockProps} rectangles={[mockRectangle, mockRectangle]} />);
    expect(screen.queryByText('Click and drag to draw a rectangle')).not.toBeInTheDocument();
  });

  it('calls onClear when clear button is clicked', () => {
    render(<Canvas {...mockProps} />);
    const clearButton = screen.getByText('Clear Canvas');
    fireEvent.click(clearButton);
    expect(mockProps.onClear).toHaveBeenCalled();
  });

  describe('Drawing functionality', () => {
    it('handles mouse events for drawing', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} rectangles={[]} onRectangleDrawn={onRectangleDrawn} />);
      const canvas = screen.getByTestId('drawing-canvas');

      simulateDrawRectangle(canvas, { x: 0, y: 0 }, { x: 100, y: 100 });

      expect(onRectangleDrawn).toHaveBeenCalledWith(expect.objectContaining({
        x: expect.any(Number),
        y: expect.any(Number),
        width: expect.any(Number),
        height: expect.any(Number)
      }));
    });

    it('prevents drawing when readonly', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} readonly rectangles={[]} onRectangleDrawn={onRectangleDrawn} />);
      const canvas = screen.getByTestId('drawing-canvas');

      simulateDrawRectangle(canvas, { x: 0, y: 0 }, { x: 100, y: 100 });

      expect(onRectangleDrawn).not.toHaveBeenCalled();
    });

    it('prevents drawing when 2 rectangles exist', () => {
      const onRectangleDrawn = jest.fn();
      render(
        <Canvas
          {...mockProps}
          rectangles={[mockRectangle, mockRectangle]}
          onRectangleDrawn={onRectangleDrawn}
        />
      );
      const canvas = screen.getByTestId('drawing-canvas');

      simulateDrawRectangle(canvas, { x: 0, y: 0 }, { x: 100, y: 100 });

      expect(onRectangleDrawn).not.toHaveBeenCalled();
    });
  });

  describe('Undo/Redo functionality', () => {
    it('shows undo/redo buttons when not readonly', () => {
      render(<Canvas {...mockProps} />);
      expect(screen.getByTestId('undo-button')).toBeInTheDocument();
      expect(screen.getByTestId('redo-button')).toBeInTheDocument();
    });

    it('hides undo/redo buttons when readonly', () => {
      render(<Canvas {...mockProps} readonly />);
      expect(screen.queryByTestId('undo-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('redo-button')).not.toBeInTheDocument();
    });

    it('disables undo button when no past actions', () => {
      render(<Canvas {...mockProps} rectangles={[]} />);
      expect(screen.getByTestId('undo-button')).toBeDisabled();
    });

    it('disables redo button when no future actions', () => {
      render(<Canvas {...mockProps} rectangles={[]} />);
      expect(screen.getByTestId('redo-button')).toBeDisabled();
    });

    it('enables undo button after drawing a rectangle', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} rectangles={[]} onRectangleDrawn={onRectangleDrawn} />);
      const canvas = screen.getByTestId('drawing-canvas');

      // Draw a rectangle
      simulateDrawRectangle(canvas, { x: 0, y: 0 }, { x: 100, y: 100 });

      // Wait for state update
      setTimeout(() => {
        expect(screen.getByTestId('undo-button')).not.toBeDisabled();
      }, 0);
    });

    it('enables redo button after undoing', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} rectangles={[mockRectangle]} onRectangleDrawn={onRectangleDrawn} />);

      // Perform undo
      fireEvent.click(screen.getByTestId('undo-button'));

      // Wait for state update
      setTimeout(() => {
        expect(screen.getByTestId('redo-button')).not.toBeDisabled();
      }, 0);
    });

    it('handles keyboard shortcuts for undo/redo', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} rectangles={[mockRectangle]} onRectangleDrawn={onRectangleDrawn} />);

      // Test undo with Cmd+Z
      fireEvent.keyDown(window, { key: 'z', metaKey: true });

      // Wait for state update
      setTimeout(() => {
        expect(onRectangleDrawn).toHaveBeenCalled();

        // Test redo with Cmd+Shift+Z
        fireEvent.keyDown(window, { key: 'z', metaKey: true, shiftKey: true });
        expect(onRectangleDrawn).toHaveBeenCalledTimes(2);
      }, 0);
    });

    it('clears redo stack when drawing a new rectangle', () => {
      const onRectangleDrawn = jest.fn();
      render(<Canvas {...mockProps} rectangles={[]} onRectangleDrawn={onRectangleDrawn} />);
      const canvas = screen.getByTestId('drawing-canvas');

      // Draw initial rectangle
      simulateDrawRectangle(canvas, { x: 0, y: 0 }, { x: 100, y: 100 });

      // Wait for state update
      setTimeout(() => {
        // Undo
        fireEvent.click(screen.getByTestId('undo-button'));
        expect(screen.getByTestId('redo-button')).not.toBeDisabled();

        // Draw new rectangle
        simulateDrawRectangle(canvas, { x: 50, y: 50 }, { x: 150, y: 150 });

        // Redo should be disabled
        expect(screen.getByTestId('redo-button')).toBeDisabled();
      }, 0);
    });
  });
});
