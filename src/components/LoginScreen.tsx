import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { LeedoLogo } from './LeedoLogo';
import { KeyRound, User, Lock, AlertCircle, ArrowRight, ShieldCheck, Globe } from 'lucide-react';

export const LoginScreen: React.FC = () => {
  const { login } = useKpi();
  const { language, setLanguage, t } = useLanguage();

  const [eid, setEid] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eid.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে এমপ্লয়ী আইডি (EID) লিখুন।' : 'Please enter your Employee ID (EID).');
      return;
    }
    if (!password.trim()) {
      setErrorMsg(language === 'bn' ? 'অনুগ্রহ করে পাসওয়ার্ড লিখুন।' : 'Please enter your password.');
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
    }, 200);
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decorative Gradient Atmosphere */}
      <div className="absolute inset-0 opacity-15 pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-rose-600 blur-3xl" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 rounded-full bg-rose-800 blur-3xl" />
      </div>

      {/* Language Switcher Bar at Top Right */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-2 bg-slate-800/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-700 text-xs shadow-lg">
        <Globe className="w-3.5 h-3.5 text-rose-400" />
        <span className="text-slate-400 font-medium">{language === 'bn' ? 'ভাষা:' : 'Language:'}</span>
        <button
          type="button"
          onClick={() => setLanguage('bn')}
          className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer ${
            language === 'bn' ? 'bg-rose-600 text-white shadow-sm' : 'text-slate-300 hover:text-white'
          }`}
        >
          বাংলা
        </button>
        <span className="text-slate-600">|</span>
        <button
          type="button"
          onClick={() => setLanguage('en')}
          className={`px-2 py-0.5 rounded text-xs font-bold transition cursor-pointer ${
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
            <LeedoLogo size="lg" showSubtitle={true} bilingualSubtitle={true} />
          </div>
        </div>

        <h2 className="text-center text-2xl font-black text-white tracking-tight">
          {language === 'bn' ? 'লিডো কর্মী কর্মদক্ষতা ও মূল্যায়ন পোর্টাল' : 'LEEDO Workforce KPI Portal'}
        </h2>
        <p className="mt-1 text-center text-xs text-slate-400">
          Local Education and Economic Development Organization (LEEDO)
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
              {language === 'bn'
                ? 'পোর্টালে প্রবেশ করতে আপনার এমপ্লয়ী আইডি (EID) এবং পাসওয়ার্ড লিখুন।'
                : 'Enter your Employee ID (EID) and password to access the portal.'}
            </p>
          </div>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('employeeId')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={eid}
                  onChange={(e) => setEid(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার EID (যেমন: 1002)' : 'Enter your EID'}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('password')} <span className="text-rose-500">*</span>
              </label>
              <div className="relative rounded-lg shadow-2xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={language === 'bn' ? 'আপনার পাসওয়ার্ড' : 'Enter your password'}
                  className="block w-full pl-9 pr-3 py-2.5 border border-slate-300 rounded-xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex justify-center items-center gap-2 py-2.5 px-4 rounded-xl shadow-md text-sm font-bold text-white bg-rose-600 hover:bg-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-rose-500 transition disabled:opacity-50 cursor-pointer"
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

          {/* Clean Guidance Notice */}
          <div className="mt-5 pt-4 border-t border-slate-100 bg-slate-50 -mx-6 sm:-mx-10 px-6 sm:px-10 pb-2 text-[11px] text-slate-500">
            <div className="flex items-start gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <p>
                {language === 'bn'
                  ? 'প্রাথমিক পাসওয়ার্ড হিসেবে আপনার EID ব্যবহার করুন। প্রথমবার প্রবেশের পরই নিজস্ব নতুন পাসওয়ার্ড সেট করতে হবে।'
                  : 'Your initial default password is your EID. You will be required to set a new personal password upon first login.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
