import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Employee,
  MonthlyEmployeeKPI,
  SystemAuditLog,
  SystemConfig,
  DailyWeeklyUpdate,
  UserCredential,
  ProofAttachment,
  StrategicPillar,
  KPIItem,
  EmployeeJD,
  ReportPeriod,
  AggregatedPeriodPerformance,
  OrgLogoConfig,
} from '../types/kpi';
import { EMPLOYEES, getEmployeeByEid as getStaticEmployeeByEid } from '../data/employees';
import { generateInitialKPIs, INITIAL_AUDIT_LOGS } from '../data/initialKpis';
import { calculateKPIScores } from '../utils/kpiCalculator';
import { getJDTemplateForDesignation } from '../data/jobDescriptions';
import { calculateWeightAdjustment } from '../utils/weightAdjuster';
import {
  testConnection,
  syncDocToFirestore,
  fetchCollectionFromFirestore,
  fetchDocFromFirestore,
  deleteDocFromFirestore,
} from '../lib/firebase';

export interface KpiContextType {
  currentUser: Employee | null;
  isLoggedIn: boolean;
  mustChangePassword: boolean;
  login: (eid: string, password: string) => { success: boolean; message: string; mustChangePassword?: boolean };
  logout: () => void;
  changePassword: (eid: string, newPassword: string) => { success: boolean; message: string };
  resetEmployeePassword: (targetEid: string, newPassword?: string) => { success: boolean; message: string };
  dismissPasswordPrompt: () => void;
  setCurrentUserByEid: (eid: string) => boolean;
  isUserHrOrExecutive: (user: Employee | null) => boolean;

  // Employees Management
  employees: Employee[];
  getEmployee: (eid: string) => Employee | undefined;
  addEmployee: (newEmp: Omit<Employee, 'sl'>) => { success: boolean; message: string };
  removeEmployee: (eid: string, reason?: string) => { success: boolean; message: string };
  updateEmployee: (eid: string, updates: Partial<Employee>) => { success: boolean; message: string };

  // JD (Job Description) Management
  employeeJds: Record<string, EmployeeJD>;
  uploadEmployeeJD: (
    eid: string,
    jdData: {
      fileName?: string;
      fileData?: string;
      fileType?: string;
      fileSize?: string;
      textContent?: string;
    }
  ) => { success: boolean; message: string };
  getEmployeeJD: (eid: string) => EmployeeJD | undefined;

  // KPI Records & Configuration
  kpiRecords: MonthlyEmployeeKPI[];
  auditLogs: SystemAuditLog[];
  systemConfig: SystemConfig;
  availableMonths: { code: string; name: string }[];
  switchActiveMonth: (monthCode: string) => void;
  advanceToNextMonth: (newMonthCode: string, newMonthName: string, isAuto?: boolean) => { success: boolean; count: number; message: string };
  autoRolledOverNotice: string | null;
  dismissAutoRolloverNotice: () => void;

  updateSystemConfig: (updates: Partial<SystemConfig>) => void;
  updateOrgLogo: (newLogoConfig: Partial<OrgLogoConfig>) => { success: boolean; message: string };
  resetOrgLogoToDefault: () => { success: boolean; message: string };
  isTargetWindowOpenForUser: (eid: string) => boolean;
  getUserKPI: (eid: string, monthCode?: string) => MonthlyEmployeeKPI | undefined;

  commitMonthlyTargets: (
    eid: string,
    targetValues: { [taskId: string]: number },
    monthCode?: string
  ) => { success: boolean; message: string };

  addCustomKpi: (
    eid: string,
    customData: {
      title: string;
      description: string;
      target: number;
      unit: string;
      weight: number;
      strategicPillar: StrategicPillar;
      autoAdjustOthers?: boolean;
    },
    monthCode?: string
  ) => { success: boolean; message: string; adjustedInfo?: string };

  addMainKpiItem: (
    eid: string,
    mainKpiData: {
      title: string;
      description: string;
      target: number;
      unit: string;
      weight: number;
      strategicPillar: StrategicPillar;
    },
    monthCode?: string
  ) => { success: boolean; message: string };

  modifyEmployeeKpiItem: (
    eid: string,
    taskId: string,
    updates: Partial<KPIItem>,
    monthCode?: string
  ) => { success: boolean; message: string };

  deleteEmployeeKpiItem: (
    eid: string,
    taskId: string,
    monthCode?: string
  ) => { success: boolean; message: string };

  deleteEmployeeMonthKPI: (
    eid: string,
    monthCode: string
  ) => { success: boolean; message: string };

  resetEmployeeKpiToDefault: (
    eid: string,
    monthCode: string
  ) => { success: boolean; message: string };

  addProgressUpdate: (
    eid: string,
    taskId: string,
    increment: number,
    updateType: 'daily' | 'weekly',
    summary: string,
    challenges?: string,
    attachments?: ProofAttachment[],
    monthCode?: string
  ) => { success: boolean; message: string };

  hrUpdateEmployeeKPI: (
    targetEid: string,
    updatedItems: { taskId: string; target: number; achieved: number }[],
    hrComments: string,
    status: 'Draft' | 'Approved',
    monthCode?: string
  ) => { success: boolean; message: string };

  hrUnlockTargetWindowForEmployee: (
    targetEid: string,
    reason: string
  ) => { success: boolean; message: string };

  sendAutomatedReminders: (
    type?: 'all' | 'targets' | 'updates'
  ) => { count: number; message: string };

  // Multi-period Aggregated Performance Reports (1m, 3m, 6m, 1y)
  getAggregatedPerformance: (eid: string, period: ReportPeriod) => AggregatedPeriodPerformance | undefined;
  getAllEmployeesAggregatedPerformance: (period: ReportPeriod) => AggregatedPeriodPerformance[];
  canUserAccessExecutiveReports: (user: Employee | null) => boolean;

  logReportPrinted: (targetEid: string, formatName?: string) => void;
  clearDemoData: () => { success: boolean; message: string };
  resetSystemData: () => void;
}

const KpiContext = createContext<KpiContextType | undefined>(undefined);

const STORAGE_KEY_KPIS = 'leedo_kpi_records_v4';
const STORAGE_KEY_LOGS = 'leedo_audit_logs_v4';
const STORAGE_KEY_CONFIG = 'leedo_sys_config_v4';
const STORAGE_KEY_SESSION = 'leedo_auth_session_v4';
const STORAGE_KEY_CREDS = 'leedo_user_credentials_v4';
const STORAGE_KEY_MONTHS = 'leedo_avail_months_v4';
const STORAGE_KEY_EMPLOYEES = 'leedo_employees_v4';
const STORAGE_KEY_JDS = 'leedo_employee_jds_v4';

const DEFAULT_CONFIG: SystemConfig = {
  simulatedDay: 24,
  activeMonth: 'September 2026',
  activeMonthCode: '2026-09',
  overrideTargetWindowOpen: true,
  automatedRemindersActive: true,
  logoConfig: {
    type: 'default',
    orgNameEn: 'LEEDO',
    orgNameBn: 'লিডো',
    orgSubtitleEn: 'Local Education & Economic Development Org.',
    orgSubtitleBn: 'স্থানীয় শিক্ষা ও অর্থনৈতিক উন্নয়ন সংস্থা • ঢাকা, বাংলাদেশ',
  },
};

const DEFAULT_MONTHS = [
  { code: '2026-07', name: 'July 2026' },
  { code: '2026-08', name: 'August 2026' },
  { code: '2026-09', name: 'September 2026' },
  { code: '2026-10', name: 'October 2026' },
];

export function getNextMonthInfo(monthCode: string): { code: string; name: string } {
  const [yearStr, monthStr] = monthCode.split('-');
  let year = parseInt(yearStr, 10);
  let month = parseInt(monthStr, 10);
  month += 1;
  if (month > 12) {
    month = 1;
    year += 1;
  }
  const nextCode = `${year}-${String(month).padStart(2, '0')}`;
  const dateObj = new Date(year, month - 1, 1);
  const nextName = dateObj.toLocaleString('en-US', { month: 'long', year: 'numeric' });
  return { code: nextCode, name: nextName };
}

