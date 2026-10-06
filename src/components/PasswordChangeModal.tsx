import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { Lock, ShieldCheck, CheckCircle2, AlertCircle, X } from 'lucide-react';

interface Props {
  eid: string;
  isFirstLogin?: boolean;
  onClose: () => void;
}

export const PasswordChangeModal: React.FC<Props> = ({ eid, isFirstLogin = false, onClose }) => {
  const { changePassword, dismissPasswordPrompt } = useKpi();
  const { language, t } = useLanguage();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!newPassword || newPassword.length < 4) {
      setErrorMsg(language === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।' : 'Password must be at least 4 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg(language === 'bn' ? 'উভয় পাসওয়ার্ডের মিল পাওয়া যায়নি।' : 'Passwords do not match.');
      return;
    }

    const res = changePassword(eid, newPassword);
    if (res.success) {
      setSuccessMsg(t('passwordChangedSuccess'));
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setErrorMsg(res.message);
    }
  };

  const handleSkip = () => {
    dismissPasswordPrompt();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-scale-in">
        {/* Header */}
        <div className="bg-gradient-to-r from-rose-600 to-rose-700 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white/20 rounded-lg">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {isFirstLogin ? t('firstLoginPasswordTitle') : t('changePassword')}
              </h3>
              <p className="text-[11px] text-rose-100 font-mono">EID: {eid}</p>
            </div>
          </div>
          {!isFirstLogin && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          <p className="text-xs text-slate-600 mb-4">
            {isFirstLogin ? t('firstLoginPasswordDesc') : (
              language === 'bn' 
                ? 'আপনার একাউন্টের গোপনীয়তা বজায় রাখতে একটি নিরাপদ পাসওয়ার্ড ব্যবহার করুন।'
                : 'Enter your new confidential password to update your login credentials.'
            )}
          </p>

          {errorMsg && (
            <div className="mb-4 bg-rose-50 border border-rose-200 rounded-lg p-3 flex items-center gap-2 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-lg p-3 flex items-center gap-2 text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('newPassword')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                {t('confirmPassword')} <span className="text-rose-500">*</span>
              </label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 font-mono"
              />
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {isFirstLogin ? (
                <button
                  type="button"
                  onClick={handleSkip}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                >
                  {t('skipForNow')}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                >
                  {language === 'bn' ? 'বাতিল' : 'Cancel'}
                </button>
              )}

              <button
                type="submit"
                className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition cursor-pointer flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                {t('saveNewPassword')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
