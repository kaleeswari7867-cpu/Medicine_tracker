import React from 'react';
import { CheckCircle2, Clock, CalendarDays, ChevronLeft, ChevronRight, RotateCcw, CheckCheck } from 'lucide-react';
import { formatReadableDate, getTodayDateString, addDays } from '../utils/date';

interface DashboardStatsProps {
  total: number;
  taken: number;
  pending: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  onMarkAllTaken: () => void;
  onResetDay: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  total,
  taken,
  pending,
  selectedDate,
  onSelectDate,
  onMarkAllTaken,
  onResetDay,
}) => {
  const isToday = selectedDate === getTodayDateString();
  const adherencePercent = total > 0 ? Math.round((taken / total) * 100) : 0;

  const handlePrevDay = () => {
    onSelectDate(addDays(selectedDate, -1));
  };

  const handleNextDay = () => {
    onSelectDate(addDays(selectedDate, 1));
  };

  const handleSetToday = () => {
    onSelectDate(getTodayDateString());
  };

  return (
    <div className="space-y-4">
      {/* Date Navigation Bar */}
      <div className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <CalendarDays className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-900">
                {formatReadableDate(selectedDate)}
              </span>
              {isToday && (
                <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full">
                  Today
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              {total === 0 ? 'No doses scheduled' : `${adherencePercent}% adherence logged`}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handlePrevDay}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Previous Day"
            aria-label="Previous Day"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {!isToday && (
            <button
              type="button"
              onClick={handleSetToday}
              className="px-2.5 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Back to Today
            </button>
          )}

          <input
            type="date"
            value={selectedDate}
            onChange={(e) => onSelectDate(e.target.value)}
            className="px-2 py-1 text-xs border border-slate-200 rounded-lg text-slate-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            aria-label="Select custom date"
          />

          <button
            type="button"
            onClick={handleNextDay}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Next Day"
            aria-label="Next Day"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {total > 0 && (
          <div className="w-full sm:w-auto flex items-center gap-2 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
            {pending > 0 && (
              <button
                type="button"
                onClick={onMarkAllTaken}
                className="flex-1 sm:flex-initial text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>Mark All Taken</span>
              </button>
            )}
            {taken > 0 && (
              <button
                type="button"
                onClick={onResetDay}
                className="text-xs font-medium text-slate-600 hover:text-slate-900 px-2 py-1.5 rounded-lg transition-colors flex items-center gap-1"
                title="Reset intake for this day"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden md:inline">Reset Day</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* The 3 Core Metric Cards from the User's Specification */}
      <section className="dashboard grid grid-cols-1 sm:grid-cols-3 gap-3.5" aria-label="Daily metrics">
        {/* Card 1: Today's Medicines */}
        <div className="card bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              {isToday ? "Today's Medicines" : "Scheduled Medicines"}
            </h3>
            <span className="p-2 rounded-lg bg-blue-50 text-blue-600">
              <CalendarDays className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 id="totalMedicines" className="text-3xl font-bold text-blue-600 tabular-nums">
              {total}
            </h2>
            <span className="text-xs text-slate-500">
              {total === 1 ? 'dose scheduled' : 'doses scheduled'}
            </span>
          </div>
        </div>

        {/* Card 2: Taken */}
        <div className="card bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Taken
            </h3>
            <span className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 id="takenMedicines" className="text-3xl font-bold text-emerald-600 tabular-nums">
              {taken}
            </h2>
            <span className="text-xs font-medium text-emerald-700 tabular-nums">
              {total > 0 ? `${adherencePercent}% completed` : '0%'}
            </span>
          </div>
        </div>

        {/* Card 3: Pending */}
        <div className="card bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Pending
            </h3>
            <span className="p-2 rounded-lg bg-amber-50 text-amber-600">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <h2 id="pendingMedicines" className="text-3xl font-bold text-amber-600 tabular-nums">
              {pending}
            </h2>
            <span className="text-xs text-slate-500">
              {pending === 0 && total > 0 ? 'All done!' : `${pending} to take`}
            </span>
          </div>
        </div>
      </section>

      {/* Adherence Progress Bar */}
      {total > 0 && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-slate-700">
              Daily Adherence Progress
            </span>
            <span className="font-bold text-slate-900 tabular-nums">
              {taken} of {total} doses taken ({adherencePercent}%)
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                adherencePercent === 100
                  ? 'bg-emerald-500'
                  : adherencePercent >= 50
                  ? 'bg-blue-600'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${adherencePercent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
