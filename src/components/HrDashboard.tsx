import React, { useState, useMemo } from 'react';
import { useKpi } from '../context/KpiContext';
import { Department } from '../types/kpi';
import {
  Users,
  Search,
  Filter,
  Printer,
  Edit3,
  Unlock,
  Bell,
  ArrowUpDown,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  TrendingUp,
  Award,
  ShieldCheck,
  Building2,
  Target,
  BarChart3,
  UserPlus,
  Paperclip,
} from 'lucide-react';

interface HrDashboardProps {
  onOpenReportModal: (eid: string) => void;
  onOpenHrEditModal: (eid: string) => void;
  onOpenOrgSummaryModal?: () => void;
  onOpenEmployeeManageModal?: () => void;
}

export const HrDashboard: React.FC<HrDashboardProps> = ({
  onOpenReportModal,
  onOpenHrEditModal,
  onOpenOrgSummaryModal,
  onOpenEmployeeManageModal,
}) => {
  const {
    employees,
    kpiRecords,
    systemConfig,
    currentUser,
    hrUnlockTargetWindowForEmployee,
    sendAutomatedReminders,
    employeeJds,
    canUserAccessExecutiveReports,
  } = useKpi();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState<string>('All');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'eid' | 'score' | 'name'>('eid');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const [actionAlert, setActionAlert] = useState<string | null>(null);

  const isHrAdmin = currentUser ? currentUser.role === 'hr_admin' || currentUser.role === 'executive' : false;
  const isKantaOrHr = currentUser?.eid === '1002' || currentUser?.eid === '1057' || currentUser?.role === 'hr_admin';
  const canAccessSummary = canUserAccessExecutiveReports(currentUser);

  // Active employees
  const activeEmployees = employees.filter((e) => e.status !== 'resigned' && e.status !== 'inactive');
  const totalEmployees = activeEmployees.length;

  const activeEids = new Set(activeEmployees.map((e) => e.eid));
  const activeMonthKpiRecords = kpiRecords.filter(
    (r) => r.month === systemConfig.activeMonthCode && activeEids.has(r.eid)
  );

  const submittedTargetsCount = activeMonthKpiRecords.filter((r) => r.targetCommittedAt).length;
  const targetSubmissionRate = Math.round((submittedTargetsCount / (totalEmployees || 1)) * 100);

  const totalScoreSum = activeMonthKpiRecords.reduce((acc, curr) => acc + curr.finalScore, 0);
  const averageKpiScore = Math.round((totalScoreSum / (totalEmployees || 1)) * 10) / 10;

  const outstandingCount = activeMonthKpiRecords.filter((r) => r.finalScore >= 90).length;
  const needsAttentionCount = activeMonthKpiRecords.filter((r) => r.finalScore < 70).length;

  const programStaffCount = activeEmployees.filter((e) => e.department === 'Program & Operation').length;
  const adminStaffCount = activeEmployees.filter((e) => e.department === 'Admin & Finance').length;

  // Filtered & Sorted Employee Directory
  const filteredEmployees = useMemo(() => {
    return employees
      .map((emp) => {
        const kpi = kpiRecords.find((r) => r.eid === emp.eid && r.month === systemConfig.activeMonthCode);
        const jd = employeeJds[emp.eid];
        return {
          emp,
          kpi,
          jd,
        };
      })
      .filter(({ emp, kpi }) => {
        // Search
        const query = searchTerm.toLowerCase();
        const matchesSearch =
          emp.eid.toLowerCase().includes(query) ||
          emp.name.toLowerCase().includes(query) ||
          emp.designation.toLowerCase().includes(query) ||
          emp.department.toLowerCase().includes(query);

        if (!matchesSearch) return false;

        // Department
        if (selectedDept !== 'All' && emp.department !== selectedDept) {
          return false;
        }

        // Status
        if (statusFilter === 'active') {
          return emp.status !== 'resigned' && emp.status !== 'inactive';
        }
        if (statusFilter === 'resigned') {
          return emp.status === 'resigned' || emp.status === 'inactive';
        }
        if (statusFilter === 'target_pending') {
          return !kpi?.targetCommittedAt;
        }
        if (statusFilter === 'target_set') {
          return !!kpi?.targetCommittedAt;
        }
        if (statusFilter === 'approved') {
          return kpi?.hrReview?.status === 'Approved';
        }
        if (statusFilter === 'underperforming') {
          return (kpi?.finalScore || 0) < 70;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'score') {
          const scoreA = a.kpi?.finalScore || 0;
          const scoreB = b.kpi?.finalScore || 0;
          return sortAsc ? scoreA - scoreB : scoreB - scoreA;
        }
        if (sortField === 'name') {
          return sortAsc
            ? a.emp.name.localeCompare(b.emp.name)
            : b.emp.name.localeCompare(a.emp.name);
        }
        // default eid
        const eidA = parseInt(a.emp.eid, 10) || 0;
        const eidB = parseInt(b.emp.eid, 10) || 0;
        return sortAsc ? eidA - eidB : eidB - eidA;
      });
  }, [employees, kpiRecords, employeeJds, searchTerm, selectedDept, statusFilter, sortField, sortAsc, systemConfig.activeMonthCode]);

  const handleUnlockTarget = (eid: string, name: string) => {
    const reason = window.prompt(
      `Enter HR justification to unlock Day 1-3 target entry for ${name} (EID: ${eid}):`,
      'Approved late submission due to emergency field assignment'
    );
    if (reason && reason.trim()) {
      const res = hrUnlockTargetWindowForEmployee(eid, reason.trim());
      setActionAlert(res.message);
    }
  };

  const handleSendReminder = (type: 'all' | 'targets' | 'updates') => {
    const res = sendAutomatedReminders(type);
    setActionAlert(res.message);
  };

  const handleExportCsv = () => {
    const headers = [
      'SL',
      'EID',
      'Name',
      'Designation',
      'Department',
      'Status',
      'Target Status',
      'Updates Count',
      'Weighted KPI Score (%)',
      'Rating',
      'HR Approval Status',
    ];

    const rows = employees.map((emp) => {
      const kpi = kpiRecords.find((r) => r.eid === emp.eid && r.month === systemConfig.activeMonthCode);
      return [
        emp.sl,
        emp.eid,
        `"${emp.name}"`,
        `"${emp.designation}"`,
        `"${emp.department}"`,
        emp.status || 'active',
        kpi?.targetCommittedAt ? 'Committed' : 'Pending',
        kpi?.updates.length || 0,
        kpi?.finalScore || 0,
        `"${kpi?.ratingLabel || 'Pending'}"`,
        `"${kpi?.hrReview?.status || 'Pending'}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `LEEDO_Workforce_KPI_Appraisal_${systemConfig.activeMonthCode}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 text-xs">
      {/* Alert banner */}
      {actionAlert && (
        <div className="p-4 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-900 text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
            <span>{actionAlert}</span>
          </div>
          <button
            onClick={() => setActionAlert(null)}
            className="text-xs text-indigo-700 hover:text-indigo-900 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Top HR Executive Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Executive HR & Workforce Management
              </span>
              <span className="text-slate-400 text-xs font-mono">{systemConfig.activeMonth}</span>
            </div>
            <h1 className="text-2xl font-black mt-2 tracking-tight">
              LEEDO Workforce Performance Central Dashboard
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Monitoring across {totalEmployees} active personnel. Track Day 1–3 target compliance, weekly progress updates, automated appraisal reports, JD uploads, and staff management.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Organization Summary Report Button */}
            {canAccessSummary && onOpenOrgSummaryModal && (
              <button
                onClick={onOpenOrgSummaryModal}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-700 hover:to-rose-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                title="View & Print complete organization-wide performance summary"
              >
                <BarChart3 className="w-4 h-4" />
                <span>সার্বিক সামারি রিপোর্ট</span>
              </button>
            )}

            {/* Employee Management Button */}
            {isKantaOrHr && onOpenEmployeeManageModal && (
              <button
                onClick={onOpenEmployeeManageModal}
                className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
                title="Add new employees or manage employee exits"
              >
                <UserPlus className="w-4 h-4 text-rose-400" />
                <span>কর্মী ব্যবস্থাপনা (নতুন/অব্যাহতি)</span>
              </button>
            )}

            <button
              onClick={() => handleSendReminder('targets')}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
              title="Broadcast reminders to staff with pending Day 1-3 target commits"
            >
              <Bell className="w-3.5 h-3.5" />
              <span>রিমাইন্ডার পাঠান</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              title="Download workforce appraisal CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-rose-400" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-800">
          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs font-medium block">Total Workforce</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-white">{totalEmployees}</span>
              <span className="text-xs text-slate-400">Personnel</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Program: {programStaffCount} | Admin: {adminStaffCount}
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs font-medium block">Target Compliance (Day 1–3)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-400">{targetSubmissionRate}%</span>
              <span className="text-xs text-slate-400">
                ({submittedTargetsCount}/{totalEmployees})
              </span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              {totalEmployees - submittedTargetsCount} staff pending
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs font-medium block">Avg Organization KPI Score</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-rose-400">{averageKpiScore}%</span>
              <span className="text-xs text-slate-400">/ 100%</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              Benchmark: Satisfactory
            </span>
          </div>

          <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700">
            <span className="text-slate-400 text-xs font-medium block">High Performers / Action</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-400">{outstandingCount}</span>
              <span className="text-xs text-slate-400">top</span>
              <span className="text-xs text-rose-400 font-bold ml-2">/ {needsAttentionCount} need help</span>
            </div>
            <span className="text-[10px] text-slate-400 mt-1 block">
              JD-based evaluation rating
            </span>
          </div>
        </div>
      </div>

      {/* Directory & Filters Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        {/* Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-xs">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by EID, Name, Designation, Department..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-300 rounded-xl text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Departments ({employees.length})</option>
              <option value="Program & Operation">Program & Operation</option>
              <option value="Admin & Finance">Admin & Finance</option>
              <option value="Executive Management">Executive Management</option>
              <option value="Partnership & Resource Mobilization">Partnership & Resource</option>
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="active">Active Staff ({activeEmployees.length})</option>
              <option value="resigned">Exited / Resigned Staff</option>
              <option value="target_pending">Target Pending (Day 1-3)</option>
              <option value="target_set">Target Committed</option>
              <option value="approved">HR Approved Final</option>
              <option value="underperforming">Score &lt; 70%</option>
            </select>

            {/* Sort Options */}
            <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-xl p-1">
              <button
                onClick={() => {
                  if (sortField === 'score') setSortAsc(!sortAsc);
                  else {
                    setSortField('score');
                    setSortAsc(false);
                  }
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  sortField === 'score' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
                }`}
              >
                Score {sortField === 'score' && (sortAsc ? '▲' : '▼')}
              </button>

              <button
                onClick={() => {
                  if (sortField === 'eid') setSortAsc(!sortAsc);
                  else {
                    setSortField('eid');
                    setSortAsc(true);
                  }
                }}
                className={`px-2 py-1 rounded-lg font-bold text-[11px] transition cursor-pointer ${
                  sortField === 'eid' ? 'bg-rose-50 text-rose-700' : 'text-slate-600'
                }`}
              >
                EID {sortField === 'eid' && (sortAsc ? '▲' : '▼')}
              </button>
            </div>
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-3 text-center w-16">EID</th>
                <th className="py-3 px-4">Employee Particulars</th>
                <th className="py-3 px-3">Department</th>
                <th className="py-3 px-3 text-center">JD Status</th>
                <th className="py-3 px-3 text-center">Target Status</th>
                <th className="py-3 px-3 text-center">Updates</th>
                <th className="py-3 px-3 text-center">Score</th>
                <th className="py-3 px-3 text-center">Rating</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-[11px]">
              {filteredEmployees.map(({ emp, kpi, jd }) => {
                const hasCommittedTarget = !!kpi?.targetCommittedAt;
                const score = kpi?.finalScore || 0;
                const isResigned = emp.status === 'resigned' || emp.status === 'inactive';

                return (
                  <tr key={emp.eid} className={`hover:bg-slate-50/80 transition ${isResigned ? 'opacity-60 bg-slate-50/40' : ''}`}>
                    {/* EID */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-mono font-bold text-xs bg-slate-100 text-slate-800 px-2 py-1 rounded-md">
                        {emp.eid}
                      </span>
                    </td>

                    {/* Name & Designation */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-[11px] shrink-0"
                          style={{ backgroundColor: emp.avatarColor }}
                        >
                          {emp.name.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
                            {emp.name}
                            {emp.role === 'executive' && (
                              <span className="text-[9px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded font-bold">
                                ED
                              </span>
                            )}
                            {isResigned && (
                              <span className="text-[9px] bg-slate-200 text-slate-700 px-1.5 py-0.2 rounded font-bold">
                                Exited
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-500 font-medium">
                            {emp.designation}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Department */}
                    <td className="py-3.5 px-3">
                      <span className="inline-block text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {emp.department}
                      </span>
                    </td>

                    {/* JD Status */}
                    <td className="py-3.5 px-3 text-center">
                      {jd ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <Paperclip className="w-3 h-3 text-emerald-600" />
                          <span>Uploaded</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                          Standard JD
                        </span>
                      )}
                    </td>

                    {/* Target Commitment Status */}
                    <td className="py-3.5 px-3 text-center">
                      {hasCommittedTarget ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Committed (Day 1-3)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          Pending Submission
                        </span>
                      )}
                    </td>

                    {/* Progress Logs Count */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-slate-700 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                        {kpi?.updates.length || 0} updates
                      </span>
                    </td>

                    {/* Final Weighted Score */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className="font-extrabold text-sm"
                        style={{ color: kpi?.ratingColor || '#64748b' }}
                      >
                        {score}%
                      </span>
                    </td>

                    {/* Rating Badge */}
                    <td className="py-3.5 px-3 text-center">
                      <span
                        className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold text-white shadow-2xs"
                        style={{ backgroundColor: kpi?.ratingColor || '#64748b' }}
                      >
                        {kpi?.ratingLabel || 'Unassessed'}
                      </span>
                    </td>

                    {/* HR Action Buttons */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* View & Print Appraisal */}
                        <button
                          onClick={() => onOpenReportModal(emp.eid)}
                          title="Generate official monthly appraisal report"
                          className="p-1.5 text-slate-700 hover:text-slate-950 bg-slate-100 hover:bg-slate-200 rounded-lg transition cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5" />
                        </button>

                        {/* HR Edit / Evaluate & JD Upload */}
                        {isHrAdmin && (
                          <button
                            onClick={() => onOpenHrEditModal(emp.eid)}
                            title="HR Edit, Score Adjustment & JD Upload"
                            className="p-1.5 text-rose-700 hover:text-rose-950 bg-rose-50 hover:bg-rose-100 rounded-lg transition cursor-pointer border border-rose-200"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {/* Unlock target exception */}
                        {isHrAdmin && !hasCommittedTarget && (
                          <button
                            onClick={() => handleUnlockTarget(emp.eid, emp.name)}
                            title="Grant Day 1-3 target setting exception unlock"
                            className="p-1.5 text-amber-700 hover:text-amber-950 bg-amber-50 hover:bg-amber-100 rounded-lg transition cursor-pointer border border-amber-200"
                          >
                            <Unlock className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Directory Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-slate-500 text-xs flex items-center justify-between">
          <span>
            Displaying <strong>{filteredEmployees.length}</strong> of <strong>{employees.length}</strong> LEEDO staff members
          </span>
          <span className="text-[11px] text-slate-400">
            Confidential Human Resource & Performance Appraisal Record
          </span>
        </div>
      </div>
    </div>
  );
};
