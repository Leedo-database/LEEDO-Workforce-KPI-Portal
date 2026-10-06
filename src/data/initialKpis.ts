import { MonthlyEmployeeKPI, SystemAuditLog, KPIItem, DailyWeeklyUpdate } from '../types/kpi';
import { EMPLOYEES } from './employees';
import { getJDTemplateForDesignation } from './jobDescriptions';
import { calculateKPIScores } from '../utils/kpiCalculator';

export function generateInitialKPIs(monthCode: string = '2026-09'): MonthlyEmployeeKPI[] {
  const result: MonthlyEmployeeKPI[] = [];

  EMPLOYEES.forEach((emp, index) => {
    const templates = getJDTemplateForDesignation(emp.designation);

    // Varied status:
    // First 40 employees have committed targets.
    // Index 0 to 15 have high activity with multiple daily/weekly updates (progress 75% to 105%).
    // Index 16 to 35 have medium activity (progress 45% to 80%).
    // Index 36 to 45 have committed targets but low progress (progress 10% to 30%).
    // Index 46 to 54 have pending targets (showing the automated reminder use-case!).
    const hasCommittedTargets = index < 45;
    const progressLevel = index < 15 ? 0.92 : index < 35 ? 0.72 : index < 45 ? 0.35 : 0;

    const baseItems = templates.map((tmpl, tIdx) => {
      // Small variation per item
      const variation = 0.85 + ((index + tIdx) % 5) * 0.08;
      const target = tmpl.defaultTarget;
      const achieved = hasCommittedTargets
        ? Math.round(target * progressLevel * variation)
        : 0;

      return {
        taskId: tmpl.id,
        title: tmpl.title,
        description: tmpl.description,
        weight: tmpl.weight,
        target: target,
        achieved: achieved,
        unit: tmpl.unit,
        strategicPillar: tmpl.strategicPillar,
        guidanceNotes: tmpl.guidanceNotes,
      };
    });

    const calculated = calculateKPIScores(baseItems, emp.designation);

    const updates: DailyWeeklyUpdate[] = [];
    if (hasCommittedTargets && progressLevel > 0) {
      // Add realistic daily/weekly updates
      const days = [2, 6, 12, 18, 24];
      days.forEach((day, dIdx) => {
        const item = calculated.items[dIdx % calculated.items.length];
        const inc = Math.max(1, Math.round(item.achieved / 3));
        updates.push({
          id: `upd-${emp.eid}-${day}`,
          date: `2026-09-${day < 10 ? '0' + day : day}`,
          taskId: item.taskId,
          progressIncrement: inc,
          currentTotal: Math.min(item.achieved, inc * (dIdx + 1)),
          updateType: dIdx % 2 === 0 ? 'weekly' : 'daily',
          summary: `Regular field activity and verification logged for ${item.title}. Coordinated with center teams and documented child attendance.`,
          challenges: dIdx === 1 ? 'Heavy monsoon rainfall caused travel delay to Sadarghat terminal area.' : undefined,
          loggedAt: `2026-09-${day < 10 ? '0' + day : day}T17:30:00Z`,
          loggedByEid: emp.eid,
        });
      });
    }

    const isLocked = hasCommittedTargets;
    const isApproved = index < 8;

    result.push({
      id: `${emp.eid}-${monthCode}`,
      eid: emp.eid,
      month: monthCode,
      targetCommittedAt: hasCommittedTargets ? '2026-09-02T10:15:00Z' : undefined,
      isTargetLocked: isLocked,
      hrTargetUnlocked: false,
      items: calculated.items,
      updates: updates,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      hrReview: isApproved
        ? {
            reviewedByEid: '1057',
            reviewedByName: 'Md. Omar Faruque',
            reviewedAt: '2026-09-22T14:00:00Z',
            supervisorRatingAdjustment: 0,
            hrComments: 'High commitment to core JD indicators. Field presence and reporting consistency observed throughout the evaluation period.',
            status: 'Approved',
          }
        : undefined,
      lastUpdatedAt: '2026-09-22T11:00:00Z',
    });
  });

  return result;
}

export const INITIAL_AUDIT_LOGS: SystemAuditLog[] = [
  {
    id: 'log-01',
    timestamp: '2026-09-01T09:00:00Z',
    actorEid: '1057',
    actorName: 'Md. Omar Faruque',
    actorRole: 'Manager HR & Admin',
    action: 'SYSTEM_CONFIG_CHANGE',
    details: 'Initiated September 2026 Monthly KPI Cycle. Target submission window opened for Day 1-3.',
  },
  {
    id: 'log-02',
    timestamp: '2026-09-02T10:15:22Z',
    actorEid: '1034',
    actorName: 'Leo Gomes',
    actorRole: 'Street Educator',
    action: 'TARGET_COMMITTED',
    details: 'Submitted committed monthly targets for 4 core JD indicators (Reaching 80 children, 22 teaching sessions).',
    targetEid: '1034',
    targetName: 'Leo Gomes',
  },
  {
    id: 'log-03',
    timestamp: '2026-09-02T11:40:10Z',
    actorEid: '1023',
    actorName: 'Md. Masud',
    actorRole: 'Social Mobilizer (Incharge)',
    action: 'TARGET_COMMITTED',
    details: 'Submitted committed monthly targets for 4 core JD indicators.',
    targetEid: '1023',
    targetName: 'Md. Masud',
  },
  {
    id: 'log-04',
    timestamp: '2026-09-04T00:00:01Z',
    actorEid: 'SYSTEM',
    actorName: 'LEEDO KPI Engine',
    actorRole: 'System',
    action: 'SYSTEM_CONFIG_CHANGE',
    details: 'Day 3 completed. Target submission window automatically locked across all 55 employees.',
  },
  {
    id: 'log-05',
    timestamp: '2026-09-12T16:20:00Z',
    actorEid: '1034',
    actorName: 'Leo Gomes',
    actorRole: 'Street Educator',
    action: 'PROGRESS_UPDATE',
    details: 'Logged weekly update: Reached +18 street children at Sadarghat launch terminal with non-formal education.',
    targetEid: '1034',
    targetName: 'Leo Gomes',
  },
  {
    id: 'log-06',
    timestamp: '2026-09-20T14:10:00Z',
    actorEid: '1057',
    actorName: 'Md. Omar Faruque',
    actorRole: 'Manager HR & Admin',
    action: 'REMINDER_SENT',
    details: 'Dispatched automated reminders to 10 staff members with pending weekly updates and evaluation reviews.',
  },
];
