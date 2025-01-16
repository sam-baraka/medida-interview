import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Canvas from '../Canvas';
import { Rectangle } from '../../types';

const mockRect: Rectangle = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
};

describe('Canvas', () => {
  const mockOnRectangleDrawn = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockContext = () => {
    return {
      clearRect: jest.fn(),
      beginPath: jest.fn(),
      moveTo: jest.fn(),
      lineTo: jest.fn(),
      stroke: jest.fn(),
      strokeStyle: '',
      lineWidth: 0,
      setLineDash: jest.fn(),
      save: jest.fn(),
      restore: jest.fn(),
      fill: jest.fn(),
      arc: jest.fn(),
      fillStyle: '',
      createLinearGradient: jest.fn(() => ({
        addColorStop: jest.fn()
      })),
      quadraticCurveTo: jest.fn(),
      closePath: jest.fn(),
      canvas: {
        width: 800,
        height: 600,
        getBoundingClientRect: () => ({
          left: 0,
          top: 0,
          width: 800,
          height: 600,
          right: 800,
          bottom: 600,
          x: 0,
          y: 0,
          toJSON: () => ({})
        })
      },
      getContextAttributes: () => ({}),
      globalAlpha: 1,
      globalCompositeOperation: 'source-over',
    } as unknown as CanvasRenderingContext2D;
  };

  beforeEach(() => {
    const mockContext = createMockContext();
    jest.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(() => mockContext);
  });

  it('renders canvas element', () => {
    render(
      <Canvas
        rectangles={[]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByTestId('drawing-canvas')).toBeInTheDocument();
  });

  it('allows drawing rectangles', () => {
    render(
      <Canvas
        rectangles={[]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    const canvas = screen.getByTestId('drawing-canvas') as HTMLCanvasElement;

    // Simulate drawing a rectangle
    fireEvent.mouseDown(canvas, { clientX: 0, clientY: 0 });
    fireEvent.mouseMove(canvas, { clientX: 100, clientY: 100 });
    fireEvent.mouseUp(canvas);

    expect(mockOnRectangleDrawn).toHaveBeenCalled();
  });

  it('displays existing rectangles', () => {
    const rectangles: Rectangle[] = [mockRect];

    render(
      <Canvas
        rectangles={rectangles}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    const canvas = screen.getByTestId('drawing-canvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');
    expect(context?.beginPath).toHaveBeenCalled();
    expect(context?.moveTo).toHaveBeenCalled();
    expect(context?.lineTo).toHaveBeenCalled();
    expect(context?.stroke).toHaveBeenCalled();
  });

  it('limits to two rectangles', () => {
    const rectangles: Rectangle[] = [
      { ...mockRect },
      { ...mockRect, x: 200 }
    ];

    render(
      <Canvas
        rectangles={rectangles}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    const canvas = screen.getByTestId('drawing-canvas') as HTMLCanvasElement;

    // Try to draw a third rectangle
    fireEvent.mouseDown(canvas, { clientX: 300, clientY: 0 });
    fireEvent.mouseMove(canvas, { clientX: 400, clientY: 100 });
    fireEvent.mouseUp(canvas);

    expect(mockOnRectangleDrawn).not.toHaveBeenCalled();
  });

  it('clears the canvas', () => {
    render(
      <Canvas
        rectangles={[mockRect]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    const clearButton = screen.getByText('Clear Canvas');
    fireEvent.click(clearButton);

    expect(mockOnClear).toHaveBeenCalled();
  });

  it('shows helper text when less than two rectangles', () => {
    render(
      <Canvas
        rectangles={[]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('Click and drag to draw a rectangle')).toBeInTheDocument();
  });

  it('does not show helper text when two rectangles exist', () => {
    render(
      <Canvas
        rectangles={[mockRect, { ...mockRect, x: 200 }]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    expect(screen.queryByText('Click and drag to draw a rectangle')).not.toBeInTheDocument();
  });

  it('handles undo/redo buttons', () => {
    render(
      <Canvas
        rectangles={[]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
      />
    );

    const undoButton = screen.getByTestId('undo-button');
    const redoButton = screen.getByTestId('redo-button');

    // Initially both buttons should be disabled
    expect(undoButton).toBeDisabled();
    expect(redoButton).toBeDisabled();
  });

  it('handles readonly mode', () => {
    render(
      <Canvas
        rectangles={[mockRect]}
        onRectangleDrawn={mockOnRectangleDrawn}
        onClear={mockOnClear}
        readonly={true}
      />
    );

    // Clear, Undo, and Redo buttons should not be present in readonly mode
    expect(screen.queryByText('Clear Canvas')).not.toBeInTheDocument();
    expect(screen.queryByTestId('undo-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('redo-button')).not.toBeInTheDocument();
  });
});
