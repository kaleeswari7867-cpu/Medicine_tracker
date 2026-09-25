import React from 'react';
import { Check, Clock, Trash2, Edit3, Copy, Utensils, Calendar, Pill } from 'lucide-react';
import { Medicine } from '../types';
import { formatTime12h, formatReadableDate, isMedicineActiveToday } from '../utils/date';
import { playTakenChime } from '../utils/audio';

interface MedicineCardProps {
  medicine: Medicine;
  isTaken: boolean;
  onToggleTaken: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (medicine: Medicine) => void;
  onDuplicate: (medicine: Medicine) => void;
}

export const MedicineCard: React.FC<MedicineCardProps> = ({
  medicine,
  isTaken,
  onToggleTaken,
  onDelete,
  onEdit,
  onDuplicate,
}) => {
  const activeNow = isMedicineActiveToday(medicine.startDate, medicine.endDate);

  const handleToggle = () => {
    if (!isTaken) {
      playTakenChime();
    }
    onToggleTaken(medicine.id);
  };

  return (
    <div
      className={`medicine-card group relative bg-white rounded-xl border transition-all duration-200 p-4 sm:p-5 shadow-xs hover:shadow-md ${
        isTaken
          ? 'border-emerald-200 bg-gradient-to-b from-emerald-50/30 to-white'
          : 'border-slate-200 hover:border-blue-300'
      }`}
    >
      {/* Top Header Row */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-start gap-2.5">
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
              isTaken
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-blue-50 text-blue-600'
            }`}
          >
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900 leading-snug flex items-center gap-1.5 flex-wrap">
              <span>💊 {medicine.name}</span>
              {medicine.category && (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {medicine.category}
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Scheduled for <span className="font-semibold text-slate-700">{formatTime12h(medicine.time)}</span> ({medicine.time})
            </p>
          </div>
        </div>

        {/* Secondary Card Actions */}
        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onDuplicate(medicine)}
            title="Duplicate for another time of day"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onEdit(medicine)}
            title="Edit details"
            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Prescription Information Block */}
      <div className="medicine-info grid grid-cols-2 gap-2 text-xs text-slate-600 bg-slate-50/70 rounded-lg p-3 my-3">
        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Dosage</span>
          <strong className="text-slate-800 text-xs font-semibold">{medicine.dosage}</strong>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Time</span>
          <strong className="text-slate-800 text-xs font-semibold">
            {medicine.time} ({formatTime12h(medicine.time)})
          </strong>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Food</span>
          <strong className="text-slate-800 text-xs font-semibold flex items-center gap-1">
            <Utensils className="w-3 h-3 text-slate-400" />
            {medicine.food}
          </strong>
        </div>

        <div>
          <span className="text-slate-400 block text-[10px] uppercase font-semibold">Active Period</span>
          <strong className="text-slate-800 text-xs font-semibold flex items-center gap-1">
            <Calendar className="w-3 h-3 text-slate-400" />
            {medicine.startDate} to {medicine.endDate}
          </strong>
        </div>

        {medicine.instructions && (
          <div className="col-span-2 pt-1 border-t border-slate-200/60 mt-1">
            <span className="text-slate-400 text-[10px] uppercase font-semibold block">Notes:</span>
            <span className="text-slate-700 italic">{medicine.instructions}</span>
          </div>
        )}
      </div>

      {/* Status Badge */}
      <div
        className={`status ${isTaken ? 'taken' : ''} text-center py-2 px-3 rounded-lg text-xs font-bold transition-all ${
          isTaken
            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
            : 'bg-amber-100 text-amber-800 border border-amber-200'
        }`}
      >
        {isTaken ? '✅ Medicine Taken' : '⏳ Medicine Pending'}
      </div>

      {/* Primary Actions Row */}
      <div className="actions flex items-center gap-2 mt-3 pt-1">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-xs ${
            isTaken
              ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isTaken ? (
            <>
              <Clock className="w-3.5 h-3.5" />
              <span>Mark Pending</span>
            </>
          ) : (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Mark Taken</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            if (window.confirm(`Are you sure you want to delete ${medicine.name}?`)) {
              onDelete(medicine.id);
            }
          }}
          className="delete-btn px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1 border border-rose-200"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
};
