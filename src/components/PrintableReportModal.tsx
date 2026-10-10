import React, { useRef, useState, useMemo, useEffect } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { getStrategicPillarsSummary } from '../utils/kpiCalculator';
import { ProofViewerModal } from './ProofViewerModal';
import { ProofAttachment, ReportPeriod } from '../types/kpi';
import { LeedoLogo } from './LeedoLogo';
import {
  Printer,
  X,
  Award,
  Shield,
  FileText,
  TrendingUp,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Layers,
  Paperclip,
  Eye,
  Calendar,
  Users,
  ChevronDown,
  Info,
} from 'lucide-react';

interface PrintableReportModalProps {
  eid: string;
  onClose: () => void;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  eid: initialEid,
  onClose,
}) => {
  const {
    getUserKPI,
    getEmployee,
    employees,
    systemConfig,
    logReportPrinted,
    kpiRecords,
    getAggregatedPerformance,
    currentUser,
    availableMonths,
    canUserAccessExecutiveReports,
  } = useKpi();
  const { language, t } = useLanguage();

  // Check if current user is authorized to view others or switch staff
  const canSwitchStaff = canUserAccessExecutiveReports(currentUser);

  // Strict Privacy: Non-executive/HR employees can ONLY view their own report
  const effectiveInitialEid = canSwitchStaff ? initialEid : (currentUser?.eid || initialEid);
  const [currentEid, setCurrentEid] = useState<string>(effectiveInitialEid);
  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('1m');
  const [activeFormat, setActiveFormat] = useState<'appraisal' | 'executive' | 'evidence' | 'matrix'>('appraisal');
  const [selectedProof, setSelectedProof] = useState<ProofAttachment | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);

  // Guard against unauthorized eid changes
  useEffect(() => {
    if (!canSwitchStaff && currentUser && currentEid !== currentUser.eid) {
      setCurrentEid(currentUser.eid);
    }
  }, [canSwitchStaff, currentUser, currentEid]);

  // If user tries to open matrix without permission, reset to appraisal
  useEffect(() => {
    if (!canSwitchStaff && activeFormat === 'matrix') {
      setActiveFormat('appraisal');
    }
  }, [canSwitchStaff, activeFormat]);

  const emp = getEmployee(currentEid);
  const kpi = getUserKPI(currentEid);

  // Aggregated multi-period performance
  const aggregatedPerf = useMemo(() => {
    return getAggregatedPerformance(currentEid, selectedPeriod);
  }, [getAggregatedPerformance, currentEid, selectedPeriod]);

  if (!emp || !kpi) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
          <p className="text-slate-600 text-sm">
            {language === 'bn' ? 'কর্মকর্তার রেকর্ড খুঁজে পাওয়া যায়নি।' : 'Employee appraisal record not found.'}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const handlePrint = () => {
    logReportPrinted(currentEid, `${activeFormat.toUpperCase()} (${selectedPeriod.toUpperCase()})`);
    window.print();
  };

  const pillarSummaries = getStrategicPillarsSummary(kpi);

  // Departmental peers for Matrix format (Executive/HR only)
  const deptPeers = employees.filter((e) => e.department === emp.department && e.status !== 'resigned');
  const deptKpis = deptPeers.map((e) => {
    const peerKpi = kpiRecords.find((r) => r.eid === e.eid && r.month === systemConfig.activeMonthCode);
    return {
      emp: e,
      score: peerKpi?.finalScore ?? 0,
      rating: peerKpi?.ratingLabel ?? 'Needs Improvement',
      color: peerKpi?.ratingColor ?? '#ea580c',
      tasksDone: peerKpi?.items.reduce((a, b) => a + (b.achieved >= b.target ? 1 : 0), 0) ?? 0,
      totalTasks: peerKpi?.items.length ?? 0,
    };
  });

  const deptAverage = Math.round(deptKpis.reduce((acc, curr) => acc + curr.score, 0) / (deptKpis.length || 1));

  const periodLabels: Record<ReportPeriod, { bn: string; en: string }> = {
    '1m': { bn: '১ মাস (চলতি মাসিক)', en: '1 Month (Monthly)' },
    '3m': { bn: '৩ মাস (ত্রৈমাসিক)', en: '3 Months (Quarterly)' },
    '6m': { bn: '৬ মাস (অর্ধ-বার্ষিক)', en: '6 Months (Semi-Annual)' },
    '1y': { bn: '১ বছর (বার্ষিক)', en: '1 Year (Annual)' },
  };

  // Period specific table items & scores
  const displayItems = aggregatedPerf?.aggregatedItems && aggregatedPerf.aggregatedItems.length > 0
    ? aggregatedPerf.aggregatedItems
    : kpi.items;
  const displayScore = aggregatedPerf ? aggregatedPerf.averageScore : kpi.finalScore;
  const displayRatingLabel = aggregatedPerf ? aggregatedPerf.overallRatingLabel : kpi.ratingLabel;
  const displayRatingColor = aggregatedPerf ? aggregatedPerf.ratingColor : kpi.ratingColor;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 pt-16 pb-16 bg-slate-950/75 backdrop-blur-xs overflow-y-auto print:static print:inset-auto print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:h-auto print:w-full">
      {/* Top Floating Control Bar (Strictly Hidden during Print) */}
      <div className="fixed top-3 inset-x-4 sm:inset-x-auto sm:right-4 z-50 flex flex-wrap items-center justify-between sm:justify-end gap-2 print:hidden bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl shadow-2xl border border-slate-700">
        {/* Quick Staff Switcher (ONLY for Forhad, Kanta, HR) */}
        {canSwitchStaff && (
          <div className="flex items-center gap-1.5 bg-slate-800 px-2 py-1 rounded-xl text-xs text-white">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <select
              value={currentEid}
              onChange={(e) => setCurrentEid(e.target.value)}
              className="bg-transparent text-white font-bold border-none focus:outline-none cursor-pointer text-xs max-w-[160px] truncate"
            >
              {employees.map((e) => (
                <option key={e.eid} value={e.eid} className="bg-slate-900 text-white">
                  {e.eid} - {e.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Evaluation Period Selector (1m, 3m, 6m, 1y) */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
          {(['1m', '3m', '6m', '1y'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriod(p)}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedPeriod === p ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3 h-3" />
              <span>{language === 'bn' ? periodLabels[p].bn : periodLabels[p].en}</span>
            </button>
          ))}
        </div>

        {/* Format Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
          <button
            type="button"
            onClick={() => setActiveFormat('appraisal')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              activeFormat === 'appraisal' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Award className="w-3 h-3" />
            <span>{language === 'bn' ? 'সনদ' : 'Appraisal'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormat('executive')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              activeFormat === 'executive' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <FileText className="w-3 h-3" />
            <span>{language === 'bn' ? 'ডসিয়ার' : 'Dossier'}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveFormat('evidence')}
            className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
              activeFormat === 'evidence' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
            }`}
          >
            <Paperclip className="w-3 h-3" />
            <span>{language === 'bn' ? 'প্রমাণ' : 'Evidence'}</span>
          </button>

          {/* Matrix Tab: STRICTLY VISIBLE ONLY TO EXECUTIVE MANAGEMENT & HR */}
          {canSwitchStaff && (
            <button
              type="button"
              onClick={() => setActiveFormat('matrix')}
              className={`px-2.5 py-1 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                activeFormat === 'matrix' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Layers className="w-3 h-3" />
              <span>{language === 'bn' ? 'ম্যাট্রিক্স' : 'Matrix'}</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
          </button>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable Document Body */}
      <div
        ref={reportRef}
        className="printable-document bg-white w-full max-w-4xl my-16 sm:my-10 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none text-xs"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Official Header */}
        <div className="border-b-2 border-rose-600 pb-4 mb-4 avoid-break">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-white p-1 rounded-lg">
                <LeedoLogo size="lg" showSubtitle={false} />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-rose-700 uppercase tracking-tight">
                  LEEDO
                </h1>
                <p className="text-[11px] font-bold text-slate-800">
                  Local Education and Economic Development Organization
                </p>
                <p className="text-[10px] text-slate-500">
                  Peace Home, Dhaka, Bangladesh • Est. 2000
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-2.5 py-1 bg-rose-50 text-rose-800 rounded font-bold text-[10px] uppercase border border-rose-200 tracking-wider">
                {activeFormat === 'appraisal' && (language === 'bn' ? 'কর্মদক্ষতা মূল্যায়ন সনদ' : 'Official Performance Appraisal')}
                {activeFormat === 'executive' && (language === 'bn' ? 'ব্যবস্থাপনা ও বোর্ড ব্রিফিং ডসিয়ার' : 'Executive Management Dossier')}
                {activeFormat === 'evidence' && (language === 'bn' ? 'কাজের প্রমাণ ও কার্যক্রম নিরীক্ষা' : 'Field Activity & Evidence Audit')}
                {activeFormat === 'matrix' && (language === 'bn' ? 'বিভাগীয় তুলনামূলক পারফরম্যান্স চার্ট' : 'Departmental Comparative Matrix')}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Doc Ref: LEEDO/KPI/{selectedPeriod.toUpperCase()}/{systemConfig.activeMonthCode}/{emp.eid}
              </p>
              <p className="text-[10px] font-bold text-slate-700 mt-0.5">
                Evaluation Period: {periodLabels[selectedPeriod].en} ({systemConfig.activeMonth})
              </p>
            </div>
          </div>
        </div>

        {/* Employee Particulars Grid */}
        <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 mb-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[11px] avoid-break">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee Name</span>
            <span className="font-bold text-slate-900 text-xs">{emp.name}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Employee ID (EID)</span>
            <span className="font-bold text-slate-900 font-mono text-xs">{emp.eid}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Designation</span>
            <span className="font-bold text-slate-800">{emp.designation}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-bold">Department</span>
            <span className="font-bold text-slate-800">{emp.department}</span>
          </div>
        </div>

        {/* Multi-Month Aggregation Info Note (when 3m, 6m, 1y selected) */}
        {selectedPeriod !== '1m' && aggregatedPerf && (
          <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 mb-4 flex items-center justify-between text-[11px] text-rose-900 avoid-break print:bg-slate-50 print:border-slate-300">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-rose-600 shrink-0" />
              <span>
                {language === 'bn'
                  ? `নির্বাচিত মূল্যায়ন সময়কাল: ${aggregatedPerf.periodLabel}। নিচের ছকে লক্ষ্যমাত্রা (Target) এবং অর্জিত (Achieved) কলামে প্রতি মাসের গড় মান ও সামগ্রিক ওয়েটেড স্কোর প্রদর্শিত হচ্ছে।`
                  : `Evaluation Period: ${aggregatedPerf.periodLabel}. Table columns reflect monthly averages and cumulative weighted scores across ${aggregatedPerf.monthsIncluded.length} months (${aggregatedPerf.monthsIncluded.join(', ')}).`}
              </span>
            </div>
            <span className="font-mono font-bold text-rose-700 whitespace-nowrap ml-2">
              Avg Score: {displayScore}%
            </span>
          </div>
        )}

        {/* FORMAT 1: OFFICIAL APPRAISAL SHEET */}
        {activeFormat === 'appraisal' && (
          <div className="space-y-4">
            {/* Core KPI Items Table */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                    <th className="border border-slate-300 px-2 py-2 text-center w-8">#</th>
                    <th className="border border-slate-300 px-3 py-2 text-left">Key Performance Indicator (Core JD)</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-16">Weight</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-28">
                      {selectedPeriod === '1m' ? 'Target' : 'Target (Avg/Mo)'}
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-28">
                      {selectedPeriod === '1m' ? 'Achieved' : 'Achieved (Avg/Mo)'}
                    </th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-20">Rate (%)</th>
                    <th className="border border-slate-300 px-2 py-2 text-center w-24">Weighted Score</th>
                  </tr>
                </thead>
                <tbody>
                  {displayItems.map((item, index) => {
                    const isOver = item.achievementRate >= 100;
                    return (
                      <tr key={item.taskId} className="hover:bg-slate-50/50">
                        <td className="border border-slate-300 px-2 py-2 text-center text-slate-500 font-mono">
                          {index + 1}
                        </td>
                        <td className="border border-slate-300 px-3 py-2">
                          <div className="font-bold text-slate-800 flex items-center gap-1.5">
                            <span>{item.title}</span>
                            {item.isCustom && (
                              <span className="px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded text-[9px] font-bold">
                                Custom
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{item.description}</div>
                          <div className="text-[9px] text-slate-400 font-mono mt-0.5">{item.strategicPillar}</div>
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold text-slate-700">
                          {item.weight}%
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono">
                          {item.target} {item.unit}
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold text-slate-900">
                          {item.achieved} {item.unit}
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-bold">
                          <span className={isOver ? 'text-emerald-700' : 'text-slate-800'}>
                            {item.achievementRate}%
                          </span>
                        </td>
                        <td className="border border-slate-300 px-2 py-2 text-center font-mono font-black text-rose-700">
                          {item.weightedScore.toFixed(1)} / {item.weight}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-100 font-bold text-slate-900 avoid-break">
                    <td colSpan={2} className="border border-slate-300 px-3 py-2 text-right uppercase">
                      Total Workforce Score & Achievement
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center font-mono">
                      {displayItems.reduce((acc, it) => acc + it.weight, 0)}%
                    </td>
                    <td colSpan={3} className="border border-slate-300 px-2 py-2 text-right uppercase text-[10px]">
                      {selectedPeriod === '1m' ? 'Composite Monthly Score (100 Max):' : `Composite Period Score (${selectedPeriod.toUpperCase()} Average):`}
                    </td>
                    <td className="border border-slate-300 px-2 py-2 text-center font-mono font-black text-sm text-rose-700">
                      {displayScore} / 100
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Score & Rating Band Card */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 flex flex-wrap items-center justify-between gap-4 avoid-break">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Overall Performance Classification ({selectedPeriod.toUpperCase()})
                </span>
                <div className="flex items-center gap-2 mt-1">
                  <span
                    className="px-3 py-1 rounded-full text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: displayRatingColor }}
                  >
                    {displayRatingLabel}
                  </span>
                  <span className="text-slate-600 font-mono text-xs font-bold">
                    (Final Score: {displayScore}%)
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                  Appraisal Status
                </span>
                <span
                  className={`inline-block mt-1 px-2.5 py-0.5 rounded text-[11px] font-bold ${
                    kpi.hrReview?.status === 'Approved'
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-amber-100 text-amber-800 border border-amber-200'
                  }`}
                >
                  {kpi.hrReview?.status === 'Approved' ? 'Verified & Approved' : 'Working Draft (Review in Progress)'}
                </span>
              </div>
            </div>

            {/* Supervisor / HR Feedback */}
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 mb-4 avoid-break">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-1">
                Executive & Supervisor Appraisal Remarks
              </span>
              <p className="text-slate-700 text-[11px] leading-relaxed italic">
                {kpi.hrReview?.hrComments ||
                  'Overall performance exhibits strong dedication towards LEEDO core goals and operational mandate. High standard maintained in line with official Job Description.'}
              </p>
            </div>
          </div>
        )}

        {/* FORMAT 2: EXECUTIVE DOSSIER */}
        {activeFormat === 'executive' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 avoid-break">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Executive Performance Summary & Strategic Alignment
              </h3>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                During this period, {emp.name} served in {emp.department} fulfilling key project objectives.
                Overall rating achieved: <strong>{displayRatingLabel}</strong> ({displayScore}% composite index).
              </p>
            </div>

            {/* Pillar breakdown */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 avoid-break">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                Strategic Pillar Weight & Achievement Breakdown
              </h3>
              <div className="space-y-2.5">
                {pillarSummaries.map((p) => (
                  <div key={p.pillar} className="border-b border-slate-200 pb-2 last:border-b-0">
                    <div className="flex justify-between font-bold text-[11px] mb-1">
                      <span className="text-slate-800">{p.pillar}</span>
                      <span className="font-mono text-rose-700">{p.averageAchievementRate}% achieved</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-rose-600 h-full rounded-full"
                        style={{ width: `${Math.min(100, p.averageAchievementRate)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* FORMAT 3: EVIDENCE & AUDIT LOG */}
        {activeFormat === 'evidence' && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-3">
                Field Progress Updates & Verification Entries ({kpi.updates.length} entries)
              </h3>
              <div className="space-y-3">
                {kpi.updates.map((upd) => (
                  <div key={upd.id} className="p-3 bg-white rounded-lg border border-slate-200 avoid-break">
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono mb-1">
                      <span>Date: {upd.date}</span>
                      <span className="uppercase font-bold text-rose-600">{upd.updateType} update</span>
                    </div>
                    <p className="font-bold text-slate-800 text-[11px] mb-1">{upd.summary}</p>
                    {upd.challenges && (
                      <p className="text-[10px] text-amber-700 italic">Field Challenges: {upd.challenges}</p>
                    )}
                  </div>
                ))}
                {kpi.updates.length === 0 && (
                  <p className="text-slate-400 text-center py-4 italic">No evidence log entries logged yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* FORMAT 4: DEPARTMENT MATRIX (EXECUTIVE / HR ONLY) */}
        {activeFormat === 'matrix' && canSwitchStaff && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-800 text-xs uppercase tracking-wider mb-2">
                Departmental Peer Benchmark ({emp.department} • Avg: {deptAverage}%)
              </h3>
              <table className="w-full border-collapse border border-slate-300 text-[11px]">
                <thead>
                  <tr className="bg-slate-100 font-bold text-slate-700">
                    <th className="border border-slate-300 px-3 py-1.5 text-left">Staff Name</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-left">Role</th>
                    <th className="border border-slate-300 px-2 py-1.5 text-center">Score</th>
                    <th className="border border-slate-300 px-3 py-1.5 text-center">Rating</th>
                  </tr>
                </thead>
                <tbody>
                  {deptKpis.map((p) => (
                    <tr key={p.emp.eid} className={p.emp.eid === emp.eid ? 'bg-rose-50 font-bold' : ''}>
                      <td className="border border-slate-300 px-3 py-1.5">{p.emp.name}</td>
                      <td className="border border-slate-300 px-3 py-1.5 text-slate-600">{p.emp.designation}</td>
                      <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold text-rose-700">
                        {p.score}%
                      </td>
                      <td className="border border-slate-300 px-3 py-1.5 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold text-white" style={{ backgroundColor: p.color }}>
                          {p.rating}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Official 3-Tier NGO Signatures Block */}
        <div className="avoid-break pt-6 mt-6 border-t-2 border-slate-300 grid grid-cols-3 gap-6 text-center text-[10px]">
          {/* Employee Signature */}
          <div className="flex flex-col items-center justify-end min-h-[80px]">
            <div className="w-36 border-b border-slate-400 pb-1 mb-1">
              <span className="text-xs text-slate-600 italic">
                {emp.name}
              </span>
            </div>
            <span className="font-bold text-slate-900 block">{emp.name}</span>
            <span className="text-slate-500">Employee Signature</span>
            <span className="text-slate-400 text-[9px]">Date: ___/___/2026</span>
          </div>

          {/* Supervisor Signature */}
          <div className="flex flex-col items-center justify-end min-h-[80px]">
            <div className="w-36 border-b border-slate-400 pb-1 mb-1">
              <span className="text-xs text-indigo-700 italic">
                Murshida Akhter Kanta
              </span>
            </div>
            <span className="font-bold text-slate-900 block">Murshida Akhter Kanta</span>
            <span className="text-slate-500">Director - Admin & Finance</span>
            <span className="text-slate-400 text-[9px]">Date: 30/09/2026</span>
          </div>

          {/* Executive Director Signature */}
          <div className="flex flex-col items-center justify-end min-h-[80px]">
            <div className="w-36 border-b border-slate-400 pb-1 mb-1">
              <span className="text-xs text-rose-700 italic font-bold">
                Forhad Hossain
              </span>
            </div>
            <span className="font-bold text-slate-900 block">Forhad Hossain</span>
            <span className="text-slate-500">Founder & Executive Director</span>
            <span className="text-slate-400 text-[9px]">LEEDO Official Seal</span>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-6 pt-3 border-t border-slate-200 text-center text-[9px] text-slate-400 avoid-break">
          LEEDO Workforce KPI & Performance Appraisal System • Official Executive Record
        </div>
      </div>

      {selectedProof && (
        <ProofViewerModal
          attachment={selectedProof}
          onClose={() => setSelectedProof(null)}
        />
      )}
    </div>
  );
};
