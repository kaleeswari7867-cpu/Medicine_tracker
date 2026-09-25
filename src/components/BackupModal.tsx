import React, { useRef } from 'react';
import { X, Download, Upload, RefreshCw, Trash2, ShieldCheck, Database } from 'lucide-react';
import { Medicine } from '../types';
import { exportMedicinesJSON, SAMPLE_MEDICINES } from '../utils/storage';

interface BackupModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicines: Medicine[];
  onImportMedicines: (medicines: Medicine[]) => void;
  onResetToSample: () => void;
  onClearAll: () => void;
}

export const BackupModal: React.FC<BackupModalProps> = ({
  isOpen,
  onClose,
  medicines,
  onImportMedicines,
  onResetToSample,
  onClearAll,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    exportMedicinesJSON(medicines);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (Array.isArray(json)) {
          onImportMedicines(json);
          alert(`Successfully imported ${json.length} medicines!`);
          onClose();
        } else {
          alert('Invalid JSON file format. Expected a list of medicines.');
        }
      } catch (err) {
        alert('Failed to parse JSON file.');
      }
    };
    reader.readAsText(file);
    if (e.target) e.target.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Data Backup & Storage
              </h3>
              <p className="text-xs text-slate-500">
                Manage your local prescription records safely
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="py-4 space-y-3">
          {/* Export JSON */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Export Prescription Backup
              </h4>
              <p className="text-[11px] text-slate-500">
                Download a JSON backup of your current {medicines.length} medicine records
              </p>
            </div>
            <button
              type="button"
              onClick={handleExport}
              className="px-3 py-1.5 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export</span>
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Import from Backup
              </h4>
              <p className="text-[11px] text-slate-500">
                Restore medicines from a previous JSON backup
              </p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".json"
              className="hidden"
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Import</span>
            </button>
          </div>

          {/* Load Sample Prescriptions */}
          <div className="p-3.5 rounded-xl border border-slate-200 flex items-center justify-between hover:border-blue-200 transition-colors">
            <div>
              <h4 className="text-xs font-bold text-slate-900">
                Load Sample Prescriptions
              </h4>
              <p className="text-[11px] text-slate-500">
                Populate realistic medical schedule examples
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset medicines to initial sample prescriptions?')) {
                  onResetToSample();
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Load Samples</span>
            </button>
          </div>

          {/* Clear All */}
          <div className="p-3.5 rounded-xl border border-rose-100 bg-rose-50/50 flex items-center justify-between">
            <div>
              <h4 className="text-xs font-bold text-rose-900">
                Clear All Medicines
              </h4>
              <p className="text-[11px] text-rose-700">
                Remove all prescriptions from local storage
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete all medicines? This cannot be undone.')) {
                  onClearAll();
                  onClose();
                }
              }}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear All</span>
            </button>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Stored securely in browser LocalStorage</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 text-xs text-slate-600 hover:text-slate-900 font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
