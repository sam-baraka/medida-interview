'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Canvas from './components/Canvas';
import MeasurementTable from './components/MeasurementTable';
import { Rectangle, MeasurementRecord } from './types';
import { calculateDistance } from './utils/calculations';
import { saveRecord, getRecords, deleteRecord } from './utils/storage';

export default function Home() {
  const [rectangles, setRectangles] = useState<Rectangle[]>([]);
  const [records, setRecords] = useState<MeasurementRecord[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    setRecords(getRecords());
  }, []);

  const handleRectangleDrawn = (rectangle: Rectangle) => {
    if (rectangles.length >= 2) return;
    setRectangles([...rectangles, rectangle]);
  };

  const handleClear = () => {
    setRectangles([]);
    setSelectedId(null);
  };

  const handleSave = () => {
    if (rectangles.length !== 2) return;

    const record: MeasurementRecord = {
      id: uuidv4(),
      rectangles: [rectangles[0], rectangles[1]] as [Rectangle, Rectangle],
      distance: calculateDistance(rectangles[0], rectangles[1]),
      createdAt: new Date().toISOString(),
    };

    saveRecord(record);
    setRecords(getRecords());
    handleClear();
  };

  const handleRecordSelect = (record: MeasurementRecord) => {
    setRectangles(record.rectangles);
    setSelectedId(record.id);
  };

  const handleDeleteRecord = (id: string) => {
    deleteRecord(id);
    setRecords(getRecords());
    if (selectedId === id) {
      handleClear();
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600 mb-4">
            Interactive Measurement Dashboard
          </h1>
          <div className="space-y-2">
            <p className="text-gray-600 max-w-2xl mx-auto">
              Draw rectangles on the canvas by clicking and dragging. Measure dimensions and distances between shapes with precision.
            </p>
            <p className="text-sm text-gray-500">
              Medida Senior Frontend Developer Submission by Samuel Baraka Bushuru
            </p>
            <p className="text-sm">
              <a 
                href="mailto:samuel.baraka1981@gmail.com"
                className="text-gray-400 hover:text-indigo-500 transition-colors"
              >
                samuel.baraka1981@gmail.com
              </a>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-indigo-100">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Drawing Canvas</h2>
              <Canvas
                rectangles={rectangles}
                onRectangleDrawn={handleRectangleDrawn}
                onClear={handleClear}
              />
              
              {rectangles.length === 2 && (
                <div className="mt-6 flex flex-col sm:flex-row justify-between items-center bg-indigo-50 rounded-lg p-4">
                  <div className="space-y-2 mb-4 sm:mb-0">
                    <p className="text-sm font-medium text-indigo-800">
                      Distance between centers: 
                      <span className="ml-2 font-mono">
                        {calculateDistance(rectangles[0], rectangles[1]).toFixed(2)}px
                      </span>
                    </p>
                    <div className="flex space-x-4">
                      <p className="text-xs text-indigo-600">
                        Rectangle 1: {rectangles[0].width.toFixed(0)}×{rectangles[0].height.toFixed(0)}px
                      </p>
                      <p className="text-xs text-indigo-600">
                        Rectangle 2: {rectangles[1].width.toFixed(0)}×{rectangles[1].height.toFixed(0)}px
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleSave}
                    className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Save Measurement
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="xl:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-purple-100">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Saved Measurements</h2>
                <span className="text-sm text-purple-600 font-medium">
                  {records.length} Records
                </span>
              </div>
              <div className="overflow-hidden">
                <MeasurementTable
                  records={records}
                  selectedId={selectedId}
                  onRecordSelect={handleRecordSelect}
                  onDeleteRecord={handleDeleteRecord}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
