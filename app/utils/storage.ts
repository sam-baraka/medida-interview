import { MeasurementRecord } from '../types';

const STORAGE_KEY = 'measurement-records';

export const saveRecord = (record: MeasurementRecord): void => {
  const records = getRecords();
  records.push(record);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
};

export const getRecords = (): MeasurementRecord[] => {
  const records = localStorage.getItem(STORAGE_KEY);
  return records ? JSON.parse(records) : [];
};

export const deleteRecord = (id: string): void => {
  const records = getRecords();
  const filteredRecords = records.filter(record => record.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredRecords));
};

export const clearRecords = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};
