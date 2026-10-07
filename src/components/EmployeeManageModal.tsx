import React, { useState } from 'react';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { Employee, Department, UserRole } from '../types/kpi';
import {
  UserPlus,
  Users,
  UserX,
  X,
  CheckCircle2,
  AlertCircle,
  Search,
  Shield,
  Briefcase,
  Building2,
  Mail,
  Phone,
  Calendar,
  RefreshCw,
  Edit,
  KeyRound,
  Lock,
} from 'lucide-react';

interface Props {
  onClose: () => void;
}

const DEPARTMENTS: Department[] = [
  'Program & Operation',
  'Admin & Finance',
  'Executive Management',
  'Partnership & Resource Mobilization',
];

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'employee', label: 'সাধারণ কর্মী (Field/Office Employee)' },
  { value: 'supervisor', label: 'তত্ত্বাবধায়ক / সুপারভাইজার (Supervisor)' },
  { value: 'hr_admin', label: 'এইচআর ও এডমিন (HR Admin / Kanta Apa / HR Manager)' },
  { value: 'executive', label: 'নির্বাহী ব্যবস্থাপনা (Executive Director / Forhad Bhai)' },
];

const DESIGNATIONS = [
  'Street Educator',
  'Special Educator',
  'Social Mobilizer',
  'Senior Social Mibilzer (Incharge)',
  'Social Mobilizer (Incharge)',
  'Program Coordinator',
  'Monitoring Officer',
  'Documentation Coordinator',
  'Communication & Media Manager',
  'Fund Acquisition Manager',
  'Co-ordinator, Partnership',
  'Accountant',
  'Assistant Accountant',
  'Logistics Officer',
  'Psycho-social Facilitator',
  'Teacher',
  'Sewing Teacher',
  'Beautification Teacher',
  'Music Teacher',
  'ICT Instructor',
  'Cricket Coach',
  'Football Couch',
  'Assistant Home Super',
  'Mother',
  'Cook',
  'Driver',
  'Security Guard',
  'Office Assistant',
  'Young Volunteer',
];

