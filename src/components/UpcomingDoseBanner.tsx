import React from 'react';
import { Clock, Utensils, CheckCircle2, AlertCircle } from 'lucide-react';
import { Medicine } from '../types';
import { formatTime12h, getMinutesFromNow } from '../utils/date';

interface UpcomingDoseBannerProps {
  medicines: Medicine[];
  onTakeDose: (id: number) => void;
}

export const UpcomingDoseBanner: React.FC<UpcomingDoseBannerProps> = ({
  medicines,
  onTakeDose,
}) => {
  // Find pending medicines, sort chronologically by time
  const pendingMeds = medicines
    .filter((m) => !m.taken)
    .sort((a, b) => a.time.localeCompare(b.time));

  if (pendingMeds.length === 0) {
    if (medicines.length === 0) return null;
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-3 text-emerald-900 shadow-xs">
        <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center shrink-0 text-emerald-600">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold">
            All doses for today have been taken!
          </h4>
          <p className="text-xs text-emerald-700">
            You are fully on track with your prescription regimen today.
          </p>
        </div>
      </div>
    );
  }

  const nextMed = pendingMeds[0];
  const minutesAway = getMinutesFromNow(nextMed.time);
  const isOverdue = minutesAway < -15;
  const isDueSoon = minutesAway >= -15 && minutesAway <= 30;

  return (
    <div
      className={`rounded-xl border p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
        isOverdue
          ? 'bg-rose-50 border-rose-200 text-rose-950'
          : isDueSoon
          ? 'bg-amber-50 border-amber-200 text-amber-950'
          : 'bg-blue-50 border-blue-200 text-blue-950'
      }`}
    >
      <div className="flex items-start sm:items-center gap-3">
        <div
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
            isOverdue
              ? 'bg-rose-100 text-rose-600'
              : isDueSoon
              ? 'bg-amber-100 text-amber-600'
              : 'bg-blue-100 text-blue-600'
          }`}
        >
          {isOverdue ? <AlertCircle className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isOverdue ? 'Overdue Dose' : isDueSoon ? 'Due Now / Soon' : 'Next Scheduled Dose'}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/70">
              {formatTime12h(nextMed.time)}
            </span>
          </div>
          <h4 className="text-base font-bold text-slate-900 mt-0.5">
            {nextMed.name} <span className="font-normal text-slate-600">({nextMed.dosage})</span>
          </h4>
          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
            <span className="inline-flex items-center gap-1">
              <Utensils className="w-3.5 h-3.5 text-slate-400" />
              {nextMed.food}
            </span>
            {nextMed.instructions && (
              <>
                <span aria-hidden="true">·</span>
                <span className="truncate max-w-xs">{nextMed.instructions}</span>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:self-center shrink-0">
        <button
          type="button"
          onClick={() => onTakeDose(nextMed.id)}
          className={`px-4 py-2 text-xs font-semibold rounded-lg shadow-xs text-white transition-colors flex items-center gap-1.5 whitespace-nowrap ${
            isOverdue
              ? 'bg-rose-600 hover:bg-rose-700'
              : isDueSoon
              ? 'bg-amber-600 hover:bg-amber-700'
              : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Mark as Taken</span>
        </button>
      </div>
    </div>
  );
};
