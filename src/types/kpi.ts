export type Department = 'Program & Operation' | 'Admin & Finance' | 'Executive Management' | 'Partnership & Resource Mobilization';

export type UserRole = 'employee' | 'supervisor' | 'hr_admin' | 'executive';

export type StrategicPillar = 
  | 'Child Rights & Street Protection'
  | 'Education, Skills & Life Training'
  | 'Shelter, Health & Holistic Care'
  | 'Admin & Financial Governance'
  | 'Partnerships, Media & Resource Mobilization';

export interface Employee {
  sl: number;
  eid: string;
  name: string;
  designation: string;
  department: Department;
  email: string;
  phone?: string;
  role: UserRole;
  avatarColor: string;
  joinDate: string;
  supervisorEid?: string;
  status?: 'active' | 'inactive' | 'resigned';
}

export interface EmployeeJD {
  eid: string;
  fileName?: string;
  fileData?: string;
  fileType?: string;
  fileSize?: string;
  textContent?: string;
  uploadedByEid: string;
  uploadedByName: string;
  uploadedAt: string;
}

export type ReportPeriod = '1m' | '3m' | '6m' | '1y';

export interface AggregatedPeriodPerformance {
  eid: string;
  name: string;
  designation: string;
  department: Department;
  period: ReportPeriod;
  periodLabel: string;
  monthsIncluded: string[];
  averageScore: number;
  averageAchievementRate: number;
  overallRatingLabel: 'Outstanding Performer' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement' | 'Unsatisfactory';
  ratingColor: string;
  tasksEvaluatedCount: number;
  monthlyScores: { monthCode: string; monthName: string; score: number }[];
  aggregatedItems: KPIItem[];
}

export interface JDTaskTemplate {
  id: string;
  designation: string;
  title: string;
  description: string;
  weight: number; // in percentage, e.g. 30 = 30%
  unit: string; // e.g. 'Sessions', 'Children Counseled', 'Vouchers', 'Field Visits'
  defaultTarget: number;
  strategicPillar: StrategicPillar;
  guidanceNotes: string;
  underperformingThreshold: number; // percentage, e.g. 70
  underperformingRecommendation: string;
  excellenceRecommendation: string;
}

export interface ProofAttachment {
  id: string;
  name: string;
  fileType: string;
  fileSize: string;
  dataUrl: string; // base64 representation for preview & storage
  uploadedAt: string;
}

export interface DailyWeeklyUpdate {
  id: string;
  date: string;
  taskId: string;
  progressIncrement: number;
  currentTotal: number;
  updateType: 'daily' | 'weekly';
  summary: string;
  challenges?: string;
  attachments?: ProofAttachment[];
  loggedAt: string;
  loggedByEid: string;
}

export interface KPIItem {
  taskId: string;
  title: string;
  description: string;
  weight: number;
  target: number;
  achieved: number;
  unit: string;
  strategicPillar: StrategicPillar;
  achievementRate: number; // in %
  weightedScore: number; // weight * (achievementRate / 100)
  guidanceNotes?: string;
  isCustom?: boolean; // User-created additional KPI indicator
  carriedOverBacklog?: {
    fromMonth: string;
    shortfall: number;
  };
}

export interface MonthlyEmployeeKPI {
  id: string; // e.g. "1034-2026-09"
  eid: string;
  month: string; // e.g. "2026-09"
  targetCommittedAt?: string;
  isTargetLocked: boolean;
  hrTargetUnlocked?: boolean;
  items: KPIItem[];
  updates: DailyWeeklyUpdate[];
  finalScore: number; // 0 to 100+
  ratingLabel: 'Outstanding Performer' | 'Exceeds Expectations' | 'Meets Expectations' | 'Needs Improvement' | 'Unsatisfactory';
  ratingColor: string;
  automatedRecommendations: string[];
  hrReview?: {
    reviewedByEid: string;
    reviewedByName: string;
    reviewedAt: string;
    supervisorRatingAdjustment?: number;
    hrComments: string;
    status: 'Draft' | 'Approved' | 'Revision Requested';
  };
  lastUpdatedAt: string;
}

export type AuditAction = 
  | 'TARGET_COMMITTED'
  | 'TARGET_OVERRIDE'
  | 'PROGRESS_UPDATE'
  | 'HR_EVALUATION'
  | 'SYSTEM_CONFIG_CHANGE'
  | 'REMINDER_SENT'
  | 'REPORT_PRINTED'
  | 'USER_LOGIN'
  | 'USER_LOGOUT'
  | 'PASSWORD_CHANGED'
  | 'DEMO_DATA_CLEARED'
  | 'CUSTOM_KPI_ADDED'
  | 'MONTH_ROLLED_OVER'
  | 'TARGET_UNLOCKED'
  | 'EMPLOYEE_ADDED'
  | 'EMPLOYEE_REMOVED'
  | 'EMPLOYEE_STATUS_CHANGED'
  | 'PASSWORD_RESET'
  | 'JD_UPLOADED'
  | 'MAIN_KPI_ADDED'
  | 'KPI_MODIFIED'
  | 'KPI_DELETED'
  | 'LOGO_UPDATED';

export interface OrgLogoConfig {
  type: 'default' | 'custom_image';
  customImageUrl?: string; // Data URL (base64) or Image URL
  orgNameEn?: string; // e.g. "LEEDO"
  orgNameBn?: string; // e.g. "লিডো"
  orgSubtitleEn?: string; // e.g. "Local Education & Economic Development Org."
  orgSubtitleBn?: string; // e.g. "স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ"
  updatedAt?: string;
  updatedByEid?: string;
  updatedByName?: string;
}

export interface UserCredential {
  eid: string;
  passwordHash: string; // Stored password
  mustChangePassword: boolean;
  lastPasswordChangedAt?: string;
}

export type SupportedLanguage = 'en' | 'bn';

export interface SystemAuditLog {
  id: string;
  timestamp: string;
  actorEid: string;
  actorName: string;
  actorRole: string;
  action: AuditAction;
  details: string;
  targetEid?: string;
  targetName?: string;
}

export interface SystemConfig {
  simulatedDay: number; // 1 to 31
  activeMonth: string; // e.g. "September 2026"
  activeMonthCode: string; // "2026-09"
  overrideTargetWindowOpen: boolean; // Manual override from HR
  automatedRemindersActive: boolean;
  logoConfig?: OrgLogoConfig;
}
