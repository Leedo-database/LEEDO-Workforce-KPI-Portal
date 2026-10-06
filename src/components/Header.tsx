import React, { useState, useEffect } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { LeedoLogo } from './LeedoLogo';
import { UserProfileModal } from './UserProfileModal';
import { ClearDemoDataModal } from './ClearDemoDataModal';
import {
  ShieldCheck,
  Calendar,
  Clock,
  LogOut,
  Trash2,
  Plus,
  Menu,
} from 'lucide-react';

interface HeaderProps {
  onOpenMobileSidebar?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
}) => {
  const {
    currentUser,
    logout,
    systemConfig,
    availableMonths,
    switchActiveMonth,
    advanceToNextMonth,
    isUserHrOrExecutive,
  } = useKpi();
  const { language, setLanguage, t } = useLanguage();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showClearDemoModal, setShowClearDemoModal] = useState(false);
  const [showNewMonthModal, setShowNewMonthModal] = useState(false);
  const [newMonthInput, setNewMonthInput] = useState('2026-10');
  const [newMonthNameInput, setNewMonthNameInput] = useState('October 2026');

  // Live real-time clock ticker
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!currentUser) return null;

  const isHrOrExec = isUserHrOrExecutive(currentUser);
  const isKantaOrHr =
    currentUser.eid === '1002' ||
    currentUser.eid === '1057' ||
    currentUser.role === 'hr_admin' ||
    isHrOrExec;

  const handleCreateMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMonthInput.trim() && newMonthNameInput.trim()) {
      const res = advanceToNextMonth(newMonthInput.trim(), newMonthNameInput.trim());
      setShowNewMonthModal(false);
      alert(res.message);
    }
  };

  // Formatted date and time strings (respecting Bengali and English locales)
  const formattedDate = currentDateTime.toLocaleDateString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  );

  const formattedTime = currentDateTime.toLocaleTimeString(
    language === 'bn' ? 'bn-BD' : 'en-US',
    {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    }
  );

  return (
    <>
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-2xs print:hidden">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-3">
            {/* Left: Authentic LEEDO Brand & Mobile Menu Trigger */}
            <div className="flex items-center gap-3 shrink-0">
              {onOpenMobileSidebar && (
                <button
                  type="button"
                  onClick={onOpenMobileSidebar}
                  className="lg:hidden p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title="Open Navigation Menu"
                >
                  <Menu className="w-5 h-5 text-slate-800" />
                </button>
              )}
              <LeedoLogo size="md" showSubtitle={true} bilingualSubtitle={true} />
            </div>

            {/* Middle: Live Active Month, Today's Date & Real-Time Clock */}
            <div className="hidden md:flex items-center gap-3 bg-slate-50/90 border border-slate-200/90 rounded-2xl px-3.5 py-1.5 shadow-2xs">
              {/* Active Month */}
              <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
                <Calendar className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'চলতি মাস' : 'Active Month'}
                  </span>
                  <div className="flex items-center gap-1">
                    <select
                      value={systemConfig.activeMonthCode}
                      onChange={(e) => switchActiveMonth(e.target.value)}
                      className="bg-transparent font-bold text-slate-800 text-xs focus:outline-none cursor-pointer pr-1"
                      title="Select or switch evaluation month"
                    >
                      {availableMonths.map((m) => (
                        <option key={m.code} value={m.code}>
                          {m.name}
                        </option>
                      ))}
                    </select>
                    {isHrOrExec && (
                      <button
                        type="button"
                        onClick={() => setShowNewMonthModal(true)}
                        className="p-0.5 hover:bg-rose-100 text-rose-600 rounded cursor-pointer"
                        title={t('startNextMonth')}
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Today's Date */}
              <div className="flex items-center gap-1.5 pr-3 border-r border-slate-200">
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'আজকের তারিখ' : "Today's Date"}
                  </span>
                  <span className="text-xs font-semibold text-slate-700">
                    {formattedDate}
                  </span>
                </div>
              </div>

              {/* Live Real-Time Clock */}
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-[9px] text-emerald-600 font-bold uppercase tracking-wider">
                    {language === 'bn' ? 'সক্রিয় সময়' : 'Live Clock'}
                  </span>
                  <span className="text-xs font-bold font-mono text-slate-900 tracking-tight">
                    {formattedTime}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Controls: Clear Demo (Kanta/HR), Language, Profile & Logout */}
            <div className="flex items-center gap-2 shrink-0">
              {/* Compact date on mobile screens */}
              <div className="flex md:hidden items-center gap-1 bg-slate-50 border border-slate-200 px-2 py-1 rounded-xl text-[11px] font-mono text-slate-700">
                <Clock className="w-3 h-3 text-emerald-600" />
                <span>{formattedTime}</span>
              </div>

              {/* Clear Demo Data Button (Exclusively for Murshida Akhter Kanta / HR Admin) */}
              {isKantaOrHr && (
                <button
                  type="button"
                  onClick={() => setShowClearDemoModal(true)}
                  className="hidden sm:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold transition cursor-pointer shadow-2xs"
                  title="Wipe demo test progress and reset for live production"
                >
                  <Trash2 className="w-3.5 h-3.5 text-rose-600" />
                  <span>{language === 'bn' ? 'ডেমো রিসেট' : 'Clear Demo'}</span>
                </button>
              )}

              {/* Language Switcher Toggle */}
              <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('bn')}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    language === 'bn' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  বাং
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-1 rounded-md text-xs font-bold transition cursor-pointer ${
                    language === 'en' ? 'bg-rose-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
              </div>

              {/* User Profile Pill */}
              <button
                type="button"
                onClick={() => setShowProfileModal(true)}
                className="flex items-center gap-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition cursor-pointer group"
                title="Click to view ID card details & password settings"
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-2xs"
                  style={{ backgroundColor: currentUser.avatarColor }}
                >
                  {currentUser.name
                    .split(' ')
                    .map((n) => n[0])
                    .slice(0, 2)
                    .join('')}
                </div>
                <div className="hidden sm:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-800 group-hover:text-rose-600 transition flex items-center gap-1">
                    {currentUser.name.split(' ')[0]}
                    {isHrOrExec && (
                      <span title="HR Administrator Privilege">
                        <ShieldCheck className="w-3.5 h-3.5 text-rose-600 inline" />
                      </span>
                    )}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">EID: {currentUser.eid}</span>
                </div>
              </button>

              {/* Logout Button */}
              <button
                type="button"
                onClick={logout}
                className="p-2 rounded-xl bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 transition cursor-pointer border border-slate-200"
                title={t('logout')}
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* User Profile Details Modal */}
      {showProfileModal && (
        <UserProfileModal
          employee={currentUser}
          onClose={() => setShowProfileModal(false)}
        />
      )}

      {/* Clear Demo Data Modal (For Kanta / HR) */}
      {showClearDemoModal && (
        <ClearDemoDataModal onClose={() => setShowClearDemoModal(false)} />
      )}

      {/* Advance to Next Month Modal */}
      {showNewMonthModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200">
            <h3 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-rose-600" />
              {t('startNextMonth')}
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              {language === 'bn'
                ? 'নতুন মাস শুরু করলে বর্তমান মাসের যেকোনো অপূর্ণ কাজের ঘাটতি স্বয়ংক্রিয়ভাবে পরবর্তী মাসের টার্গেটে বকেয়া (Backlog Rollover) হিসেবে যুক্ত হবে।'
                : 'Advancing to a new month will automatically roll over any incomplete targets from the current month into the next month target backlog.'}
            </p>

            <form onSubmit={handleCreateMonth} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Month Code (YYYY-MM)
                </label>
                <input
                  type="text"
                  required
                  value={newMonthInput}
                  onChange={(e) => setNewMonthInput(e.target.value)}
                  placeholder="2026-10"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Month Display Name
                </label>
                <input
                  type="text"
                  required
                  value={newMonthNameInput}
                  onChange={(e) => setNewMonthNameInput(e.target.value)}
                  placeholder="October 2026"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowNewMonthModal(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-xs cursor-pointer"
                >
                  {language === 'bn' ? 'মাস শুরু করুন' : 'Initialize Month'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
