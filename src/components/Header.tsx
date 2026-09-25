import React from 'react';
import { Pill, Printer, Download, BellRing, Sparkles } from 'lucide-react';
import { playReminderTone } from '../utils/audio';

interface HeaderProps {
  onOpenAddModal: () => void;
  onOpenPrintModal: () => void;
  onOpenBackupModal: () => void;
  activeTab: 'schedule' | 'all-medicines';
  setActiveTab: (tab: 'schedule' | 'all-medicines') => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenAddModal,
  onOpenPrintModal,
  onOpenBackupModal,
  activeTab,
  setActiveTab,
}) => {
  const handleTestChime = () => {
    playReminderTone();
  };

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-sm">
            <Pill className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
              Medicine Tracker
            </h1>
            <p className="text-xs text-slate-500 hidden sm:block">
              Daily schedule & adherence manager
            </p>
          </div>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'schedule'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Today's Schedule
          </button>
          <button
            onClick={() => setActiveTab('all-medicines')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'all-medicines'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Medicines
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTestChime}
            title="Test reminder chime"
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <BellRing className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenPrintModal}
            title="Print medicine schedule"
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors hidden sm:flex items-center gap-1.5 text-xs font-medium"
          >
            <Printer className="w-4 h-4" />
            <span className="hidden md:inline">Print</span>
          </button>

          <button
            type="button"
            onClick={onOpenBackupModal}
            title="Data backup & settings"
            className="p-2 text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onOpenAddModal}
            className="px-3.5 py-2 text-xs font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-xs flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>➕ Add Medicine</span>
          </button>
        </div>
      </div>
    </header>
  );
};
