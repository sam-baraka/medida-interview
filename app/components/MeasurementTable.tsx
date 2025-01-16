'use client';

import React, { useState, useMemo } from 'react';
import { MeasurementRecord } from '../types';
import { formatDistance, formatTimestamp } from '../utils/calculations';

interface MeasurementTableProps {
  records: MeasurementRecord[];
  selectedId: string | null;
  onRecordSelect: (record: MeasurementRecord) => void;
  onDeleteRecord: (id: string) => void;
}

type SortField = 'timestamp' | 'distance';
type SortOrder = 'asc' | 'desc';

export default function MeasurementTable({
  records,
  selectedId,
  onRecordSelect,
  onDeleteRecord,
}: MeasurementTableProps) {
  const [sortField, setSortField] = useState<SortField>('timestamp');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const filteredAndSortedRecords = useMemo(() => {
    let filtered = records;
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = records.filter(record => {
        const distance = formatDistance(record.distance);
        const timestamp = formatTimestamp(record.createdAt);
        const r1 = `${record.rectangles[0].width}×${record.rectangles[0].height}`;
        const r2 = record.rectangles[1] ? `${record.rectangles[1].width}×${record.rectangles[1].height}` : '';
        return (
          distance.toLowerCase().includes(query) ||
          timestamp.toLowerCase().includes(query) ||
          r1.toLowerCase().includes(query) ||
          r2.toLowerCase().includes(query)
        );
      });
    }

    // Apply sorting
    return [...filtered].sort((a, b) => {
      if (sortField === 'timestamp') {
        const comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return sortOrder === 'asc' ? comparison : -comparison;
      } else {
        const comparison = a.distance - b.distance;
        return sortOrder === 'asc' ? comparison : -comparison;
      }
    });
  }, [records, sortField, sortOrder, searchQuery]);

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) return '↕️';
    return sortOrder === 'asc' ? '↑' : '↓';
  };

  if (records.length === 0) {
    return (
      <div className="text-center text-gray-500 py-8">
        No measurements saved yet
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search measurements..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent pl-10"
          />
          <svg
            className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow">
        <table className="min-w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rectangles
              </th>
              <th
                className="w-1/6 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('distance')}
                data-testid="distance-header"
              >
                Distance {getSortIcon('distance')}
              </th>
              <th
                className="w-1/3 px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('timestamp')}
                data-testid="timestamp-header"
              >
                Time {getSortIcon('timestamp')}
              </th>
              <th className="w-1/6 px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Delete
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedRecords.map((record) => (
              <tr
                key={record.id}
                onClick={() => onRecordSelect(record)}
                className={`hover:bg-indigo-50 transition-colors cursor-pointer ${
                  selectedId === record.id ? 'bg-purple-50' : ''
                }`}
                data-testid="measurement-row"
              >
                <td className="px-4 py-4">
                  <div className="text-sm text-gray-900">
                    R1: {record.rectangles[0].width}×{record.rectangles[0].height}
                  </div>
                  <div className="text-sm text-gray-900">
                    R2: {record.rectangles[1]?.width}×{record.rectangles[1]?.height}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {formatDistance(record.distance)}px
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className="text-sm text-gray-900">
                    {formatTimestamp(record.createdAt)}
                  </span>
                </td>
                <td className="px-4 py-4 text-center">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRecord(record.id);
                    }}
                    className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1.5 rounded-full font-medium text-sm inline-flex items-center gap-1 transition-colors"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                      <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-sm text-gray-500 text-right">
        {filteredAndSortedRecords.length} measurement{filteredAndSortedRecords.length !== 1 ? 's' : ''} found
      </div>
    </div>
  );
}
