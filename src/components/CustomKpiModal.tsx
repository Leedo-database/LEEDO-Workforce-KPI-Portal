import React, { useState, useMemo } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { StrategicPillar } from '../types/kpi';
import { calculateWeightAdjustment } from '../utils/weightAdjuster';
import {
  PlusCircle,
  Target,
  X,
  CheckCircle2,
  AlertCircle,
  Percent,
  Sliders,
  Sparkles,
  Info,
  ArrowRight,
} from 'lucide-react';

interface Props {
  eid: string;
  onClose: () => void;
}

const STRATEGIC_PILLARS: StrategicPillar[] = [
  'Child Rights & Street Protection',
  'Education, Skills & Life Training',
  'Shelter, Health & Holistic Care',
  'Admin & Financial Governance',
  'Partnerships, Media & Resource Mobilization',
];

export const CustomKpiModal: React.FC<Props> = ({ eid, onClose }) => {
  const { addCustomKpi, getUserKPI, getEmployee } = useKpi();
  const { language, t } = useLanguage();

  const emp = getEmployee(eid);
  const currentRecord = getUserKPI(eid);
  const existingItems = currentRecord?.items || [];

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [target, setTarget] = useState<number>(10);
  const [unit, setUnit] = useState('টি (Items)');
  const [weight, setWeight] = useState<number>(5);
  const [pillar, setPillar] = useState<StrategicPillar>('Child Rights & Street Protection');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Compute live weight adjustment
  const currentTotalWeight = useMemo(() => {
    return existingItems.reduce((sum, it) => sum + it.weight, 0);
  }, [existingItems]);

  const weightAdjustment = useMemo(() => {
    return calculateWeightAdjustment(existingItems, Number(weight) || 0);
  }, [existingItems, weight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg(language === 'bn' ? 'কাজের শিরোনাম দিন।' : 'Please enter KPI title.');
      return;
    }
    if (target <= 0) {
      setErrorMsg(language === 'bn' ? 'লক্ষ্যমাত্রা অবশ্যই ০ এর বেশি হতে হবে।' : 'Target must be greater than 0.');
      return;
    }
    if (!weightAdjustment.isValid) {
      setErrorMsg(weightAdjustment.error || 'কেপিআই ওয়েট ১০০% এর অতিরিক্ত হতে পারবে না।');
      return;
    }

    const res = addCustomKpi(eid, {
      title: title.trim(),
      description: description.trim() || title.trim(),
      target: Number(target),
      unit: unit.trim() || 'Units',
      weight: Number(weight) || 5,
      strategicPillar: pillar,
      autoAdjustOthers: true,
    });

    if (res.success) {
      setSuccessMsg(
        language === 'bn'
          ? `অতিরিক্ত কেপিআই সফলভাবে যুক্ত হয়েছে! ${res.adjustedInfo || ''}`
          : 'Custom KPI added successfully with automatic weight balancing.'
      );
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 my-8 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <PlusCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {language === 'bn' ? 'কাস্টম কেপিআই সূচক সংযোজন' : 'Add Custom KPI Indicator'}
              </h3>
              <p className="text-[11px] text-rose-100">
                {language === 'bn'
                  ? 'স্বয়ংক্রিয় ওয়েট সমন্বয় (মোট ১০০% সীমাবদ্ধ)'
                  : 'Automated weight balancing (capped at 100%)'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="font-bold">{successMsg}</span>
            </div>
          )}

          {/* Weight Auto-Balancing Rule Highlight Card */}
          <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
            <Sliders className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-[11px] text-amber-950">
                {language === 'bn' ? '১০০% ওয়েট সমন্বয় নীতি:' : '100% Total Weight Rule:'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">
                {language === 'bn'
                  ? `নতুন কেপিআই-এ ${weight}% বরাদ্দ করলে শীর্ষ কেপিআইগুলো থেকে সমান হারে ${weight}% কমে মোট ১০০% বজায় থাকবে। কোনো অবস্থাতেই ১০০% এর বেশি হবে না।`
                  : `Assigning ${weight}% to this custom KPI will proportionally deduct ${weight}% from top-weighted KPIs so total remains exactly 100%.`}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('customKpiTitle')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'যেমন: বিশেষ মাঠ জরিপ পরিচালনা / নতুন কেন্দ্র পরিদর্শন'
                    : 'e.g. Special Field Baseline Survey / Donor Visit Coordination'
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('customKpiDesc')}
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={
                  language === 'bn'
                    ? 'এই কাজের লক্ষ্য ও প্রত্যাশিত ফলাফল সংক্ষেপে লিখুন...'
                    : 'Briefly describe the purpose and expected outputs...'
                }
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {t('targetValue')} <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={target}
                  onChange={(e) => setTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {language === 'bn' ? 'পরিমাপ একক' : 'Unit'}
                </label>
                <input
                  type="text"
                  required
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  placeholder="যেমন: সেশন / জন / রিপোর্ট"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center justify-between">
                  <span>{t('weightPercent')}</span>
                  <span className="text-[10px] text-rose-600 font-mono font-bold">
                    {weight}%
                  </span>
                </label>
                <input
                  type="number"
                  min="5"
                  max="40"
                  value={weight}
                  onChange={(e) => setWeight(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-rose-600 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Live Weight Rebalance Preview */}
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'ওয়েট লাইভ প্রিভিউ (মোট ১০০% নিশ্চিত):' : 'Weight Balancing Live Preview:'}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono">
                  {language === 'bn' ? 'সর্বমোট = ১০০%' : 'Total = 100%'}
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-[11px]">
                {/* Existing items with updated weight */}
                {existingItems.map((item) => {
                  const adjusted = weightAdjustment.adjustedItems.find((a) => a.taskId === item.taskId);
                  const newW = adjusted ? adjusted.weight : item.weight;
                  const changed = newW !== item.weight;

                  return (
                    <div
                      key={item.taskId}
                      className={`flex items-center justify-between px-2.5 py-1 rounded-md text-slate-700 ${
                        changed ? 'bg-amber-100/70 font-semibold' : 'bg-white'
                      }`}
                    >
                      <span className="truncate max-w-[240px] text-slate-800" title={item.title}>
                        {item.title}
                      </span>
                      <div className="flex items-center gap-1.5 font-mono text-[10px]">
                        <span className={changed ? 'text-slate-400 line-through' : 'text-slate-600'}>
                          {item.weight}%
                        </span>
                        {changed && (
                          <>
                            <ArrowRight className="w-2.5 h-2.5 text-amber-600" />
                            <span className="text-amber-800 font-bold">{newW}%</span>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}

                {/* New KPI row */}
                <div className="flex items-center justify-between px-2.5 py-1 rounded-md bg-rose-50 text-rose-900 border border-rose-200 font-bold">
                  <span className="truncate max-w-[240px]">
                    + {title.trim() || (language === 'bn' ? 'নতুন অতিরিক্ত কেপিআই' : 'New Custom KPI')}
                  </span>
                  <span className="font-mono text-rose-700">+{weight}%</span>
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-2 italic">
                {weightAdjustment.deductionSummary}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {language === 'bn' ? 'কৌশলগত ক্ষেত্র (Strategic Pillar)' : 'Strategic Pillar'}
              </label>
              <select
                value={pillar}
                onChange={(e) => setPillar(e.target.value as StrategicPillar)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
              >
                {STRATEGIC_PILLARS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>

              <button
                type="submit"
                disabled={!weightAdjustment.isValid}
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                {t('saveCustomKpi')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
