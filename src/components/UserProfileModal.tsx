import React, { useState } from 'react';
import { Employee } from '../types/kpi';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { getEmployeeByEid } from '../data/employees';
import { PasswordChangeModal } from './PasswordChangeModal';
import {
  X,
  User,
  Building,
  Briefcase,
  Mail,
  Calendar,
  Shield,
  KeyRound,
  LogOut,
  CheckCircle,
  Clock,
  Award,
} from 'lucide-react';

interface Props {
  employee: Employee;
  onClose: () => void;
}

export const UserProfileModal: React.FC<Props> = ({ employee, onClose }) => {
  const { logout } = useKpi();
  const { language, t } = useLanguage();
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const supervisor = employee.supervisorEid ? getEmployeeByEid(employee.supervisorEid) : null;

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-scale-in">
          {/* Official LEEDO ID Card Top Header */}
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-rose-950 p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-black text-white shadow-lg border-2 border-white/20 flex-shrink-0"
                style={{ backgroundColor: employee.avatarColor }}
              >
                {employee.name
                  .split(' ')
                  .map((n) => n[0])
                  .slice(0, 2)
                  .join('')}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-500/30 text-rose-300 border border-rose-500/40">
                    EID: {employee.eid}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    {language === 'bn' ? 'সক্রিয় কর্মকর্তা' : 'Active Personnel'}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mt-1 leading-tight">{employee.name}</h3>
                <p className="text-xs text-rose-200 mt-0.5">{employee.designation}</p>
              </div>
            </div>
          </div>

          {/* Detailed Info Grid */}
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Building className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'বিভাগ (Department)' : 'Department'}
                </span>
                <p className="font-bold text-slate-800 mt-1">{employee.department}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'সিস্টেম রোল (Role Privilege)' : 'Role Privilege'}
                </span>
                <p className="font-bold text-slate-800 mt-1 capitalize">
                  {employee.role === 'hr_admin'
                    ? (language === 'bn' ? 'এইচআর ও প্রশাসন প্রধান' : 'HR & Admin Administrator')
                    : employee.role === 'executive'
                    ? (language === 'bn' ? 'নির্বাহী প্রশাসন' : 'Executive Management')
                    : employee.role === 'supervisor'
                    ? (language === 'bn' ? 'সুপারভাইজার' : 'Line Supervisor')
                    : (language === 'bn' ? 'নিয়মিত কর্মী' : 'Staff Employee')}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'অফিসিয়াল ইমেইল' : 'Official Email'}
                </span>
                <p className="font-bold text-slate-800 mt-1 font-mono truncate">{employee.email}</p>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-rose-600" />
                  {language === 'bn' ? 'যোগদানের তারিখ' : 'Date of Joining'}
                </span>
                <p className="font-bold text-slate-800 mt-1 font-mono">{employee.joinDate}</p>
              </div>
            </div>

            {/* Line Manager / Supervisor Info */}
            <div className="p-3 rounded-xl bg-rose-50/50 border border-rose-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-rose-800 tracking-wider">
                    {language === 'bn' ? 'রিপোর্টিং লাইন ম্যানেজার / সুপারভাইজার' : 'Line Manager / Supervisor'}
                  </span>
                  <p className="font-bold text-slate-800">
                    {supervisor ? `${supervisor.name} (${supervisor.designation})` : (language === 'bn' ? 'নির্বাহী পরিচালক সরাসরি' : 'Executive Director Direct')}
                  </p>
                </div>
              </div>
              {supervisor && (
                <span className="font-mono text-[10px] bg-rose-200/60 text-rose-900 px-2 py-0.5 rounded font-bold">
                  EID: {supervisor.eid}
                </span>
              )}
            </div>

            {/* Account Actions */}
            <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-center gap-3 justify-between">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-slate-300 hover:border-slate-400 text-slate-700 hover:text-slate-900 text-xs font-bold transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <KeyRound className="w-4 h-4 text-rose-600" />
                {t('changePassword')}
              </button>

              <button
                type="button"
                onClick={handleLogout}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg bg-slate-900 hover:bg-black text-white text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordChangeModal
          eid={employee.eid}
          onClose={() => setShowPasswordModal(false)}
        />
      )}
    </>
  );
};
