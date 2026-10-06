import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { AuditAction } from '../types/kpi';
import {
  History,
  Search,
  Filter,
  ShieldAlert,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  Download,
  Calendar,
} from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const { auditLogs } = useKpi();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState<string>('All');

  const filteredLogs = auditLogs.filter((log) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      log.actorName.toLowerCase().includes(query) ||
      log.actorEid.toLowerCase().includes(query) ||
      log.details.toLowerCase().includes(query) ||
      (log.targetName && log.targetName.toLowerCase().includes(query));

    if (!matchesSearch) return false;
    if (selectedAction !== 'All' && log.action !== selectedAction) return false;

    return true;
  });

  const getActionBadge = (action: AuditAction) => {
    switch (action) {
      case 'TARGET_COMMITTED':
        return <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded">Target Committed</span>;
      case 'PROGRESS_UPDATE':
        return <span className="bg-blue-100 text-blue-800 text-[10px] font-bold px-2 py-0.5 rounded">Progress Update</span>;
      case 'HR_EVALUATION':
        return <span className="bg-purple-100 text-purple-800 text-[10px] font-bold px-2 py-0.5 rounded">HR Evaluation</span>;
      case 'TARGET_UNLOCKED':
        return <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">Target Unlocked</span>;
      case 'REMINDER_SENT':
        return <span className="bg-indigo-100 text-indigo-800 text-[10px] font-bold px-2 py-0.5 rounded">Reminder Dispatched</span>;
      case 'REPORT_PRINTED':
        return <span className="bg-slate-200 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">Report Printed</span>;
      case 'SYSTEM_CONFIG_CHANGE':
        return <span className="bg-rose-100 text-rose-800 text-[10px] font-bold px-2 py-0.5 rounded">Config Change</span>;
      case 'USER_LOGIN':
        return <span className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">User Login</span>;
      default:
        return <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded">{action}</span>;
    }
  };

  const handleDownloadLogs = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `LEEDO_Audit_Logs_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <History className="w-5 h-5 text-rose-600" />
            <span>LEEDO System Governance & Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Tamper-evident chronological audit trail of all monthly target commits, progress entries, HR overrides, and appraisal approvals.
          </p>
        </div>

        <button
          onClick={handleDownloadLogs}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-rose-400" />
          <span>Export Audit Trail (JSON)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search audit events by user, EID, description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white rounded-xl border border-slate-300 text-xs font-medium text-slate-800 focus:outline-rose-500"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedAction}
              onChange={(e) => setSelectedAction(e.target.value)}
              className="bg-white px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold text-slate-700 focus:outline-none"
            >
              <option value="All">All Event Types</option>
              <option value="TARGET_COMMITTED">Target Committed (Day 1-3)</option>
              <option value="PROGRESS_UPDATE">Progress Updates</option>
              <option value="HR_EVALUATION">HR Evaluations</option>
              <option value="TARGET_UNLOCKED">Target Unlocked</option>
              <option value="REMINDER_SENT">Reminder Dispatched</option>
              <option value="REPORT_PRINTED">Report Printed</option>
              <option value="SYSTEM_CONFIG_CHANGE">System Config Changes</option>
            </select>
          </div>
        </div>

        {/* Audit Log Stream */}
        <div className="divide-y divide-slate-100 max-h-[600px] overflow-y-auto">
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div key={log.id} className="p-4 hover:bg-slate-50/80 transition flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActionBadge(log.action)}
                    <span className="font-bold text-slate-900">{log.actorName}</span>
                    <span className="font-mono text-slate-400 text-[11px]">
                      (EID: {log.actorEid})
                    </span>
                    <span className="text-slate-400">•</span>
                    <span className="text-[11px] text-slate-500 font-medium">{log.actorRole}</span>
                  </div>

                  <p className="text-slate-800 leading-relaxed font-medium">{log.details}</p>

                  {log.targetName && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
                      <User className="w-3 h-3 text-slate-400" />
                      <span>
                        Target Subject: <strong className="text-slate-700">{log.targetName}</strong> (EID: {log.targetEid})
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-right shrink-0 text-slate-400 text-[11px] font-mono flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>{new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  <span className="hidden sm:inline">, {new Date(log.timestamp).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-400 text-xs">
              No audit logs matching search criteria.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
