import { Medicine } from '../types';
import { getTodayDateString, addDays } from './date';

const STORAGE_KEY = 'medicines';

export const SAMPLE_MEDICINES: Medicine[] = [
  {
    id: 1716900000001,
    name: 'Amoxicillin',
    dosage: '500 mg',
    time: '08:00',
    food: 'After Food',
    startDate: getTodayDateString(),
    endDate: addDays(getTodayDateString(), 7),
    taken: true,
    category: 'Capsule',
    instructions: 'Complete full course. Drink with full glass of water.',
    color: '#3b82f6',
    dailyAdherence: {
      [getTodayDateString()]: true,
    }
  },
  {
    id: 1716900000002,
    name: 'Vitamin D3 & Calcium',
    dosage: '1000 IU',
    time: '09:30',
    food: 'Before Food',
    startDate: addDays(getTodayDateString(), -3),
    endDate: addDays(getTodayDateString(), 27),
    taken: false,
    category: 'Tablet',
    instructions: 'Take in the morning with water.',
    color: '#f59e0b',
    dailyAdherence: {}
  },
  {
    id: 1716900000003,
    name: 'Metformin',
    dosage: '500 mg',
    time: '13:00',
    food: 'After Food',
    startDate: addDays(getTodayDateString(), -10),
    endDate: addDays(getTodayDateString(), 50),
    taken: false,
    category: 'Tablet',
    instructions: 'Post-lunch blood sugar regulation.',
    color: '#10b981',
    dailyAdherence: {}
  },
  {
    id: 1716900000004,
    name: 'Atorvastatin',
    dosage: '20 mg',
    time: '20:30',
    food: 'Anytime',
    startDate: addDays(getTodayDateString(), -5),
    endDate: addDays(getTodayDateString(), 25),
    taken: false,
    category: 'Tablet',
    instructions: 'Evening dose before bed.',
    color: '#8b5cf6',
    dailyAdherence: {}
  }
];

export function loadMedicines(): Medicine[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // If nothing saved yet, provide the sample medicines
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SAMPLE_MEDICINES));
      return SAMPLE_MEDICINES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      // Normalize items to ensure required fields
      return parsed.map((item) => ({
        id: item.id || Date.now() + Math.random(),
        name: item.name || 'Unnamed Medicine',
        dosage: item.dosage || '1 dose',
        time: item.time || '08:00',
        food: item.food || 'After Food',
        startDate: item.startDate || getTodayDateString(),
        endDate: item.endDate || getTodayDateString(),
        taken: typeof item.taken === 'boolean' ? item.taken : false,
        category: item.category || 'Tablet',
        instructions: item.instructions || '',
        color: item.color || '#2563eb',
        dailyAdherence: item.dailyAdherence || {}
      }));
    }
    return [];
  } catch (err) {
    console.error('Failed to load medicines from localStorage', err);
    return [];
  }
}

export function saveMedicines(medicines: Medicine[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(medicines));
  } catch (err) {
    console.error('Failed to save medicines to localStorage', err);
  }
}

export function exportMedicinesJSON(medicines: Medicine[]): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(medicines, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `medicine_tracker_backup_${getTodayDateString()}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}
