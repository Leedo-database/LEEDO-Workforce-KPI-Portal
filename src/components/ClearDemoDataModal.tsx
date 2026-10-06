import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { Trash2, AlertTriangle, CheckCircle2, ShieldAlert, X } from 'lucide-react';

interface Props {
  onClose: () => void;
}

export const ClearDemoDataModal: React.FC<Props> = ({ onClose }) => {
  const { clearDemoData, currentUser } = useKpi();
  const { language, t } = useLanguage();

  const [confirmed, setConfirmed] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleClear = () => {
    setIsProcessing(true);
    setTimeout(() => {
      const res = clearDemoData();
      setIsProcessing(false);
      if (res.success) {
        setSuccessMsg(res.message);
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-rose-200 animate-scale-in">
        {/* Header */}
        <div className="bg-rose-600 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-lg">
              <Trash2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {t('clearDemoDataModalTitle')}
              </h3>
              <p className="text-[11px] text-rose-100">
                {language === 'bn' 
                  ? 'অনুমোদিত প্রশাসক: কান্তা / এইচআর এডমিন' 
                  : 'Authorized Administrator: Kanta / HR Admin'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold mb-1">
                {language === 'bn' ? 'সতর্কতা: ডেমো ডাটা স্থায়ীভাবে মুছে যাবে' : 'Caution: Demo Data Will Be Cleared'}
              </p>
              <p className="text-amber-800 leading-relaxed">
                {t('clearDemoDataDesc')}
              </p>
            </div>
          </div>

          <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 text-xs space-y-2">
            <div className="font-bold text-slate-800">
              {language === 'bn' ? 'এই অপারেশনে যা ঘটবে:' : 'Summary of what will happen:'}
            </div>
            <ul className="list-disc list-inside space-y-1 text-slate-600 pl-1">
              <li>{language === 'bn' ? '৫৫ জন কর্মকর্তার সমস্ত ডেমো কাজের অগ্রগতি মুছে ০ হবে।' : 'All demo progress logs will be wiped and set to 0.'}</li>
              <li>{language === 'bn' ? 'টার্গেট ইনপুট উইন্ডো দিন ১ (Day 1) এ রিসেট হবে যেন সবাই আসল টার্গেট দিতে পারে।' : 'Target input window will reset to Day 1 so all staff can submit real targets.'}</li>
              <li>{language === 'bn' ? 'সকলের অফিসিয়াল একাউন্ট ও জেডি টেমপ্লেট বহাল থাকবে।' : 'All 55 official staff accounts & official JD indicators will remain intact.'}</li>
              <li>{language === 'bn' ? 'সিস্টেমটি আজ থেকেই সম্পূর্ণ লাইভ ব্যবহারের উপযোগী হয়ে যাবে।' : 'System will be immediately ready for live institutional use.'}</li>
            </ul>
          </div>

          {successMsg ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 flex items-center gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <span className="font-bold">{successMsg}</span>
            </div>
          ) : (
            <div className="pt-2">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-rose-600 focus:ring-rose-500 w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  {language === 'bn'
                    ? 'আমি নিশ্চিত করছি যে আমি ডেমো ডাটা মুছে ফেলে এখন থেকে আসল প্রাতিষ্ঠানিক ডাটা ইনপুট শুরু করতে চাই।'
                    : 'I confirm that I want to clear simulated demo data and start real organizational records.'}
                </span>
              </label>
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
            >
              {language === 'bn' ? 'বাতিল' : 'Cancel'}
            </button>

            <button
              type="button"
              disabled={!confirmed || isProcessing || !!successMsg}
              onClick={handleClear}
              className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 rounded-lg shadow-sm transition flex items-center gap-2 cursor-pointer"
            >
              <Trash2 className="w-4 h-4" />
              {isProcessing
                ? (language === 'bn' ? 'মুছে ফেলা হচ্ছে...' : 'Clearing...')
                : t('confirmClearDemoData')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
