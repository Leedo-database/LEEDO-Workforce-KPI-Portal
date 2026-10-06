import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { LeedoLogo } from './LeedoLogo';
import { UserProfileModal } from './UserProfileModal';
import { ClearDemoDataModal } from './ClearDemoDataModal';
import {
  UserCheck,
  FileText,
  BarChart3,
  Users,
  UserPlus,
  Bell,
  History,
  Trash2,
  LogOut,
  Calendar,
  X,
  ShieldCheck,
  ChevronRight,
  Plus,
  BookOpen,
} from 'lucide-react';
import { Employee } from '../types/kpi';

interface SidebarProps {
  activeTab: 'my-portal' | 'hr-dashboard' | 'audit-logs' | 'reminders';
  setActiveTab: (tab: 'my-portal' | 'hr-dashboard' | 'audit-logs' | 'reminders') => void;
  onOpenReportModal: (eid: string) => void;
  onOpenJdModal?: (employee: Employee) => void;
  onOpenOrgSummaryModal?: () => void;
  onOpenEmployeeManageModal?: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenReportModal,
  onOpenJdModal,
  onOpenOrgSummaryModal,
  onOpenEmployeeManageModal,
  isMobileOpen = false,
  onCloseMobile,
}) => {
  const {
    currentUser,
    logout,
    kpiRecords,
    systemConfig,
    availableMonths,
    switchActiveMonth,
    advanceToNextMonth,
    canUserAccessExecutiveReports,
    isUserHrOrExecutive,
  } = useKpi();
  const { language, setLanguage, t } = useLanguage();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showClearDemoModal, setShowClearDemoModal] = useState(false);
  const [showNewMonthModal, setShowNewMonthModal] = useState(false);
  const [newMonthInput, setNewMonthInput] = useState('2026-10');
  const [newMonthNameInput, setNewMonthNameInput] = useState('October 2026');

  if (!currentUser) return null;

  // Dynamic HR / Exec permission check (ensures any HR staff inherits all access)
  const isHrOrExec = isUserHrOrExecutive(currentUser);
  const canAccessOrgSummary = canUserAccessExecutiveReports(currentUser);

  // Count pending targets for active month
  const pendingTargetsCount = kpiRecords.filter(
    (r) => r.month === systemConfig.activeMonthCode && !r.targetCommittedAt
  ).length;

  const handleCreateMonth = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMonthInput.trim() && newMonthNameInput.trim()) {
      const res = advanceToNextMonth(newMonthInput.trim(), newMonthNameInput.trim());
      setShowNewMonthModal(false);
      alert(res.message);
    }
  };

  const handleNavClick = (tab: 'my-portal' | 'hr-dashboard' | 'audit-logs' | 'reminders') => {
    setActiveTab(tab);
    if (onCloseMobile) onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 shadow-xl select-none">
      {/* Top Brand & Logo */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white p-1 rounded-xl shadow-xs">
            <LeedoLogo size="md" showSubtitle={false} />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-rose-500 tracking-wider text-sm">LEEDO</span>
              <span className="bg-rose-500/20 text-rose-300 text-[10px] font-bold px-1.5 py-0.2 rounded">
                KPI
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium leading-tight">
              {language === 'bn' ? 'কর্মদক্ষতা মূল্যায়ন সিস্টেম' : 'Staff Performance System'}
            </p>
          </div>
        </div>

        {onCloseMobile && (
          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Active Evaluation Month Bar */}
      <div className="px-4 py-3 bg-slate-950/60 border-b border-slate-800/80">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-slate-400 font-bold flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-rose-400" />
            <span>{language === 'bn' ? 'মূল্যায়ন চক্র:' : 'Appraisal Month:'}</span>
          </span>
          {isHrOrExec && (
            <button
              onClick={() => setShowNewMonthModal(true)}
              className="text-rose-400 hover:text-rose-300 text-[10px] font-bold flex items-center gap-0.5 cursor-pointer"
              title="Add new appraisal month"
            >
              <Plus className="w-3 h-3" />
              <span>{language === 'bn' ? 'নতুন মাস' : 'New Month'}</span>
            </button>
          )}
        </div>
        <select
          value={systemConfig.activeMonthCode}
          onChange={(e) => switchActiveMonth(e.target.value)}
          className="w-full bg-slate-800 text-white font-bold text-xs rounded-lg px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-rose-500 cursor-pointer"
        >
          {availableMonths.map((m) => (
            <option key={m.code} value={m.code}>
              {m.name} {m.code === systemConfig.activeMonthCode ? '★' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Navigation Menu List */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 overscroll-contain">
        {/* Core Employee Menu */}
        <div className="space-y-1">
          <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            {language === 'bn' ? 'প্রধান মেন্যু (Main Menu)' : 'Navigation Menu'}
          </div>

          {/* 1. My KPI Portal */}
          <button
            onClick={() => handleNavClick('my-portal')}
            className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
              activeTab === 'my-portal'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 font-bold'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-2.5">
              <UserCheck className={`w-4 h-4 ${activeTab === 'my-portal' ? 'text-white' : 'text-rose-400'}`} />
              <span>{language === 'bn' ? 'মাই কেপিআই পোর্টাল' : 'My KPI Portal'}</span>
            </div>
            {activeTab === 'my-portal' && <ChevronRight className="w-4 h-4 text-white/80" />}
          </button>

          {/* 2. My Job Description (Official JD) */}
          {onOpenJdModal && (
            <button
              onClick={() => {
                onOpenJdModal(currentUser);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer group"
              title="View & print official Job Description"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span>{language === 'bn' ? 'আমার জব ডেসক্রিপশন' : 'My Job Description'}</span>
              </div>
              <span className="text-[10px] bg-sky-500/20 text-sky-300 px-1.5 py-0.5 rounded font-mono">
                JD
              </span>
            </button>
          )}

          {/* 3. My Report */}
          <button
            onClick={() => {
              onOpenReportModal(currentUser.eid);
              if (onCloseMobile) onCloseMobile();
            }}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer group"
          >
            <div className="flex items-center gap-2.5">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>{language === 'bn' ? 'মাই রিপোর্ট (আমার সনদ)' : 'My Report'}</span>
            </div>
            <span className="text-[10px] bg-slate-800 group-hover:bg-slate-700 text-slate-400 px-2 py-0.5 rounded font-mono">
              PDF
            </span>
          </button>

          {/* 3. Summary Report (Forhad, Kanta, HR & Exec) */}
          {canAccessOrgSummary && onOpenOrgSummaryModal && (
            <button
              onClick={() => {
                onOpenOrgSummaryModal();
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <BarChart3 className="w-4 h-4 text-amber-400" />
                <span>{language === 'bn' ? 'সামারি রিপোর্ট' : 'Summary Report'}</span>
              </div>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-bold">
                ORG
              </span>
            </button>
          )}
        </div>

        {/* HR & Management Section */}
        {isHrOrExec && (
          <div className="space-y-1 pt-3 border-t border-slate-800/80">
            <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center justify-between">
              <span>{language === 'bn' ? 'এইচআর ও এডমিন কন্ট্রোল' : 'HR & Admin Controls'}</span>
              <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
            </div>

            {/* 4. HR Dashboard with pending badge (e.g. 10) */}
            <button
              onClick={() => handleNavClick('hr-dashboard')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                activeTab === 'hr-dashboard'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Users className={`w-4 h-4 ${activeTab === 'hr-dashboard' ? 'text-white' : 'text-blue-400'}`} />
                <span>{language === 'bn' ? 'এইচআর ড্যাশবোর্ড' : 'HR Dashboard'}</span>
              </div>
              {pendingTargetsCount > 0 && (
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                    activeTab === 'hr-dashboard'
                      ? 'bg-white text-rose-700'
                      : 'bg-amber-500 text-slate-950'
                  }`}
                  title={`${pendingTargetsCount} pending target commits`}
                >
                  {pendingTargetsCount}
                </span>
              )}
            </button>

            {/* 5. Staff Manager */}
            {onOpenEmployeeManageModal && (
              <button
                onClick={() => {
                  onOpenEmployeeManageModal();
                  if (onCloseMobile) onCloseMobile();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer group"
              >
                <div className="flex items-center gap-2.5">
                  <UserPlus className="w-4 h-4 text-purple-400" />
                  <span>{language === 'bn' ? 'স্টাফ ম্যানেজার' : 'Staff Manager'}</span>
                </div>
                <span className="text-[10px] bg-slate-800 group-hover:bg-slate-700 text-purple-300 px-1.5 py-0.5 rounded font-bold">
                  HR
                </span>
              </button>
            )}

            {/* 6. Broadcast Reminders */}
            <button
              onClick={() => handleNavClick('reminders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                activeTab === 'reminders'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Bell className={`w-4 h-4 ${activeTab === 'reminders' ? 'text-white' : 'text-amber-400'}`} />
                <span>{language === 'bn' ? 'ব্রডকাস্ট রিমাইন্ডার' : 'Broadcast Reminders'}</span>
              </div>
              {activeTab === 'reminders' && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>

            {/* 7. Audit Trail */}
            <button
              onClick={() => handleNavClick('audit-logs')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer group ${
                activeTab === 'audit-logs'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40 font-bold'
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <History className={`w-4 h-4 ${activeTab === 'audit-logs' ? 'text-white' : 'text-teal-400'}`} />
                <span>{language === 'bn' ? 'অডিট ট্রেইল' : 'Audit Trail'}</span>
              </div>
              {activeTab === 'audit-logs' && <ChevronRight className="w-4 h-4 text-white/80" />}
            </button>

            {/* 8. Clear Demo Data Option */}
            <button
              onClick={() => {
                setShowClearDemoModal(true);
                if (onCloseMobile) onCloseMobile();
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'ডেমো ডাটা সাফ করুন' : 'Clear Demo Data'}</span>
            </button>
          </div>
        )}
      </div>

      {/* Bottom User Profile & Session Controls */}
      <div className="p-3 sm:p-4 bg-slate-950/80 border-t border-slate-800 space-y-3">
        {/* User Card */}
        <div
          onClick={() => setShowProfileModal(true)}
          className="flex items-center justify-between p-2 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 border border-slate-800 transition cursor-pointer group"
          title="Click to view full user profile"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-rose-400 flex items-center justify-center font-black text-white text-xs shrink-0 shadow-sm">
              {currentUser.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-white truncate group-hover:text-rose-300 transition">
                {currentUser.name}
              </div>
              <div className="text-[10px] text-slate-400 truncate flex items-center gap-1 font-mono">
                <span>EID: {currentUser.eid}</span>
                <span>•</span>
                <span className="text-rose-400 font-semibold">{currentUser.role}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-white transition shrink-0" />
        </div>

        {/* Quick Action Footer: Language & Logout */}
        <div className="flex items-center justify-between gap-2 pt-1">
          {/* Language Switch */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLanguage('bn')}
              className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer transition ${
                language === 'bn'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              বাং
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 text-[11px] font-bold rounded cursor-pointer transition ${
                language === 'en'
                  ? 'bg-rose-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              EN
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition cursor-pointer"
            title="Log out of system"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'লগআউট' : 'Logout'}</span>
          </button>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileModal && (
        <UserProfileModal employee={currentUser} onClose={() => setShowProfileModal(false)} />
      )}

      {/* Clear Demo Data Modal */}
      {showClearDemoModal && (
        <ClearDemoDataModal onClose={() => setShowClearDemoModal(false)} />
      )}

      {/* New Month Generator Modal */}
      {showNewMonthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-200 text-slate-900 animate-in zoom-in-95 text-xs">
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-rose-600" />
                <span>{language === 'bn' ? 'পরবর্তী মাস চালু করুন' : 'Advance Next Month'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowNewMonthModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <form onSubmit={handleCreateMonth} className="space-y-3">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মাস কোড (Month Code e.g. 2026-10):
                </label>
                <input
                  type="text"
                  required
                  value={newMonthInput}
                  onChange={(e) => setNewMonthInput(e.target.value)}
                  placeholder="YYYY-MM"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  মাসের নাম (Display Name):
                </label>
                <input
                  type="text"
                  required
                  value={newMonthNameInput}
                  onChange={(e) => setNewMonthNameInput(e.target.value)}
                  placeholder="October 2026"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
              <p className="text-[10px] text-slate-500 bg-amber-50 p-2 rounded border border-amber-200">
                নতুন মাস শুরু হলে সকল কর্মীর বিগত মাসের অর্জন সংরক্ষিত থাকবে এবং নতুন মাসের টার্গেট উইন্ডো স্বয়ংক্রিয়ভাবে উন্মুক্ত হবে।
              </p>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewMonthModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold transition cursor-pointer"
                >
                  মাস সক্রিয় করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Sticky left, permanent) */}
      <aside className="hidden lg:flex w-64 xl:w-72 shrink-0 h-screen sticky top-0 z-30 flex-col print:hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Sidebar */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex print:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          {/* Drawer */}
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
