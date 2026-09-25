export type FoodTiming = 'After Food' | 'Before Food' | 'Anytime';

export type MedicineCategory = 'Tablet' | 'Capsule' | 'Syrup' | 'Drops' | 'Injection' | 'Inhaler' | 'Cream' | 'Other';

export interface Medicine {
  id: number;
  name: string;
  dosage: string;
  time: string; // "HH:MM" 24h format
  food: FoodTiming;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  taken?: boolean; // legacy/current day flag
  category?: MedicineCategory;
  instructions?: string;
  color?: string; // Pill color indicator
  dailyAdherence?: Record<string, boolean>; // 'YYYY-MM-DD': boolean
}

export type FilterStatus = 'all' | 'pending' | 'taken';
export type FilterTimeOfDay = 'all' | 'morning' | 'afternoon' | 'evening';
export type SortOption = 'time-asc' | 'time-desc' | 'name-asc' | 'status';
