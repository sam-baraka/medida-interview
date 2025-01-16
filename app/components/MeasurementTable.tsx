'use client';

import { MeasurementRecord } from '../types';
import { formatDistance, formatTimestamp } from '../utils/calculations';

interface MeasurementTableProps {
  records: MeasurementRecord[];
  selectedId: string | null;
  onRecordSelect: (record: MeasurementRecord) => void;
  onDeleteRecord: (id: string) => void;
}

export default function MeasurementTable({
  records,
  selectedId,
  onRecordSelect,
  onDeleteRecord
}: MeasurementTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead>
          <tr>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tl-lg">
              Rectangles
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Distance
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
              Time
            </th>
            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50 rounded-tr-lg">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100">
          {records.map((record) => (
            <tr
              key={record.id}
              onClick={() => onRecordSelect(record)}
              className={`cursor-pointer transition-all duration-200 hover:bg-indigo-50 ${
                selectedId === record.id ? 'bg-purple-50 hover:bg-purple-100' : ''
              }`}
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="text-sm font-medium text-gray-900">
                    R1: {record.rectangles[0].width.toFixed(0)}×{record.rectangles[0].height.toFixed(0)}
                  </div>
                  <div className="text-sm text-gray-600">
                    R2: {record.rectangles[1].width.toFixed(0)}×{record.rectangles[1].height.toFixed(0)}
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {formatDistance(record.distance)}px
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-600">
                  {formatTimestamp(record.createdAt)}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-right">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteRecord(record.id);
                  }}
                  className="text-sm text-red-600 hover:text-red-900 font-medium hover:underline focus:outline-none"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
          {records.length === 0 && (
            <tr>
              <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                <div className="space-y-2">
                  <p className="text-sm font-medium">No measurements saved yet</p>
                  <p className="text-xs">Draw and save rectangles to see them here</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
