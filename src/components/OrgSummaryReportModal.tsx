import React, { useState, useMemo, useRef } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { ReportPeriod, Department } from '../types/kpi';
import { LeedoLogo } from './LeedoLogo';
import {
  Printer,
  X,
  Award,
  TrendingUp,
  Filter,
  Search,
  Building2,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Eye,
  BarChart3,
  Download,
} from 'lucide-react';

interface Props {
  onClose: () => void;
  onOpenIndividualReport?: (eid: string) => void;
}

export const OrgSummaryReportModal: React.FC<Props> = ({
  onClose,
  onOpenIndividualReport,
}) => {
  const {
    getAllEmployeesAggregatedPerformance,
    systemConfig,
    currentUser,
    logReportPrinted,
    canUserAccessExecutiveReports,
  } = useKpi();
  const { language } = useLanguage();

  const isAuthorized = canUserAccessExecutiveReports(currentUser);

  const [selectedPeriod, setSelectedPeriod] = useState<ReportPeriod>('1m');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const reportRef = useRef<HTMLDivElement>(null);

  // Retrieve aggregated records for selected period
  const performanceList = useMemo(() => {
    return getAllEmployeesAggregatedPerformance(selectedPeriod);
  }, [getAllEmployeesAggregatedPerformance, selectedPeriod]);

  // Filtered list
  const filteredList = useMemo(() => {
    return performanceList.filter((item) => {
      // Search
      const query = searchTerm.toLowerCase();
      const matchSearch =
        item.eid.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.designation.toLowerCase().includes(query) ||
        item.department.toLowerCase().includes(query);

      if (!matchSearch) return false;

      // Department
      if (selectedDept !== 'All' && item.department !== selectedDept) {
        return false;
      }

      // Classification
      if (selectedClassification !== 'All' && item.overallRatingLabel !== selectedClassification) {
        return false;
      }

      return true;
    });
  }, [performanceList, searchTerm, selectedDept, selectedClassification]);

  // Aggregate stats
  const totalCount = performanceList.length;
  const avgScore =
    totalCount > 0
      ? Math.round((performanceList.reduce((acc, it) => acc + it.averageScore, 0) / totalCount) * 10) / 10
      : 0;
  const avgAchievementRate =
    totalCount > 0
      ? Math.round((performanceList.reduce((acc, it) => acc + it.averageAchievementRate, 0) / totalCount) * 10) / 10
      : 0;

  const countOutstanding = performanceList.filter((it) => it.overallRatingLabel === 'Outstanding Performer').length;
  const countExceeds = performanceList.filter((it) => it.overallRatingLabel === 'Exceeds Expectations').length;
  const countMeets = performanceList.filter((it) => it.overallRatingLabel === 'Meets Expectations').length;
  const countNeeds = performanceList.filter((it) => it.overallRatingLabel === 'Needs Improvement').length;
  const countUnsatisfactory = performanceList.filter((it) => it.overallRatingLabel === 'Unsatisfactory').length;

  const handlePrint = () => {
    logReportPrinted('ORGANIZATION', `Workforce Summary Report (${selectedPeriod.toUpperCase()})`);
    window.print();
  };

  const periodLabelMap: Record<ReportPeriod, { bn: string; en: string }> = {
    '1m': { bn: '১ মাস (চলতি মাসিক)', en: '1 Month (Current Monthly)' },
    '3m': { bn: '৩ মাস (ত্রৈমাসিক সারসংক্ষেপ)', en: '3 Months (Quarterly Summary)' },
    '6m': { bn: '৬ মাস (অর্ধ-বার্ষিক মূল্যায়ন)', en: '6 Months (Semi-Annual Summary)' },
    '1y': { bn: '১ বছর (বার্ষিক সার্বিক মূল্যায়ন)', en: '1 Year (Annual Comprehensive)' },
  };

  if (!isAuthorized) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
        <div className="bg-white p-6 rounded-2xl max-w-sm w-full text-center">
          <p className="text-slate-800 font-bold text-sm">
            {language === 'bn' ? 'অননুমোদিত এক্সেস' : 'Access Restricted'}
          </p>
          <p className="text-slate-500 text-xs mt-1">
            {language === 'bn'
              ? 'সার্বিক সংস্থাভিত্তিক সামারি রিপোর্ট দেখার অনুমতি কেবল নির্বাহী ব্যবস্থাপনা ও এইচআর অ্যাডমিনের জন্য সংরক্ষিত।'
              : 'Organization Summary Report is strictly restricted to Executive Leadership and HR.'}
          </p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-bold cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:static print:inset-auto print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:h-auto print:w-full">
      {/* Top Floating Control Bar (Hidden during Print) */}
      <div className="fixed top-3 inset-x-4 sm:inset-x-auto sm:right-4 z-50 flex flex-wrap items-center justify-between sm:justify-end gap-2 print:hidden bg-slate-900/95 backdrop-blur-md p-2.5 rounded-2xl shadow-2xl border border-slate-700">
        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl text-xs">
          {(['1m', '3m', '6m', '1y'] as ReportPeriod[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setSelectedPeriod(p)}
              className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1 cursor-pointer ${
                selectedPeriod === p ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? periodLabelMap[p].bn : periodLabelMap[p].en}</span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-md cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'bn' ? 'সারসংক্ষেপ প্রিন্ট / সংরক্ষণ' : 'Print / Export Summary'}</span>
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Printable Document Body */}
      <div
        ref={reportRef}
        className="printable-document bg-white w-full max-w-5xl my-16 sm:my-10 p-6 sm:p-10 rounded-2xl shadow-2xl border border-slate-200 text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none text-xs"
        style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
      >
        {/* Official Header */}
        <div className="border-b-2 border-rose-600 pb-5 mb-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <LeedoLogo size="lg" showSubtitle={false} />
              <div>
                <h1 className="text-xl sm:text-2xl font-black text-rose-700 uppercase tracking-tight">
                  LEEDO
                </h1>
                <p className="text-[11px] font-bold text-slate-800">
                  Local Education and Economic Development Organization
                </p>
                <p className="text-[10px] text-slate-500">
                  Est. 2000 • Peace Home, Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="text-right">
              <span className="inline-block px-3 py-1 bg-rose-50 text-rose-800 rounded font-bold text-[10px] uppercase border border-rose-200 tracking-wider">
                {language === 'bn'
                  ? 'সার্বিক কর্মী কেপিআই ও মূল্যায়ন সারসংক্ষেপ প্রতিবেদন'
                  : 'Organization Workforce KPI & Appraisal Summary'}
              </span>
              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                Doc Ref: LEEDO/ORG-SUMMARY/{selectedPeriod.toUpperCase()}/{systemConfig.activeMonthCode}
              </p>
              <p className="text-[10px] font-bold text-slate-700 mt-0.5">
                Evaluation Cycle: {periodLabelMap[selectedPeriod].en} ({systemConfig.activeMonth})
              </p>
            </div>
          </div>
        </div>

        {/* Executive Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <div className="bg-slate-50 border border-slate-200 p-3 rounded-xl">
            <span className="text-[10px] text-slate-500 font-bold uppercase block">
              {language === 'bn' ? 'মূল্যায়নকৃত মোট কর্মী' : 'Total Workforce Evaluated'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-slate-900">{totalCount}</span>
              <span className="text-[11px] text-slate-500">{language === 'bn' ? 'জন কর্মী' : 'staff'}</span>
            </div>
          </div>

          <div className="bg-rose-50 border border-rose-200 p-3 rounded-xl">
            <span className="text-[10px] text-rose-700 font-bold uppercase block">
              {language === 'bn' ? 'গড় কেপিআই স্কোর' : 'Avg Weighted KPI Score'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-rose-700">{avgScore}</span>
              <span className="text-[11px] text-rose-600 font-bold">/ ১০০</span>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
            <span className="text-[10px] text-emerald-700 font-bold uppercase block">
              {language === 'bn' ? 'গড় লক্ষ্যমাত্রা অর্জন হার' : 'Avg Target Achievement'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-emerald-700">{avgAchievementRate}%</span>
              <span className="text-[11px] text-emerald-600">
                {avgAchievementRate >= 80 ? '✓ সন্তোষজনক' : '⚠️ উন্নয়ন আবশ্যক'}
              </span>
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-3 rounded-xl">
            <span className="text-[10px] text-indigo-700 font-bold uppercase block">
              {language === 'bn' ? 'শীর্ষ কর্মদক্ষতা' : 'Top Performers (≥80%)'}
            </span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl font-black text-indigo-800">
                {countOutstanding + countExceeds}
              </span>
              <span className="text-[11px] text-indigo-600">
                ({Math.round(((countOutstanding + countExceeds) / (totalCount || 1)) * 100)}%)
              </span>
            </div>
          </div>
        </div>

        {/* Performance Classification Grade Breakdown */}
        <div className="bg-slate-50 border border-slate-200 p-3.5 rounded-xl mb-5 text-[11px]">
          <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-2">
            {language === 'bn'
              ? 'কর্মদক্ষতা গ্রেড বিন্যাস (Overall Performance Classification Breakdown):'
              : 'Overall Performance Classification Distribution:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            <div className="bg-white p-2 rounded-lg border border-red-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-red-600 font-bold block">Outstanding (≥90%)</span>
                <span className="font-mono text-xs font-bold text-slate-800">{countOutstanding} জন</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-red-100 text-red-800 rounded font-bold font-mono">
                {Math.round((countOutstanding / (totalCount || 1)) * 100)}%
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-blue-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-blue-600 font-bold block">Exceeds (80-89%)</span>
                <span className="font-mono text-xs font-bold text-slate-800">{countExceeds} জন</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-blue-100 text-blue-800 rounded font-bold font-mono">
                {Math.round((countExceeds / (totalCount || 1)) * 100)}%
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-emerald-600 font-bold block">Meets (70-79%)</span>
                <span className="font-mono text-xs font-bold text-slate-800">{countMeets} জন</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded font-bold font-mono">
                {Math.round((countMeets / (totalCount || 1)) * 100)}%
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-amber-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-600 font-bold block">Needs Imp. (60-69%)</span>
                <span className="font-mono text-xs font-bold text-slate-800">{countNeeds} জন</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-800 rounded font-bold font-mono">
                {Math.round((countNeeds / (totalCount || 1)) * 100)}%
              </span>
            </div>

            <div className="bg-white p-2 rounded-lg border border-slate-300 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-600 font-bold block">Unsatisfactory (&lt;60%)</span>
                <span className="font-mono text-xs font-bold text-slate-800">{countUnsatisfactory} জন</span>
              </div>
              <span className="text-[10px] px-1.5 py-0.5 bg-slate-200 text-slate-700 rounded font-bold font-mono">
                {Math.round((countUnsatisfactory / (totalCount || 1)) * 100)}%
              </span>
            </div>
          </div>
        </div>

        {/* Filter & Search Bar (Hidden during print) */}
        <div className="mb-4 p-3 bg-slate-100 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-2.5 print:hidden">
          <div className="flex items-center gap-2 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'bn' ? 'নাম, পদবি বা আইডি দিয়ে খুঁজুন...' : 'Search by Name, EID, or Designation...'}
              className="w-full bg-white px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="All">{language === 'bn' ? 'সকল বিভাগ' : 'All Departments'}</option>
              <option value="Program & Operation">Program & Operation</option>
              <option value="Admin & Finance">Admin & Finance</option>
              <option value="Executive Management">Executive Management</option>
              <option value="Partnership & Resource Mobilization">Partnership & Resource</option>
            </select>

            <select
              value={selectedClassification}
              onChange={(e) => setSelectedClassification(e.target.value)}
              className="bg-white px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            >
              <option value="All">{language === 'bn' ? 'সকল গ্রেড' : 'All Classifications'}</option>
              <option value="Outstanding Performer">Outstanding Performer</option>
              <option value="Exceeds Expectations">Exceeds Expectations</option>
              <option value="Meets Expectations">Meets Expectations</option>
              <option value="Needs Improvement">Needs Improvement</option>
              <option value="Unsatisfactory">Unsatisfactory</option>
            </select>
          </div>
        </div>

        {/* Master Workforce Performance Table */}
        <div className="overflow-x-auto mb-6">
          <table className="w-full border-collapse border border-slate-300 text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold">
                <th className="border border-slate-300 px-2 py-2 text-center w-10">#</th>
                <th className="border border-slate-300 px-2 py-2 text-center w-14">EID</th>
                <th className="border border-slate-300 px-3 py-2 text-left">
                  {language === 'bn' ? 'কর্মকর্তার নাম ও পদবি' : 'Employee Name & Role'}
                </th>
                <th className="border border-slate-300 px-3 py-2 text-left">
                  {language === 'bn' ? 'বিভাগ' : 'Department'}
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20">
                  {language === 'bn' ? 'লক্ষ্য অর্জন %' : 'Achieve %'}
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20">
                  {language === 'bn' ? 'কেপিআই স্কোর' : 'KPI Score'}
                </th>
                <th className="border border-slate-300 px-3 py-2 text-center">
                  {language === 'bn' ? 'সার্বিক মূল্যায়ন শ্রেণি (Classification)' : 'Performance Classification'}
                </th>
                <th className="border border-slate-300 px-2 py-2 text-center w-20 print:hidden">
                  {language === 'bn' ? 'একক সনদ' : 'Action'}
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredList.map((item, idx) => {
                const badgeBg =
                  item.overallRatingLabel === 'Outstanding Performer'
                    ? 'bg-red-50 text-red-700 border-red-200'
                    : item.overallRatingLabel === 'Exceeds Expectations'
                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                    : item.overallRatingLabel === 'Meets Expectations'
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : item.overallRatingLabel === 'Needs Improvement'
                    ? 'bg-amber-50 text-amber-800 border-amber-200'
                    : 'bg-slate-100 text-slate-700 border-slate-300';

                return (
                  <tr key={item.eid} className="hover:bg-slate-50/70">
                    <td className="border border-slate-300 px-2 py-1.5 text-center text-slate-500 font-mono">
                      {idx + 1}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-mono font-bold text-slate-800">
                      {item.eid}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5">
                      <div className="font-bold text-slate-900">{item.name}</div>
                      <div className="text-[10px] text-slate-500">{item.designation}</div>
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-slate-700">
                      {item.department}
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-bold font-mono">
                      <span
                        className={
                          item.averageAchievementRate >= 80
                            ? 'text-emerald-700'
                            : item.averageAchievementRate >= 60
                            ? 'text-amber-700'
                            : 'text-rose-700'
                        }
                      >
                        {item.averageAchievementRate}%
                      </span>
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center font-black font-mono text-xs text-rose-700">
                      {item.averageScore}
                    </td>
                    <td className="border border-slate-300 px-3 py-1.5 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${badgeBg}`}>
                        {item.overallRatingLabel}
                      </span>
                    </td>
                    <td className="border border-slate-300 px-2 py-1.5 text-center print:hidden">
                      <button
                        onClick={() => {
                          onOpenIndividualReport?.(item.eid);
                          onClose();
                        }}
                        className="px-2 py-1 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-700 rounded text-[10px] font-bold flex items-center justify-center gap-1 mx-auto transition cursor-pointer"
                        title="View individual appraisal"
                      >
                        <Eye className="w-3 h-3" />
                        <span>{language === 'bn' ? 'দেখুন' : 'View'}</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Official Governance Sign-Off Blocks */}
        <div className="avoid-break pt-8 border-t border-slate-300 grid grid-cols-3 gap-6 text-center text-[10px]">
          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center pb-1">
              <span className="font-cursive text-slate-700 text-xs italic">Evaluator Signed</span>
            </div>
            <p className="font-bold text-slate-800">HR & Performance Reviewer</p>
            <p className="text-slate-500">Md. Omar Faruque (Manager HR & Admin)</p>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center pb-1">
              <span className="font-cursive text-slate-700 text-xs italic">Murshida Kanta</span>
            </div>
            <p className="font-bold text-slate-800">Director - Admin & Finance</p>
            <p className="text-slate-500">Murshida Akhter Kanta</p>
          </div>

          <div>
            <div className="h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center pb-1">
              <span className="font-cursive text-rose-800 font-bold text-xs italic">Forhad Hossain</span>
            </div>
            <p className="font-bold text-slate-800">Founder & Executive Director</p>
            <p className="text-slate-500">Forhad Hossain</p>
          </div>
        </div>
      </div>
    </div>
  );
};
