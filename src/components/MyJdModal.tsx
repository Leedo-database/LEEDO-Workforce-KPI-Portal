import React from 'react';
import { Employee, EmployeeJD } from '../types/kpi';
import { useKpi } from '../context/KpiContext';
import { useLanguage } from '../context/LanguageContext';
import { getJDTemplateForDesignation } from '../data/jobDescriptions';
import { LeedoLogo } from './LeedoLogo';
import {
  X,
  BookOpen,
  FileText,
  Download,
  Calendar,
  Shield,
  Briefcase,
  CheckCircle2,
  Printer,
  ExternalLink,
} from 'lucide-react';

interface MyJdModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee;
}

export const MyJdModal: React.FC<MyJdModalProps> = ({ isOpen, onClose, employee }) => {
  const { getEmployeeJD, getEmployee } = useKpi();
  const { language } = useLanguage();

  if (!isOpen) return null;

  const uploadedJd: EmployeeJD | undefined = getEmployeeJD(employee.eid);
  const coreTemplates = getJDTemplateForDesignation(employee.designation);
  const supervisor = employee.supervisorEid ? getEmployee(employee.supervisorEid) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadFile = () => {
    if (!uploadedJd?.fileData) return;
    const link = document.createElement('a');
    link.href = uploadedJd.fileData;
    link.download = uploadedJd.fileName || `${employee.name}_Job_Description.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-xs overflow-y-auto print:static print:p-0 print:m-0 print:bg-white print:overflow-visible print:block print:h-auto print:w-full">
      <div className="printable-document bg-white w-full max-w-3xl my-auto max-h-[92vh] flex flex-col rounded-2xl shadow-2xl border border-slate-200 overflow-hidden text-slate-900 print:shadow-none print:border-none print:m-0 print:p-0 print:w-full print:max-w-none text-xs print:max-h-none print:overflow-visible print:block">
        {/* Header Bar */}
        <div className="shrink-0 bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between print:bg-transparent print:text-slate-900 print:border-b-2 print:border-rose-600 print:p-0 print:pb-4 avoid-break">
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-lg">
              <LeedoLogo size="md" showSubtitle={false} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white print:text-rose-700">
                  {language === 'bn' ? 'অফিসিয়াল জব ডেসক্রিপশন (JD)' : 'Official Job Description (JD)'}
                </h2>
                <span className="hidden print:inline-block text-[10px] font-bold px-2 py-0.5 bg-rose-50 text-rose-700 border border-rose-200 rounded">
                  LEEDO WORKFORCE
                </span>
              </div>
              <p className="text-xs text-slate-300 print:text-slate-600">
                Local Education and Economic Development Organization (LEEDO) • Peace Home, Dhaka
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 print:hidden">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer shadow-sm"
              title="Print official Job Description on A4 paper"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'প্রিন্ট করুন' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
              title="Close modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 overscroll-contain print:overflow-visible print:h-auto print:p-0 print:pt-4 print:space-y-4">
          {/* Employee Profile Summary Card */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 avoid-break">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee Name</span>
              <span className="font-bold text-slate-900 text-sm">{employee.name}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Employee ID</span>
              <span className="font-bold text-slate-900 font-mono">{employee.eid}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Designation</span>
              <span className="font-bold text-slate-800">{employee.designation}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Department</span>
              <span className="font-bold text-slate-800">{employee.department}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Direct Supervisor</span>
              <span className="font-medium text-slate-700">
                {supervisor ? `${supervisor.name} (${supervisor.designation})` : 'Executive Management'}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Join Date</span>
              <span className="font-medium text-slate-700 font-mono">{employee.joinDate}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Evaluation Cycle</span>
              <span className="font-medium text-slate-700">Monthly Appraisal</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">JD Status</span>
              <span className="inline-flex items-center gap-1 font-bold text-emerald-700 text-xs">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {uploadedJd ? 'Custom Signed Document' : 'Standard Assigned JD'}
              </span>
            </div>
          </div>

          {/* Uploaded Document Banner if HR has uploaded a custom PDF/Doc */}
          {uploadedJd && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 avoid-break">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 text-blue-700 rounded-lg">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 text-xs">
                    {language === 'bn' ? 'এইচআর স্বাক্ষরিত মূল নথি' : 'HR Signed Document Uploaded'}
                  </h4>
                  <p className="text-[11px] text-blue-700">
                    {uploadedJd.fileName || 'Official_Signed_Job_Description.pdf'} •{' '}
                    {language === 'bn' ? 'আপলোড তারিখ:' : 'Uploaded on:'} {new Date(uploadedJd.uploadedAt).toLocaleDateString()}
                  </p>
                  {uploadedJd.textContent && (
                    <p className="text-[11px] text-blue-600 mt-1 italic">
                      "{uploadedJd.textContent}"
                    </p>
                  )}
                </div>
              </div>

              {uploadedJd.fileData && (
                <button
                  type="button"
                  onClick={handleDownloadFile}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition cursor-pointer print:hidden shrink-0"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{language === 'bn' ? 'ডাউনলোড' : 'Download'}</span>
                </button>
              )}
            </div>
          )}

          {/* Core Roles & Responsibilities Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-2">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-600" />
                {language === 'bn' ? 'মূল দায়িত্ব ও কেপিআই কাজের পরিধি' : 'Core Key Responsibilities & Tasks'}
              </h3>
              <span className="text-[11px] text-slate-500 font-mono">
                {coreTemplates.length} {language === 'bn' ? 'টি মূল কার্যভার' : 'Core Tasks Defined'}
              </span>
            </div>

            <div className="space-y-3">
              {coreTemplates.map((task, idx) => (
                <div
                  key={task.id || idx}
                  className="p-3.5 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition avoid-break"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <h4 className="font-bold text-slate-900 text-xs sm:text-sm">
                          {task.title}
                        </h4>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-100">
                          {task.weight}% {language === 'bn' ? 'ওয়েট' : 'Weight'}
                        </span>
                      </div>
                      <p className="text-slate-600 text-xs mt-1.5 leading-relaxed">
                        {task.description}
                      </p>
                      <div className="mt-2 text-[10px] text-slate-400 font-mono">
                        Strategic Pillar: {task.strategicPillar}
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-2.5 sm:text-right text-xs shrink-0 border border-slate-200 sm:w-44">
                      <span className="text-[10px] text-slate-400 uppercase font-bold block">
                        Standard Target
                      </span>
                      <span className="font-bold font-mono text-slate-900 text-sm">
                        {task.defaultTarget} {task.unit}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        / {language === 'bn' ? 'প্রতি মাসে' : 'Month'}
                      </span>
                    </div>
                  </div>

                  {task.guidanceNotes && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-lg border border-amber-100/50">
                      💡 <strong>Guidance:</strong> {task.guidanceNotes}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Operational Governance Note */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-center text-slate-500 text-[11px] avoid-break">
            {language === 'bn'
              ? 'এই জব ডেসক্রিপশন লিডো এর অফিসিয়াল কর্মনীতি ও শিশু সুরক্ষাবিধি মোতাবেক নিয়ন্ত্রিত।'
              : 'This Job Description is officially governed under LEEDO Workforce Policies & Child Safeguarding Protocols.'}
          </div>

          {/* Official Signatures Block for A4 Print */}
          <div className="hidden print:block pt-8 mt-6 border-t-2 border-slate-300 avoid-break">
            <div className="grid grid-cols-3 gap-8 text-center text-xs">
              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-slate-900 mb-2 h-12 flex items-end justify-center font-serif text-[11px] text-slate-700 italic">
                  {employee.name}
                </div>
                <span className="font-bold text-slate-900">{language === 'bn' ? 'কর্মীর স্বাক্ষর ও তারিখ' : 'Employee Signature & Date'}</span>
                <span className="text-[10px] text-slate-500">EID: {employee.eid}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-slate-900 mb-2 h-12 flex items-end justify-center font-serif text-[11px] text-slate-700 italic">
                  {supervisor?.name || 'Department Head'}
                </div>
                <span className="font-bold text-slate-900">{language === 'bn' ? 'সুপারভাইজারের স্বাক্ষর' : 'Supervisor Signature'}</span>
                <span className="text-[10px] text-slate-500">{supervisor?.designation || 'Immediate Supervisor'}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-40 border-b border-slate-900 mb-2 h-12 flex items-end justify-center font-serif text-[11px] text-slate-700 italic">
                  Murshida Akhter Kanta
                </div>
                <span className="font-bold text-slate-900">{language === 'bn' ? 'এইচআর অনুমোদন ও সিল' : 'HR Approval & Stamp'}</span>
                <span className="text-[10px] text-slate-500">LEEDO Executive / HR Admin</span>
              </div>
            </div>

            <div className="text-center text-[10px] text-slate-400 mt-6 font-mono">
              Official Document Generated on {new Date().toLocaleDateString()} • LEEDO Workforce Performance System
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="shrink-0 bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end print:hidden">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs transition cursor-pointer"
          >
            {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
