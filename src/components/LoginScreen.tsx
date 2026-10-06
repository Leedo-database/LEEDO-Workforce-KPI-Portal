import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { LeedoLogo } from './LeedoLogo';
import { EMPLOYEES } from '../data/employees';
import { KeyRound, User, Lock, AlertCircle, ArrowRight, ShieldCheck, HelpCircle, CheckCircle2, Globe } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useKpi();
  const { language, setLanguage, t } = useLanguage();

  const [eid, setEid] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDemoList, setShowDemoList] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eid.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে এমপ্লয়ী আইডি দিন।' : 'Please enter your Employee ID.');
      return;
    }
    if (!password.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড দিন।' : 'Please enter your password.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    setTimeout(() => {
      const result = login(eid.trim(), password.trim());
      setIsSubmitting(false);
      if (!result.success) {
        setErrorMsg(result.message);
      }
    }, 250);
  };

  const handleQuickSelect = (quickEid: string) => {
    setEid(quickEid);
    setPassword(`leedo@${quickEid}`);
    setErrorMsg(null);
  };

  const demoProfiles = [
    { eid: '1002', name: 'Murshida Akhter Kanta', role: 'Director - Admin & Finance', note: 'HR Admin & Demo Reset Rights' },
    { eid: '1001', name: 'Forhad Hossain', role: 'Founder & Executive Director', note: 'Executive Management' },
    { eid: '1057', name: 'Md. Omar Faruque', role: 'Manager - HR & Admin', note: 'HR Management' },
    { eid: '1007', name: 'Athui Marma', role: 'Monitoring Officer', note: 'Supervisor' },
    { eid: '1008', name: 'Tawhid Ahmeed', role: 'Young Volunteer (Field Staff)', note: 'Employee (Individual View Only)' },
    { eid: '1025', name: 'Md. Al Amin', role: 'Child Protection Officer', note: 'Employee (Individual View Only)' },
  ];

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Graphic */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-rose-600 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-blue-600 blur-3xl" />
      </div>

      {/* Language Switcher Bar at Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-800/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs">
        <Globe className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-slate-400 font-medium">{language === 'bn' ? 'ভাষা:' : 'Language:'}</span>
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`px-2 py-0.5 rounded text-xs font-bold transition ${
            language === 'bn' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          বাংলা
        </button>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded text-xs font-bold transition ${
            language === 'en' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          English
        </button>
      </div>

      {/* Main Container */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="flex justify-center mb-4">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-2xl border border-slate-200 inline-flex items-center justify-center">
            <LeedoLogo size="lg" showSubtitle={true} />
          </div>
        </div>

        <h2 className="text-center text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'লিডো কর্মী মূল্যায়ন পোর্টাল' : 'LEEDO Workforce KPI Portal'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          {language === 'bn' 
            ? 'লোকাল এডুকেশন অ্যান্ড ইকোনমিক ডেভেলপমেন্ট অর্গানাইজেশন' 
            : 'Local Education and Economic Development Organization'}
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        <div className="bg-white py-8 px-6 shadow-2xl rounded-2xl sm:px-10 border border-slate-200">
          <div className="border-b border-slate-100 pb-4 mb-5">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <KeyRound className="w-4 h-4 text-rose-600" />
              {t('loginTitle')}
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              {t('loginSubtitle')}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-start gap-2.5 text-xs text-rose-800 animate-fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employeeId')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={eid}
                  onChange={(e) => setEid(e.target.value)}
                  placeholder="e.g. 1002, 1008, 1057"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  {t('password')} <span className="text-rose-500">*</span>
                </label>
                <span className="text-[11px] text-slate-400">
                  {language === 'bn' ? 'ডিফল্ট: leedo@<EID>' : 'Default: leedo@<EID>'}
                </span>
              </div>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="block w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>{t('signingIn')}</span>
                ) : (
                  <>
                    <span>{t('signIn')}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Privacy & Help Note */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 sm:-mx-10 px-6 sm:px-10 pb-2 text-[11px] text-slate-500">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <p>
                {t('defaultPasswordNotice')}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Demo Accounts Selection Box */}
        <div className="mt-6 bg-slate-800/80 backdrop-blur-md rounded-xl p-4 border border-slate-700">
          <button
            type="button"
            onClick={() => setShowDemoList(!showDemoList)}
            className="w-full flex items-center justify-between text-xs font-bold text-slate-200 hover:text-white transition"
          >
            <span className="flex items-center gap-1.5 text-rose-400">
              <HelpCircle className="w-3.5 h-3.5" />
              {t('quickLoginHint')}
            </span>
            <span className="text-[11px] text-slate-400 underline">
              {showDemoList ? (language === 'bn' ? 'লুকান' : 'Hide') : (language === 'bn' ? 'অ্যাকাউন্ট তালিকা দেখুন' : 'View Accounts')}
            </span>
          </button>

          {showDemoList && (
            <div className="mt-3 space-y-2 max-h-60 overflow-y-auto pr-1">
              {demoProfiles.map((p) => (
                <button
                  key={p.eid}
                  type="button"
                  onClick={() => handleQuickSelect(p.eid)}
                  className="w-full text-left p-2 rounded-lg bg-slate-700/60 hover:bg-rose-900/40 border border-slate-600/50 hover:border-rose-500/50 transition flex items-center justify-between group cursor-pointer"
                >
                  <div>
                    <div className="text-xs font-bold text-white group-hover:text-rose-300 flex items-center gap-1.5">
                      <span className="font-mono text-rose-400 bg-slate-800 px-1.5 py-0.5 rounded text-[10px]">
                        EID: {p.eid}
                      </span>
                      <span>{p.name}</span>
                    </div>
                    <div className="text-[11px] text-slate-400">{p.role}</div>
                    <div className="text-[10px] text-amber-300/90 font-mono mt-0.5">{p.note}</div>
                  </div>
                  <span className="text-[11px] font-bold text-rose-400 group-hover:translate-x-0.5 transition flex items-center gap-1">
                    {language === 'bn' ? 'লগইন' : 'Select'}
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
