import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { getJDTemplateForDesignation } from '../data/jobDescriptions';
import { getStrategicPillarsSummary } from '../utils/kpiCalculator';
import { CustomKpiModal } from './CustomKpiModal';
import { ProofViewerModal } from './ProofViewerModal';
import { MyJdModal } from './MyJdModal';
import { ProofAttachment, Employee } from '../types/kpi';
import {
  Calendar,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  PlusCircle,
  Printer,
  TrendingUp,
  Award,
  BookOpen,
  Clock,
  Sparkles,
  Shield,
  FileCheck,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  Upload,
  Paperclip,
  Trash2,
  Eye,
  FileText,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface EmployeePortalProps {
  onOpenReportModal: (eid: string) => void;
  onOpenJdModal?: (employee: Employee) => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ onOpenReportModal, onOpenJdModal }) => {
  const {
    currentUser,
    getUserKPI,
    systemConfig,
    isTargetWindowOpenForUser,
    commitMonthlyTargets,
    addProgressUpdate,
  } = useKpi();
  const { language, t } = useLanguage();

  if (!currentUser) return null;

  const userKpi = getUserKPI(currentUser.eid);
  const isTargetOpen = isTargetWindowOpenForUser(currentUser.eid);
  const isMonthEnd = systemConfig.simulatedDay >= 30;

  // Modals state
  const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
  const [isCustomKpiOpen, setIsCustomKpiOpen] = useState(false);
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [targetInputs, setTargetInputs] = useState<{ [taskId: string]: number }>({});
  const [selectedProof, setSelectedProof] = useState<ProofAttachment | null>(null);

  // Daily/Weekly update modal state
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string>('');
  const [updateType, setUpdateType] = useState<'daily' | 'weekly'>('weekly');
  const [incrementValue, setIncrementValue] = useState<number>(1);
  const [updateSummary, setUpdateSummary] = useState('');
  const [challenges, setChallenges] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<ProofAttachment[]>([]);

  // Status messages
  const [actionNotice, setActionNotice] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!userKpi) {
    return (
      <div className="p-8 text-center text-slate-500">
        No KPI record initialized for employee ID {currentUser.eid}.
      </div>
    );
  }

  const strategicSummary = getStrategicPillarsSummary(userKpi);

  const handleOpenTargetModal = () => {
    if (!isTargetOpen) {
      setActionNotice({
        type: 'error',
        text: language === 'bn'
          ? 'টার্গেট ইনপুট উইন্ডো বর্তমানে বন্ধ রয়েছে। প্রতি মাসের ১ থেকে ৩ তারিখের মধ্যে টার্গেট সাবমিট করতে হবে।'
          : 'Target input window is strictly closed. Monthly targets must be submitted during Days 1 to 3 of the month.',
      });
      return;
    }
    const currentMap: { [taskId: string]: number } = {};
    userKpi.items.forEach((item) => {
      currentMap[item.taskId] = item.target;
    });
    setTargetInputs(currentMap);
    setIsTargetModalOpen(true);
  };

  const handleSaveTargets = (e: React.FormEvent) => {
    e.preventDefault();
    const res = commitMonthlyTargets(currentUser.eid, targetInputs);
    if (res.success) {
      setIsTargetModalOpen(false);
      setActionNotice({ type: 'success', text: res.message });
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.7 } });
      } catch (err) {}
    } else {
      setActionNotice({ type: 'error', text: res.message });
    }
  };

  const handleOpenUpdateModal = (taskId?: string) => {
    setSelectedTaskId(taskId || userKpi.items[0]?.taskId || '');
    setIncrementValue(1);
    setUpdateSummary('');
    setChallenges('');
    setAttachedFiles([]);
    setIsUpdateModalOpen(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    // Limit to 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert(language === 'bn' ? 'ফাইলের আকার ৫ মেগাবাইটের কম হতে হবে।' : 'File size must be under 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeStr = `${(file.size / 1024).toFixed(1)} KB`;

      const newAttachment: ProofAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        fileType: file.type || 'document',
        fileSize: sizeStr,
        dataUrl,
        uploadedAt: new Date().toISOString(),
      };

      setAttachedFiles((prev) => [...prev, newAttachment]);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAttachment = (attId: string) => {
    setAttachedFiles((prev) => prev.filter((a) => a.id !== attId));
  };

  const handleSaveProgressUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTaskId) {
      alert(language === 'bn' ? 'অনুগ্রহ করে একটি কাজের সূচক নির্বাচন করুন।' : 'Please select a core JD task.');
      return;
    }
    if (incrementValue <= 0) {
      alert(language === 'bn' ? 'অগ্রগতির মান অবশ্যই ০ এর বেশি হতে হবে।' : 'Please enter a valid progress increment greater than 0.');
      return;
    }
    if (!updateSummary.trim()) {
      alert(language === 'bn' ? 'অনুগ্রহ করে কাজের বিবরণ লিখুন।' : 'Please provide a brief description of the work performed.');
      return;
    }

    const res = addProgressUpdate(
      currentUser.eid,
      selectedTaskId,
      Number(incrementValue),
      updateType,
      updateSummary.trim(),
      challenges.trim() ? challenges.trim() : undefined,
      attachedFiles.length > 0 ? attachedFiles : undefined
    );

    if (res.success) {
      setIsUpdateModalOpen(false);
      setActionNotice({ type: 'success', text: res.message });
    } else {
      setActionNotice({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Action Notification Alert */}
      {actionNotice && (
        <div
          className={`p-4 rounded-xl flex items-center justify-between shadow-2xs animate-in fade-in duration-200 ${
            actionNotice.type === 'success'
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-900'
              : 'bg-rose-50 border border-rose-200 text-rose-900'
          }`}
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            {actionNotice.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            )}
            <span>{actionNotice.text}</span>
          </div>
          <button
            onClick={() => setActionNotice(null)}
            className="text-xs font-bold text-slate-400 hover:text-slate-700 cursor-pointer ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Day 1-3 Target & KPI Setup Window Notification */}
      {systemConfig.simulatedDay <= 3 && (
        <div className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">
                {language === 'bn' ? '🎯 চলতি মাসের কেপিআই টার্গেট নির্ধারণের সময় (১-৩ তারিখ)' : '🎯 Monthly Target & KPI Setup Window (Days 1–3)'}
              </h3>
              <p className="text-xs text-rose-100 mt-0.5">
                {language === 'bn'
                  ? 'আপনার চলতি মাসের কেপিআই টার্গেট নির্ধারণ করুন এবং প্রয়োজনে অতিরিক্ত কাস্টম কেপিআই যোগ করুন। ৩ তারিখের পর এই উইন্ডো বন্ধ হয়ে যাবে।'
                  : 'Submit your monthly targets and add any custom KPIs now. Window automatically locks after Day 3.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenTargetModal}
              className="px-3.5 py-1.5 rounded-xl bg-white text-rose-700 hover:bg-rose-50 font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
            >
              {language === 'bn' ? 'টার্গেট দিন' : 'Set Targets'}
            </button>
            <button
              onClick={() => setIsCustomKpiOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-rose-800 hover:bg-rose-900 text-white font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
            >
              {language === 'bn' ? '+ কাস্টম কেপিআই' : '+ Custom KPI'}
            </button>
          </div>
        </div>
      )}

      {/* Month-End (Last 3 Days) Reporting Urgent Alert */}
      {systemConfig.simulatedDay >= 28 && (
        <div className="bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl p-4 text-white shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 animate-in fade-in duration-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm">
                {language === 'bn' ? '⚠️ মাস সমাপনী সতর্কবার্তা (চলতি মাসের শেষ ৩ দিন)' : '⚠️ Month-End Reporting Notice (Last 3 Days of Month)'}
              </h3>
              <p className="text-xs text-amber-100 mt-0.5">
                {language === 'bn'
                  ? 'চলতি মাসের কার্যকাল শেষ হতে চলেছে! আপনার মাসিক মূল্যায়ন রিপোর্ট ও কেপিআই স্কোর যাতে নিখুঁত ও সর্বোচ্চ হয়, সেজন্য আপনার সকল ফিল্ড কার্যক্রম, অগ্রগতি ও তথ্য অবিলম্বে আপডেট দিন।'
                  : 'Month is coming to an end! Submit all remaining progress entries and evidence now to ensure your monthly appraisal report and score are maximized.'}
              </p>
            </div>
          </div>
          <button
            onClick={() => handleOpenUpdateModal()}
            className="px-4 py-2 rounded-xl bg-white text-amber-900 hover:bg-amber-50 font-bold text-xs shadow-sm transition cursor-pointer whitespace-nowrap"
          >
            {language === 'bn' ? 'কাজের তথ্য আপডেট দিন' : 'Update Progress Now'}
          </button>
        </div>
      )}

      {/* Hero Profile & Status Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-rose-50 rounded-full blur-3xl -z-0 opacity-60 pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          {/* Employee Meta */}
          <div className="flex items-start gap-4">
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md shrink-0"
              style={{ backgroundColor: currentUser.avatarColor }}
            >
              {currentUser.eid}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl font-bold text-slate-900">{currentUser.name}</h1>
                <span className="bg-slate-100 text-slate-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-slate-200 font-mono">
                  EID: {currentUser.eid}
                </span>
                <span className="bg-rose-50 text-rose-700 text-xs px-2.5 py-0.5 rounded-full font-semibold border border-rose-200">
                  {currentUser.department}
                </span>
              </div>

              <p className="text-sm font-medium text-slate-600 mt-1">
                {language === 'bn' ? 'পদবী:' : 'Designation:'}{' '}
                <strong className="text-slate-900 font-semibold">{currentUser.designation}</strong>
              </p>

              <div className="flex items-center gap-4 text-xs text-slate-500 mt-2 flex-wrap">
                <span>
                  {language === 'bn' ? 'মূল্যায়ন মাস:' : 'Cycle:'}{' '}
                  <strong className="text-slate-700">{systemConfig.activeMonth}</strong>
                </span>
                <span>•</span>
                <span>
                  {language === 'bn' ? 'স্টাফ রোল:' : 'Role:'}{' '}
                  <strong className="text-slate-700 capitalize">{currentUser.role.replace('_', ' ')}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2.5 flex-wrap w-full lg:w-auto justify-start lg:justify-end">
            {/* My Official Job Description (JD) */}
            <button
              onClick={() => {
                if (onOpenJdModal) {
                  onOpenJdModal(currentUser);
                } else {
                  setIsJdModalOpen(true);
                }
              }}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 border border-blue-200 font-bold text-xs transition cursor-pointer"
              title="View my official job description and core duties"
            >
              <BookOpen className="w-4 h-4 text-blue-600" />
              <span>{language === 'bn' ? 'আমার জব ডেসক্রিপশন (JD)' : 'My Job Description'}</span>
            </button>

            {/* Submit / Edit Targets */}
            <button
              onClick={handleOpenTargetModal}
              disabled={!isTargetOpen}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition shadow-xs cursor-pointer ${
                isTargetOpen
                  ? 'bg-rose-600 hover:bg-rose-700 text-white'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
            >
              {isTargetOpen ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
              <span>
                {userKpi.isTargetLocked && !userKpi.hrTargetUnlocked
                  ? language === 'bn' ? 'টার্গেট লকড (১-৩ তারিখ)' : 'Targets Locked (Days 1-3)'
                  : language === 'bn' ? 'মাসিক টার্গেট ইনপুট দিন' : 'Input Monthly Targets'}
              </span>
            </button>

            {/* Add Custom KPI */}
            <button
              onClick={() => {
                if (!isTargetOpen) {
                  setActionNotice({
                    type: 'error',
                    text: language === 'bn'
                      ? 'কাস্টম কেপিআই যোগ করার নির্ধারিত সময় (১-৩ তারিখ) পার হয়ে গেছে। ৩ তারিখের পর নতুন কেপিআই যোগ করতে এইচআর অনুমোদনের প্রয়োজন।'
                      : 'Custom KPI window is closed (Days 1–3 only). HR authorization required after Day 3.',
                  });
                  return;
                }
                setIsCustomKpiOpen(true);
              }}
              className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-bold text-xs transition cursor-pointer ${
                isTargetOpen
                  ? 'bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200'
                  : 'bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed'
              }`}
              title="Add a custom KPI indicator"
            >
              <PlusCircle className="w-4 h-4 text-purple-600" />
              <span>{language === 'bn' ? '+ অতিরিক্ত কেপিআই' : '+ Custom KPI'}</span>
            </button>

            {/* Log Daily/Weekly Update */}
            <button
              onClick={() => handleOpenUpdateModal()}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-black text-white font-bold text-xs transition shadow-xs cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 text-rose-400" />
              <span>{language === 'bn' ? 'কাজের অগ্রগতি জমা দিন' : 'Log Work Progress'}</span>
            </button>

            {/* Official Report */}
            <button
              onClick={() => onOpenReportModal(currentUser.eid)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 font-bold text-xs transition shadow-2xs cursor-pointer"
            >
              <FileCheck className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? 'অফিসিয়াল সনদ' : 'Appraisal Report'}</span>
            </button>
          </div>
        </div>

        {/* Data Privacy & Window Status Banner */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-600">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isTargetOpen ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
              }`}
            />
            <span className="font-semibold">
              {isTargetOpen ? t('targetWindowOpen') : t('targetWindowClosed')}
            </span>
            <span className="text-slate-400 text-[11px] hidden sm:inline">
              (Current Simulated Day: {systemConfig.simulatedDay})
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-medium bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
            🔒 {language === 'bn' ? 'ব্যক্তিগত এক্সেস: আপনি কেবল আপনার নিজের তথ্য দেখতে পাচ্ছেন।' : 'Individual Access: Strictly locked to your JD indicators.'}
          </div>
        </div>
      </div>

      {/* Real-Time Performance Score Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Cumulative Score */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{language === 'bn' ? 'সামগ্রিক ওয়েটেড স্কোর' : 'Cumulative Weighted Score'}</span>
            <Award className="w-4 h-4 text-rose-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {userKpi.finalScore}%
            </span>
            <span className="text-xs text-slate-400 font-medium">/ 100% Max</span>
          </div>
          <div className="mt-2 text-[11px] font-bold" style={{ color: userKpi.ratingColor }}>
            {userKpi.ratingLabel}
          </div>
        </div>

        {/* Core Indicators */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{language === 'bn' ? 'জেডি সূচক সংখ্যা' : 'Core JD Indicators'}</span>
            <BookOpen className="w-4 h-4 text-blue-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {userKpi.items.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {language === 'bn' ? 'অ্যাসাইনড' : 'Assigned'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {language === 'bn' ? 'মোট প্রাতিষ্ঠানিক ওয়েট:' : 'Total Weight:'}{' '}
            <strong>{userKpi.items.reduce((a, b) => a + b.weight, 0)}%</strong>
          </div>
        </div>

        {/* Updates Submitted */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{language === 'bn' ? 'অগ্রগতি লগ সংখ্যা' : 'Progress Logs Logged'}</span>
            <Clock className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-black text-slate-900 font-mono">
              {userKpi.updates.length}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              {language === 'bn' ? 'এন্ট্রি' : 'Entries'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {userKpi.updates.length > 0 ? (
              <span>
                {language === 'bn' ? 'সর্বশেষ আপডেট:' : 'Last:'}{' '}
                {userKpi.updates[0].date}
              </span>
            ) : (
              <span className="text-amber-600 font-medium">
                {language === 'bn' ? 'কোনো আপডেট নেই' : 'No updates recorded yet'}
              </span>
            )}
          </div>
        </div>

        {/* Appraisal Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>{language === 'bn' ? 'এইচআর অনুমোদন স্ট্যাটাস' : 'Evaluation Approval'}</span>
            <Shield className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="mt-3">
            <span
              className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${
                userKpi.hrReview?.status === 'Approved'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-amber-100 text-amber-800 border border-amber-300'
              }`}
            >
              {userKpi.hrReview?.status || (language === 'bn' ? 'চলমান সাইকেল' : 'Active Cycle')}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500">
            {userKpi.hrReview ? (
              <span>Verified by {userKpi.hrReview.reviewedByName}</span>
            ) : (
              <span>{language === 'bn' ? 'মাস শেষে চূড়ান্ত স্বাক্ষর' : 'Pending 3-Tier Sign-off'}</span>
            )}
          </div>
        </div>
      </div>

      {/* Core Indicators Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-50/50">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-rose-600" />
              <span>{language === 'bn' ? 'আমার কর্মদক্ষতা ও কেপিআই লক্ষ্যমাত্রা তালিকা' : 'My Core JD Performance Indicators'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'জেডি অনুযায়ী নির্ধারিত কাজসমূহ ও আপনার অর্জিত অগ্রগতির হিসাব।'
                : 'Weighted JD deliverables for your official job description.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsCustomKpiOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold border border-purple-200 transition cursor-pointer flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অতিরিক্ত কেপিআই' : 'Custom KPI'}</span>
            </button>
            <button
              onClick={() => handleOpenUpdateModal()}
              className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition cursor-pointer flex items-center gap-1 shadow-2xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'অগ্রগতি জমা' : 'Log Progress'}</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-100/70 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4">{language === 'bn' ? 'কাজের নাম ও বিবরণ' : 'KPI Indicator'}</th>
                <th className="py-3 px-3 text-center">{language === 'bn' ? 'ওয়েট %' : 'Weight %'}</th>
                <th className="py-3 px-3 text-center">{language === 'bn' ? 'লক্ষ্যমাত্রা' : 'Target'}</th>
                <th className="py-3 px-3 text-center">{language === 'bn' ? 'অর্জিত' : 'Achieved'}</th>
                <th className="py-3 px-3 text-center">{language === 'bn' ? 'অগ্রগতি %' : 'Rate %'}</th>
                <th className="py-3 px-3 text-center">{language === 'bn' ? 'ওয়েটেড স্কোর' : 'Score'}</th>
                <th className="py-3 px-4 text-center">{language === 'bn' ? 'অ্যাকশন' : 'Action'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-800">
              {userKpi.items.map((item) => {
                const isOverperforming = item.achievementRate >= 100;
                const isUnderperforming = item.achievementRate < 70;

                return (
                  <tr key={item.taskId} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 max-w-sm">
                      <div className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                        <span>{item.title}</span>
                        {item.isCustom && (
                          <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-100 text-purple-800 font-bold">
                            Custom
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Carried over backlog alert */}
                      {item.carriedOverBacklog && (
                        <div className="mt-1 inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded text-[10px] font-bold">
                          <AlertTriangle className="w-3 h-3 text-amber-600" />
                          <span>
                            {language === 'bn'
                              ? `পূর্ববর্তী মাস থেকে বকেয়া: +${item.carriedOverBacklog.shortfall} ${item.unit} যুক্ত হয়েছে`
                              : `Rolled over shortfall: +${item.carriedOverBacklog.shortfall} ${item.unit}`}
                          </span>
                        </div>
                      )}

                      <div className="mt-1 flex items-center gap-2 flex-wrap">
                        <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                          {item.strategicPillar}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-sm text-slate-900 bg-slate-100 px-2 py-1 rounded-md">
                        {item.weight}%
                      </span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium">
                      <span className="text-sm font-semibold text-slate-800">
                        {item.target}
                      </span>{' '}
                      <span className="text-[11px] text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-center font-medium">
                      <span className="text-sm font-bold text-rose-600">
                        {item.achieved}
                      </span>{' '}
                      <span className="text-[11px] text-slate-500">{item.unit}</span>
                    </td>

                    <td className="py-3.5 px-3 text-center min-w-[130px]">
                      <div className="flex items-center justify-between text-[11px] mb-1 font-semibold">
                        <span
                          className={
                            isOverperforming
                              ? 'text-emerald-700'
                              : isUnderperforming
                              ? 'text-rose-700'
                              : 'text-slate-700'
                          }
                        >
                          {item.achievementRate}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            isOverperforming
                              ? 'bg-emerald-600'
                              : isUnderperforming
                              ? 'bg-rose-500'
                              : 'bg-amber-500'
                          }`}
                          style={{ width: `${Math.min(item.achievementRate, 100)}%` }}
                        />
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-center">
                      <span className="font-extrabold text-sm text-slate-900 font-mono">
                        {item.weightedScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenUpdateModal(item.taskId)}
                        className="px-2.5 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition border border-rose-200 cursor-pointer"
                        title="Add progress update for this core task"
                      >
                        + Update
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Updates History & Attached Proofs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-indigo-600" />
              <span>{language === 'bn' ? 'আমার কাজের অগ্রগতির লগ ও সংযুক্ত প্রমাণপত্র' : 'Work Updates & Attached Proofs'}</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {language === 'bn'
                ? 'দৈনিক ও সাপ্তাহিক এন্ট্রি এবং ঐচ্ছিক প্রমাণপত্রসমূহ।'
                : 'Chronological activity entries with attached documentation.'}
            </p>
          </div>

          <button
            onClick={() => handleOpenUpdateModal()}
            className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>{language === 'bn' ? 'নতুন এন্ট্রি' : 'New Entry'}</span>
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {userKpi.updates.length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300 text-slate-400 text-xs">
              {language === 'bn'
                ? 'এই মূল্যায়ন মাসে এখনও কোনো অগ্রগতির আপডেট জমা দেওয়া হয়নি।'
                : 'No work updates recorded yet for this month.'}
            </div>
          ) : (
            userKpi.updates.map((upd) => {
              const task = userKpi.items.find((i) => i.taskId === upd.taskId);
              return (
                <div
                  key={upd.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs hover:border-slate-300 transition"
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200 text-[11px]">
                        {upd.date}
                      </span>
                      <span className="font-bold text-slate-900 text-xs">
                        {task ? task.title : 'General Indicator'}
                      </span>
                    </div>

                    <span className="font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      +{upd.progressIncrement} {task?.unit}
                    </span>
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed">{upd.summary}</p>

                  {upd.challenges && (
                    <div className="mt-2 text-amber-900 bg-amber-50 p-2 rounded-lg border border-amber-200 text-[11px]">
                      <strong>{language === 'bn' ? 'মাঠপর্যায়ের চ্যালেঞ্জ:' : 'Field Challenges:'}</strong> {upd.challenges}
                    </div>
                  )}

                  {/* Attached Proofs (Optional) */}
                  {upd.attachments && upd.attachments.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-200 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                        <Paperclip className="w-3 h-3 text-rose-600" />
                        {language === 'bn' ? 'সংযুক্ত প্রমাণপত্র:' : 'Attached Proof:'}
                      </span>
                      {upd.attachments.map((att) => (
                        <button
                          key={att.id}
                          type="button"
                          onClick={() => setSelectedProof(att)}
                          className="px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 border border-slate-300 text-[10px] font-bold text-slate-700 flex items-center gap-1.5 transition cursor-pointer shadow-2xs"
                        >
                          <Eye className="w-3 h-3 text-rose-600" />
                          <span>{att.name}</span>
                          <span className="text-slate-400">({att.fileSize})</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Target Setting Modal */}
      {isTargetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-xl w-full p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-rose-600" />
                  <span>{t('targetSetting')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn'
                    ? '১-৩ তারিখের মধ্যে লক্ষ্যমাত্রা নির্ধারণ করুন। পরবর্তীতে এটি স্বয়ংক্রিয় লক হয়ে যাবে।'
                    : 'Input your committed targets for this evaluation month.'}
                </p>
              </div>
              <button
                onClick={() => setIsTargetModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTargets} className="mt-4 space-y-4">
              {userKpi.items.map((item) => (
                <div
                  key={item.taskId}
                  className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">{item.title}</span>
                    <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded font-mono font-semibold">
                      Weight: {item.weight}%
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">{item.description}</p>

                  <div className="flex items-center gap-3 pt-1">
                    <label className="text-xs font-semibold text-slate-700">
                      {language === 'bn' ? 'নির্ধারিত লক্ষ্যমাত্রা:' : 'Committed Target:'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      required
                      value={targetInputs[item.taskId] !== undefined ? targetInputs[item.taskId] : item.target}
                      onChange={(e) =>
                        setTargetInputs({
                          ...targetInputs,
                          [item.taskId]: Math.max(1, parseInt(e.target.value) || 1),
                        })
                      }
                      className="w-28 px-3 py-1.5 text-xs bg-white rounded-lg border border-slate-300 font-bold focus:ring-1 focus:ring-rose-500 focus:outline-none"
                    />
                    <span className="text-xs text-slate-500 font-medium">{item.unit}</span>
                  </div>
                </div>
              ))}

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsTargetModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer"
                >
                  {t('commitTargets')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Daily/Weekly Progress Update Modal with Optional Proof Upload */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-rose-600" />
                  <span>{t('logProgress')}</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {language === 'bn'
                    ? 'আপনার অর্জিত অগ্রগতি এবং ঐচ্ছিক প্রমাণপত্র আপলোড করুন।'
                    : 'Record units completed towards your committed targets.'}
                </p>
              </div>
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold text-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProgressUpdate} className="mt-4 space-y-4 text-xs">
              {/* Select Task */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {language === 'bn' ? 'কাজের সূচক নির্বাচন করুন:' : 'Select Core Indicator:'}
                </label>
                <select
                  value={selectedTaskId}
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs font-semibold text-slate-800 focus:outline-rose-500"
                >
                  {userKpi.items.map((item) => (
                    <option key={item.taskId} value={item.taskId}>
                      {item.title} (Target: {item.target} {item.unit} | Current: {item.achieved})
                    </option>
                  ))}
                </select>
              </div>

              {/* Update Frequency Type */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">{t('updateType')}:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setUpdateType('daily')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition ${
                      updateType === 'daily'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t('dailyUpdate')}
                  </button>
                  <button
                    type="button"
                    onClick={() => setUpdateType('weekly')}
                    className={`py-2 px-3 rounded-xl border font-bold text-xs cursor-pointer transition ${
                      updateType === 'weekly'
                        ? 'bg-rose-50 border-rose-500 text-rose-800 shadow-2xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {t('weeklyUpdate')}
                  </button>
                </div>
              </div>

              {/* Progress Units Increment */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {t('incrementAchieved')}:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    required
                    value={incrementValue}
                    onChange={(e) => setIncrementValue(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-32 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-300 font-bold focus:outline-rose-500"
                  />
                  <span className="text-xs text-slate-500">
                    {userKpi.items.find((i) => i.taskId === selectedTaskId)?.unit || 'Units'}
                  </span>
                </div>
              </div>

              {/* Activity Description */}
              <div className="space-y-1">
                <label className="font-bold text-slate-800">
                  {t('workSummary')}: <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    language === 'bn'
                      ? 'মাঠপর্যায়ের কার্যক্রম, শিশুদের উপস্থিতি বা সম্পাদিত কাজের বিবরণ লিখুন...'
                      : 'Describe field activities performed, child attendance, shelter duties, or verification work...'
                  }
                  value={updateSummary}
                  onChange={(e) => setUpdateSummary(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                />
              </div>

              {/* Challenges / Blockers */}
              <div className="space-y-1">
                <label className="font-semibold text-slate-700">
                  {t('challenges')}:
                </label>
                <input
                  type="text"
                  placeholder={
                    language === 'bn'
                      ? 'যেমন: প্রতিকূল আবহাওয়া, পরিবহন সংকট, প্রশাসনিক অনুমতি...'
                      : 'e.g., Weather conditions, transportation bottleneck, clearance...'
                  }
                  value={challenges}
                  onChange={(e) => setChallenges(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 rounded-xl border border-slate-300 text-xs focus:outline-rose-500"
                />
              </div>

              {/* Proof / Document Upload (Optional - Non Mandatory) */}
              <div className="space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Paperclip className="w-3.5 h-3.5 text-rose-600" />
                    <span>{t('proofUploadLabel')}</span>
                  </label>
                  <span className="text-[10px] text-slate-400 font-medium">
                    {language === 'bn' ? 'বাধ্যতামূলক নয়' : 'Non-mandatory'}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500">
                  {t('proofOptionalNote')}
                </p>

                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 cursor-pointer font-bold text-xs transition">
                    <Upload className="w-3.5 h-3.5 text-rose-600" />
                    <span>{language === 'bn' ? 'ফাইল বা ছবি নির্বাচন করুন' : 'Choose File / Photo'}</span>
                    <input
                      type="file"
                      accept="image/*,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Attached files preview */}
                {attachedFiles.length > 0 && (
                  <div className="space-y-1 pt-1">
                    {attachedFiles.map((att) => (
                      <div
                        key={att.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 text-[11px]"
                      >
                        <div className="flex items-center gap-2 truncate">
                          <FileText className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />
                          <span className="font-bold text-slate-800 truncate">{att.name}</span>
                          <span className="text-slate-400">({att.fileSize})</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(att.id)}
                          className="text-rose-500 hover:text-rose-700 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsUpdateModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition cursor-pointer"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition shadow-xs cursor-pointer"
                >
                  {t('submitProgress')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom KPI Modal */}
      {isCustomKpiOpen && (
        <CustomKpiModal
          eid={currentUser.eid}
          onClose={() => setIsCustomKpiOpen(false)}
        />
      )}

      {/* Official Job Description Modal */}
      {isJdModalOpen && (
        <MyJdModal
          isOpen={isJdModalOpen}
          onClose={() => setIsJdModalOpen(false)}
          employee={currentUser}
        />
      )}

      {/* Proof Lightbox Modal */}
      {selectedProof && (
        <ProofViewerModal
          attachment={selectedProof}
          onClose={() => setSelectedProof(null)}
        />
      )}
    </div>
  );
};
