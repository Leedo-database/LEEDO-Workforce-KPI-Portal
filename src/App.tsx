/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { KpiProvider, useKpi } from './context/KpiContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { LoginScreen } from './components/LoginScreen';
import { PasswordChangeModal } from './components/PasswordChangeModal';
import { Header } from './components/Header';
import { EmployeePortal } from './components/EmployeePortal';
import { HrDashboard } from './components/HrDashboard';
import { RemindersView } from './components/RemindersModal';
import { AuditLogsView } from './components/AuditLogsModal';
import { PrintableReportModal } from './components/PrintableReportModal';
import { HrEditModal } from './components/HrEditModal';
import { OrgSummaryReportModal } from './components/OrgSummaryReportModal';
import { EmployeeManageModal } from './components/EmployeeManageModal';
import { LogoEditorModal } from './components/LogoEditorModal';
import { MyJdModal } from './components/MyJdModal';
import { Sidebar } from './components/Sidebar';
import { Employee } from './types/kpi';

function AppContent() {
  const { currentUser, isLoggedIn, mustChangePassword, dismissPasswordPrompt, isUserHrOrExecutive } = useKpi();
  const { language, t } = useLanguage();

  const [activeTab, setActiveTab] = useState<'my-portal' | 'hr-dashboard' | 'audit-logs' | 'reminders'>('my-portal');
  const [reportModalEid, setReportModalEid] = useState<string | null>(null);
  const [jdModalEmployee, setJdModalEmployee] = useState<Employee | null>(null);
  const [hrEditModalEid, setHrEditModalEid] = useState<string | null>(null);
  const [showOrgSummaryModal, setShowOrgSummaryModal] = useState<boolean>(false);
  const [showEmployeeManageModal, setShowEmployeeManageModal] = useState<boolean>(false);
  const [showLogoEditorModal, setShowLogoEditorModal] = useState<boolean>(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // If not logged in, render the secure LoginScreen
  if (!isLoggedIn || !currentUser) {
    return <LoginScreen />;
  }

  // Strict role boundaries: dynamically check HR/Executive position
  const isHrOrExec = isUserHrOrExecutive(currentUser);
  const currentTab = !isHrOrExec && activeTab !== 'my-portal' ? 'my-portal' : activeTab;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans text-slate-900 selection:bg-rose-500 selection:text-white">
      {/* Left-Side Dedicated Navigation Sidebar */}
      <Sidebar
        activeTab={currentTab}
        setActiveTab={setActiveTab}
        onOpenReportModal={(eid) => setReportModalEid(eid)}
        onOpenJdModal={(emp) => setJdModalEmployee(emp || currentUser)}
        onOpenOrgSummaryModal={() => setShowOrgSummaryModal(true)}
        onOpenEmployeeManageModal={() => setShowEmployeeManageModal(true)}
        onOpenLogoEditorModal={() => setShowLogoEditorModal(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* Main App Content Panel */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Global Top Bar: Authentic LEEDO Logo, Live Running Month, Today's Date & Real-Time Clock */}
        <Header
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenLogoEditorModal={() => setShowLogoEditorModal(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {currentTab === 'my-portal' && (
            <EmployeePortal
              onOpenReportModal={(eid) => setReportModalEid(eid)}
              onOpenJdModal={(emp) => setJdModalEmployee(emp || currentUser)}
            />
          )}

          {currentTab === 'hr-dashboard' && isHrOrExec && (
            <HrDashboard
              onOpenReportModal={(eid) => setReportModalEid(eid)}
              onOpenHrEditModal={(eid) => setHrEditModalEid(eid)}
              onOpenOrgSummaryModal={() => setShowOrgSummaryModal(true)}
              onOpenEmployeeManageModal={() => setShowEmployeeManageModal(true)}
              onOpenLogoEditorModal={() => setShowLogoEditorModal(true)}
            />
          )}

          {currentTab === 'reminders' && isHrOrExec && <RemindersView />}

          {currentTab === 'audit-logs' && isHrOrExec && <AuditLogsView />}
        </main>

        {/* First-login Password Change Prompt */}
        {mustChangePassword && (
          <PasswordChangeModal
            eid={currentUser.eid}
            isFirstLogin={true}
            onClose={dismissPasswordPrompt}
          />
        )}

        {/* Official Job Description Modal (Mounted at App root for clean full-page A4 printing) */}
        {jdModalEmployee && (
          <MyJdModal
            isOpen={!!jdModalEmployee}
            onClose={() => setJdModalEmployee(null)}
            employee={jdModalEmployee}
          />
        )}

        {/* Multi-Format Individual Printable Management Report Modal */}
        {reportModalEid && (
          <PrintableReportModal
            eid={reportModalEid}
            onClose={() => setReportModalEid(null)}
          />
        )}

        {/* HR Edit, Score Adjustment & JD Upload Modal */}
        {hrEditModalEid && isHrOrExec && (
          <HrEditModal
            eid={hrEditModalEid}
            onClose={() => setHrEditModalEid(null)}
          />
        )}

        {/* Organization-Wide Summary Report Modal (Forhad, Kanta & HR) */}
        {showOrgSummaryModal && (
          <OrgSummaryReportModal
            onClose={() => setShowOrgSummaryModal(false)}
            onOpenIndividualReport={(eid) => {
              setShowOrgSummaryModal(false);
              setReportModalEid(eid);
            }}
          />
        )}

        {/* Employee Management Modal (Add new staff / Exited staff) */}
        {showEmployeeManageModal && (
          <EmployeeManageModal onClose={() => setShowEmployeeManageModal(false)} />
        )}

        {/* Organization Logo & Branding Editor Modal (For HR & Executives) */}
        {showLogoEditorModal && isHrOrExec && (
          <LogoEditorModal
            isOpen={showLogoEditorModal}
            onClose={() => setShowLogoEditorModal(false)}
          />
        )}

        {/* Official Clean Footer */}
        <footer className="bg-white border-t border-slate-200 py-6 text-xs text-slate-500 print:hidden mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="font-black text-rose-600">LEEDO</span>
              <span>•</span>
              <span>Local Education and Economic Development Organization</span>
            </div>

            <div className="flex items-center gap-4 text-[11px] text-slate-400">
              <span>Peace Home, Dhaka, Bangladesh</span>
              <span>•</span>
              <span>Workforce KPI & Appraisal System</span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <LanguageProvider>
      <KpiProvider>
        <AppContent />
      </KpiProvider>
    </LanguageProvider>
  );
}
