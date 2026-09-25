import React, { useState, useEffect } from 'react';
import { Pill, Plus, X, Sparkles, Check, Clock, Calendar } from 'lucide-react';
import { FoodTiming, Medicine, MedicineCategory } from '../types';
import { getTodayDateString, addDays } from '../utils/date';

interface MedicineFormProps {
  initialData?: Medicine | null;
  onSubmit: (medicineData: Omit<Medicine, 'id'>, editId?: number) => void;
  onCancel?: () => void;
  isInline?: boolean;
}

const DOSAGE_PRESETS = ['500 mg', '250 mg', '100 mg', '1 Tablet', '1 Capsule', '5 ml', '10 ml', '2 Puffs'];
const TIME_PRESETS = [
  { label: 'Morning', time: '08:00' },
  { label: 'Afternoon', time: '13:00' },
  { label: 'Evening', time: '18:00' },
  { label: 'Night', time: '21:00' },
];

const CATEGORIES: MedicineCategory[] = ['Tablet', 'Capsule', 'Syrup', 'Drops', 'Inhaler', 'Injection', 'Cream', 'Other'];

export const MedicineForm: React.FC<MedicineFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isInline = false,
}) => {
  const [name, setName] = useState('');
  const [dosage, setDosage] = useState('');
  const [time, setTime] = useState('08:00');
  const [food, setFood] = useState<FoodTiming>('After Food');
  const [startDate, setStartDate] = useState(getTodayDateString());
  const [endDate, setEndDate] = useState(addDays(getTodayDateString(), 14));
  const [category, setCategory] = useState<MedicineCategory>('Tablet');
  const [instructions, setInstructions] = useState('');
  const [color, setColor] = useState('#2563eb');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setDosage(initialData.dosage);
      setTime(initialData.time);
      setFood(initialData.food);
      setStartDate(initialData.startDate);
      setEndDate(initialData.endDate);
      setCategory(initialData.category || 'Tablet');
      setInstructions(initialData.instructions || '');
      setColor(initialData.color || '#2563eb');
    } else {
      setName('');
      setDosage('');
      setTime('08:00');
      setFood('After Food');
      setStartDate(getTodayDateString());
      setEndDate(addDays(getTodayDateString(), 14));
      setCategory('Tablet');
      setInstructions('');
      setColor('#2563eb');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !dosage.trim() || !time || !startDate || !endDate) {
      return;
    }

    onSubmit(
      {
        name: name.trim(),
        dosage: dosage.trim(),
        time,
        food,
        startDate,
        endDate,
        category,
        instructions: instructions.trim(),
        color,
        taken: initialData?.taken || false,
        dailyAdherence: initialData?.dailyAdherence || {},
      },
      initialData?.id
    );

    if (!initialData) {
      setName('');
      setDosage('');
      setInstructions('');
    }
  };

  return (
    <section className="add-section bg-white p-5 sm:p-6 rounded-xl border border-slate-200 shadow-xs">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <Pill className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {initialData ? '✏️ Edit Medicine' : '➕ Add Medicine'}
            </h2>
            <p className="text-xs text-slate-500">
              {initialData
                ? 'Update medication dosage, schedule, and food directions'
                : 'Enter medication details, timing, and prescription schedule'}
            </p>
          </div>
        </div>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <form id="medicineForm" onSubmit={handleSubmit} className="space-y-4">
        {/* Medicine Name */}
        <div>
          <label htmlFor="medicineName" className="block text-xs font-semibold text-slate-700 mb-1">
            Medicine Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="medicineName"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Amoxicillin, Paracetamol, Metformin"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Dosage & Quick Presets */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="dosage" className="block text-xs font-semibold text-slate-700">
              Dosage <span className="text-rose-500">*</span>
            </label>
            <span className="text-xs text-slate-500">Tap to select</span>
          </div>
          <input
            type="text"
            id="dosage"
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="Dosage (eg: 500 mg, 1 tablet, 10 ml)"
            required
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />

          {/* Quick Dosage Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {DOSAGE_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setDosage(preset)}
                className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                  dosage === preset
                    ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>

        {/* Form Grid: Time & Food */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="medicineTime" className="block text-xs font-semibold text-slate-700">
                Scheduled Time <span className="text-rose-500">*</span>
              </label>
            </div>
            <input
              type="time"
              id="medicineTime"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
            {/* Time Presets */}
            <div className="flex gap-1 mt-1.5">
              {TIME_PRESETS.map((t) => (
                <button
                  key={t.time}
                  type="button"
                  onClick={() => setTime(t.time)}
                  className={`flex-1 text-[11px] py-1 rounded border text-center transition-colors ${
                    time === t.time
                      ? 'bg-blue-50 border-blue-300 text-blue-700 font-semibold'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="food" className="block text-xs font-semibold text-slate-700 mb-1">
              Food Relationship <span className="text-rose-500">*</span>
            </label>
            <select
              id="food"
              value={food}
              onChange={(e) => setFood(e.target.value as FoodTiming)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer"
            >
              <option value="After Food">After Food</option>
              <option value="Before Food">Before Food</option>
              <option value="Anytime">Anytime</option>
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {food === 'After Food'
                ? 'Take within 30 minutes following a meal'
                : food === 'Before Food'
                ? 'Take on an empty stomach ~30-60 mins prior'
                : 'Can be taken at any time with or without meals'}
            </p>
          </div>
        </div>

        {/* Date Ranges: Start & End Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-xs font-semibold text-slate-700 mb-1">
              Start Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>

          <div>
            <label htmlFor="endDate" className="block text-xs font-semibold text-slate-700 mb-1">
              End Date <span className="text-rose-500">*</span>
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              min={startDate}
              onChange={(e) => setEndDate(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Category & Color / Form Details */}
        <div className="pt-2 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Form / Type
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`text-xs px-2.5 py-1 rounded-md border transition-colors ${
                    category === cat
                      ? 'bg-blue-600 text-white border-blue-600 font-medium'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="instructions" className="block text-xs font-semibold text-slate-700 mb-1">
              Doctor's Note / Special Instructions (Optional)
            </label>
            <input
              type="text"
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Swallow whole, avoid grapefruit juice"
              className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2.5 pt-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}

          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs hover:shadow transition-all flex items-center justify-center gap-1.5"
          >
            {initialData ? (
              <>
                <Check className="w-4 h-4" />
                <span>Save Medicine Changes</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>Add Medicine</span>
              </>
            )}
          </button>
        </div>
      </form>
    </section>
  );
};
