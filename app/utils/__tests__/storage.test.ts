import { saveRecord, getRecords, deleteRecord, clearRecords } from '../storage';
import { MeasurementRecord, Rectangle } from '../../types';

describe('Storage Utils', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear();
  });

  const mockRectangle1: Rectangle = {
    x: 0,
    y: 0,
    width: 100,
    height: 100
  };

  const mockRectangle2: Rectangle = {
    x: 200,
    y: 200,
    width: 100,
    height: 100
  };

  const mockRecord: MeasurementRecord = {
    id: 'test-id',
    rectangles: [mockRectangle1, mockRectangle2],
    distance: 282.84, // sqrt(2) * 200
    createdAt: '2025-01-16T09:00:00Z'
  };

  describe('saveRecord', () => {
    it('should save a record to localStorage', () => {
      saveRecord(mockRecord);
      const stored = localStorage.getItem('measurement-records');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual([mockRecord]);
    });

    it('should append new records to existing ones', () => {
      const mockRecord2 = { ...mockRecord, id: 'test-id-2' };
      saveRecord(mockRecord);
      saveRecord(mockRecord2);
      
      const stored = localStorage.getItem('measurement-records');
      expect(stored).not.toBeNull();
      expect(JSON.parse(stored!)).toEqual([mockRecord, mockRecord2]);
    });
  });

  describe('getRecords', () => {
    it('should return an empty array when no records exist', () => {
      const records = getRecords();
      expect(records).toEqual([]);
    });

    it('should return stored records', () => {
      localStorage.setItem('measurement-records', JSON.stringify([mockRecord]));
      const records = getRecords();
      expect(records).toEqual([mockRecord]);
    });
  });

  describe('deleteRecord', () => {
    it('should delete a specific record', () => {
      const mockRecord2 = { ...mockRecord, id: 'test-id-2' };
      saveRecord(mockRecord);
      saveRecord(mockRecord2);
      
      deleteRecord('test-id');
      
      const records = getRecords();
      expect(records).toEqual([mockRecord2]);
    });

    it('should handle deleting non-existent record', () => {
      saveRecord(mockRecord);
      deleteRecord('non-existent-id');
      
      const records = getRecords();
      expect(records).toEqual([mockRecord]);
    });
  });

  describe('clearRecords', () => {
    it('should remove all records', () => {
      saveRecord(mockRecord);
      clearRecords();
      
      const records = getRecords();
      expect(records).toEqual([]);
    });
  });
});