export const EmployeeManageModal: React.FC<Props> = ({ onClose }) => {
  const { employees, addEmployee, removeEmployee, updateEmployee, resetEmployeePassword } = useKpi();
  const { language } = useLanguage();

  const [activeTab, setActiveTab] = useState<'list' | 'add'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'resigned'>('active');

  // Password Reset State
  const [resetEmpTarget, setResetEmpTarget] = useState<Employee | null>(null);
  const [newResetPassword, setNewResetPassword] = useState<string>('');
  const [resetSuccessNotice, setResetSuccessNotice] = useState<string | null>(null);

  // New Employee Form State
  const maxEid = Math.max(
    ...employees.map((e) => parseInt(e.eid, 10)).filter((n) => !isNaN(n)),
    1097
  );
  const [newEid, setNewEid] = useState<string>(String(maxEid + 1));
  const [name, setName] = useState('');
  const [designation, setDesignation] = useState('Street Educator');
  const [customDesignation, setCustomDesignation] = useState('');
  const [department, setDepartment] = useState<Department>('Program & Operation');
  const [role, setRole] = useState<UserRole>('employee');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [joinDate, setJoinDate] = useState('2026-09-01');
  const [supervisorEid, setSupervisorEid] = useState('1013');

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const filteredEmployees = employees.filter((emp) => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      emp.name.toLowerCase().includes(q) ||
      emp.eid.toLowerCase().includes(q) ||
      emp.designation.toLowerCase().includes(q) ||
      emp.department.toLowerCase().includes(q);

    if (!matchSearch) return false;

    if (statusFilter === 'active') return emp.status !== 'resigned' && emp.status !== 'inactive';
    if (statusFilter === 'resigned') return emp.status === 'resigned' || emp.status === 'inactive';
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFeedback({ type: 'error', message: 'কর্মকর্তার পুরো নাম দিন।' });
      return;
    }
    if (!newEid.trim()) {
      setFeedback({ type: 'error', message: 'এমপ্লয়ী আইডি দিন।' });
      return;
    }

    const finalDesignation = designation === 'OTHER' ? customDesignation.trim() : designation;

    const res = addEmployee({
      eid: newEid.trim(),
      name: name.trim(),
      designation: finalDesignation || 'Field Officer',
      department,
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '')}@leedobd.org`,
      phone: phone.trim() || undefined,
      role,
      joinDate,
      supervisorEid: supervisorEid || undefined,
      avatarColor: '#e11d48',
      status: 'active',
    });

    if (res.success) {
      setFeedback({ type: 'success', message: res.message });
      // Reset form
      setName('');
      setNewEid(String(parseInt(newEid, 10) + 1));
      setEmail('');
      setPhone('');
      setTimeout(() => {
        setActiveTab('list');
        setFeedback(null);
      }, 1500);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  const handleDeactivate = (eid: string, empName: string) => {
    const reason = window.prompt(
      `কর্মী "${empName}" (EID: ${eid})-কে তালিকা থেকে বাদ বা অব্যাহতি দেওয়ার কারণ লিখুন:`,
      'Resigned / Left organization'
    );
    if (reason && reason.trim()) {
      const res = removeEmployee(eid, reason.trim());
      setFeedback({ type: res.success ? 'success' : 'error', message: res.message });
    }
  };

  const handleReactivate = (eid: string, empName: string) => {
    const confirm = window.confirm(`কর্মী "${empName}" (EID: ${eid})-কে পুনরায় সক্রিয় করতে চান?`);
    if (confirm) {
      const res = updateEmployee(eid, { status: 'active' });
      setFeedback({ type: res.success ? 'success' : 'error', message: `কর্মী ${empName} সফলভাবে পুনর্বহাল হয়েছেন।` });
    }
  };

  const handleConfirmPasswordReset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmpTarget) return;
    const res = resetEmployeePassword(resetEmpTarget.eid, newResetPassword);
    if (res.success) {
      setResetSuccessNotice(res.message);
      setFeedback({ type: 'success', message: res.message });
      setTimeout(() => {
        setResetEmpTarget(null);
        setResetSuccessNotice(null);
      }, 1800);
    } else {
      setFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-slate-950/80 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200 my-auto animate-in zoom-in-95 duration-150 text-xs">
        {/* Header */}
        <div className="shrink-0 bg-gradient-to-r from-rose-700 via-rose-600 to-rose-800 px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">
                {language === 'bn' ? 'কর্মী ব্যবস্থাপনা পোর্টাল (HR & Kanta Apa Access)' : 'Employee Directory & Staff Management'}
              </h3>
              <p className="text-[11px] text-rose-100">
                {language === 'bn'
                  ? 'নতুন কর্মী এন্ট্রি ও কর্মী অব্যাহতি/বাদ দেওয়ার প্রশাসনিক ক্ষমতা'
                  : 'Add new staff entries or mark exited employees'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-white/10 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab('list');
              setFeedback(null);
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'list'
                ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-px'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'bn' ? `সকল কর্মী তালিকা (${employees.length})` : `Staff Directory (${employees.length})`}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('add');
              setFeedback(null);
            }}
            className={`px-4 py-2 font-bold text-xs rounded-t-xl transition cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'add'
                ? 'bg-white text-rose-700 border-t border-x border-slate-200 -mb-px'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>{language === 'bn' ? '+ নতুন কর্মী নিয়োগ এন্ট্রি' : '+ Add New Employee'}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedback && (
          <div
            className={`m-6 mb-0 p-3 rounded-xl border flex items-start gap-2 text-xs ${
              feedback.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : 'bg-rose-50 border-rose-200 text-rose-800'
            }`}
          >
            {feedback.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            )}
            <span className="font-semibold">{feedback.message}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 overscroll-contain">
          {/* TAB 1: LIST EMPLOYEES */}
          {activeTab === 'list' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative flex-1 min-w-[200px]">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder={language === 'bn' ? 'নাম, পদবি বা আইডি খুঁজুন...' : 'Search by name, role, EID...'}
                    className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setStatusFilter('active')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      statusFilter === 'active' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-600'
                    }`}
                  >
                    {language === 'bn' ? 'কর্মরত কর্মী' : 'Active Staff'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('resigned')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      statusFilter === 'resigned' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-600'
                    }`}
                  >
                    {language === 'bn' ? 'অব্যাহতিপ্রাপ্ত / সাবেক' : 'Exited Staff'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setStatusFilter('all')}
                    className={`px-2.5 py-1 rounded text-[11px] font-bold transition cursor-pointer ${
                      statusFilter === 'all' ? 'bg-white shadow-xs text-rose-700' : 'text-slate-600'
                    }`}
                  >
                    {language === 'bn' ? 'সকল' : 'All'}
                  </button>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-[420px] overflow-y-auto">
                <table className="w-full border-collapse text-left">
                  <thead className="bg-slate-100 text-slate-700 sticky top-0 font-bold border-b border-slate-200">
                    <tr>
                      <th className="py-2.5 px-3 w-16">EID</th>
                      <th className="py-2.5 px-3">নাম ও পদবি</th>
                      <th className="py-2.5 px-3">বিভাগ</th>
                      <th className="py-2.5 px-3">যোগদান তারিখ</th>
                      <th className="py-2.5 px-3">স্থিতি</th>
                      <th className="py-2.5 px-3 text-right">পদক্ষেপ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredEmployees.map((emp) => {
                      const isResigned = emp.status === 'resigned' || emp.status === 'inactive';
                      return (
                        <tr key={emp.eid} className="hover:bg-slate-50 transition">
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-800">
                            {emp.eid}
                          </td>
                          <td className="py-2.5 px-3">
                            <div className="font-bold text-slate-900">{emp.name}</div>
                            <div className="text-[10px] text-slate-500">{emp.designation}</div>
                          </td>
                          <td className="py-2.5 px-3 text-slate-700">{emp.department}</td>
                          <td className="py-2.5 px-3 text-slate-500 font-mono text-[10px]">
                            {emp.joinDate}
                          </td>
                          <td className="py-2.5 px-3">
                            <span
                              className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                                isResigned
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                              }`}
                            >
                              {isResigned ? (language === 'bn' ? 'অব্যাহতিপ্রাপ্ত' : 'Exited') : (language === 'bn' ? 'সক্রিয়' : 'Active')}
                            </span>
                          </td>
                          <td className="py-2.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Password Reset Action Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setResetEmpTarget(emp);
                                  setNewResetPassword(emp.eid);
                                  setResetSuccessNotice(null);
                                }}
                                className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 rounded font-bold text-[10px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                title={language === 'bn' ? 'পাসওয়ার্ড রিসেট করুন' : 'Reset Employee Password'}
                              >
                                <KeyRound className="w-3 h-3 text-amber-600" />
                                <span>{language === 'bn' ? 'পাসওয়ার্ড রিসেট' : 'Reset Pass'}</span>
                              </button>

                              {isResigned ? (
                                <button
                                  type="button"
                                  onClick={() => handleReactivate(emp.eid, emp.name)}
                                  className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded font-bold text-[10px] transition cursor-pointer"
                                >
                                  {language === 'bn' ? 'পুনর্বহাল' : 'Reactivate'}
                                </button>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleDeactivate(emp.eid, emp.name)}
                                  className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded font-bold text-[10px] transition cursor-pointer"
                                  title="Mark employee as exited / resigned"
                                >
                                  {language === 'bn' ? 'অব্যাহতি / বাদ' : 'Exit / Remove'}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: ADD NEW EMPLOYEE */}
          {activeTab === 'add' && (
            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    এমপ্লয়ী আইডি (EID) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={newEid}
                    onChange={(e) => setNewEid(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-rose-700 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="e.g. 1098"
                  />
                  <span className="text-[10px] text-slate-400">স্বয়ংক্রিয় পরবর্তী আইডি প্রস্তাবিত</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    কর্মকর্তার পুরো নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    placeholder="e.g. Md. Shahidul Islam"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    পদবি (Designation) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {DESIGNATIONS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                    <option value="OTHER">অন্যান্য / নতুন পদবি লিখুন...</option>
                  </select>

                  {designation === 'OTHER' && (
                    <input
                      type="text"
                      required
                      value={customDesignation}
                      onChange={(e) => setCustomDesignation(e.target.value)}
                      placeholder="নতুন পদবির নাম লিখুন..."
                      className="mt-2 w-full px-3 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    বিভাগ (Department) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={department}
                    onChange={(e) => setDepartment(e.target.value as Department)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ভূমিকা ও একসেস লেভেল (Role) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {ROLES.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    যোগদানের তারিখ (Join Date)
                  </label>
                  <input
                    type="date"
                    value={joinDate}
                    onChange={(e) => setJoinDate(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    অফিসিয়াল ইমেইল
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. shahidul.field@leedobd.org"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    মোবাইল নম্বর
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="e.g. 01700-000000"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs font-mono focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  তত্ত্বাবধায়ক / সুপারভাইজার
                </label>
                <select
                  value={supervisorEid}
                  onChange={(e) => setSupervisorEid(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs bg-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                >
                  <option value="1001">Forhad Hossain (Founder & ED - 1001)</option>
                  <option value="1002">Murshida Akhter Kanta (Director Admin & Finance - 1002)</option>
                  <option value="1013">Md. Sohel Rana (Manager - 1013)</option>
                  <option value="1057">Md. Omar Faruque (Manager HR & Admin - 1057)</option>
                  <option value="1075">Farhana Akter (Program Coordinator - 1075)</option>
                  <option value="1023">Md. Masud (Social Mobilizer Incharge - 1023)</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('list')}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition cursor-pointer"
                >
                  বাতিল
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>কর্মী নিয়োগ সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Password Reset Prompt Modal (for HR / Kanta) */}
      {resetEmpTarget && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 animate-in zoom-in-95 text-slate-900">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
                <KeyRound className="w-4 h-4 text-rose-600" />
                <span>{language === 'bn' ? 'কর্মকর্তার পাসওয়ার্ড রিসেট' : 'Reset Staff Password'}</span>
              </div>
              <button
                type="button"
                onClick={() => setResetEmpTarget(null)}
                className="text-slate-400 hover:text-slate-700 p-1 rounded-lg cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {resetSuccessNotice ? (
              <div className="my-4 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <div>
                  <div className="font-bold">{language === 'bn' ? 'পাসওয়ার্ড রিসেট সফল হয়েছে!' : 'Password Reset Successful!'}</div>
                  <div className="text-[11px] mt-0.5">{resetSuccessNotice}</div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleConfirmPasswordReset} className="mt-4 space-y-4 text-xs">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-slate-700">
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">কর্মকর্তার নাম:</span>
                    <span className="font-bold text-slate-900">{resetEmpTarget.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">এমপ্লয়ী আইডি (EID):</span>
                    <span className="font-mono font-bold text-rose-600">{resetEmpTarget.eid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400 font-bold uppercase text-[10px]">পদবি:</span>
                    <span className="font-medium text-slate-800">{resetEmpTarget.designation}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">
                    {language === 'bn' ? 'নতুন পাসওয়ার্ড নির্ধারণ করুন:' : 'Set New Password:'}
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      required
                      value={newResetPassword}
                      onChange={(e) => setNewResetPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-2 focus:ring-rose-500 focus:outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-slate-500 mt-1">
                    {language === 'bn'
                      ? 'ডিফল্ট পাসওয়ার্ড: কর্মীর EID। রিসেটের পর কর্মী লগইন করলে নিজের নতুন পাসওয়ার্ড পরিবর্তনের সুযোগ পাবেন।'
                      : 'Default: Employee EID. The staff will be prompted to set their custom password on next login.'}
                  </p>
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setResetEmpTarget(null)}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 font-semibold cursor-pointer"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <KeyRound className="w-3.5 h-3.5" />
                    <span>{language === 'bn' ? 'রিসেট নিশ্চিত করুন' : 'Confirm Reset'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
