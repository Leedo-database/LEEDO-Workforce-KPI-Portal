import React, { useState, useMemo, useEffect } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { StrategicPillar, KPIItem } from '../types/kpi';
import { getJDTemplateForDesignation } from '../data/jobDescriptions';
import { calculateWeightAdjustment } from '../utils/weightAdjuster';
import {
  X,
  Save,
  CheckCircle2,
  AlertCircle,
  FileText,
  Sliders,
  Upload,
  PlusCircle,
  Trash2,
  Edit,
  Download,
  Percent,
  ArrowRight,
  BookOpen,
  Paperclip,
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

export const HrEditModal: React.FC<Props> = ({ eid, onClose }) => {
  const {
    getUserKPI,
    getEmployee,
    hrUpdateEmployeeKPI,
    modifyEmployeeKpiItem,
    deleteEmployeeKpiItem,
    deleteEmployeeMonthKPI,
    resetEmployeeKpiToDefault,
    addMainKpiItem,
    uploadEmployeeJD,
    getEmployeeJD,
    availableMonths,
    systemConfig,
    kpiRecords,
    currentUser,
  } = useKpi();
  const { language } = useLanguage();

  const [selectedMonth, setSelectedMonth] = useState<string>(systemConfig.activeMonthCode);

  const emp = getEmployee(eid);
  const kpiRecord = getUserKPI(eid, selectedMonth);
  const currentJD = getEmployeeJD(eid);

  const [activeTab, setActiveTab] = useState<'appraisal' | 'kpis' | 'jd'>('appraisal');

  // Tab 1 State: Appraisal
  const [items, setItems] = useState<{ taskId: string; target: number; achieved: number }[]>(() => {
    return kpiRecord?.items.map((i) => ({
      taskId: i.taskId,
      target: i.target,
      achieved: i.achieved,
    })) || [];
  });
  const [hrComments, setHrComments] = useState<string>(kpiRecord?.hrReview?.hrComments || '');
  const [approvalStatus, setApprovalStatus] = useState<'Draft' | 'Approved'>(
    kpiRecord?.hrReview?.status === 'Approved' ? 'Approved' : 'Approved'
  );

  // Sync state when selectedMonth changes
  useEffect(() => {
    const rec = getUserKPI(eid, selectedMonth);
    if (rec) {
      setItems(
        rec.items.map((i) => ({
          taskId: i.taskId,
          target: i.target,
          achieved: i.achieved,
        }))
      );
      setHrComments(rec.hrReview?.hrComments || '');
      setApprovalStatus(rec.hrReview?.status === 'Approved' ? 'Approved' : 'Approved');
    }
  }, [selectedMonth, eid, kpiRecords]);

  // Tab 2 State: KPI Editor & Add Main KPI
  const [editingItem, setEditingItem] = useState<KPIItem | null>(null);
  const [isAddingMainKpi, setIsAddingMainKpi] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newTarget, setNewTarget] = useState<number>(10);
  const [newUnit, setNewUnit] = useState('টি');
  const [newWeight, setNewWeight] = useState<number>(10);
  const [newPillar, setNewPillar] = useState<StrategicPillar>('Child Rights & Street Protection');

  // Delete Confirmation state
  const [deleteConfirmItem, setDeleteConfirmItem] = useState<{ taskId: string; title: string; weight: number } | null>(null);
  const [showMonthResetConfirm, setShowMonthResetConfirm] = useState<boolean>(false);

  // Tab 3 State: JD Upload
  const [jdText, setJdText] = useState(currentJD?.textContent || '');
  const [jdFile, setJdFile] = useState<{ name: string; data: string; size: string } | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!emp || !kpiRecord) return null;

  // Weight rebalancing calculation for new main KPI
  const newKpiWeightAdjustment = useMemo(() => {
    return calculateWeightAdjustment(kpiRecord.items, Number(newWeight) || 0);
  }, [kpiRecord.items, newWeight]);

  // Tab 1 Submit: Appraisal Update
  const handleAppraisalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = hrUpdateEmployeeKPI(eid, items, hrComments, approvalStatus, selectedMonth);
    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => onClose(), 1200);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Tab 2: Add New Main KPI
  const handleAddMainKpi = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFeedback({ type: 'error', message: 'কেপিআই শিরোনাম দিন।' });
      return;
    }
    if (!newKpiWeightAdjustment.isValid) {
      setFeedback({ type: 'error', message: newKpiWeightAdjustment.error || 'ওয়েট ১০০% এর বেশি হতে পারবে না।' });
      return;
    }

    const res = addMainKpiItem(eid, {
      title: newTitle.trim(),
      description: newDesc.trim() || newTitle.trim(),
      target: Number(newTarget) || 1,
      unit: newUnit.trim() || 'Units',
      weight: Number(newWeight) || 10,
      strategicPillar: newPillar,
    }, selectedMonth);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setIsAddingMainKpi(false);
      setNewTitle('');
      setNewDesc('');
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Tab 2: Save Modified KPI Item
  const handleSaveItemEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    const res = modifyEmployeeKpiItem(eid, editingItem.taskId, {
      title: editingItem.title,
      description: editingItem.description,
      target: Number(editingItem.target),
      achieved: Number(editingItem.achieved),
      weight: Number(editingItem.weight),
      unit: editingItem.unit,
      strategicPillar: editingItem.strategicPillar,
    }, selectedMonth);

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      setEditingItem(null);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  // Tab 2: Confirm and Delete KPI Item
  const handleConfirmDeleteItem = () => {
    if (!deleteConfirmItem) return;
    const res = deleteEmployeeKpiItem(eid, deleteConfirmItem.taskId, selectedMonth);
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message });
    setDeleteConfirmItem(null);
  };

  // Tab 2: Confirm and Reset Month KPI
  const handleConfirmMonthReset = () => {
    const res = resetEmployeeKpiToDefault(eid, selectedMonth);
    setFeedback({ type: res.success ? 'success' : 'error', message: res.message });
    setShowMonthResetConfirm(false);
  };

  // Tab 3: JD File Upload Handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const base64 = uploadEvent.target?.result as string;
      const sizeKB = `${Math.round(file.size / 1024)} KB`;
      setJdFile({
        name: file.name,
        data: base64,
        size: sizeKB,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveJD = (e: React.FormEvent) => {
    e.preventDefault();
    const res = uploadEmployeeJD(eid, {
      fileName: jdFile?.name,
      fileData: jdFile?.data,
      fileSize: jdFile?.size,
      textContent: jdText.trim(),
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const templates = getJDTemplateForDesignation(emp.designation);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-4 pt-6 pb-12 bg-slate-950/75 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden border border-slate-200 my-4 animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Sliders className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm">
                  {language === 'bn' ? 'এইচআর প্রশাসন ও কেপিআই নিয়ন্ত্রণ প্যানেল' : 'HR Appraisal & KPI Management Panel'}
                </h3>
                <span className="bg-rose-900/60 px-2 py-0.5 rounded text-[10px] font-mono text-rose-200">
                  EID: {emp.eid}
                </span>
              </div>
              <p className="text-[11px] text-rose-100">
                {emp.name} • {emp.designation} ({emp.department})
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

        {/* Tab Navigation & Month Selection */}
        <div className="flex flex-wrap items-center justify-between border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setActiveTab('appraisal');
                setFeedback(null);
              }}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'appraisal'
                  ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-px'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{language === 'bn' ? '১. মাসিক মূল্যায়ন ও স্কোর' : '1. Appraisal & Scoring'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('kpis');
                setFeedback(null);
              }}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'kpis'
                  ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-px'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-4 h-4" />
              <span>{language === 'bn' ? '২. কেপিআই পরিবর্তন ও সংযোজন' : '2. Core KPI Editor'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setActiveTab('jd');
                setFeedback(null);
              }}
              className={`px-4 py-2 font-bold text-xs rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'jd'
                  ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-px'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              <span>{language === 'bn' ? '৩. জেডি আপলোড (JD Manager)' : '3. Job Description (JD)'}</span>
            </button>
          </div>

          {/* Month selector for HR to view and manage present or past KPIs */}
          <div className="flex items-center gap-2 pb-2 text-xs">
            <span className="text-slate-500 font-bold">{language === 'bn' ? 'মূল্যায়ন মাস:' : 'Cycle:'}</span>
            <select
              value={selectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                setEditingItem(null);
                setDeleteConfirmItem(null);
                setFeedback(null);
              }}
              className="bg-white border border-slate-300 font-bold text-slate-800 rounded-lg px-2.5 py-1 text-xs focus:ring-2 focus:ring-rose-500 cursor-pointer shadow-2xs"
            >
              {availableMonths.map((m) => (
                <option key={m.code} value={m.code}>
                  {m.name} {m.code === systemConfig.activeMonthCode ? (language === 'bn' ? '(চলতি)' : '(Current)') : (language === 'bn' ? '(পূর্ববর্তী)' : '(Past)')}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`m-6 mb-0 p-3 rounded-xl border flex items-start gap-2 text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6">
          {/* TAB 1: MONTHLY APPRAISAL & SCORING */}
          {activeTab === 'appraisal' && (
            <form onSubmit={handleAppraisalSubmit} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-slate-700">
                <p className="font-semibold text-slate-800 mb-1">
                  {language === 'bn'
                    ? 'চলতি মাসের টার্গেট ও অর্জিত লক্ষ্যমাত্রা পর্যালোচনা:'
                    : 'Review and adjust targets and verified achievements:'}
                </p>
                <p className="text-[11px] text-slate-500">
                  {language === 'bn'
                    ? 'এইচআর ও সুপারভাইজার সরাসরি ফিল্ড ভেরিফিকেশনের ওপর ভিত্তি করে সংখ্যা পরিবর্তন করতে পারেন।'
                    : 'HR and supervisors can modify values based on ground inspection and field evidence.'}
                </p>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[300px] overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">সূচকের নাম (KPI Indicator)</th>
                      <th className="py-2.5 px-2 text-center w-16">ওয়েট</th>
                      <th className="py-2.5 px-2 text-center w-24">টার্গেট</th>
                      <th className="py-2.5 px-2 text-center w-24">অর্জিত</th>
                      <th className="py-2.5 px-2 text-center w-20">অর্জনের হার</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kpiRecord.items.map((kItem, idx) => {
                      const currentVal = items.find((i) => i.taskId === kItem.taskId) || {
                        target: kItem.target,
                        achieved: kItem.achieved,
                      };
                      const rate = Math.round((currentVal.achieved / (currentVal.target || 1)) * 100);

                      return (
                        <tr key={kItem.taskId} className="hover:bg-slate-50">
                          <td className="py-2 px-3">
                            <span className="font-bold text-slate-800 block">{kItem.title}</span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              একক: {kItem.unit}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">
                            {kItem.weight}%
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="1"
                              value={currentVal.target}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.taskId === kItem.taskId ? { ...i, target: val } : i
                                  )
                                );
                              }}
                              className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center text-xs focus:ring-1 focus:ring-rose-500"
                            />
                          </td>
                          <td className="py-2 px-2 text-center">
                            <input
                              type="number"
                              min="0"
                              value={currentVal.achieved}
                              onChange={(e) => {
                                const val = Number(e.target.value);
                                setItems((prev) =>
                                  prev.map((i) =>
                                    i.taskId === kItem.taskId ? { ...i, achieved: val } : i
                                  )
                                );
                              }}
                              className="w-20 px-2 py-1 border border-slate-300 rounded font-mono text-center text-xs font-bold text-rose-700 focus:ring-1 focus:ring-rose-500"
                            />
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold">
                            <span
                              className={
                                rate >= 80 ? 'text-emerald-700' : rate >= 60 ? 'text-amber-700' : 'text-rose-700'
                              }
                            >
                              {rate}%
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-800 mb-1">
                  এইচআর / সুপারভাইজার মূল্যায়ন মন্তব্য (Official Appraisal Comments) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={hrComments}
                  onChange={(e) => setHrComments(e.target.value)}
                  placeholder="কর্মকর্তার কর্মদক্ষতা, শক্তি এবং উন্নয়ন ক্ষেত্র সংক্রান্ত বিস্তারিত মন্তব্য লিখুন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="appraisalStatus"
                      checked={approvalStatus === 'Approved'}
                      onChange={() => setApprovalStatus('Approved')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-bold text-emerald-800">চূড়ান্ত অনুমোদন (Approve Evaluation)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="appraisalStatus"
                      checked={approvalStatus === 'Draft'}
                      onChange={() => setApprovalStatus('Draft')}
                      className="text-rose-600 focus:ring-rose-500"
                    />
                    <span className="font-semibold text-slate-600">খসড়া হিসেবে সংরক্ষণ (Working Draft)</span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>মূল্যায়ন সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 2: KPI MODIFICATION & ADD MAIN KPI */}
          {activeTab === 'kpis' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {language === 'bn' ? 'কর্মকর্তার মূল কেপিআই সূচক তালিকা' : 'Core KPI Indicators List'}
                  </h4>
                  <p className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'এখানে এইচআর যেকোনো কেপিআই সংশোধন করতে পারেন বা নতুন মূল কেপিআই যুক্ত করতে পারেন।'
                      : 'HR can edit any indicator or inject a new core KPI with automated 100% weight balancing.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAddingMainKpi(!isAddingMainKpi)}
                  className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                >
                  <PlusCircle className="w-4 h-4" />
                  <span>{isAddingMainKpi ? 'ফর্ম বন্ধ করুন' : '+ নতুন মূল কেপিআই যোগ করুন'}</span>
                </button>
              </div>

              {/* Add New Main KPI Form */}
              {isAddingMainKpi && (
                <form
                  onSubmit={handleAddMainKpi}
                  className="p-4 bg-rose-50/60 border border-rose-200 rounded-xl space-y-3"
                >
                  <h5 className="font-bold text-rose-900 text-xs flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4 text-rose-600" />
                    <span>নতুন মূল কেপিআই সংযোজন (অন্যান্য সূচক থেকে সমান হারে ওয়েট কমবে)</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        কেপিআই শিরোনাম <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="যেমন: মাসিক স্পেশাল কেস ম্যানেজমেন্ট"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        কৌশলগত ক্ষেত্র (Strategic Pillar)
                      </label>
                      <select
                        value={newPillar}
                        onChange={(e) => setNewPillar(e.target.value as StrategicPillar)}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      >
                        {STRATEGIC_PILLARS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        টার্গেট <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        min="1"
                        required
                        value={newTarget}
                        onChange={(e) => setNewTarget(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        একক
                      </label>
                      <input
                        type="text"
                        value={newUnit}
                        onChange={(e) => setNewUnit(e.target.value)}
                        placeholder="টি / সেশন"
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        বরাদ্দকৃত ওয়েট (%)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="35"
                        required
                        value={newWeight}
                        onChange={(e) => setNewWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded font-mono font-bold text-rose-700 text-xs focus:ring-1 focus:ring-rose-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-amber-800 italic bg-amber-50 p-2 rounded border border-amber-200">
                    ℹ️ {newKpiWeightAdjustment.deductionSummary}
                  </p>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setIsAddingMainKpi(false)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      disabled={!newKpiWeightAdjustment.isValid}
                      className="px-4 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded font-bold text-xs"
                    >
                      মূল কেপিআই হিসেবে সংরক্ষণ করুন
                    </button>
                  </div>
                </form>
              )}

              {/* Editing an Item in a Modal-in-place form */}
              {editingItem && (
                <form
                  onSubmit={handleSaveItemEdit}
                  className="p-4 bg-amber-50/70 border border-amber-300 rounded-xl space-y-3"
                >
                  <h5 className="font-bold text-amber-900 text-xs flex items-center gap-1.5">
                    <Edit className="w-4 h-4 text-amber-700" />
                    <span>কেপিআই সম্পাদনা: {editingItem.title}</span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        শিরোনাম
                      </label>
                      <input
                        type="text"
                        value={editingItem.title}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, title: e.target.value })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">
                        কৌশলগত ক্ষেত্র
                      </label>
                      <select
                        value={editingItem.strategicPillar}
                        onChange={(e) =>
                          setEditingItem({
                            ...editingItem,
                            strategicPillar: e.target.value as StrategicPillar,
                          })
                        }
                        className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded text-xs"
                      >
                        {STRATEGIC_PILLARS.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-2">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        টার্গেট
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={editingItem.target}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, target: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        অর্জিত
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={editingItem.achieved}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, achieved: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold text-rose-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        ওয়েট (%)
                      </label>
                      <input
                        type="number"
                        min="5"
                        max="50"
                        value={editingItem.weight}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, weight: Number(e.target.value) })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded font-mono text-xs font-bold text-rose-700"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-700 mb-0.5">
                        একক
                      </label>
                      <input
                        type="text"
                        value={editingItem.unit}
                        onChange={(e) =>
                          setEditingItem({ ...editingItem, unit: e.target.value })
                        }
                        className="w-full px-2 py-1 bg-white border border-slate-300 rounded text-xs"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setEditingItem(null)}
                      className="px-3 py-1 text-slate-600 hover:bg-slate-200 rounded text-xs"
                    >
                      বাতিল
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded font-bold text-xs"
                    >
                      পরিবর্তন নিশ্চিত করুন
                    </button>
                  </div>
                </form>
              )}

              {/* Delete KPI Confirmation Prompt */}
              {deleteConfirmItem && (
                <div className="p-3 bg-rose-50 border border-rose-300 rounded-xl mb-3 flex flex-wrap items-center justify-between gap-2 text-xs text-rose-900 animate-in fade-in">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                    <span>
                      {language === 'bn'
                        ? `"${deleteConfirmItem.title}" সূচকটি মুছে ফেলতে চান? এর ${deleteConfirmItem.weight}% ওয়েট অবশিষ্ট সূচকগুলোতে পুনর্বণ্টন হবে।`
                        : `Delete KPI "${deleteConfirmItem.title}"? Its ${deleteConfirmItem.weight}% weight will be redistributed.`}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleConfirmDeleteItem}
                      className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {language === 'bn' ? 'মুছে ফেলুন (নিশ্চিত)' : 'Confirm Delete'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirmItem(null)}
                      className="px-2.5 py-1 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-lg text-xs cursor-pointer"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                </div>
              )}

              {/* List of existing KPIs */}
              <div className="border border-slate-200 rounded-xl overflow-hidden">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3">কেপিআই বিবরণ</th>
                      <th className="py-2.5 px-2 text-center w-16">ওয়েট</th>
                      <th className="py-2.5 px-2 text-center w-20">টার্গেট</th>
                      <th className="py-2.5 px-2 text-center w-20">অর্জিত</th>
                      <th className="py-2.5 px-3 text-right w-24">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {kpiRecord.items.map((item) => (
                      <tr key={item.taskId} className="hover:bg-slate-50">
                        <td className="py-2 px-3">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-slate-800">{item.title}</span>
                            {item.isCustom && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                                কাস্টম
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500">{item.strategicPillar}</div>
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-slate-700">
                          {item.weight}%
                        </td>
                        <td className="py-2 px-2 text-center font-mono text-slate-700">
                          {item.target} {item.unit}
                        </td>
                        <td className="py-2 px-2 text-center font-mono font-bold text-rose-700">
                          {item.achieved} {item.unit}
                        </td>
                        <td className="py-2 px-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              type="button"
                              onClick={() => setEditingItem(item)}
                              className="p-1 hover:bg-slate-200 rounded text-slate-600 hover:text-slate-900 transition cursor-pointer"
                              title="সম্পাদনা করুন"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmItem({ taskId: item.taskId, title: item.title, weight: item.weight })}
                              className="p-1 hover:bg-rose-100 rounded text-rose-600 hover:text-rose-800 transition cursor-pointer"
                              title="অপসারণ করুন"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Month KPI Reset / Clear Option */}
              <div className="mt-4 p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="font-bold text-slate-700 block">
                    {language === 'bn' ? `${selectedMonth} মাসের কেপিআই নিয়ন্ত্রণ:` : `Manage ${selectedMonth} KPI Record:`}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {language === 'bn'
                      ? 'ভুল বা পূর্ববর্তী মাসের স্কোরকার্ড রিসেট করতে অথবা ডিফল্ট অবস্থায় ফিরিয়ে নিতে ব্যবহার করুন।'
                      : 'Reset or clear this monthly scorecard back to default designation template.'}
                  </span>
                </div>

                {!showMonthResetConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowMonthResetConfirm(true)}
                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold transition cursor-pointer"
                  >
                    {language === 'bn' ? 'ডিফল্ট জেডি সূচকে রিসেট করুন' : 'Reset to Default Template'}
                  </button>
                ) : (
                  <div className="flex items-center gap-2 bg-rose-100 p-1.5 rounded-xl border border-rose-300">
                    <span className="text-[11px] text-rose-900 font-bold px-1">
                      {language === 'bn' ? 'আপনি কি নিশ্চিত?' : 'Are you sure?'}
                    </span>
                    <button
                      type="button"
                      onClick={handleConfirmMonthReset}
                      className="px-2.5 py-1 bg-rose-600 text-white rounded-lg font-bold text-xs cursor-pointer shadow-xs"
                    >
                      {language === 'bn' ? 'হ্যাঁ, রিসেট করুন' : 'Yes, Reset'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowMonthResetConfirm(false)}
                      className="px-2 py-1 bg-slate-200 text-slate-700 rounded-lg text-xs cursor-pointer"
                    >
                      {language === 'bn' ? 'বাতিল' : 'Cancel'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: JD (JOB DESCRIPTION) UPLOAD & MANAGEMENT */}
          {activeTab === 'jd' && (
            <form onSubmit={handleSaveJD} className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-3">
                <FileText className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-slate-800 text-xs">
                    {language === 'bn'
                      ? 'কর্মকর্তার অফিসিয়াল জব ডেসক্রিপশন (JD) আপলোড ও ব্যবস্থাপনা'
                      : 'Job Description (JD) Document & Responsibilities Management'}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    {language === 'bn'
                      ? 'এইচআর ও এডমিন এখান থেকে যেকোনো কর্মীর স্বাক্ষরিত জেডি ফাইল আপলোড করতে পারবেন এবং কাজের বিবরণ হালনাগাদ করতে পারবেন।'
                      : 'HR can upload signed JD files (PDF/Images) and configure specific responsibilities for this employee.'}
                  </p>
                </div>
              </div>

              {/* Existing Uploaded Document Info */}
              {currentJD && (
                <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Paperclip className="w-4 h-4 text-emerald-700" />
                    <div>
                      <span className="font-bold text-emerald-900 block">{currentJD.fileName}</span>
                      <span className="text-[10px] text-emerald-700">
                        আপলোডকারী: {currentJD.uploadedByName} • {new Date(currentJD.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {currentJD.fileData && (
                    <a
                      href={currentJD.fileData}
                      download={currentJD.fileName || 'Employee_JD.pdf'}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-bold flex items-center gap-1 transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>ডাউনলোড</span>
                    </a>
                  )}
                </div>
              )}

              {/* Upload New JD File */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  নতুন জেডি ফাইল আপলোড করুন (PDF, Word বা ছবি)
                </label>
                <div className="border-2 border-dashed border-slate-300 hover:border-rose-500 rounded-xl p-4 text-center bg-slate-50/60 transition cursor-pointer relative">
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                    onChange={handleFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <Upload className="w-6 h-6 text-slate-400 mx-auto mb-1.5" />
                  <p className="font-bold text-slate-700 text-xs">
                    {jdFile ? jdFile.name : 'ফাইল নির্বাচন করতে ক্লিক করুন বা ড্র্যাগ করুন'}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    {jdFile ? `সাইজ: ${jdFile.size}` : 'সর্বোচ্চ ৫ মেগাবাইট (PDF, DOCX, JPG)'}
                  </p>
                </div>
              </div>

              {/* JD Responsibilities Textarea */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  প্রধান প্রধান দায়িত্ব ও কর্তব্য (Job Duties & Scope):
                </label>
                <textarea
                  rows={4}
                  value={jdText}
                  onChange={(e) => setJdText(e.target.value)}
                  placeholder="এই কর্মীর মূল কাজের পরিধি, জবাবদিহিতা ও নির্ধারিত ফিল্ড কার্যক্রম এখানে লিপিবদ্ধ করুন..."
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              {/* Standard Templates Reference */}
              <div className="p-3 bg-slate-100 rounded-xl">
                <span className="font-bold text-slate-700 block mb-1 text-[11px]">
                  প্রতিষ্ঠানের মানসম্মত জেডি টেমপ্লেট ({emp.designation}):
                </span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-600">
                  {templates.slice(0, 3).map((t) => (
                    <li key={t.id}>
                      <span className="font-semibold text-slate-800">{t.title}</span> — {t.description}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-end pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>জেডি (JD) সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
