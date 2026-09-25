import React from 'react';
import { X, Printer, Pill, Download } from 'lucide-react';
import { Medicine } from '../types';
import { formatReadableDate, formatTime12h, getTodayDateString } from '../utils/date';

interface PrintScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
}

export const PrintScheduleModal: React.FC<PrintScheduleModalProps> = ({
  isOpen,
  onClose,
  medicines,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-xl border border-slate-200 my-8">
        {/* Modal Controls (Hidden when printed) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div>
            <h3 className="text-base font-bold text-slate-900">
              Prescription & Intake Schedule
            </h3>
            <p className="text-xs text-slate-500">
              Printable format ready for caregivers, family members, or fridge checklist
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>Print Now</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Area */}
        <div id="printable-schedule" className="p-2 print:p-0">
          <div className="border-b-2 border-slate-900 pb-3 mb-4 flex justify-between items-end">
            <div>
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span>💊 Patient Daily Medication Schedule</span>
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Generated on {formatReadableDate(getTodayDateString())}
              </p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <p>Total Prescriptions: <strong>{medicines.length}</strong></p>
            </div>
          </div>

          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-300 bg-slate-50">
                <th className="py-2.5 px-3 font-bold text-slate-800">Time</th>
                <th className="py-2.5 px-3 font-bold text-slate-800">Medicine Name</th>
                <th className="py-2.5 px-3 font-bold text-slate-800">Dosage</th>
                <th className="py-2.5 px-3 font-bold text-slate-800">Food Instruction</th>
                <th className="py-2.5 px-3 font-bold text-slate-800">Course Duration</th>
                <th className="py-2.5 px-3 font-bold text-slate-800 text-center">Daily Check</th>
              </tr>
            </thead>
            <tbody>
              {medicines
                .slice()
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((m) => (
                  <tr key={m.id} className="border-b border-slate-200 hover:bg-slate-50/50">
                    <td className="py-2.5 px-3 font-semibold text-slate-900 tabular-nums">
                      {formatTime12h(m.time)}
                      <span className="block text-[10px] text-slate-500 font-normal">
                        ({m.time})
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">
                      {m.name}
                      {m.instructions && (
                        <span className="block text-[10px] text-slate-500 font-normal mt-0.5">
                          Note: {m.instructions}
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700 font-medium">
                      {m.dosage}
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 font-medium">
                        {m.food}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600 text-[11px]">
                      {m.startDate} ~ {m.endDate}
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <div className="w-5 h-5 border-2 border-slate-400 rounded mx-auto"></div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>

          <div className="mt-8 pt-4 border-t border-slate-200 flex justify-between items-center text-[11px] text-slate-500">
            <p>Always consult your physician or licensed pharmacist before changing dosage.</p>
            <p className="font-semibold text-slate-700">Doctor / Clinic Signature: __________________</p>
          </div>
        </div>
      </div>
    </div>
  );
};
