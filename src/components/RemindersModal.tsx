import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { EMPLOYEES } from '../data/employees';
import {
  Bell,
  Send,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Calendar,
  Users,
  Target,
  Shield,
  Sparkles,
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { kpiRecords, systemConfig, sendAutomatedReminders } = useKpi();
  const [feedback, setFeedback] = useState<string | null>(null);

  // Group pending staff
  const pendingTargets = kpiRecords
    .filter((r) => !r.targetCommittedAt)
    .map((r) => EMPLOYEES.find((e) => e.eid === r.eid))
    .filter(Boolean);

  const pendingUpdates = kpiRecords
    .filter((r) => r.updates.length === 0)
    .map((r) => EMPLOYEES.find((e) => e.eid === r.eid))
    .filter(Boolean);

  const pendingReviews = kpiRecords
    .filter((r) => !r.hrReview)
    .map((r) => EMPLOYEES.find((e) => e.eid === r.eid))
    .filter(Boolean);

  const handleBroadcast = (type: 'all' | 'targets' | 'updates') => {
    const res = sendAutomatedReminders(type);
    setFeedback(res.message);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-5 h-5 text-rose-600" />
            <span>Automated Performance Reminders & Review Alerts</span>
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated notifications for Day 1–3 target deadlines, weekly progress logging, and month-end appraisal reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleBroadcast('all')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition shadow-sm cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Broadcast All Reminders</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-sm font-semibold flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span>{feedback}</span>
          </div>
          <button
            onClick={() => setFeedback(null)}
            className="text-xs text-emerald-700 hover:text-emerald-900 font-bold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 3 Categories of Reminders */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Category 1: Pending Targets */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500" />
                <span>Target Setting Window (Day 1–3)</span>
              </h3>
              <span className="text-[10px] font-bold bg-amber-50 text-amber-800 px-2 py-0.5 rounded-full border border-amber-200">
                {pendingTargets.length} Staff Pending
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Staff who have not yet committed their monthly target indicators. System strictly locks on Day 3.
            </p>

            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
              {pendingTargets.slice(0, 10).map((emp) => (
                <div
                  key={emp?.eid}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{emp?.name}</span>
                    <span className="text-[11px] text-slate-500">{emp?.designation}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {emp?.eid}
                  </span>
                </div>
              ))}
              {pendingTargets.length > 10 && (
                <p className="text-[11px] text-slate-400 text-center py-1">
                  + {pendingTargets.length - 10} more staff members
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => handleBroadcast('targets')}
              className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
            >
              Send Target Submission Alerts
            </button>
          </div>
        </div>

        {/* Category 2: Pending Weekly Updates */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <span>Weekly Update Inactivity</span>
              </h3>
              <span className="text-[10px] font-bold bg-rose-50 text-rose-800 px-2 py-0.5 rounded-full border border-rose-200">
                {pendingUpdates.length} Staff Inactive
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Staff members with zero progress logs this month. Prompts them to submit field activity summaries.
            </p>

            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
              {pendingUpdates.slice(0, 10).map((emp) => (
                <div
                  key={emp?.eid}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{emp?.name}</span>
                    <span className="text-[11px] text-slate-500">{emp?.designation}</span>
                  </div>
                  <span className="font-mono text-[10px] font-bold text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                    {emp?.eid}
                  </span>
                </div>
              ))}
              {pendingUpdates.length > 10 && (
                <p className="text-[11px] text-slate-400 text-center py-1">
                  + {pendingUpdates.length - 10} more staff members
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => handleBroadcast('updates')}
              className="w-full py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
            >
              Send Weekly Log Nudges
            </button>
          </div>
        </div>

        {/* Category 3: Month-End Appraisal Approvals */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Shield className="w-4 h-4 text-indigo-500" />
                <span>Month-End HR Reviews</span>
              </h3>
              <span className="text-[10px] font-bold bg-indigo-50 text-indigo-800 px-2 py-0.5 rounded-full border border-indigo-200">
                {pendingReviews.length} Reviews Due
              </span>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Performance appraisal reports ready for line manager evaluation comments and ED approval.
            </p>

            <div className="mt-4 space-y-2 max-h-56 overflow-y-auto">
              {pendingReviews.slice(0, 10).map((emp) => (
                <div
                  key={emp?.eid}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center justify-between"
                >
                  <div>
                    <span className="font-bold text-slate-900 block">{emp?.name}</span>
                    <span className="text-[11px] text-slate-500">{emp?.designation}</span>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">
                    Score Ready
                  </span>
                </div>
              ))}
              {pendingReviews.length > 10 && (
                <p className="text-[11px] text-slate-400 text-center py-1">
                  + {pendingReviews.length - 10} more evaluations
                </p>
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 mt-4">
            <button
              onClick={() => handleBroadcast('all')}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition cursor-pointer shadow-2xs"
            >
              Alert Review Supervisors
            </button>
          </div>
        </div>
      </div>

      {/* Strategic Goal Alignment Tracker */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Target className="w-5 h-5 text-rose-600" />
              <span>LEEDO Institutional Strategic Goal Alignment Tracking</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Workforce task alignment mapped across all 5 Strategic NGO Pillars for sustainable community impact.
            </p>
          </div>
          <span className="text-xs font-bold text-rose-700 bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
            100% Core JD Compliance
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-5 text-xs">
          {[
            {
              title: 'Child Rights & Street Protection',
              desc: 'Street outreach, night rescue, hygiene, anti-trafficking, safe shelter transition.',
              staffCount: 22,
              impact: 'Top Priority',
              color: 'border-rose-400 bg-rose-50/60 text-rose-900',
            },
            {
              title: 'Education, Skills & Life Training',
              desc: 'Non-formal mobile schools, remedial tutoring, sewing, ICT, salon cosmetology.',
              staffCount: 16,
              impact: 'High Impact',
              color: 'border-blue-400 bg-blue-50/60 text-blue-900',
            },
            {
              title: 'Shelter, Health & Holistic Care',
              desc: 'Nutritious meals, maternal warmth, trauma counseling, sports tournaments.',
              staffCount: 12,
              impact: 'Critical Care',
              color: 'border-emerald-400 bg-emerald-50/60 text-emerald-900',
            },
            {
              title: 'Admin & Financial Governance',
              desc: 'Voucher auditing, donor reporting, procurement transparency, facility safety.',
              staffCount: 8,
              impact: 'Accountability',
              color: 'border-purple-400 bg-purple-50/60 text-purple-900',
            },
            {
              title: 'Partnerships & Resource Mobilization',
              desc: 'Institutional grants, CSR pitches, media advocacy, university volunteer MoUs.',
              staffCount: 6,
              impact: 'Sustainability',
              color: 'border-amber-400 bg-amber-50/60 text-amber-900',
            },
          ].map((pillar, i) => (
            <div key={i} className={`p-4 rounded-xl border ${pillar.color} space-y-2 flex flex-col justify-between`}>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider block opacity-75">
                  Pillar 0{i + 1}
                </span>
                <h4 className="font-bold text-xs mt-1">{pillar.title}</h4>
                <p className="text-[11px] opacity-90 mt-1 leading-relaxed">{pillar.desc}</p>
              </div>

              <div className="pt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-bold">
                <span>{pillar.staffCount} Staff Roles</span>
                <span>{pillar.impact}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
