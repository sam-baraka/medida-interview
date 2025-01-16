/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent } from '@testing-library/react';
import MeasurementTable from '../MeasurementTable';
import { MeasurementRecord } from '../../types';

const mockRecords: MeasurementRecord[] = [
  {
    id: '1',
    rectangles: [
      { x: 0, y: 0, width: 100, height: 100 },
      { x: 200, y: 200, width: 150, height: 150 }
    ],
    distance: 100,
    createdAt: '2025-01-16T07:00:00.000Z'
  },
  {
    id: '2',
    rectangles: [
      { x: 0, y: 0, width: 200, height: 200 },
      { x: 400, y: 400, width: 250, height: 250 }
    ],
    distance: 200,
    createdAt: '2025-01-16T08:00:00.000Z'
  }
];

describe('MeasurementTable', () => {
  const mockOnRecordSelect = jest.fn();
  const mockOnDeleteRecord = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders empty state when no records', () => {
    render(
      <MeasurementTable
        records={[]}
        selectedId={null}
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    expect(screen.getByText('No measurements saved yet')).toBeInTheDocument();
  });

  it('renders records with correct data', () => {
    render(
      <MeasurementTable
        records={mockRecords}
        selectedId={null}
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    expect(screen.getByText('R1: 100×100')).toBeInTheDocument();
    expect(screen.getByText('R2: 150×150')).toBeInTheDocument();
    expect(screen.getByText('100.00px')).toBeInTheDocument();
  });

  it('calls onRecordSelect when clicking a row', () => {
    render(
      <MeasurementTable
        records={mockRecords}
        selectedId={null}
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    const rows = screen.getAllByTestId('measurement-row');
    fireEvent.click(rows[1]); // Click the first record (sorted by timestamp desc)

    expect(mockOnRecordSelect).toHaveBeenCalledWith(mockRecords[0]);
  });

  it('highlights selected record', () => {
    render(
      <MeasurementTable
        records={mockRecords}
        selectedId="1"
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    const rows = screen.getAllByTestId('measurement-row');
    expect(rows[1].className).toContain('bg-purple-50'); // First record is second in the list (sorted by timestamp desc)
    expect(rows[0].className).not.toContain('bg-purple-50');
  });

  it('sorts records by distance', () => {
    render(
      <MeasurementTable
        records={mockRecords}
        selectedId={null}
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    const distanceHeader = screen.getByTestId('distance-header');
    fireEvent.click(distanceHeader);

    const rows = screen.getAllByTestId('measurement-row');
    expect(rows[0].textContent).toContain('100.00px');
    expect(rows[1].textContent).toContain('200.00px');

    // Click again to reverse sort order
    fireEvent.click(distanceHeader);
    const rowsAfterSecondClick = screen.getAllByTestId('measurement-row');
    expect(rowsAfterSecondClick[0].textContent).toContain('200.00px');
    expect(rowsAfterSecondClick[1].textContent).toContain('100.00px');
  });

  it('sorts records by timestamp', () => {
    render(
      <MeasurementTable
        records={mockRecords}
        selectedId={null}
        onRecordSelect={mockOnRecordSelect}
        onDeleteRecord={mockOnDeleteRecord}
      />
    );

    const timestampHeader = screen.getByTestId('timestamp-header');
    fireEvent.click(timestampHeader);

    const rows = screen.getAllByTestId('measurement-row');
    expect(rows[0].textContent).toContain('10:00:00 AM');
    expect(rows[1].textContent).toContain('11:00:00 AM');
  });
});