export const KpiProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Employees storage
  const [employees, setEmployees] = useState<Employee[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return EMPLOYEES;
  });

  // 2. JD storage
  const [employeeJds, setEmployeeJds] = useState<Record<string, EmployeeJD>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_JDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  // 3. User credentials
  const [userCredentials, setUserCredentials] = useState<Record<string, UserCredential>>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CREDS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return {};
  });

  // 4. Logged-in session: Keep logged-in session across page reloads & link clicks
  const [currentUser, setCurrentUser] = useState<Employee | null>(() => {
    try {
      const savedEid = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (savedEid) {
        const savedEmpData = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
        const empList: Employee[] = savedEmpData ? JSON.parse(savedEmpData) : EMPLOYEES;
        const found = empList.find((e) => e.eid === savedEid) || EMPLOYEES.find((e) => e.eid === savedEid);
        if (found) {
          return found;
        }
      }
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  const [mustChangePassword, setMustChangePassword] = useState<boolean>(() => {
    try {
      const savedEid = localStorage.getItem(STORAGE_KEY_SESSION) || sessionStorage.getItem(STORAGE_KEY_SESSION);
      if (savedEid) {
        const savedCreds = localStorage.getItem(STORAGE_KEY_CREDS);
        if (savedCreds) {
          const credsMap = JSON.parse(savedCreds);
          const cred = credsMap[savedEid];
          if (cred) {
            return Boolean(cred.mustChangePassword || !cred.passwordHash || cred.passwordHash === savedEid);
          }
        }
        return false;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  });

  // 5. Available months
  const [availableMonths, setAvailableMonths] = useState<{ code: string; name: string }[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_MONTHS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_MONTHS;
  });

  // 6. System config
  const [systemConfig, setSystemConfig] = useState<SystemConfig>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_CONFIG,
          ...parsed,
          overrideTargetWindowOpen: true,
        };
      } catch (e) {
        console.error(e);
      }
    }
    return DEFAULT_CONFIG;
  });

  // 7. KPI Records
  const [kpiRecords, setKpiRecords] = useState<MonthlyEmployeeKPI[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_KPIS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Generate initial records for active month and prior months
    const current = generateInitialKPIs(DEFAULT_CONFIG.activeMonthCode);
    const prior = generateInitialKPIs('2026-08');
    return [...current, ...prior];
  });

  // 8. Audit logs
  const [auditLogs, setAuditLogs] = useState<SystemAuditLog[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LOGS);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_AUDIT_LOGS;
  });

  const [autoRolledOverNotice, setAutoRolledOverNotice] = useState<string | null>(null);

  // Sync to local storage & session
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY_SESSION, currentUser.eid);
      sessionStorage.setItem(STORAGE_KEY_SESSION, currentUser.eid);
    } else {
      localStorage.removeItem(STORAGE_KEY_SESSION);
      sessionStorage.removeItem(STORAGE_KEY_SESSION);
    }
  }, [currentUser]);

  // Initial Cloud Firestore Connection & Synchronization
  useEffect(() => {
    testConnection();

    const syncCloudData = async () => {
      try {
        const [cloudConfig, cloudKpis, cloudCreds, cloudJds, cloudEmps] = await Promise.all([
          fetchDocFromFirestore<SystemConfig>('system_config', 'app_config'),
          fetchCollectionFromFirestore<MonthlyEmployeeKPI>('kpi_records'),
          fetchCollectionFromFirestore<UserCredential>('user_credentials'),
          fetchCollectionFromFirestore<EmployeeJD>('employee_jds'),
          fetchCollectionFromFirestore<Employee>('employees'),
        ]);

        if (cloudConfig) {
          setSystemConfig((prev) => ({ ...prev, ...cloudConfig }));
        }
        if (cloudKpis && cloudKpis.length > 0) {
          setKpiRecords(cloudKpis);
        }
        if (cloudCreds && cloudCreds.length > 0) {
          const credsMap: Record<string, UserCredential> = {};
          cloudCreds.forEach((c) => { credsMap[c.eid] = c; });
          setUserCredentials((prev) => ({ ...prev, ...credsMap }));
        }
        if (cloudJds && cloudJds.length > 0) {
          const jdsMap: Record<string, EmployeeJD> = {};
          cloudJds.forEach((j) => { jdsMap[j.eid] = j; });
          setEmployeeJds((prev) => ({ ...prev, ...jdsMap }));
        }
        if (cloudEmps && cloudEmps.length > 0) {
          setEmployees(cloudEmps);
        }
      } catch (err) {
        console.warn('[Firebase] Initial sync note:', err);
      }
    };

    syncCloudData();
  }, []);

  // Sync to local storage & Firestore
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(employees));
    employees.forEach((emp) => syncDocToFirestore('employees', emp.eid, emp));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_JDS, JSON.stringify(employeeJds));
    Object.values(employeeJds).forEach((jd) => syncDocToFirestore('employee_jds', jd.eid, jd));
  }, [employeeJds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(systemConfig));
    syncDocToFirestore('system_config', 'app_config', systemConfig);
  }, [systemConfig]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_KPIS, JSON.stringify(kpiRecords));
  }, [kpiRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_MONTHS, JSON.stringify(availableMonths));
  }, [availableMonths]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_CREDS, JSON.stringify(userCredentials));
    Object.values(userCredentials).forEach((c) => syncDocToFirestore('user_credentials', c.eid, c));
  }, [userCredentials]);

  // Helper for Audit Logging
  const addAuditLog = (
    action: SystemAuditLog['action'],
    details: string,
    targetEid?: string,
    targetName?: string
  ) => {
    const newLog: SystemAuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      actorEid: currentUser?.eid || 'SYSTEM',
      actorName: currentUser?.name || 'Automated System Scheduler',
      actorRole: currentUser?.role || 'SYSTEM',
      action,
      details,
      targetEid,
      targetName,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  // Helper to find Employee
  const getEmployee = (eid: string): Employee | undefined => {
    return employees.find((e) => e.eid === eid) || EMPLOYEES.find((e) => e.eid === eid);
  };

  // Dynamic HR & Executive Role Permission Check
  // Ensures anyone in an HR or Executive position (by role, designation, department, or executive ID)
  // automatically receives 100% of all administrative, dashboard, staff management, password reset, and report accesses.
  const isUserHrOrExecutive = (user: Employee | null): boolean => {
    if (!user) return false;
    if (user.role === 'executive' || user.role === 'hr_admin') return true;
    const dept = (user.department || '').toLowerCase();
    if (
      dept.includes('human resource') ||
      dept.includes('hr') ||
      dept.includes('executive') ||
      dept.includes('admin & finance')
    ) {
      return true;
    }
    const des = (user.designation || '').toLowerCase();
    if (
      des.includes('hr') ||
      des.includes('human resource') ||
      des.includes('director') ||
      des.includes('manager - hr') ||
      des.includes('admin') ||
      des.includes('executive')
    ) {
      return true;
    }
    return (
      user.eid === '1001' || // Forhad Hossain
      user.eid === '1002' || // Murshida Akhter Kanta
      user.eid === '1057'    // Md. Omar Faruque
    );
  };

  const canUserAccessExecutiveReports = (user: Employee | null): boolean => {
    return isUserHrOrExecutive(user);
  };

  // Advance to Next Month & Auto Rollover
  const advanceToNextMonth = (
    newMonthCode: string,
    newMonthName: string,
    isAuto: boolean = false
  ): { success: boolean; count: number; message: string } => {
    // 1. Add to available months if not present
    if (!availableMonths.some((m) => m.code === newMonthCode)) {
      setAvailableMonths((prev) => [...prev, { code: newMonthCode, name: newMonthName }]);
    }

    const currentMonthCode = systemConfig.activeMonthCode;
    let carriedOverCount = 0;

    // 2. Generate new month records with automatic carryover for all active employees
    const activeStaff = employees.filter((e) => e.status !== 'inactive' && e.status !== 'resigned');

    const newRecords: MonthlyEmployeeKPI[] = activeStaff.map((emp) => {
      const prevRecord = kpiRecords.find(
        (r) => r.eid === emp.eid && r.month === currentMonthCode
      );

      const baseTemplates = getJDTemplateForDesignation(emp.designation);

      const items: KPIItem[] = baseTemplates.map((tmpl) => {
        let backlogShortfall = 0;

        if (prevRecord) {
          const prevItem = prevRecord.items.find(
            (it) => it.taskId === tmpl.id || it.title === tmpl.title
          );
          if (prevItem && prevItem.achieved < prevItem.target) {
            backlogShortfall = prevItem.target - prevItem.achieved;
            carriedOverCount++;
          }
        }

        const initialTarget = tmpl.defaultTarget + backlogShortfall;

        return {
          taskId: tmpl.id,
          title: tmpl.title,
          description: tmpl.description,
          weight: tmpl.weight,
          target: initialTarget,
          achieved: 0,
          unit: tmpl.unit,
          strategicPillar: tmpl.strategicPillar,
          achievementRate: 0,
          weightedScore: 0,
          guidanceNotes: tmpl.guidanceNotes,
          carriedOverBacklog:
            backlogShortfall > 0
              ? { fromMonth: currentMonthCode, shortfall: backlogShortfall }
              : undefined,
        };
      });

      // Also carry forward any custom unfinished KPIs
      if (prevRecord) {
        prevRecord.items
          .filter((it) => it.isCustom && it.achieved < it.target)
          .forEach((customIt) => {
            const shortfall = customIt.target - customIt.achieved;
            carriedOverCount++;
            items.push({
              ...customIt,
              target: shortfall,
              achieved: 0,
              achievementRate: 0,
              weightedScore: 0,
              carriedOverBacklog: {
                fromMonth: currentMonthCode,
                shortfall,
              },
            });
          });
      }

      const calculated = calculateKPIScores(items, emp.designation);

      return {
        id: `${emp.eid}-${newMonthCode}`,
        eid: emp.eid,
        month: newMonthCode,
        isTargetLocked: false,
        items: calculated.items,
        updates: [],
        finalScore: calculated.finalScore,
        ratingLabel: calculated.ratingLabel,
        ratingColor: calculated.ratingColor,
        automatedRecommendations: calculated.automatedRecommendations,
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setKpiRecords((prev) => [
      ...prev.filter((r) => r.month !== newMonthCode),
      ...newRecords,
    ]);

    if (!isAuto) {
      setSystemConfig((prev) => ({
        ...prev,
        activeMonthCode: newMonthCode,
        activeMonth: newMonthName,
        simulatedDay: 1,
        overrideTargetWindowOpen: false,
      }));
    }

    addAuditLog(
      'MONTH_ROLLED_OVER',
      `${isAuto ? '[স্বয়ংক্রিয় রোলওভার (১৫ তারিখের পর)]' : 'Initialized'} মাস ${newMonthName}. ${carriedOverCount}টি অসমাপ্ত কাজের ব্যাকলগ নতুন টার্গেটে স্বয়ংক্রিয় সমন্বয় করা হয়েছে।`
    );

    return {
      success: true,
      count: carriedOverCount,
      message: `মাস ${newMonthName} সফলভাবে তৈরি হয়েছে। ${carriedOverCount}টি পূর্ববর্তী অসমাপ্ত কাজের ঘাটতি পরবর্তী মাসের টার্গেটে সমন্বয় করা হয়েছে।`,
    };
  };

  // 15th-of-month automatic rollover requirement:
  // "proti maser 15 tarik er por porer mas jeno auto matic hoye jay, october 2026 choloman tik 15 tarik er por automatic november 2026 toiri hoye jabe"
  useEffect(() => {
    if (systemConfig.simulatedDay > 15) {
      const nextMonth = getNextMonthInfo(systemConfig.activeMonthCode);
      const exists = availableMonths.some((m) => m.code === nextMonth.code);
      if (!exists) {
        advanceToNextMonth(nextMonth.code, nextMonth.name, true);
        setAutoRolledOverNotice(
          `১৫ তারিখ অতিক্রান্ত হওয়ায় পরবর্তী মাস (${nextMonth.name}) স্বয়ংক্রিয়ভাবে প্রস্তুত করা হয়েছে। আপনি চাইলে এখনই এটি নির্বাচন করতে পারেন।`
        );
      }
    }
  }, [systemConfig.simulatedDay, systemConfig.activeMonthCode, availableMonths]);

  const dismissAutoRolloverNotice = () => setAutoRolledOverNotice(null);

  const switchActiveMonth = (monthCode: string) => {
    const found = availableMonths.find((m) => m.code === monthCode);
    if (!found) return;

    setSystemConfig((prev) => ({
      ...prev,
      activeMonthCode: found.code,
      activeMonth: found.name,
      simulatedDay: 2,
      overrideTargetWindowOpen: false,
    }));

    addAuditLog(
      'SYSTEM_CONFIG_CHANGE',
      `সক্রিয় মূল্যায়ন মাস পরিবর্তন: ${found.name} (${found.code})`
    );
  };

  const updateSystemConfig = (updates: Partial<SystemConfig>) => {
    setSystemConfig((prev) => {
      const next = { ...prev, ...updates };
      addAuditLog(
        'SYSTEM_CONFIG_CHANGE',
        `সিস্টেম কনফিগারেশন আপডেট: তারিখ=দিন ${next.simulatedDay}, ওভাররাইড=${next.overrideTargetWindowOpen ? 'OPEN' : 'CLOSED'}`
      );
      return next;
    });
  };

  // Employee Profile Management (Add / Remove)
  const addEmployee = (newEmpData: Omit<Employee, 'sl'>): { success: boolean; message: string } => {
    const existing = getEmployee(newEmpData.eid);
    if (existing) {
      return { success: false, message: `এমপ্লয়ী আইডি ${newEmpData.eid} ইতিমধ্যে নিবন্ধিত রয়েছে!` };
    }

    const nextSl = employees.length + 1;
    const newEmp: Employee = {
      ...newEmpData,
      sl: nextSl,
      status: 'active',
      avatarColor: newEmpData.avatarColor || '#e11d48',
    };

    setEmployees((prev) => [...prev, newEmp]);

    // Create user credentials with standard default: leedo@{eid}
    setUserCredentials((prev) => ({
      ...prev,
      [newEmp.eid]: {
        eid: newEmp.eid,
        passwordHash: `leedo@${newEmp.eid}`,
        mustChangePassword: true,
      },
    }));

    // Initialize default KPI scorecard for the active month
    const templates = getJDTemplateForDesignation(newEmp.designation);
    const baseItems: KPIItem[] = templates.map((tmpl) => ({
      taskId: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      weight: tmpl.weight,
      target: tmpl.defaultTarget,
      achieved: 0,
      unit: tmpl.unit,
      strategicPillar: tmpl.strategicPillar,
      achievementRate: 0,
      weightedScore: 0,
      guidanceNotes: tmpl.guidanceNotes,
    }));

    const calculated = calculateKPIScores(baseItems, newEmp.designation);

    const initialRecord: MonthlyEmployeeKPI = {
      id: `${newEmp.eid}-${systemConfig.activeMonthCode}`,
      eid: newEmp.eid,
      month: systemConfig.activeMonthCode,
      isTargetLocked: false,
      items: calculated.items,
      updates: [],
      finalScore: 0,
      ratingLabel: 'Needs Improvement',
      ratingColor: '#ea580c',
      automatedRecommendations: ['নতুন কর্মী হিসেবে নিয়োগ সম্পন্ন। ১-৩ তারিখের মধ্যে প্রাথমিক লক্ষ্যমাত্রা নির্ধারণ করুন।'],
      lastUpdatedAt: new Date().toISOString(),
    };

    setKpiRecords((prev) => [...prev, initialRecord]);

    addAuditLog(
      'EMPLOYEE_ADDED',
      `নতুন কর্মী যোগদান নথিভুক্ত: ${newEmp.name} (${newEmp.designation}, EID: ${newEmp.eid}, বিভাগ: ${newEmp.department})`,
      newEmp.eid,
      newEmp.name
    );

    return { success: true, message: `নতুন কর্মী ${newEmp.name} (EID: ${newEmp.eid}) সফলভাবে যুক্ত হয়েছে। ডিফল্ট লগইন পাসওয়ার্ড: leedo@${newEmp.eid}` };
  };

  const removeEmployee = (eid: string, reason: string = 'Left Organization'): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    // Mark as inactive / resigned
    setEmployees((prev) =>
      prev.map((e) => (e.eid === eid ? { ...e, status: 'resigned' } : e))
    );

    addAuditLog(
      'EMPLOYEE_REMOVED',
      `কর্মীর অবসান/অব্যাহতি কার্যকর করা হয়েছে: ${emp.name} (EID: ${emp.eid}). কারণ: ${reason}`,
      emp.eid,
      emp.name
    );

    return { success: true, message: `কর্মী ${emp.name} (EID: ${eid}) কে সফলভাবে নিষ্ক্রিয়/অব্যাহতি তালিকাভুক্ত করা হয়েছে।` };
  };

  const updateEmployee = (eid: string, updates: Partial<Employee>): { success: boolean; message: string } => {
    setEmployees((prev) =>
      prev.map((e) => (e.eid === eid ? { ...e, ...updates } : e))
    );

    addAuditLog(
      'EMPLOYEE_STATUS_CHANGED',
      `কর্মী তথ্য হালনাগাদ: EID ${eid}`,
      eid
    );

    return { success: true, message: 'কর্মী তথ্য সফলভাবে আপডেট হয়েছে।' };
  };

  // Upload JD for an employee
  const uploadEmployeeJD = (
    eid: string,
    jdData: {
      fileName?: string;
      fileData?: string;
      fileType?: string;
      fileSize?: string;
      textContent?: string;
    }
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const newJD: EmployeeJD = {
      eid,
      fileName: jdData.fileName || `${emp.name}_JD.pdf`,
      fileData: jdData.fileData,
      fileType: jdData.fileType || 'application/pdf',
      fileSize: jdData.fileSize || '120 KB',
      textContent: jdData.textContent,
      uploadedByEid: currentUser?.eid || 'HR',
      uploadedByName: currentUser?.name || 'HR Admin',
      uploadedAt: new Date().toISOString(),
    };

    setEmployeeJds((prev) => ({ ...prev, [eid]: newJD }));

    addAuditLog(
      'JD_UPLOADED',
      `কর্মকর্তার জব ডেসক্রিপশন (JD) আপলোড ও সংরক্ষণ: ${emp.name} (${emp.designation})`,
      emp.eid,
      emp.name
    );

    return { success: true, message: `${emp.name}-এর জন্য জব ডেসক্রিপশন (JD) সফলভাবে আপলোড হয়েছে।` };
  };

  const getEmployeeJD = (eid: string): EmployeeJD | undefined => {
    return employeeJds[eid];
  };

  // Get active KPI record for an employee
  const getUserKPI = (eid: string, monthCode?: string): MonthlyEmployeeKPI | undefined => {
    const targetMonth = monthCode || systemConfig.activeMonthCode;
    let found = kpiRecords.find((k) => k.eid === eid && k.month === targetMonth);

    if (!found) {
      const emp = getEmployee(eid);
      if (emp) {
        const templates = getJDTemplateForDesignation(emp.designation);
        const blankItems = templates.map((tmpl) => ({
          taskId: tmpl.id,
          title: tmpl.title,
          description: tmpl.description,
          weight: tmpl.weight,
          target: tmpl.defaultTarget,
          achieved: 0,
          unit: tmpl.unit,
          strategicPillar: tmpl.strategicPillar,
          achievementRate: 0,
          weightedScore: 0,
          guidanceNotes: tmpl.guidanceNotes,
        }));
        const calculated = calculateKPIScores(blankItems, emp.designation);
        const newRecord: MonthlyEmployeeKPI = {
          id: `${eid}-${targetMonth}`,
          eid,
          month: targetMonth,
          isTargetLocked: false,
          items: calculated.items,
          updates: [],
          finalScore: calculated.finalScore,
          ratingLabel: calculated.ratingLabel,
          ratingColor: calculated.ratingColor,
          automatedRecommendations: calculated.automatedRecommendations,
          lastUpdatedAt: new Date().toISOString(),
        };
        found = newRecord;
      }
    }
    return found;
  };

  const isTargetWindowOpenForUser = (eid: string): boolean => {
    // Target window is fully open for workforce daily/monthly management
    if (systemConfig.overrideTargetWindowOpen !== false) return true;
    if (systemConfig.simulatedDay <= 3) return true;
    const userKpi = getUserKPI(eid);
    if (userKpi?.hrTargetUnlocked) return true;
    return true;
  };

  const commitMonthlyTargets = (
    eid: string,
    targetValues: { [taskId: string]: number },
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const isOpen = isTargetWindowOpenForUser(eid);
    if (!isOpen) {
      return {
        success: false,
        message: 'টার্গেট এন্ট্রি উইন্ডো বর্তমানে বন্ধ রয়েছে (১-৩ তারিখ)। এইচআর অনুমোদনের প্রয়োজন।',
      };
    }

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(eid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const updatedBaseItems = currentRecord.items.map((item) => {
      const newTarget = targetValues[item.taskId] !== undefined ? targetValues[item.taskId] : item.target;
      return {
        ...item,
        target: Math.max(1, newTarget),
      };
    });

    const calculated = calculateKPIScores(updatedBaseItems, emp.designation);
    const now = new Date().toISOString();

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      targetCommittedAt: now,
      isTargetLocked: true,
      hrTargetUnlocked: false,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === eid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === eid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'TARGET_COMMITTED',
      `${targetMonth}-এর জন্য মাসিক টার্গেট চূড়ান্ত ও লক করা হয়েছে (${emp.name})।`,
      emp.eid,
      emp.name
    );

    return { success: true, message: 'মাসিক লক্ষ্যমাত্রা সফলভাবে জমা হয়েছে ও লক করা হয়েছে।' };
  };

  // Add Custom Individual KPI with Automatic Weight Rebalancing
  // "custom KIP deyar somoy weight jeno 100% er otirikto na hoy seta janano, onno KPI theke automatic weight kome adjust hoye jeno jay, onno kpi theke soman hare % kombe, jemon new kpi te 5 dilo, tahole top 5 theke 1 kore kome ekhane add hobe, but 100% er besi jeno na hoy"
  const addCustomKpi = (
    eid: string,
    customData: {
      title: string;
      description: string;
      target: number;
      unit: string;
      weight: number;
      strategicPillar: StrategicPillar;
      autoAdjustOthers?: boolean;
    }
  ): { success: boolean; message: string; adjustedInfo?: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const currentRecord = getUserKPI(eid);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const targetWeight = Math.max(5, customData.weight);

    // Calculate weight adjustment
    const adjResult = calculateWeightAdjustment(currentRecord.items, targetWeight);
    if (!adjResult.isValid) {
      return { success: false, message: adjResult.error || 'কেপিআই ওয়েট ১০০% এর অতিরিক্ত হতে পারবে না।' };
    }

    const newTaskId = `custom-${Date.now()}`;
    const newItem: KPIItem = {
      taskId: newTaskId,
      title: customData.title.trim(),
      description: customData.description.trim(),
      weight: targetWeight,
      target: Math.max(1, customData.target),
      achieved: 0,
      unit: customData.unit.trim() || 'টি',
      strategicPillar: customData.strategicPillar,
      achievementRate: 0,
      weightedScore: 0,
      isCustom: true,
    };

    // Combine adjusted others with new item
    const finalItems = [...adjResult.adjustedItems, newItem];
    const calculated = calculateKPIScores(finalItems, emp.designation);
    const now = new Date().toISOString();

    setKpiRecords((prev) =>
      prev.map((rec) => {
        if (rec.eid === eid && rec.month === systemConfig.activeMonthCode) {
          return {
            ...rec,
            items: calculated.items,
            finalScore: calculated.finalScore,
            ratingLabel: calculated.ratingLabel,
            ratingColor: calculated.ratingColor,
            automatedRecommendations: calculated.automatedRecommendations,
            lastUpdatedAt: now,
          };
        }
        return rec;
      })
    );

    addAuditLog(
      'CUSTOM_KPI_ADDED',
      `অতিরিক্ত কেপিআই যুক্ত: "${customData.title}" (${targetWeight}% ওয়েট, টার্গেট: ${customData.target} ${customData.unit}). ${adjResult.deductionSummary}`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `অতিরিক্ত কেপিআই সফলভাবে যুক্ত হয়েছে। ${adjResult.deductionSummary}`,
      adjustedInfo: adjResult.deductionSummary,
    };
  };

  // HR Add New Main Core KPI with Weight Balancing
  const addMainKpiItem = (
    eid: string,
    mainKpiData: {
      title: string;
      description: string;
      target: number;
      unit: string;
      weight: number;
      strategicPillar: StrategicPillar;
    },
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(eid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const targetWeight = Math.max(5, mainKpiData.weight);
    const adjResult = calculateWeightAdjustment(currentRecord.items, targetWeight);
    if (!adjResult.isValid) {
      return { success: false, message: adjResult.error || 'কেপিআই ওয়েট ১০০% এর বেশি হতে পারবে না।' };
    }

    const newTaskId = `core-${Date.now()}`;
    const newItem: KPIItem = {
      taskId: newTaskId,
      title: mainKpiData.title.trim(),
      description: mainKpiData.description.trim(),
      weight: targetWeight,
      target: Math.max(1, mainKpiData.target),
      achieved: 0,
      unit: mainKpiData.unit.trim() || 'Units',
      strategicPillar: mainKpiData.strategicPillar,
      achievementRate: 0,
      weightedScore: 0,
      isCustom: false,
    };

    const finalItems = [...adjResult.adjustedItems, newItem];
    const calculated = calculateKPIScores(finalItems, emp.designation);
    const now = new Date().toISOString();

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === eid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === eid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'MAIN_KPI_ADDED',
      `এইচআর কর্তৃক নতুন মূল কেপিআই সংযোজন (${targetMonth}): "${mainKpiData.title}" (${targetWeight}% ওয়েট). ${adjResult.deductionSummary}`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `নতুন মূল কেপিআই সফলভাবে যুক্ত হয়েছে এবং অন্যান্য কেপিআই থেকে সমানুপাতিক ওয়েট সমন্বয় করা হয়েছে।`,
    };
  };

  // HR Modify Existing KPI (target, weight, title, unit) with auto rebalancing
  const modifyEmployeeKpiItem = (
    eid: string,
    taskId: string,
    updates: Partial<KPIItem>,
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(eid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const existingItem = currentRecord.items.find((it) => it.taskId === taskId);
    if (!existingItem) return { success: false, message: 'কেপিআই সূচক পাওয়া যায়নি।' };

    let updatedItems = [...currentRecord.items];

    // If weight is being changed
    if (updates.weight !== undefined && updates.weight !== existingItem.weight) {
      const adjResult = calculateWeightAdjustment(currentRecord.items, updates.weight, taskId);
      if (!adjResult.isValid) {
        return { success: false, message: adjResult.error || 'কেপিআই ওয়েট ১০০% এর বেশি হতে পারবে না।' };
      }

      updatedItems = adjResult.adjustedItems.map((it) => {
        if (it.taskId === taskId) {
          return { ...it, ...updates, weight: updates.weight! };
        }
        return it;
      });

      // If the target task was not in adjusted items, add it
      if (!updatedItems.some((it) => it.taskId === taskId)) {
        updatedItems.push({ ...existingItem, ...updates, weight: updates.weight });
      }
    } else {
      updatedItems = updatedItems.map((it) =>
        it.taskId === taskId ? { ...it, ...updates } : it
      );
    }

    const calculated = calculateKPIScores(updatedItems, emp.designation);
    const now = new Date().toISOString();

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === eid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === eid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'KPI_MODIFIED',
      `এইচআর কর্তৃক কেপিআই সংশোধন (${targetMonth}): "${existingItem.title}" (${emp.name})`,
      emp.eid,
      emp.name
    );

    return { success: true, message: 'কেপিআই সফলভাবে পরিবর্তিত হয়েছে।' };
  };

  // Delete a KPI and redistribute its weight to remaining items
  const deleteEmployeeKpiItem = (
    eid: string,
    taskId: string,
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(eid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const itemToDelete = currentRecord.items.find((it) => it.taskId === taskId);
    if (!itemToDelete) return { success: false, message: 'কেপিআই পাওয়া যায়নি।' };

    const remaining = currentRecord.items.filter((it) => it.taskId !== taskId);
    if (remaining.length === 0) {
      return { success: false, message: 'সর্বশেষ কেপিআইটি মুছে ফেলা সম্ভব নয়। অন্তত ১টি সূচক থাকা আবশ্যক।' };
    }

    // Distribute deleted item's weight equally to remaining items
    let weightToDistribute = itemToDelete.weight;
    const redistributed = remaining.map((it) => ({ ...it }));

    let i = 0;
    while (weightToDistribute > 0) {
      redistributed[i % redistributed.length].weight += 1;
      weightToDistribute -= 1;
      i++;
    }

    const calculated = calculateKPIScores(redistributed, emp.designation);
    const now = new Date().toISOString();

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === eid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === eid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'KPI_DELETED',
      `কেপিআই অপসারিত (${targetMonth}): "${itemToDelete.title}". অপসারিত ওয়েট (${itemToDelete.weight}%) অবশিষ্ট সূচকে পুনর্বণ্টন করা হয়েছে।`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `"${itemToDelete.title}" সফলভাবে অপসারিত হয়েছে এবং ${itemToDelete.weight}% ওয়েট অবশিষ্ট সূচকে পুনর্বণ্টন করা হয়েছে।`,
    };
  };

  // Delete an entire month's KPI record for an employee
  const deleteEmployeeMonthKPI = (
    eid: string,
    monthCode: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const recordId = `${eid}-${monthCode}`;
    setKpiRecords((prev) => prev.filter((r) => !(r.eid === eid && r.month === monthCode)));
    deleteDocFromFirestore('kpi_records', recordId);

    addAuditLog(
      'KPI_DELETED',
      `এইচআর কর্তৃক সম্পূর্ণ মাসের (${monthCode}) কেপিআই রেকর্ড অপসারিত: ${emp.name} (${eid})`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `${emp.name}-এর ${monthCode} মাসের কেপিআই রেকর্ড সফলভাবে মুছে ফেলা হয়েছে।`,
    };
  };

  // Reset an employee's month KPI to original default JD template
  const resetEmployeeKpiToDefault = (
    eid: string,
    monthCode: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const templates = getJDTemplateForDesignation(emp.designation);
    const blankItems = templates.map((tmpl) => ({
      taskId: tmpl.id,
      title: tmpl.title,
      description: tmpl.description,
      weight: tmpl.weight,
      target: tmpl.defaultTarget,
      achieved: 0,
      unit: tmpl.unit,
      strategicPillar: tmpl.strategicPillar,
      achievementRate: 0,
      weightedScore: 0,
      guidanceNotes: tmpl.guidanceNotes,
    }));
    const calculated = calculateKPIScores(blankItems, emp.designation);
    const newRecord: MonthlyEmployeeKPI = {
      id: `${eid}-${monthCode}`,
      eid,
      month: monthCode,
      isTargetLocked: false,
      items: calculated.items,
      updates: [],
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      lastUpdatedAt: new Date().toISOString(),
    };

    setKpiRecords((prev) => {
      const filtered = prev.filter((r) => !(r.eid === eid && r.month === monthCode));
      return [...filtered, newRecord];
    });

    syncDocToFirestore('kpi_records', newRecord.id, newRecord);

    addAuditLog(
      'KPI_MODIFIED',
      `এইচআর কর্তৃক ${monthCode} মাসের কেপিআই ডিফল্ট জেডি টেমপ্লেটে রিসেট করা হয়েছে: ${emp.name}`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `${emp.name}-এর ${monthCode} মাসের কেপিআই ডিফল্ট সূচকে রিসেট করা হয়েছে।`,
    };
  };

  // Progress Update with Optional Proof Attachment
  const addProgressUpdate = (
    eid: string,
    taskId: string,
    increment: number,
    updateType: 'daily' | 'weekly',
    summary: string,
    challenges?: string,
    attachments?: ProofAttachment[],
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(eid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(eid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const targetItem = currentRecord.items.find((item) => item.taskId === taskId);
    if (!targetItem) return { success: false, message: 'টাস্ক খুঁজে পাওয়া যায়নি।' };

    const newAchieved = targetItem.achieved + increment;
    const now = new Date().toISOString();
    const dateStr = now.split('T')[0];

    const newUpdate: DailyWeeklyUpdate = {
      id: `upd-${Date.now()}`,
      date: dateStr,
      taskId: taskId,
      progressIncrement: increment,
      currentTotal: newAchieved,
      updateType,
      summary: summary.trim(),
      challenges: challenges?.trim() || undefined,
      attachments: attachments && attachments.length > 0 ? attachments : undefined,
      loggedAt: now,
      loggedByEid: currentUser?.eid || eid,
    };

    const updatedItems = currentRecord.items.map((item) => {
      if (item.taskId === taskId) {
        return {
          ...item,
          achieved: newAchieved,
        };
      }
      return item;
    });

    const calculated = calculateKPIScores(updatedItems, emp.designation);

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      updates: [newUpdate, ...currentRecord.updates],
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === eid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === eid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'PROGRESS_UPDATE',
      `অগ্রগতি লগ: "${targetItem.title}" +${increment} ${targetItem.unit}. মোট অর্জিত: ${newAchieved}/${targetItem.target}.`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `অগ্রগতি সফলভাবে সংরক্ষিত হয়েছে (+${increment} ${targetItem.unit})।`,
    };
  };

  // HR Review & Official Score Adjustment
  const hrUpdateEmployeeKPI = (
    targetEid: string,
    updatedItems: { taskId: string; target: number; achieved: number }[],
    hrComments: string,
    status: 'Draft' | 'Approved',
    monthCode?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(targetEid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const targetMonth = monthCode || systemConfig.activeMonthCode;
    const currentRecord = getUserKPI(targetEid, targetMonth);
    if (!currentRecord) return { success: false, message: 'KPI রেকর্ড খুঁজে পাওয়া যায়নি।' };

    const itemMap = new Map(updatedItems.map((u) => [u.taskId, u]));

    const modifiedItems = currentRecord.items.map((item) => {
      const update = itemMap.get(item.taskId);
      if (update) {
        return {
          ...item,
          target: Math.max(1, update.target),
          achieved: Math.max(0, update.achieved),
        };
      }
      return item;
    });

    const calculated = calculateKPIScores(modifiedItems, emp.designation);
    const now = new Date().toISOString();

    const hrReview = {
      reviewedByEid: currentUser?.eid || '1002',
      reviewedByName: currentUser?.name || 'Murshida Akhter Kanta',
      reviewedAt: now,
      hrComments: hrComments.trim(),
      status,
    };

    const updatedRecord: MonthlyEmployeeKPI = {
      ...currentRecord,
      items: calculated.items,
      finalScore: calculated.finalScore,
      ratingLabel: calculated.ratingLabel,
      ratingColor: calculated.ratingColor,
      automatedRecommendations: calculated.automatedRecommendations,
      hrReview,
      lastUpdatedAt: now,
    };

    setKpiRecords((prev) => {
      const exists = prev.some((rec) => rec.eid === targetEid && rec.month === targetMonth);
      if (exists) {
        return prev.map((rec) => (rec.eid === targetEid && rec.month === targetMonth ? updatedRecord : rec));
      }
      return [...prev, updatedRecord];
    });

    syncDocToFirestore('kpi_records', updatedRecord.id, updatedRecord);

    addAuditLog(
      'HR_EVALUATION',
      `এইচআর মূল্যায়ন সম্পন্ন (${status}, ${targetMonth}): স্কোর ${calculated.finalScore}% (${calculated.ratingLabel})`,
      emp.eid,
      emp.name
    );

    return { success: true, message: `মূল্যায়ন ও স্কোর সফলভাবে আপডেট করা হয়েছে (${status})।` };
  };

  // HR Unlock Target Window
  const hrUnlockTargetWindowForEmployee = (
    targetEid: string,
    reason: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(targetEid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    setKpiRecords((prev) =>
      prev.map((rec) => {
        if (rec.eid === targetEid && rec.month === systemConfig.activeMonthCode) {
          return {
            ...rec,
            isTargetLocked: false,
            hrTargetUnlocked: true,
          };
        }
        return rec;
      })
    );

    addAuditLog(
      'TARGET_UNLOCKED',
      `এইচআর বিশেষ অনুমতিতে টার্গেট লক আনলক করা হয়েছে। কারণ: ${reason}`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `${emp.name} (EID: ${emp.eid})-এর জন্য টার্গেট ইনপুট উইন্ডো আনলক করা হয়েছে।`,
    };
  };

  // Automated Reminders Dispatcher
  const sendAutomatedReminders = (
    type: 'all' | 'targets' | 'updates' = 'all'
  ): { count: number; message: string } => {
    let count = 0;
    const currentMonthCode = systemConfig.activeMonthCode;

    employees.forEach((emp) => {
      if (emp.status === 'resigned' || emp.status === 'inactive') return;
      const rec = kpiRecords.find((r) => r.eid === emp.eid && r.month === currentMonthCode);

      if (type === 'all' || type === 'targets') {
        if (!rec?.targetCommittedAt) count++;
      }
      if (type === 'all' || type === 'updates') {
        if (rec && rec.updates.length === 0) count++;
      }
    });

    addAuditLog(
      'REMINDER_SENT',
      `স্বয়ংক্রিয় রিমাইন্ডার প্রেরণ: ${count} জন কর্মীকে এসএমএস/ইমেইল নোটিফিকেশন পাঠানো হয়েছে (${systemConfig.activeMonth})।`
    );

    return {
      count,
      message: `মোট ${count} জন কর্মীর নিকট নোটিফিকেশন অ্যালার্ট পাঠানো হয়েছে।`,
    };
  };

  // Multi-Period Performance Calculation (1m, 3m, 6m, 1y)
  const getAggregatedPerformance = (
    eid: string,
    period: ReportPeriod
  ): AggregatedPeriodPerformance | undefined => {
    const emp = getEmployee(eid);
    if (!emp) return undefined;

    const activeCode = systemConfig.activeMonthCode;

    // Helper to generate list of past month codes
    const getPastMonthCodes = (baseCode: string, count: number): string[] => {
      const list: string[] = [];
      const [yStr, mStr] = baseCode.split('-');
      let y = parseInt(yStr, 10);
      let m = parseInt(mStr, 10);
      for (let i = 0; i < count; i++) {
        const code = `${y}-${String(m).padStart(2, '0')}`;
        list.push(code);
        m -= 1;
        if (m < 1) {
          m = 12;
          y -= 1;
        }
      }
      return list;
    };

    const countMap: Record<ReportPeriod, number> = {
      '1m': 1,
      '3m': 3,
      '6m': 6,
      '1y': 12,
    };

    const monthsIncluded = getPastMonthCodes(activeCode, countMap[period]);
    const monthlyScores: { monthCode: string; monthName: string; score: number }[] = [];

    let scoreSum = 0;
    let achieveRateSum = 0;
    let tasksCount = 0;

    monthsIncluded.forEach((mCode) => {
      const rec = kpiRecords.find((r) => r.eid === eid && r.month === mCode);
      const mName = availableMonths.find((m) => m.code === mCode)?.name || mCode;

      if (rec) {
        monthlyScores.push({ monthCode: mCode, monthName: mName, score: rec.finalScore });
        scoreSum += rec.finalScore;
        const avgRate = rec.items.reduce((a, b) => a + b.achievementRate, 0) / (rec.items.length || 1);
        achieveRateSum += avgRate;
        tasksCount += rec.items.length;
      } else {
        // Historical baseline generation for earlier unvisited months
        const baseRec = kpiRecords.find((r) => r.eid === eid && r.month === activeCode);
        const baseScore = baseRec ? baseRec.finalScore : 84;
        const hash = (parseInt(eid, 10) || 1000) * 19 + parseInt(mCode.replace('-', ''), 10);
        const variation = (hash % 13) - 6; // -6 to +6
        const simScore = Math.min(100, Math.max(55, Math.round(baseScore + variation)));

        monthlyScores.push({ monthCode: mCode, monthName: mName, score: simScore });
        scoreSum += simScore;
        achieveRateSum += simScore;
        tasksCount += 4;
      }
    });

    const averageScore = Math.round((scoreSum / monthsIncluded.length) * 10) / 10;
    const averageAchievementRate = Math.round((achieveRateSum / monthsIncluded.length) * 10) / 10;

    // Compute item-by-item averages across monthsIncluded
    const baseRecord = getUserKPI(eid, activeCode);
    const baseItems = baseRecord?.items || [];

    const aggregatedItems: KPIItem[] = baseItems.map((baseItem) => {
      let totalTarget = 0;
      let totalAchieved = 0;

      monthsIncluded.forEach((mCode) => {
        const monthRec = kpiRecords.find((r) => r.eid === eid && r.month === mCode);
        if (monthRec) {
          const matchingItem = monthRec.items.find(
            (it) => it.taskId === baseItem.taskId || it.title === baseItem.title
          );
          if (matchingItem) {
            totalTarget += matchingItem.target;
            totalAchieved += matchingItem.achieved;
          } else {
            totalTarget += baseItem.target;
            totalAchieved += Math.round(baseItem.target * (monthRec.finalScore / 100));
          }
        } else {
          // Simulated past month
          const hash = (parseInt(eid, 10) || 1000) * 19 + parseInt(mCode.replace('-', ''), 10);
          const baseScore = baseRecord ? baseRecord.finalScore : 84;
          const variation = (hash % 13) - 6;
          const simScore = Math.min(100, Math.max(55, Math.round(baseScore + variation)));
          totalTarget += baseItem.target;
          totalAchieved += Math.round(baseItem.target * (simScore / 100));
        }
      });

      const numMonths = monthsIncluded.length || 1;
      const avgTarget = Math.round((totalTarget / numMonths) * 10) / 10;
      const avgAchieved = Math.round((totalAchieved / numMonths) * 10) / 10;
      const rawRate = avgTarget > 0 ? (avgAchieved / avgTarget) * 100 : 0;
      const achievementRate = Math.round(rawRate * 10) / 10;
      const weightedScore = Math.round(((baseItem.weight * Math.min(achievementRate, 120)) / 100) * 10) / 10;

      return {
        ...baseItem,
        target: avgTarget,
        achieved: avgAchieved,
        achievementRate,
        weightedScore,
      };
    });

    let overallRatingLabel: AggregatedPeriodPerformance['overallRatingLabel'] = 'Meets Expectations';
    let ratingColor = '#059669';

    if (averageScore >= 90) {
      overallRatingLabel = 'Outstanding Performer';
      ratingColor = '#dc2626';
    } else if (averageScore >= 80) {
      overallRatingLabel = 'Exceeds Expectations';
      ratingColor = '#2563eb';
    } else if (averageScore >= 70) {
      overallRatingLabel = 'Meets Expectations';
      ratingColor = '#059669';
    } else if (averageScore >= 60) {
      overallRatingLabel = 'Needs Improvement';
      ratingColor = '#d97706';
    } else {
      overallRatingLabel = 'Unsatisfactory';
      ratingColor = '#64748b';
    }

    const periodLabels: Record<ReportPeriod, string> = {
      '1m': '১ মাস (চলতি মাসিক মূল্যায়ন)',
      '3m': '৩ মাস (ত্রৈমাসিক মূল্যায়ন)',
      '6m': '৬ মাস (অর্ধ-বার্ষিক মূল্যায়ন)',
      '1y': '১ বছর (বার্ষিক সামগ্রিক মূল্যায়ন)',
    };

    return {
      eid,
      name: emp.name,
      designation: emp.designation,
      department: emp.department,
      period,
      periodLabel: periodLabels[period],
      monthsIncluded,
      averageScore,
      averageAchievementRate,
      overallRatingLabel,
      ratingColor,
      tasksEvaluatedCount: tasksCount,
      monthlyScores,
      aggregatedItems,
    };
  };

  // Get All Employees Aggregated Performance for Summary Report
  const getAllEmployeesAggregatedPerformance = (period: ReportPeriod): AggregatedPeriodPerformance[] => {
    const activeStaff = employees.filter((e) => e.status !== 'resigned');
    return activeStaff
      .map((emp) => getAggregatedPerformance(emp.eid, period))
      .filter((p): p is AggregatedPeriodPerformance => p !== undefined);
  };

  // Log Report Printed
  const logReportPrinted = (targetEid: string, formatName: string = 'Appraisal Sheet') => {
    const emp = getEmployee(targetEid);
    addAuditLog(
      'REPORT_PRINTED',
      `অফিসিয়াল মূল্যায়ন সনদ প্রিন্ট/পিডিএফ গ্রহণ (${formatName})`,
      targetEid,
      emp?.name
    );
  };

  // Auth Operations
  const login = (
    eid: string,
    password: string
  ): { success: boolean; message: string; mustChangePassword?: boolean } => {
    const cleanEid = eid.trim();
    const cleanPassword = password.trim();

    const emp = getEmployee(cleanEid);
    if (!emp) {
      return { success: false, message: `এমপ্লয়ী আইডি "${cleanEid}" পাওয়া যায়নি। অনুগ্রহ করে সঠিক EID লিখুন।` };
    }

    const cred = userCredentials[cleanEid];
    // Default initial password for all employees is their EID
    const defaultPassword = cleanEid;
    const hasCustomPassword = !!(cred && cred.passwordHash && cred.passwordHash !== defaultPassword);
    const expectedPassword = hasCustomPassword ? cred.passwordHash : defaultPassword;

    if (cleanPassword !== expectedPassword) {
      return {
        success: false,
        message: hasCustomPassword
          ? 'ভুল পাসওয়ার্ড! আপনার পরিবর্তিত নতুন পাসওয়ার্ড লিখুন।'
          : 'ভুল পাসওয়ার্ড! প্রাথমিক পাসওয়ার্ড হিসেবে আপনার EID লিখুন।',
      };
    }

    // Force password change on first login or if still using the default EID password
    const needsPassChange =
      !hasCustomPassword ||
      cleanPassword === defaultPassword ||
      Boolean(cred && cred.mustChangePassword);

    setCurrentUser(emp);
    localStorage.setItem(STORAGE_KEY_SESSION, emp.eid);
    sessionStorage.setItem(STORAGE_KEY_SESSION, emp.eid);
    setMustChangePassword(needsPassChange);

    addAuditLog('USER_LOGIN', `কর্মী সিস্টেমে লগইন করেছেন: ${emp.name} (${emp.designation})`, emp.eid, emp.name);

    return {
      success: true,
      message: 'লগইন সফল হয়েছে।',
      mustChangePassword: needsPassChange,
    };
  };

  const logout = () => {
    if (currentUser) {
      addAuditLog('USER_LOGOUT', `কর্মী সিস্টেমে লগআউট করেছেন: ${currentUser.name}`, currentUser.eid, currentUser.name);
    }
    localStorage.removeItem(STORAGE_KEY_SESSION);
    sessionStorage.removeItem(STORAGE_KEY_SESSION);
    setCurrentUser(null);
    setMustChangePassword(false);
  };

  const changePassword = (
    eid: string,
    newPassword: string
  ): { success: boolean; message: string } => {
    const cleanPass = newPassword.trim();
    if (cleanPass.length < 4) {
      return { success: false, message: 'পাসওয়ার্ড অবশ্যই কমপক্ষে ৪ অক্ষরের হতে হবে।' };
    }

    if (cleanPass === eid.trim()) {
      return { success: false, message: 'নতুন পাসওয়ার্ড আপনার EID থেকে ভিন্ন ও গোপনীয় হতে হবে।' };
    }

    const updatedCred = {
      eid,
      passwordHash: cleanPass,
      mustChangePassword: false,
      lastPasswordChangedAt: new Date().toISOString(),
    };

    setUserCredentials((prev) => ({
      ...prev,
      [eid]: updatedCred,
    }));
    syncDocToFirestore('user_credentials', eid, updatedCred);

    setMustChangePassword(false);
    localStorage.setItem(STORAGE_KEY_SESSION, eid);
    sessionStorage.setItem(STORAGE_KEY_SESSION, eid);
    addAuditLog('PASSWORD_CHANGED', `পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে।`, eid);

    return { success: true, message: 'পাসওয়ার্ড সফলভাবে পরিবর্তিত হয়েছে।' };
  };

  // Organization Logo & Branding Management (For HR/Exec)
  const updateOrgLogo = (newLogoConfig: Partial<OrgLogoConfig>): { success: boolean; message: string } => {
    const updated: OrgLogoConfig = {
      ...(systemConfig.logoConfig || DEFAULT_CONFIG.logoConfig!),
      ...newLogoConfig,
      updatedAt: new Date().toISOString(),
      updatedByEid: currentUser?.eid || 'HR',
      updatedByName: currentUser?.name || 'HR Admin',
    };

    setSystemConfig((prev) => ({
      ...prev,
      logoConfig: updated,
    }));

    addAuditLog(
      'LOGO_UPDATED',
      `সংস্থার অফিসিয়াল লোগো ও ব্র্যান্ডিং আপডেট করা হয়েছে (${newLogoConfig.type || 'Custom Logo'})`
    );

    return { success: true, message: 'সংস্থার লোগো সফলভাবে পরিবর্তিত হয়েছে।' };
  };

  const resetOrgLogoToDefault = (): { success: boolean; message: string } => {
    setSystemConfig((prev) => ({
      ...prev,
      logoConfig: DEFAULT_CONFIG.logoConfig,
    }));

    addAuditLog(
      'LOGO_UPDATED',
      'সংস্থার লোগো ডিফল্ট লিডো লোগোতে পুনর্বহাল করা হয়েছে'
    );

    return { success: true, message: 'সংস্থার লোগো ডিফল্ট অবস্থায় সফলভাবে পুনর্বহাল করা হয়েছে।' };
  };

  // HR / Admin Password Reset for any employee
  const resetEmployeePassword = (
    targetEid: string,
    newPassword?: string
  ): { success: boolean; message: string } => {
    const emp = getEmployee(targetEid);
    if (!emp) return { success: false, message: 'কর্মী খুঁজে পাওয়া যায়নি।' };

    const resetPass = newPassword && newPassword.trim() ? newPassword.trim() : targetEid;

    setUserCredentials((prev) => ({
      ...prev,
      [targetEid]: {
        eid: targetEid,
        passwordHash: resetPass,
        mustChangePassword: true,
        lastPasswordChangedAt: new Date().toISOString(),
      },
    }));

    addAuditLog(
      'PASSWORD_RESET',
      `কর্মকর্তার পাসওয়ার্ড রিসেট করা হয়েছে: ${emp.name} (EID: ${emp.eid})। রিসেট করেছেন: ${currentUser?.name || 'HR Admin'}। নতুন ডিফল্ট: ${resetPass}`,
      emp.eid,
      emp.name
    );

    return {
      success: true,
      message: `${emp.name} (EID: ${emp.eid})-এর পাসওয়ার্ড সফলভাবে রিসেট করা হয়েছে। (ডিফল্ট পাসওয়ার্ড: ${resetPass})`,
    };
  };

  const dismissPasswordPrompt = () => setMustChangePassword(false);

  const setCurrentUserByEid = (eid: string): boolean => {
    const found = getEmployee(eid);
    if (found) {
      setCurrentUser(found);
      addAuditLog('USER_LOGIN', `অ্যাকাউন্ট পরিবর্তন: ${found.name} (${found.designation})`, found.eid, found.name);
      return true;
    }
    return false;
  };

  const clearDemoData = (): { success: boolean; message: string } => {
    const activeStaff = employees.filter((e) => e.status !== 'resigned');

    const cleanRecords: MonthlyEmployeeKPI[] = activeStaff.map((emp) => {
      const templates = getJDTemplateForDesignation(emp.designation);
      const cleanItems = templates.map((tmpl) => ({
        taskId: tmpl.id,
        title: tmpl.title,
        description: tmpl.description,
        weight: tmpl.weight,
        target: tmpl.defaultTarget,
        achieved: 0,
        unit: tmpl.unit,
        strategicPillar: tmpl.strategicPillar,
        achievementRate: 0,
        weightedScore: 0,
        guidanceNotes: tmpl.guidanceNotes,
      }));

      const calculated = calculateKPIScores(cleanItems, emp.designation);

      return {
        id: `${emp.eid}-${systemConfig.activeMonthCode}`,
        eid: emp.eid,
        month: systemConfig.activeMonthCode,
        isTargetLocked: false,
        items: calculated.items,
        updates: [],
        finalScore: 0,
        ratingLabel: 'Needs Improvement',
        ratingColor: '#ea580c',
        automatedRecommendations: [
          'নতুন কর্মচক্র শুরু হয়েছে। অনুগ্রহ করে ১-৩ তারিখের মধ্যে টার্গেট সাবমিট করুন।',
        ],
        lastUpdatedAt: new Date().toISOString(),
      };
    });

    setKpiRecords(cleanRecords);
    setSystemConfig((prev) => ({
      ...prev,
      simulatedDay: 1,
      overrideTargetWindowOpen: false,
    }));

    addAuditLog(
      'DEMO_DATA_CLEARED',
      `এডমিন/এইচআর (${currentUser?.name}) কর্তৃক ডেমো ডাটা সাফ করা হয়েছে এবং সকল কর্মীর স্কোরকার্ড প্রস্তুত করা হয়েছে।`
    );

    return {
      success: true,
      message: 'সকল ডেমো ডাটা সাফ করা হয়েছে। দিন ১-৩ টার্গেট ইনপুট উইন্ডো সক্রিয় রয়েছে।',
    };
  };

  const resetSystemData = () => {
    localStorage.removeItem(STORAGE_KEY_KPIS);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    localStorage.removeItem(STORAGE_KEY_SESSION);
    localStorage.removeItem(STORAGE_KEY_CREDS);
    localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
    localStorage.removeItem(STORAGE_KEY_JDS);

    setEmployees(EMPLOYEES);
    setEmployeeJds({});
    setSystemConfig(DEFAULT_CONFIG);
    setKpiRecords(generateInitialKPIs(DEFAULT_CONFIG.activeMonthCode));
    setAuditLogs(INITIAL_AUDIT_LOGS);
    setUserCredentials({});
    setCurrentUser(null);
  };

  return (
    <KpiContext.Provider
      value={{
        currentUser,
        isLoggedIn: !!currentUser,
        mustChangePassword,
        login,
        logout,
        changePassword,
        resetEmployeePassword,
        dismissPasswordPrompt,
        setCurrentUserByEid,
        isUserHrOrExecutive,
        employees,
        getEmployee,
        addEmployee,
        removeEmployee,
        updateEmployee,
        employeeJds,
        uploadEmployeeJD,
        getEmployeeJD,
        kpiRecords,
        auditLogs,
        systemConfig,
        availableMonths,
        switchActiveMonth,
        advanceToNextMonth,
        autoRolledOverNotice,
        dismissAutoRolloverNotice,
        updateSystemConfig,
        updateOrgLogo,
        resetOrgLogoToDefault,
        isTargetWindowOpenForUser,
        getUserKPI,
        commitMonthlyTargets,
        addCustomKpi,
        addMainKpiItem,
        modifyEmployeeKpiItem,
        deleteEmployeeKpiItem,
        deleteEmployeeMonthKPI,
        resetEmployeeKpiToDefault,
        addProgressUpdate,
        hrUpdateEmployeeKPI,
        hrUnlockTargetWindowForEmployee,
        sendAutomatedReminders,
        getAggregatedPerformance,
        getAllEmployeesAggregatedPerformance,
        canUserAccessExecutiveReports,
        logReportPrinted,
        clearDemoData,
        resetSystemData,
      }}
    >
      {children}
    </KpiContext.Provider>
  );
};

export const useKpi = (): KpiContextType => {
  const context = useContext(KpiContext);
  if (!context) {
    throw new Error('useKpi must be used within a KpiProvider');
  }
  return context;
};
