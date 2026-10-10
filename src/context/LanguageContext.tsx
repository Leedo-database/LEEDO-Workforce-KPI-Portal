import React, { createContext, useContext, useState, useEffect } from 'react';
import { SupportedLanguage } from '../types/kpi';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  t: (key: string) => string;
}

const STORAGE_KEY_LANG = 'leedo_app_lang_v1';

const translations: Record<string, { en: string; bn: string }> = {
  // Brand & App
  appName: {
    en: 'LEEDO Workforce & KPI Appraisal System',
    bn: 'লিডো কর্মী কর্মদক্ষতা ও কেপিআই মূল্যায়ন পোর্টাল',
  },
  orgName: {
    en: 'Local Education and Economic Development Organization',
    bn: 'লোকাল এডুকেশন অ্যান্ড ইকোনমিক ডেভেলপমেন্ট অর্গানাইজেশন',
  },
  ngoBureauReg: {
    en: 'Workforce Performance Appraisal',
    bn: 'কর্মী কর্মদক্ষতা ও মূল্যায়ন সিস্টেম',
  },
  childProtection: {
    en: 'Local Education and Economic Development Organization',
    bn: 'লোকাল এডুকেশন অ্যান্ড ইকোনমিক ডেভেলপমেন্ট অর্গানাইজেশন',
  },

  // Auth & Login
  loginTitle: {
    en: 'LEEDO Staff Portal Sign In',
    bn: 'লিডো স্টাফ পোর্টাল সাইন ইন',
  },
  loginSubtitle: {
    en: 'Enter your Employee ID (EID) and password to access your JD indicators and appraisal portal.',
    bn: 'আপনার জেডি লক্ষ্যমাত্রা এবং মূল্যায়ন পোর্টালে প্রবেশের জন্য এমপ্লয়ী আইডি (EID) ও পাসওয়ার্ড দিন।',
  },
  employeeId: {
    en: 'Employee ID (EID)',
    bn: 'এমপ্লয়ী আইডি (EID)',
  },
  password: {
    en: 'Password',
    bn: 'পাসওয়ার্ড',
  },
  signIn: {
    en: 'Sign In to Portal',
    bn: 'পোর্টালে প্রবেশ করুন',
  },
  signingIn: {
    en: 'Verifying Credentials...',
    bn: 'যাচাই করা হচ্ছে...',
  },
  defaultPasswordNotice: {
    en: 'Your initial default password is your Employee ID (EID). You will be required to change your password upon first login.',
    bn: 'প্রাথমিক পাসওয়ার্ড হিসেবে আপনার EID ব্যবহার করুন। প্রথমবার প্রবেশের পরই নিজস্ব নতুন পাসওয়ার্ড সেট করতে হবে।',
  },
  quickLoginHint: {
    en: 'Quick Demo Access by Role:',
    bn: 'ভূমিকা অনুযায়ী দ্রুত ডেমো লগইন:',
  },
  logout: {
    en: 'Sign Out',
    bn: 'লগআউট',
  },
  changePassword: {
    en: 'Change Password',
    bn: 'পাসওয়ার্ড পরিবর্তন',
  },
  firstLoginPasswordTitle: {
    en: 'First Login: Secure Your Account',
    bn: 'প্রথম লগইন: আপনার পাসওয়ার্ড সুরক্ষিত করুন',
  },
  firstLoginPasswordDesc: {
    en: 'For security, please change your initial default password (EID) and set a new confidential personal password to proceed.',
    bn: 'নিরাপত্তার স্বার্থে আপনার প্রাথমিক পাসওয়ার্ড (EID) পরিবর্তন করে একটি নতুন গোপনীয় পাসওয়ার্ড সেট করে এগিয়ে যান।',
  },
  newPassword: {
    en: 'New Password',
    bn: 'নতুন পাসওয়ার্ড',
  },
  confirmPassword: {
    en: 'Confirm Password',
    bn: 'পাসওয়ার্ড নিশ্চিত করুন',
  },
  saveNewPassword: {
    en: 'Save Password & Continue',
    bn: 'পাসওয়ার্ড সংরক্ষণ করে এগিয়ে যান',
  },
  skipForNow: {
    en: 'Skip for Now',
    bn: 'আপাতত থাক',
  },
  passwordChangedSuccess: {
    en: 'Password changed successfully! Keep it confidential.',
    bn: 'পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে! এটি গোপন রাখুন।',
  },

  // Navigation
  myPortal: {
    en: 'My KPI Portal',
    bn: 'আমার কেপিআই পোর্টাল',
  },
  hrDashboard: {
    en: 'HR Monitoring Dashboard',
    bn: 'এইচআর মনিটরিং ড্যাশবোর্ড',
  },
  auditTrail: {
    en: 'Audit Trail',
    bn: 'অডিট হিস্ট্রি',
  },
  reminders: {
    en: 'Broadcast Reminders',
    bn: 'রিমাইন্ডার ও নোটিফিকেশন',
  },
  managementReports: {
    en: 'Management Reports',
    bn: 'ব্যবস্থাপনা রিপোর্ট',
  },

  // Role details & Privacy
  restrictedNotice: {
    en: 'Data Privacy Notice: You are logged into your individual workspace. You only have access to your own JD targets, updates, and appraisal report.',
    bn: 'তথ্য গোপনীয়তা সতর্কতা: আপনি আপনার ব্যক্তিগত ওয়ার্কস্পেসে লগইন আছেন। আপনি শুধুমাত্র আপনার নিজের জেডি লক্ষ্যমাত্রা, আপডেট ও মূল্যায়ন দেখতে পাবেন।',
  },
  hrAdminAccess: {
    en: 'HR & Executive Access Active',
    bn: 'এইচআর ও নির্বাহী প্রশাসনিক এক্সেস সক্রিয়',
  },

  // Targets & Rollover
  targetSetting: {
    en: 'Monthly Target Setting',
    bn: 'মাসিক লক্ষ্যমাত্রা নির্ধারণ',
  },
  targetWindowOpen: {
    en: 'Target Input Window OPEN (Day 1-3)',
    bn: 'টার্গেট ইনপুট উইন্ডো খোলা (১-৩ তারিখ)',
  },
  targetWindowClosed: {
    en: 'Target Input Window LOCKED (Days 4-31)',
    bn: 'টার্গেট ইনপুট উইন্ডো লকড (৪-৩১ তারিখ)',
  },
  commitTargets: {
    en: 'Commit & Lock Targets',
    bn: 'লক্ষ্যমাত্রা নিশ্চিত ও লক করুন',
  },
  carriedOverNotice: {
    en: 'Incomplete Task Carried Over from Previous Month',
    bn: 'পূর্ববর্তী মাসের অপূর্ণ লক্ষ্যমাত্রা স্বয়ংক্রিয় যুক্ত হয়েছে',
  },
  backlog: {
    en: 'Backlog / Rollover',
    bn: 'বকেয়া / রোলওভার',
  },

  // Custom KPI
  addCustomKpi: {
    en: '+ Add Custom Individual KPI',
    bn: '+ অতিরিক্ত ব্যক্তিগত কেপিআই যুক্ত করুন',
  },
  customKpiTitle: {
    en: 'Additional Task / Custom KPI Title',
    bn: 'অতিরিক্ত কাজ / নিজস্ব কেপিআই-এর শিরোনাম',
  },
  customKpiDesc: {
    en: 'Task Description & Objective',
    bn: 'কাজের বিস্তারিত বিবরণ ও উদ্দেশ্য',
  },
  targetValue: {
    en: 'Target',
    bn: 'লক্ষ্যমাত্রা',
  },
  unit: {
    en: 'Measurement Unit (e.g. Children, Sessions, Reports, Visits)',
    bn: 'পরিমাপ একক (যেমন: শিশু, সেশন, ফাইল, ভিজিট, সভা)',
  },
  weightPercent: {
    en: 'Weight (%)',
    bn: 'ওয়েট / গুরুত্ব (%)',
  },
  saveCustomKpi: {
    en: 'Add to My KPI Sheet',
    bn: 'আমার কেপিআই তালিকায় যুক্ত করুন',
  },

  // Updates & Proof
  logProgress: {
    en: 'Log Daily / Weekly Progress',
    bn: 'দৈনিক / সাপ্তাহিক কাজের অগ্রগতি জমা দিন',
  },
  updateType: {
    en: 'Update Frequency',
    bn: 'আপডেটের ধরন',
  },
  dailyUpdate: {
    en: 'Daily Log',
    bn: 'দৈনিক আপডেট',
  },
  weeklyUpdate: {
    en: 'Weekly Milestone Summary',
    bn: 'সাপ্তাহিক সারসংক্ষেপ',
  },
  incrementAchieved: {
    en: 'New Progress Achieved in this Entry',
    bn: 'এই এন্ট্রিতে অর্জিত নতুন অগ্রগতি',
  },
  workSummary: {
    en: 'Work Description / Field Activities',
    bn: 'কাজের বিবরণ ও মাঠপর্যায়ের কার্যক্রম',
  },
  challenges: {
    en: 'Field Challenges / Bottlenecks (Optional)',
    bn: 'মাঠপর্যায়ের প্রতিকূলতা বা চ্যালেঞ্জ (ঐচ্ছিক)',
  },
  proofUploadLabel: {
    en: 'Attach Document / Proof (Optional, Photo, Register or Document)',
    bn: 'প্রমাণপত্র বা ডকুমেন্টস সংযুক্ত করুন (ঐচ্ছিক, ছবি, রেজিস্টার বা ফাইল)',
  },
  proofOptionalNote: {
    en: 'Proof attachment is NOT mandatory. You can upload visit photos, sign sheets, vouchers, or reports if available.',
    bn: 'প্রমাণপত্র আপলোড বাধ্যতামূলক নয়। উপলব্ধ থাকলে মাঠ ভিজিটের ছবি, স্বাক্ষর শিট, ভাউচার বা রিপোর্ট যুক্ত করতে পারেন।',
  },
  submitProgress: {
    en: 'Record Progress Entry',
    bn: 'অগ্রগতি সংরক্ষণ করুন',
  },

  // Demo Data Delete (for HR & Kanta)
  clearDemoDataBtn: {
    en: 'Delete Demo Data (Start Fresh Production)',
    bn: 'ডেমো ডাটা মুছুন (ফ্রেশ প্রোডাকশন শুরু)',
  },
  clearDemoDataModalTitle: {
    en: 'Clear All Demo Data & Initialize Fresh Database',
    bn: 'সমস্ত ডেমো ডাটা মুছে ফ্রেশ ডাটাবেজ চালু করুন',
  },
  clearDemoDataDesc: {
    en: 'This action will wipe all simulated demo progress logs, reset achieved scores to 0, clear test attachments, and preserve all 55 verified staff accounts ready for live production use.',
    bn: 'এই অপশনটি সমস্ত সিমুলেটেড ডেমো অগ্রগতি এবং টেস্ট ডাটা মুছে ফেলবে এবং সমস্ত ৫৫ জন কর্মকর্তা-কর্মচারীর একাউন্ট ফ্রেশ প্রোডাকশন ব্যবহারের জন্য সম্পূর্ণ প্রস্তুত করবে।',
  },
  confirmClearDemoData: {
    en: 'Yes, Wipe Demo Data & Begin Live System',
    bn: 'হ্যাঁ, ডেমো ডাটা মুছে লাইভ সিস্টেম চালু করুন',
  },

  // Month Switcher & Controls
  monthLabel: {
    en: 'Active Evaluation Month:',
    bn: 'বর্তমান মূল্যায়ন মাস:',
  },
  startNextMonth: {
    en: '+ Advance to Next Month (Auto Rollover)',
    bn: '+ পরবর্তী মাস শুরু করুন (স্বয়ংক্রিয় বকেয়া রোলওভার)',
  },

  // Reports
  printOfficialReport: {
    en: 'Print Official Report (Ctrl+P)',
    bn: 'অফিসিয়াল রিপোর্ট প্রিন্ট করুন',
  },
  formatAppraisal: {
    en: 'Format 1: Performance Appraisal Certificate',
    bn: 'ফরম্যাট ১: মাসিক কর্মদক্ষতা মূল্যায়ন সনদ',
  },
  formatExecutiveDossier: {
    en: 'Format 2: Management & ED Briefing Dossier',
    bn: 'ফরম্যাট ২: ব্যবস্থাপনা ও নির্বাহী পরিচালক ডসিয়ার',
  },
  formatEvidenceAudit: {
    en: 'Format 3: Work Verification & Proof Audit',
    bn: 'ফরম্যাট ৩: কাজের প্রমাণ ও কার্যক্রম নিরীক্ষা রিপোর্ট',
  },
  formatDepartmentMatrix: {
    en: 'Format 4: Departmental Comparative Matrix',
    bn: 'ফরম্যাট ৪: বিভাগীয় সামগ্রিক পারফরম্যান্স টেবিল',
  },
  orientationLandscape: {
    en: 'Landscape',
    bn: 'আড়াআড়ি (ল্যান্ডস্কেপ)',
  },
  orientationPortrait: {
    en: 'Portrait',
    bn: 'লম্বালম্বি (পোর্ট্রেট)',
  },
  resetToDefaultTemplate: {
    en: 'Reset to Default Template',
    bn: 'ডিফল্ট জেডি সূচকে রিসেট করুন',
  },
  confirmDeleteIndicator: {
    en: 'Delete KPI Indicator',
    bn: 'কেপিআই সূচক অপসারণ',
  },
  changeLogo: {
    en: 'Change Logo',
    bn: 'সংস্থার লোগো পরিবর্তন',
  },
  autoLoginEnabled: {
    en: 'Auto Login Enabled',
    bn: 'অটো লগইন সক্রিয়',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    return (saved === 'bn' || saved === 'en') ? saved : 'bn'; // Default to Bangla for best user fit
  });

  const setLanguage = (lang: SupportedLanguage) => {
    setLanguageState(lang);
    localStorage.setItem(STORAGE_KEY_LANG, lang);
  };

  const t = (key: string): string => {
    const item = translations[key];
    if (!item) return key;
    return item[language] || item.en || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
