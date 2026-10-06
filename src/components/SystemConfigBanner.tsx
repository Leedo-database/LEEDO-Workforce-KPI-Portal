import React from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import {
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  Unlock,
  Lock,
  Sparkles,
  Zap,
  Printer,
  X,
} from 'lucide-react';

interface Props {
  onOpenOrgSummary?: () => void;
}

export const SystemConfigBanner: React.FC<Props> = ({ onOpenOrgSummary }) => {
  const {
    systemConfig,
    updateSystemConfig,
    currentUser,
    autoRolledOverNotice,
    dismissAutoRolloverNotice,
  } = useKpi();
  const { language } = useLanguage();

  if (!currentUser) return null;

  const isHrOrExecutive = currentUser.role === 'hr_admin' || currentUser.role === 'executive';
  const isDay1 = systemConfig.simulatedDay === 1;
  const isDay1To3 = systemConfig.simulatedDay <= 3;
  const isPast15 = systemConfig.simulatedDay > 15;
  const isMonthEnd = systemConfig.simulatedDay >= 30;

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 text-xs px-4 py-2 shadow-inner print:hidden">
      <div className="max-w-7xl mx-auto space-y-2">
        {/* Main Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Left: Active Cycle & Status */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 font-semibold text-white bg-slate-800 px-2.5 py-1 rounded-md border border-slate-700">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{systemConfig.activeMonth}</span>
            </div>

            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'bn' ? 'সিস্টেম তারিখ:' : 'Day:'}{' '}
                <strong className="text-white text-xs">
                  {language === 'bn' ? `দিন ${systemConfig.simulatedDay}` : `Day ${systemConfig.simulatedDay}`}
                </strong>
              </span>
            </div>

            {/* Window Status Badge */}
            {systemConfig.overrideTargetWindowOpen ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700 animate-pulse">
                <Unlock className="w-3 h-3 text-emerald-400" />
                {language === 'bn' ? 'টার্গেট উইন্ডো: খোলা (এইচআর স্পেশাল অনুমতি)' : 'Target Window: OPEN (HR Override)'}
              </span>
            ) : isDay1To3 ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                <CheckCircle className="w-3 h-3 text-emerald-400" />
                {language === 'bn' ? 'টার্গেট সাবমিশন উইন্ডো খোলা (১–৩ তারিখ)' : 'Target Input Window: OPEN (Days 1–3)'}
              </span>
            ) : isMonthEnd ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-indigo-950 text-indigo-300 border border-indigo-700">
                <Sparkles className="w-3 h-3 text-indigo-400" />
                {language === 'bn'
                  ? `মাস সমাপনী (দিন ${systemConfig.simulatedDay}): মূল্যায়ন ও প্রিন্ট প্রস্তুত`
                  : `Month-End (Day ${systemConfig.simulatedDay}): Appraisal Reports Ready`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-950 text-rose-300 border border-rose-800">
                <Lock className="w-3 h-3 text-rose-400" />
                {language === 'bn' ? 'টার্গেট লকড • কাজের দৈনিক/সাপ্তাহিক অগ্রগতি চালু' : 'Target Window: LOCKED • Updates Active'}
              </span>
            )}

            {/* 15th of Month Automated Rollover Indicator */}
            {isPast15 && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300 border border-blue-800">
                <Zap className="w-3 h-3 text-blue-400" />
                {language === 'bn' ? '১৫ তারিখ অতিক্রান্ত: পরবর্তী মাস অটো প্রস্তুত' : 'Past Day 15: Next month auto initialized'}
              </span>
            )}
          </div>

          {/* Right: Simulation Controls */}
          {isHrOrExecutive && (
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-slate-400 text-[11px] hidden sm:inline">
                {language === 'bn' ? 'তারিখ সিমুলেশন:' : 'Timeline Jump:'}
              </span>

              <button
                onClick={() => updateSystemConfig({ simulatedDay: 1 })}
                title="Day 1: Print Previous Month Reports & Start New Targets"
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  systemConfig.simulatedDay === 1
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {language === 'bn' ? 'দিন ১ (রিপোর্ট প্রিন্ট ও শুরু)' : 'Day 1 (Reports)'}
              </button>

              <button
                onClick={() => updateSystemConfig({ simulatedDay: 2 })}
                title="Day 2: Target Window Open"
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  systemConfig.simulatedDay === 2
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {language === 'bn' ? 'দিন ২ (টার্গেট ইনপুট)' : 'Day 2 (Target)'}
              </button>

              <button
                onClick={() => updateSystemConfig({ simulatedDay: 16 })}
                title="Day 16: Automated next month creation trigger"
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  systemConfig.simulatedDay === 16
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {language === 'bn' ? 'দিন ১৬ (অটো রোলওভার)' : 'Day 16 (Auto Next)'}
              </button>

              <button
                onClick={() => updateSystemConfig({ simulatedDay: 30 })}
                title="Day 30: Month-End Evaluation"
                className={`px-2 py-0.5 rounded text-[10px] font-medium transition cursor-pointer ${
                  systemConfig.simulatedDay === 30
                    ? 'bg-rose-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {language === 'bn' ? 'দিন ৩০ (মূল্যায়ন সনদ)' : 'Day 30 (Appraisal)'}
              </button>
            </div>
          )}
        </div>

        {/* Day 1 Special Callout for Printing Previous Month Reports */}
        {isDay1 && (
          <div className="bg-emerald-950/80 border border-emerald-700/80 rounded-xl px-3 py-2 flex items-center justify-between gap-3 text-emerald-200 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Printer className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                <strong>{language === 'bn' ? '📅 প্রতি মাসের ১ তারিখ:' : '📅 1st Day of Month:'}</strong>{' '}
                {language === 'bn'
                  ? 'বিগত মাসের (Previous Month) সার্বিক ও একক কর্মদক্ষতা মূল্যায়ন সনদ প্রিন্ট করার নির্ধারিত দিন।'
                  : 'Designated day for printing Previous Month official individual and workforce summary appraisal reports.'}
              </span>
            </div>

            {onOpenOrgSummary && (
              <button
                onClick={onOpenOrgSummary}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-bold text-[11px] transition shrink-0 cursor-pointer shadow-sm"
              >
                {language === 'bn' ? 'সারসংক্ষেপ রিপোর্ট প্রিন্ট করুন' : 'Print Summary Report'}
              </button>
            )}
          </div>
        )}

        {/* 15th-of-Month Auto Rollover Notification */}
        {autoRolledOverNotice && (
          <div className="bg-blue-950/80 border border-blue-700/80 rounded-xl px-3 py-2 flex items-center justify-between gap-3 text-blue-200 text-xs animate-in fade-in duration-200">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-blue-400 shrink-0" />
              <span>{autoRolledOverNotice}</span>
            </div>
            <button
              onClick={dismissAutoRolloverNotice}
              className="text-blue-300 hover:text-white p-1 rounded hover:bg-blue-900/50 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
