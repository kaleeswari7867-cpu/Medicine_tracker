import React, { useState, useEffect, useMemo } from 'react';
import confetti from 'canvas-confetti';
import {
  Pill,
  Search,
  Filter,
  Plus,
  Calendar,
  Sparkles,
  ArrowUpDown,
  Utensils,
  CheckCircle2,
  Clock,
  Check,
  AlertCircle
} from 'lucide-react';
import {
  Medicine,
  FilterStatus,
  FilterTimeOfDay,
  SortOption,
} from './types';
import {
  loadMedicines,
  saveMedicines,
  SAMPLE_MEDICINES,
} from './utils/storage';
import {
  getTodayDateString,
  isDateWithinRange,
  getTimeOfDay,
  formatTime12h,
} from './utils/date';
import { Header } from './components/Header';
import { DashboardStats } from './components/DashboardStats';
import { UpcomingDoseBanner } from './components/UpcomingDoseBanner';
import { MedicineCard } from './components/MedicineCard';
import { MedicineForm } from './components/MedicineForm';
import { PrintScheduleModal } from './components/PrintScheduleModal';
import { BackupModal } from './components/BackupModal';

export default function App() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [activeTab, setActiveTab] = useState<'schedule' | 'all-medicines'>('schedule');

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [filterTime, setFilterTime] = useState<FilterTimeOfDay>('all');
  const [sortOption, setSortOption] = useState<SortOption>('time-asc');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingMedicine, setEditingMedicine] = useState<Medicine | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false);

  // Initial load
  useEffect(() => {
    const loaded = loadMedicines();
    setMedicines(loaded);
  }, []);

  // Save to localStorage on any state change
  const updateMedicines = (newMeds: Medicine[]) => {
    setMedicines(newMeds);
    saveMedicines(newMeds);
  };

  // Helper to determine if medicine is taken on the active date
  const isMedicineTakenOnDate = (med: Medicine, dateKey: string): boolean => {
    if (med.dailyAdherence && typeof med.dailyAdherence[dateKey] === 'boolean') {
      return med.dailyAdherence[dateKey];
    }
    // Fallback for today to legacy `taken` boolean
    if (dateKey === getTodayDateString()) {
      return Boolean(med.taken);
    }
    return false;
  };

  // Toggle taken status for a medicine on selectedDate
  const handleToggleTaken = (id: number) => {
    const updated = medicines.map((med) => {
      if (med.id !== id) return med;

      const currentStatus = isMedicineTakenOnDate(med, selectedDate);
      const newStatus = !currentStatus;

      const newAdherence = { ...(med.dailyAdherence || {}) };
      newAdherence[selectedDate] = newStatus;

      const updatedMed: Medicine = {
        ...med,
        dailyAdherence: newAdherence,
      };

      // Also sync current day legacy boolean
      if (selectedDate === getTodayDateString()) {
        updatedMed.taken = newStatus;
      }

      return updatedMed;
    });

    updateMedicines(updated);

    // Check if this action completed all medicines for the selected day
    const activeForDay = updated.filter((m) =>
      isDateWithinRange(selectedDate, m.startDate, m.endDate)
    );
    const allTaken =
      activeForDay.length > 0 &&
      activeForDay.every((m) => isMedicineTakenOnDate(m, selectedDate));

    if (allTaken) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#2563eb', '#10b981', '#f59e0b', '#8b5cf6'],
        });
      } catch {
        // Safe fallback
      }
    }
  };

  // Mark all active medicines for selectedDate as taken
  const handleMarkAllTaken = () => {
    const updated = medicines.map((med) => {
      if (!isDateWithinRange(selectedDate, med.startDate, med.endDate)) {
        return med;
      }
      const newAdherence = { ...(med.dailyAdherence || {}) };
      newAdherence[selectedDate] = true;
      return {
        ...med,
        taken: selectedDate === getTodayDateString() ? true : med.taken,
        dailyAdherence: newAdherence,
      };
    });

    updateMedicines(updated);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#2563eb', '#38bdf8'],
      });
    } catch {
      // Safe fallback
    }
  };

  // Reset all medicines for selectedDate to pending
  const handleResetDay = () => {
    const updated = medicines.map((med) => {
      if (!isDateWithinRange(selectedDate, med.startDate, med.endDate)) {
        return med;
      }
      const newAdherence = { ...(med.dailyAdherence || {}) };
      newAdherence[selectedDate] = false;
      return {
        ...med,
        taken: selectedDate === getTodayDateString() ? false : med.taken,
        dailyAdherence: newAdherence,
      };
    });
    updateMedicines(updated);
  };

  // Delete a medicine
  const handleDeleteMedicine = (id: number) => {
    const updated = medicines.filter((m) => m.id !== id);
    updateMedicines(updated);
  };

  // Add or Edit medicine submission
  const handleSaveMedicine = (medicineData: Omit<Medicine, 'id'>, editId?: number) => {
    if (editId) {
      // Editing existing
      const updated = medicines.map((m) => {
        if (m.id === editId) {
          return {
            ...medicineData,
            id: editId,
          };
        }
        return m;
      });
      updateMedicines(updated);
      setEditingMedicine(null);
    } else {
      // Adding new
      const newMed: Medicine = {
        ...medicineData,
        id: Date.now(),
      };
      updateMedicines([...medicines, newMed]);
    }
    setIsAddModalOpen(false);
  };

  // Duplicate a medicine
  const handleDuplicateMedicine = (med: Medicine) => {
    const duplicated: Medicine = {
      ...med,
      id: Date.now(),
      name: `${med.name} (Copy)`,
      taken: false,
      dailyAdherence: {},
    };
    updateMedicines([...medicines, duplicated]);
  };

  // Medicines active for the currently selected date
  const activeMedicinesForSelectedDate = useMemo(() => {
    return medicines.filter((m) =>
      isDateWithinRange(selectedDate, m.startDate, m.endDate)
    );
  }, [medicines, selectedDate]);

  // Compute metrics for the active date
  const totalCount = activeMedicinesForSelectedDate.length;
  const takenCount = activeMedicinesForSelectedDate.filter((m) =>
    isMedicineTakenOnDate(m, selectedDate)
  ).length;
  const pendingCount = totalCount - takenCount;

  // Filter & sort medicines for the current view
  const displayedMedicines = useMemo(() => {
    // 1. Source list: tab determines whether to show only today/selected date or all
    let list =
      activeTab === 'schedule'
        ? activeMedicinesForSelectedDate
        : medicines;

    // 2. Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.name.toLowerCase().includes(q) ||
          m.dosage.toLowerCase().includes(q) ||
          (m.instructions && m.instructions.toLowerCase().includes(q))
      );
    }

    // 3. Status filter
    if (filterStatus === 'taken') {
      list = list.filter((m) => isMedicineTakenOnDate(m, selectedDate));
    } else if (filterStatus === 'pending') {
      list = list.filter((m) => !isMedicineTakenOnDate(m, selectedDate));
    }

    // 4. Time of day filter
    if (filterTime !== 'all') {
      list = list.filter((m) => getTimeOfDay(m.time) === filterTime);
    }

    // 5. Sorting
    return [...list].sort((a, b) => {
      if (sortOption === 'time-asc') {
        return a.time.localeCompare(b.time);
      }
      if (sortOption === 'time-desc') {
        return b.time.localeCompare(a.time);
      }
      if (sortOption === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      if (sortOption === 'status') {
        const aTaken = isMedicineTakenOnDate(a, selectedDate) ? 1 : 0;
        const bTaken = isMedicineTakenOnDate(b, selectedDate) ? 1 : 0;
        return aTaken - bTaken;
      }
      return 0;
    });
  }, [
    activeTab,
    activeMedicinesForSelectedDate,
    medicines,
    searchQuery,
    filterStatus,
    filterTime,
    sortOption,
    selectedDate,
  ]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-16">
      {/* Top Bar Header */}
      <Header
        onOpenAddModal={() => {
          setEditingMedicine(null);
          setIsAddModalOpen(true);
        }}
        onOpenPrintModal={() => setIsPrintModalOpen(true)}
        onOpenBackupModal={() => setIsBackupModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      <main className="container max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* Banner Section matching user's header */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💊</span>
              <h2 className="text-2xl font-bold tracking-tight">Medicine Tracker</h2>
            </div>
            <p className="text-blue-100 text-sm">
              Manage your medicines, dosage schedule & daily adherence with ease
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            <button
              type="button"
              onClick={() => {
                setEditingMedicine(null);
                setIsAddModalOpen(true);
              }}
              className="w-full md:w-auto px-4 py-2.5 bg-white text-blue-700 hover:bg-blue-50 text-xs font-bold rounded-xl transition-all shadow-xs flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>➕ Add Medicine</span>
            </button>
          </div>
        </section>

        {/* Dashboard 3-Card Metrics Section */}
        <DashboardStats
          total={totalCount}
          taken={takenCount}
          pending={pendingCount}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
          onMarkAllTaken={handleMarkAllTaken}
          onResetDay={handleResetDay}
        />

        {/* Next Scheduled Dose Banner */}
        {activeTab === 'schedule' && (
          <UpcomingDoseBanner
            medicines={activeMedicinesForSelectedDate}
            onTakeDose={handleToggleTaken}
          />
        )}

        {/* Inline Add / Edit Section if in editing mode or on desktop */}
        {editingMedicine && (
          <div className="mb-4">
            <MedicineForm
              initialData={editingMedicine}
              onSubmit={handleSaveMedicine}
              onCancel={() => setEditingMedicine(null)}
              isInline={true}
            />
          </div>
        )}

        {/* Medicine Section */}
        <section className="medicine-section space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Pill className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    {activeTab === 'schedule' ? '💊 Schedule for ' + selectedDate : '💊 All Medicines'}
                  </h2>
                  <p className="text-xs text-slate-500">
                    {displayedMedicines.length}{' '}
                    {displayedMedicines.length === 1 ? 'prescription listed' : 'prescriptions listed'}
                  </p>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search medicine or dose..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Filter Tabs & Sorting */}
            <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2.5">
              {/* Status Segmented Tabs */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setFilterStatus('all')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterStatus === 'all'
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  All ({activeTab === 'schedule' ? totalCount : medicines.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('pending')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterStatus === 'pending'
                      ? 'bg-white text-amber-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Pending ({pendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterStatus('taken')}
                  className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                    filterStatus === 'taken'
                      ? 'bg-white text-emerald-800 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Taken ({takenCount})
                </button>
              </div>

              {/* Time of Day Tabs */}
              <div className="flex items-center gap-1">
                {(['all', 'morning', 'afternoon', 'evening'] as FilterTimeOfDay[]).map((tod) => (
                  <button
                    key={tod}
                    type="button"
                    onClick={() => setFilterTime(tod)}
                    className={`px-2 py-1 text-[11px] rounded capitalize transition-colors ${
                      filterTime === tod
                        ? 'bg-blue-50 text-blue-700 font-semibold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {tod}
                  </button>
                ))}
              </div>

              {/* Sort Order Selector */}
              <div className="flex items-center gap-1.5 ml-auto text-xs text-slate-500">
                <ArrowUpDown className="w-3.5 h-3.5" />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value as SortOption)}
                  className="bg-transparent border-0 text-slate-700 text-xs font-medium focus:ring-0 cursor-pointer"
                >
                  <option value="time-asc">Sort: Time (Earliest first)</option>
                  <option value="time-desc">Sort: Time (Latest first)</option>
                  <option value="name-asc">Sort: Name (A to Z)</option>
                  <option value="status">Sort: Status (Pending first)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Medicine List Grid matching user's #medicineList */}
          <div
            id="medicineList"
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {displayedMedicines.length === 0 ? (
              <div className="col-span-full bg-white rounded-xl border border-dashed border-slate-300 p-10 text-center space-y-3">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
                  <Pill className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-slate-800">
                  No medicines found
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {searchQuery
                    ? `No medications match "${searchQuery}". Try clearing search filters.`
                    : activeTab === 'schedule'
                    ? `No prescriptions active on ${selectedDate}. You can add a new medicine or check all medicines.`
                    : 'Your medicine cabinet is currently empty. Add your first prescription to get started.'}
                </p>
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingMedicine(null);
                      setIsAddModalOpen(true);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>➕ Add Medicine</span>
                  </button>
                  {medicines.length === 0 && (
                    <button
                      type="button"
                      onClick={() => updateMedicines(SAMPLE_MEDICINES)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      Load Sample Prescriptions
                    </button>
                  )}
                </div>
              </div>
            ) : (
              displayedMedicines.map((medicine) => (
                <MedicineCard
                  key={medicine.id}
                  medicine={medicine}
                  isTaken={isMedicineTakenOnDate(medicine, selectedDate)}
                  onToggleTaken={handleToggleTaken}
                  onDelete={handleDeleteMedicine}
                  onEdit={(med) => {
                    setEditingMedicine(med);
                    setIsAddModalOpen(true);
                  }}
                  onDuplicate={handleDuplicateMedicine}
                />
              ))
            )}
          </div>
        </section>

        {/* Quick Add Medicine Collapsible Section at bottom for convenience */}
        {!editingMedicine && !isAddModalOpen && (
          <section className="mt-8">
            <MedicineForm
              onSubmit={handleSaveMedicine}
              isInline={true}
            />
          </section>
        )}
      </main>

      {/* Add / Edit Medicine Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-xl w-full my-8">
            <MedicineForm
              initialData={editingMedicine}
              onSubmit={handleSaveMedicine}
              onCancel={() => {
                setIsAddModalOpen(false);
                setEditingMedicine(null);
              }}
            />
          </div>
        </div>
      )}

      {/* Printable Schedule Modal */}
      <PrintScheduleModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        medicines={medicines}
      />

      {/* Backup, Storage & Samples Modal */}
      <BackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        medicines={medicines}
        onImportMedicines={(imported) => updateMedicines(imported)}
        onResetToSample={() => updateMedicines(SAMPLE_MEDICINES)}
        onClearAll={() => updateMedicines([])}
      />
    </div>
  );
}
