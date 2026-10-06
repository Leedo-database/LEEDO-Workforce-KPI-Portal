import { JDTaskTemplate } from '../types/kpi';

export const JD_TEMPLATES_BY_DESIGNATION: Record<string, JDTaskTemplate[]> = {
  'Founder & ED': [
    {
      id: 'ed-01',
      designation: 'Founder & ED',
      title: 'Strategic NGO Leadership & Vision Execution',
      description: 'Lead organization vision, strategic child-welfare policies, government liaison, and annual operational oversight.',
      weight: 30,
      unit: 'Milestones Completed',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Review board governance, statutory filings, and overall programmatic progress.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Strengthen weekly management review meetings and accelerate strategic priority execution.',
      excellenceRecommendation: 'Exemplary leadership; recommend sharing best practice models at national child-welfare summits.'
    },
    {
      id: 'ed-02',
      designation: 'Founder & ED',
      title: 'Donor Engagement & High-Level Partnership Mobilization',
      description: 'Engage bilateral/multilateral donors, diplomatic missions, and major philanthropic partners to ensure NGO sustainability.',
      weight: 30,
      unit: 'Strategic Engagements',
      defaultTarget: 6,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Document high-impact meetings, institutional pitches, and signed MoUs.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Re-align fundraising pipeline with international humanitarian aid opportunities and corporate CSR.',
      excellenceRecommendation: 'Outstanding donor acquisition; recommend expanding multi-year institutional grant contracts.'
    },
    {
      id: 'ed-03',
      designation: 'Founder & ED',
      title: 'Child Safeguarding & Policy Compliance Oversight',
      description: 'Enforce stringent zero-tolerance child protection policies across all street centers and transit shelters.',
      weight: 20,
      unit: 'Center Compliance Audits',
      defaultTarget: 4,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Conduct surprise visits and review safeguarding incident resolution reports.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Mandate immediate safeguarding compliance refresher for all supervisory staff.',
      excellenceRecommendation: 'Uncompromising standard in child safeguarding; benchmarked as organizational gold standard.'
    },
    {
      id: 'ed-04',
      designation: 'Founder & ED',
      title: 'Executive Financial Health & Audit Transparency',
      description: 'Oversee financial audits, donor grant compliance, and fiscal sustainability.',
      weight: 20,
      unit: 'Financial Reviews',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Verify monthly budget burn rates and statutory NGO affairs bureau filings.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Conduct in-depth variance analysis with Finance Director to eliminate budget bottlenecks.',
      excellenceRecommendation: 'Superb financial stewardship and transparent donor governance.'
    }
  ],

  'Director - Admin & Finance': [
    {
      id: 'dir-af-01',
      designation: 'Director - Admin & Finance',
      title: 'Financial Governance, Grant Budgeting & Statutory Compliance',
      description: 'Manage donor fund accounting, monthly variance tracking, NGO Affairs Bureau compliance, and statutory filings.',
      weight: 35,
      unit: 'Financial Reports/Audits',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure 100% voucher transparency and timely donor financial statement releases.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Strengthen weekly budget burn-rate reconciliation and close outstanding voucher variances.',
      excellenceRecommendation: 'Flawless fiscal management and pristine donor audit compliance.'
    },
    {
      id: 'dir-af-02',
      designation: 'Director - Admin & Finance',
      title: 'HR Operations, Staff Welfare & Regulatory Adherence',
      description: 'Supervise HR policies, statutory staff benefits, performance review cycles, and workforce dispute resolutions.',
      weight: 25,
      unit: 'HR Cycle Verifications',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Monitor 100% staff payroll clearance and grievance resolution records.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Implement structured supervisory coaching and streamline HR documentation timelines.',
      excellenceRecommendation: 'Outstanding workforce leadership and employee satisfaction scores.'
    },
    {
      id: 'dir-af-03',
      designation: 'Director - Admin & Finance',
      title: 'Procurement Integrity, Asset Management & Logistics Oversight',
      description: 'Oversee central procurement committee, inventory audits, vehicle logistics, and facility safety maintenance.',
      weight: 20,
      unit: 'Procurement Reviews',
      defaultTarget: 6,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Audit purchase requisitions, competitive quotations, and asset register reconciliations.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Tighten competitive bidding oversight and accelerate supplier delivery turnaround.',
      excellenceRecommendation: 'Exceptional cost savings achieved through strategic vendor negotiations.'
    },
    {
      id: 'dir-af-04',
      designation: 'Director - Admin & Finance',
      title: 'Administrative Operational Efficiency & Risk Mitigation',
      description: 'Ensure institutional continuity, insurance coverage, center lease agreements, and emergency readiness.',
      weight: 20,
      unit: 'Operational Reviews',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Quarterly review of physical security, IT data backups, and vendor contracts.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Update risk mitigation contingency plans for shelter facilities and fleet management.',
      excellenceRecommendation: 'High operational resilience and seamless administrative workflow.'
    }
  ],

  'Manager HR & Admin': [
    {
      id: 'hr-01',
      designation: 'Manager HR & Admin',
      title: 'Staff Performance Management & KPI Evaluation Cycles',
      description: 'Facilitate monthly KPI setting, progress monitoring, reminder dispatch, and appraisal compilation across 55 staff.',
      weight: 30,
      unit: 'Appraisal Reviews Completed',
      defaultTarget: 55,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure 100% on-time target submission within the first 3 days and month-end report generation.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Automate escalation notices to department heads for pending performance reviews.',
      excellenceRecommendation: 'Exemplary HR governance; 100% timely appraisal submission achieved across all departments.'
    },
    {
      id: 'hr-02',
      designation: 'Manager HR & Admin',
      title: 'Staff Recruitment, Induction & Capacity Building Workshops',
      description: 'Conduct hiring, onboarding, child safeguarding orientations, and pedagogical training coordination.',
      weight: 25,
      unit: 'Sessions/Workshops',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure all new recruits complete mandatory child protection & code of conduct training.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Formulate specialized field training for street educators and shelter caregivers.',
      excellenceRecommendation: 'Outstanding capacity enhancement programs recognized across field teams.'
    },
    {
      id: 'hr-03',
      designation: 'Manager HR & Admin',
      title: 'Attendance, Leave Governance & Payroll Verification',
      description: 'Maintain staff biometric/register logs, leave records, disciplinary actions, and payroll inputs.',
      weight: 25,
      unit: 'Monthly Audit Cycles',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Verify zero discrepancies between biometric attendance and monthly salary disbursement sheets.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Address field educator attendance irregularities through digital check-in audits.',
      excellenceRecommendation: 'Pristine leave and attendance records with zero audit discrepancies.'
    },
    {
      id: 'hr-04',
      designation: 'Manager HR & Admin',
      title: 'Office Administration, Facility Safety & System Logs Governance',
      description: 'Manage head office operations, utility bills, system audit logs, and security protocols.',
      weight: 20,
      unit: 'Inspection Checks',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Audit daily log entries, facility maintenance registers, and visitor protocols.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Enforce weekly facility audit checklists and inspect safety equipment.',
      excellenceRecommendation: 'Top-tier administrative support and prompt facilities maintenance.'
    }
  ],

  'Accountant': [
    {
      id: 'acc-01',
      designation: 'Accountant',
      title: 'Voucher Verification, Journal Entries & Ledger Maintenance',
      description: 'Verify field vouchers against procurement policies, record ledger entries, and prepare bank reconciliations.',
      weight: 30,
      unit: 'Vouchers Processed',
      defaultTarget: 120,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Verify supporting receipts, budget head codes, and supervisor approvals for all payments.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Schedule dedicated field voucher collection days to avoid month-end backlogs.',
      excellenceRecommendation: 'Meticulous ledger precision; zero posting errors detected in monthly verification.'
    },
    {
      id: 'acc-02',
      designation: 'Accountant',
      title: 'Donor Grant Budget Tracking & Financial Statements',
      description: 'Prepare project-wise income/expenditure statements, burn-rate analyses, and donor financial reports.',
      weight: 30,
      unit: 'Project Reports Prepared',
      defaultTarget: 6,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Flag any budget lines nearing 90% threshold for proactive grant management.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Enhance monthly coordination with Project Managers to forecast spending accurately.',
      excellenceRecommendation: 'Commended for on-time, transparent financial reporting to international partners.'
    },
    {
      id: 'acc-03',
      designation: 'Accountant',
      title: 'Payroll Disbursement, Tax Deduction & Statutory Filing',
      description: 'Compute monthly salary sheets, staff tax deductions, provident funds, and statutory banking transfers.',
      weight: 25,
      unit: 'Disbursement Cycles',
      defaultTarget: 2,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure staff receive salaries by the 1st of every month without exception.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Initiate bank transfer paperwork 3 days earlier to safeguard salary timelines.',
      excellenceRecommendation: '100% on-time payroll delivery with perfect tax compliance.'
    },
    {
      id: 'acc-04',
      designation: 'Accountant',
      title: 'Petty Cash Auditing & Internal Financial Controls',
      description: 'Reconcile shelter petty cash, fuel accounts, and conduct surprise cash counts at center offices.',
      weight: 15,
      unit: 'Cash Count Reconciliations',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Inspect physical cash in hand against log entries.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Conduct surprise physical cash audits twice monthly at all shelter units.',
      excellenceRecommendation: 'Impeccable cash custody and rigorous voucher compliance.'
    }
  ],

  'Assistant Accountant': [
    {
      id: 'asst-acc-01',
      designation: 'Assistant Accountant',
      title: 'Field Expense Bills & Voucher Entry Support',
      description: 'Check receipt validity, tax calculations, and input daily financial entries into the accounting software.',
      weight: 35,
      unit: 'Vouchers Keyed',
      defaultTarget: 100,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Scrutinize receipts for authentic supplier seals and tax withholding certificates.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Provide orientation to field staff on compliant receipt documentation.',
      excellenceRecommendation: 'Rapid voucher turnover and zero data-entry backlog.'
    },
    {
      id: 'asst-acc-02',
      designation: 'Assistant Accountant',
      title: 'Shelter Center Ration & Utility Bills Audit',
      description: 'Audit monthly food rations, electricity, water, and fuel bills for all transitional homes.',
      weight: 30,
      unit: 'Bills Audited',
      defaultTarget: 20,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Cross-check utility meter readings and food consumption registers.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Create consumption benchmark charts to detect utility and food ration anomalies.',
      excellenceRecommendation: 'High diligence in catching billing discrepancies and conserving NGO resources.'
    },
    {
      id: 'asst-acc-03',
      designation: 'Assistant Accountant',
      title: 'Physical Voucher Archiving & Audit Preparation',
      description: 'Maintain structured physical and digital files for annual external NGO bureau audits.',
      weight: 20,
      unit: 'Files Archived',
      defaultTarget: 12,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Organize files chronologically with stamped audit reference numbers.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Standardize folder index labels for swift audit retrieval.',
      excellenceRecommendation: 'Audit-ready archives praised during annual regulatory inspection.'
    },
    {
      id: 'asst-acc-04',
      designation: 'Assistant Accountant',
      title: 'Banking Transactions & Treasury Errands',
      description: 'Submit bank transfers, collect statements, and deposit donor cheques safely.',
      weight: 15,
      unit: 'Banking Visits',
      defaultTarget: 10,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Retain stamped deposit slips and bank counterfoils securely.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Confirm real-time deposit confirmations with Chief Accountant.',
      excellenceRecommendation: 'Reliable and safe handling of all treasury operations.'
    }
  ],

  'Monitoring Officer': [
    {
      id: 'me-01',
      designation: 'Monitoring Officer',
      title: 'Field Project Monitoring & Activity Verification Visits',
      description: 'Conduct on-site inspections of street school sessions, transit shelters, and vocational workshops.',
      weight: 35,
      unit: 'Field Verification Visits',
      defaultTarget: 16,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Validate actual child attendance figures versus reported register numbers.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Increase random unscheduled monitoring visits across peak night street school hours.',
      excellenceRecommendation: 'Meticulous field verification maintaining data integrity across the NGO.'
    },
    {
      id: 'me-02',
      designation: 'Monitoring Officer',
      title: 'M&E Indicator Tracking & Logframe Compliance',
      description: 'Update project indicator dashboards against donor logframes and highlight implementation lags.',
      weight: 30,
      unit: 'Indicator Matrix Updates',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Track key performance indicators (KPIs) against baseline and milestone commitments.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Organize monthly M&E feedback sessions with field supervisors.',
      excellenceRecommendation: 'Superior quantitative analytics enabling proactive project corrections.'
    },
    {
      id: 'me-03',
      designation: 'Monitoring Officer',
      title: 'Beneficiary Case Story Validation & Impact Surveys',
      description: 'Verify rescued children case files, family reintegration reports, and conduct satisfaction surveys.',
      weight: 20,
      unit: 'Case Verifications',
      defaultTarget: 10,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Audit 10 random case files monthly for complete documentation and consent forms.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Implement standardized child interview protocols for ethical data collection.',
      excellenceRecommendation: 'Rich qualitative evaluations highlighting transformational child rescue stories.'
    },
    {
      id: 'me-04',
      designation: 'Monitoring Officer',
      title: 'M&E Monthly Reporting & Corrective Recommendations',
      description: 'Compile monthly comprehensive monitoring report highlighting risks, bottlenecks, and solutions for ED.',
      weight: 15,
      unit: 'Reports Generated',
      defaultTarget: 2,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Submit reports with actionable recommendation matrices and deadlines.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Ensure monitoring reports provide specific remedial timelines for underperforming centers.',
      excellenceRecommendation: 'Highly actionable M&E insights praised by executive leadership.'
    }
  ],

  'Manager': [
    {
      id: 'mgr-01',
      designation: 'Manager',
      title: 'Program Execution & Field Operations Leadership',
      description: 'Supervise daily street education, child protection rescues, and center operations across Dhaka zones.',
      weight: 30,
      unit: 'Supervisory Reviews',
      defaultTarget: 20,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Lead weekly operations coordination and ensure high morale among field teams.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Strengthen daily morning briefs with field mobilizers to clarify hotspot targets.',
      excellenceRecommendation: 'Dynamic operational leadership delivering steady growth in rescued children.'
    },
    {
      id: 'mgr-02',
      designation: 'Manager',
      title: 'Street Outreach Coordination & Child Rescue Operations',
      description: 'Coordinate emergency night rescue drives at railway stations, launch terminals, and bus depots.',
      weight: 30,
      unit: 'Rescue Drives Coordinated',
      defaultTarget: 8,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Prioritize vulnerable runaway children, street babies, and victims of abuse.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Enhance liaison with railway police and station child-help desks.',
      excellenceRecommendation: 'Heroic emergency response that secured safe shelter for numerous vulnerable youth.'
    },
    {
      id: 'mgr-03',
      designation: 'Manager',
      title: 'Stakeholder & Local Authority Liaison',
      description: 'Liaise with Department of Social Services (DSS), Child Protection Committees, police stations, and local ward councilors.',
      weight: 20,
      unit: 'Stakeholder Meetings',
      defaultTarget: 6,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Maintain active contact lists and resolve jurisdiction challenges smoothly.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Establish formal quarterly coordination meetings with local station masters and ward authorities.',
      excellenceRecommendation: 'Exceptional diplomatic coordination securing local government trust.'
    },
    {
      id: 'mgr-04',
      designation: 'Manager',
      title: 'Field Safety Protocols & Crisis Management',
      description: 'Enforce team security during night patrols, medical emergencies, and legal child custody procedures.',
      weight: 20,
      unit: 'Crisis Drills/Reviews',
      defaultTarget: 4,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Review SOS communication channels and first-response transport readiness.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Conduct mandatory safety drills for night educators operating in high-risk zones.',
      excellenceRecommendation: 'Flawless safety record maintained during intensive night rescue missions.'
    }
  ],

  'Program Coordinator': [
    {
      id: 'coord-01',
      designation: 'Program Coordinator',
      title: 'Project Milestone Delivery & Curriculum Supervision',
      description: 'Ensure non-formal curriculum delivery, teacher training schedules, and quarterly milestone adherence.',
      weight: 35,
      unit: 'Curriculum Cycles Delivered',
      defaultTarget: 4,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Coordinate lesson plans and teaching aids for street educators and vocational teachers.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Institute bi-weekly pedagogical refresher sessions for street educators.',
      excellenceRecommendation: 'Innovative interactive street curriculum resulting in 95% student retention.'
    },
    {
      id: 'coord-02',
      designation: 'Program Coordinator',
      title: 'Educator Mentoring & Teaching Quality Appraisals',
      description: 'Observe classroom and street teaching sessions, provide constructive coaching, and evaluate student progress.',
      weight: 25,
      unit: 'Teacher Observations',
      defaultTarget: 14,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Assess child-centered teaching methodologies and positive reinforcement techniques.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Provide specialized training in trauma-informed pedagogical practices.',
      excellenceRecommendation: 'Marked uplift in educator instructional confidence and classroom engagement.'
    },
    {
      id: 'coord-03',
      designation: 'Program Coordinator',
      title: 'Cross-Center Coordination & Student Competitions',
      description: 'Organize inter-center cultural events, sports meets, spelling bees, and vocational exhibitions.',
      weight: 20,
      unit: 'Events Organized',
      defaultTarget: 3,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Foster pride, camaraderie, and self-confidence among rescued street children.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Delegate activity committee roles to center mothers and teachers to boost participation.',
      excellenceRecommendation: 'Outstanding community festivals bringing widespread visibility to LEEDO children.'
    },
    {
      id: 'coord-04',
      designation: 'Program Coordinator',
      title: 'Donor Milestone Reporting & Beneficiary Progress Files',
      description: 'Compile monthly progress notes, attendance trends, and graduation records for donor review.',
      weight: 20,
      unit: 'Progress Reports',
      defaultTarget: 2,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure 100% data fidelity and student photo release consent compliance.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Establish early drafting cycles with documentation officer to avoid report delays.',
      excellenceRecommendation: 'Consistently praised by donor representatives for clear impact documentation.'
    }
  ],

  'Street Educator': [
    {
      id: 'se-01',
      designation: 'Street Educator',
      title: 'Street Outreach, Rapport Building & Identification',
      description: 'Conduct daily street patrols at identified hubs (Sadarghat, Kamalapur, Gabtoli) to identify at-risk street children.',
      weight: 35,
      unit: 'Children Reached',
      defaultTarget: 80,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Build trust through empathetic communication; document new child registrations.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Target evening transit arrival times to connect with newly arrived runaway children.',
      excellenceRecommendation: 'Extraordinary rapport with vulnerable children; top performer in street outreach.'
    },
    {
      id: 'se-02',
      designation: 'Street Educator',
      title: 'Open-Air & Mobile School Sessions',
      description: 'Deliver non-formal foundational literacy, Bengali alphabet, basic mathematics, and life skills sessions.',
      weight: 30,
      unit: 'Teaching Sessions',
      defaultTarget: 22,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Use game-based learning, storytelling, and colorful flashcards for street children.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Incorporate more interactive drawing and singing exercises to sustain child attention.',
      excellenceRecommendation: 'Creative pedagogical methods that transformed reluctant street kids into eager learners.'
    },
    {
      id: 'se-03',
      designation: 'Street Educator',
      title: 'Personal Hygiene, Health Screening & First-Aid',
      description: 'Provide handwashing instruction, nail clipping, skin hygiene care, and administer basic first-aid.',
      weight: 20,
      unit: 'Hygiene Drives',
      defaultTarget: 16,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Log skin infection treatments and refer severe medical cases to the center nurse.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Replenish personal first-aid kit weekly and conduct interactive hygiene quizzes.',
      excellenceRecommendation: 'Substantial improvement in personal hygiene and well-being of street students.'
    },
    {
      id: 'se-04',
      designation: 'Street Educator',
      title: 'Shelter Referrals & Transitional Center Motivation',
      description: 'Counsel children and motivate them to visit LEEDO Peace Home or drop-in center for safe shelter.',
      weight: 15,
      unit: 'Children Referred to Shelter',
      defaultTarget: 6,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Coordinate with social mobilizers for escorting motivated children to safe shelters.',
      underperformingThreshold: 60,
      underperformingRecommendation: 'Organize peer-mentor visits where former street children share their shelter transformation.',
      excellenceRecommendation: 'Highest rate of successful transitions from dangerous street living to safe shelter care.'
    }
  ],

  'Social Mobilizer': [
    {
      id: 'sm-01',
      designation: 'Social Mobilizer',
      title: 'Community Stakeholder Mobilization & Awareness Meetings',
      description: 'Engage local shopkeepers, transport workers, vendors, and community elders to protect street children.',
      weight: 35,
      unit: 'Community Meetings',
      defaultTarget: 12,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Form community protective networks to alert LEEDO when children face abuse or violence.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Focus on tea-stall owners and night guards near train and launch terminals.',
      excellenceRecommendation: 'Formed strong local watch networks that actively safeguard street youth.'
    },
    {
      id: 'sm-02',
      designation: 'Social Mobilizer',
      title: 'Family Tracing & Reintegration Counseling',
      description: 'Trace parents/guardians of runaway children, conduct home assessments, and mediate safe family reunification.',
      weight: 30,
      unit: 'Family Tracing Cases',
      defaultTarget: 5,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Follow up 30-day post-reintegration to prevent repeat runaways.',
      underperformingThreshold: 60,
      underperformingRecommendation: 'Work closely with village local government representatives (UP members) for home visits.',
      excellenceRecommendation: 'Compassionate family mediator with remarkable track record of durable reunifications.'
    },
    {
      id: 'sm-03',
      designation: 'Social Mobilizer',
      title: 'Anti-Trafficking & Child Labor Intervention',
      description: 'Identify children forced into hazardous labor, debt bondage, or vulnerable to trafficking networks.',
      weight: 20,
      unit: 'Intervention Cases',
      defaultTarget: 4,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Report suspected traffickers to law enforcement and secure child rescue.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Strengthen surveillance around late-night long-distance bus arrival platforms.',
      excellenceRecommendation: 'Proactive vigilance that saved multiple children from exploitation.'
    },
    {
      id: 'sm-04',
      designation: 'Social Mobilizer',
      title: 'Drop-In Center Mobilization & Enrollment',
      description: 'Mobilize street youth to attend daytime educational, recreational, and life skills programs.',
      weight: 15,
      unit: 'Children Mobilized',
      defaultTarget: 25,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Track regular attendance and identify drop-out causes immediately.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Introduce sports and board-game incentives during early afternoon hours.',
      excellenceRecommendation: 'Consistently high attendance numbers at local drop-in facilities.'
    }
  ],

  'Special Educator': [
    {
      id: 'sped-01',
      designation: 'Special Educator',
      title: 'Individualized Education Plans (IEP) for Traumatized Children',
      description: 'Develop tailored learning roadmaps for children with severe trauma, cognitive delays, or behavioral challenges.',
      weight: 35,
      unit: 'IEPs Formulated/Updated',
      defaultTarget: 12,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Set measurable weekly milestones in speech, sensory integration, and basic numeracy.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Consult closely with the psychosocial facilitator to align cognitive and emotional goals.',
      excellenceRecommendation: 'Groundbreaking progress observed in previously non-verbal or severely traumatized children.'
    },
    {
      id: 'sped-02',
      designation: 'Special Educator',
      title: 'One-on-One Remedial Literacy & Cognitive Sessions',
      description: 'Conduct dedicated private and small-group special education and speech development sessions.',
      weight: 30,
      unit: 'Special Sessions',
      defaultTarget: 24,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Utilize sensory toys, tactile boards, and repetitive cognitive prompts.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Introduce multisensory learning aids to stimulate neural responsiveness.',
      excellenceRecommendation: 'Immense patience and mastery of adaptive pedagogical techniques.'
    },
    {
      id: 'sped-03',
      designation: 'Special Educator',
      title: 'Behavioral De-escalation & Emotional Stability Support',
      description: 'Support children during emotional breakdowns, tantrums, and PTSD flashbacks with gentle therapeutic techniques.',
      weight: 20,
      unit: 'Interventions Logged',
      defaultTarget: 15,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Record triggers, cooling-down durations, and successful coping mechanisms.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Establish calm-down sensory spaces within classrooms.',
      excellenceRecommendation: 'Exceptional de-escalation skills preventing self-harm and classroom friction.'
    },
    {
      id: 'sped-04',
      designation: 'Special Educator',
      title: 'Child Progress Portfolios & Multi-Disciplinary Reviews',
      description: 'Document comprehensive progress portfolios and participate in monthly child review case conferences.',
      weight: 15,
      unit: 'Portfolios Finalized',
      defaultTarget: 12,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Include visual work samples, behavioral logs, and milestone checklists.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Ensure portfolio updates are logged weekly to avoid month-end reporting rush.',
      excellenceRecommendation: 'Thorough, clinical-grade documentation respected by child psychologists.'
    }
  ],

  'Psycho-social Facilitator': [
    {
      id: 'psy-01',
      designation: 'Psycho-social Facilitator',
      title: 'Individual Counseling & Trauma Healing Sessions',
      description: 'Conduct clinical trauma counseling for children rescued from abuse, substance dependence, or exploitation.',
      weight: 40,
      unit: 'One-on-One Sessions',
      defaultTarget: 30,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Establish safe, confidential space; utilize trauma-informed cognitive behavioral therapy.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Prioritize newly admitted children within their first 72 hours of shelter placement.',
      excellenceRecommendation: 'Profound therapeutic healing; children demonstrated marked reduction in anxiety and aggression.'
    },
    {
      id: 'psy-02',
      designation: 'Psycho-social Facilitator',
      title: 'Group Art Therapy, Music Relaxation & Emotional Circles',
      description: 'Facilitate weekly group expression sessions using drawing, drama, and meditation to build collective resilience.',
      weight: 30,
      unit: 'Group Sessions',
      defaultTarget: 12,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Encourage non-verbal expression of pain and foster peer support circles.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Integrate expressive clay modeling and rhythmic drumming for tension release.',
      excellenceRecommendation: 'Vibrant group dynamics transforming shy and fearful youth into self-expressed leaders.'
    },
    {
      id: 'psy-03',
      designation: 'Psycho-social Facilitator',
      title: 'Substance Detoxification & Harm-Reduction Support',
      description: 'Support children struggling with solvent sniffing (Dandi) through daily monitoring and craving redirection.',
      weight: 20,
      unit: 'Monitoring Logs',
      defaultTarget: 16,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Coordinate with shelter mothers and medical staff for physical detox management.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Establish buddy-support pairs between recovering youth and senior sober residents.',
      excellenceRecommendation: 'Zero relapse rate recorded among assigned shelter residents.'
    },
    {
      id: 'psy-04',
      designation: 'Psycho-social Facilitator',
      title: 'Confidential Case Notes & Psychiatric Referral Management',
      description: 'Maintain strict confidential case diaries and manage external psychiatric referrals when necessary.',
      weight: 10,
      unit: 'Case Diaries Updated',
      defaultTarget: 30,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Comply with child psychology professional confidentiality and ethical codes.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Ensure case file entries are completed within 24 hours of each session.',
      excellenceRecommendation: 'Gold standard documentation adhering to international mental health guidelines.'
    }
  ],

  'Teacher': [
    {
      id: 'teach-01',
      designation: 'Teacher',
      title: 'Core Academic Curriculum & Lesson Delivery',
      description: 'Teach Bengali, English, Math, and General Science according to national primary education bridging standards.',
      weight: 40,
      unit: 'Classes Conducted',
      defaultTarget: 44,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Differentiate lesson difficulty according to child literacy readiness.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Use visual teaching aids and daily board exercises to anchor basic arithmetic.',
      excellenceRecommendation: 'High academic pass rate with multiple students successfully transitioning to mainstream schools.'
    },
    {
      id: 'teach-02',
      designation: 'Teacher',
      title: 'Student Homework, Evaluation & Exam Administration',
      description: 'Grade daily classwork, administer monthly class assessments, and track individual learning growth.',
      weight: 25,
      unit: 'Student Assessments',
      defaultTarget: 35,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Provide encouraging written feedback and remedial support for struggling students.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Implement weekly 30-minute peer-tutoring circles for students lagging behind.',
      excellenceRecommendation: 'Detailed progress tracking allowing personalized academic intervention.'
    },
    {
      id: 'teach-03',
      designation: 'Teacher',
      title: 'Classroom Discipline & Positive Behavior Cultivation',
      description: 'Maintain positive learning atmosphere, attendance discipline, and cooperative classroom behavior.',
      weight: 20,
      unit: 'Daily Attendance Audits',
      defaultTarget: 22,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Strictly prohibit corporal punishment; use reward stars and recognition privileges.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Reward weekly "Student of the Week" badges to incentivize punctual attendance.',
      excellenceRecommendation: 'Exemplary classroom harmony and high student enthusiasm.'
    },
    {
      id: 'teach-04',
      designation: 'Teacher',
      title: 'Parent/Guardian Consultation & Academic Progress Sharing',
      description: 'Conduct parent-teacher meetings or shelter caregiver reviews to discuss each student’s academic progress.',
      weight: 15,
      unit: 'Consultations Held',
      defaultTarget: 8,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Collaborate with shelter mothers to ensure evening study hours are maintained.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Schedule flexible evening consultation slots for shelter mothers and guardians.',
      excellenceRecommendation: 'Strong collaborative synergy between classroom teachers and shelter caregivers.'
    }
  ],

  'Sewing Teacher': [
    {
      id: 'sew-01',
      designation: 'Sewing Teacher',
      title: 'Vocational Tailoring, Pattern Cutting & Machine Operation',
      description: 'Train adolescent girls and boys in basic/advanced sewing machine operation, measurement, and dress cutting.',
      weight: 40,
      unit: 'Practical Training Sessions',
      defaultTarget: 36,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Instruct on baby garments, salwar-kameez, masks, and tote bags for economic independence.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Break complex pattern cutting down into illustrated cardboard stencils for novice learners.',
      excellenceRecommendation: 'Graduated students producing market-standard apparel with high sewing precision.'
    },
    {
      id: 'sew-02',
      designation: 'Sewing Teacher',
      title: 'Apparel Production & Quality Control Inspection',
      description: 'Supervise trainees in completing finished garments meeting commercial craftsmanship and stitching standards.',
      weight: 30,
      unit: 'Finished Garments Inspected',
      defaultTarget: 25,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Audit hem finishing, buttonhole stitching, and seam durability.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Institute a mandatory 5-point quality check before approving finished items.',
      excellenceRecommendation: 'Zero garment defects; multiple pieces selected for charity fundraising exhibitions.'
    },
    {
      id: 'sew-03',
      designation: 'Sewing Teacher',
      title: 'Sewing Machine Maintenance & Workplace Safety',
      description: 'Ensure daily machine oiling, needle safety compliance, electrical cord checks, and fabric scrap recycling.',
      weight: 20,
      unit: 'Maintenance Inspections',
      defaultTarget: 20,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Prevent workshop needle-stick injuries through strict safety guards.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Conduct weekly oiling and bobbin inspection routine with all trainees.',
      excellenceRecommendation: 'Zero machinery downtime and accident-free workshop operation.'
    },
    {
      id: 'sew-04',
      designation: 'Sewing Teacher',
      title: 'Market Linkage & Income-Generation Coordination',
      description: 'Liaise with local boutique vendors or NGO craft fairs to explore sales opportunities for student garments.',
      weight: 10,
      unit: 'Market Exhibition Contacts',
      defaultTarget: 3,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Help trainees understand basic product costing and profit calculations.',
      underperformingThreshold: 60,
      underperformingRecommendation: 'Showcase finished crafts during LEEDO donor visits and annual open days.',
      excellenceRecommendation: 'Empowered students with direct earnings deposited into their savings accounts.'
    }
  ],

  'Beautification Teacher': [
    {
      id: 'beauty-01',
      designation: 'Beautification Teacher',
      title: 'Professional Salon Skills & Cosmetology Instruction',
      description: 'Train youth in hair cutting, styling, skin facials, henna art, waxing, and bridal parlor skills.',
      weight: 40,
      unit: 'Practical Salon Classes',
      defaultTarget: 30,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Emphasize hygiene, customer etiquette, and modern beauty trends for parlor jobs.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Increase hands-on mannequin practice hours before student-on-student trials.',
      excellenceRecommendation: 'Trained students immediately hireable at commercial beauty salons.'
    },
    {
      id: 'beauty-02',
      designation: 'Beautification Teacher',
      title: 'Sanitization & Cosmetic Safety Standards',
      description: 'Enforce strict sterilization of scissors, combs, brushes, and skin allergy patch tests.',
      weight: 30,
      unit: 'Sanitization Audits',
      defaultTarget: 20,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Prevent cross-contamination; enforce sanitization protocols between every practice session.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Mandate UV/chemical sterilizer usage checks after every session.',
      excellenceRecommendation: 'Immaculate hygiene standards maintained in the vocational parlor lab.'
    },
    {
      id: 'beauty-03',
      designation: 'Beautification Teacher',
      title: 'Trainee Practical Skill Assessment & Portfolio',
      description: 'Evaluate trainee styling accuracy, speed, grooming, and client communication skills.',
      weight: 20,
      unit: 'Student Assessments',
      defaultTarget: 15,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Score students on customer courtesy, cleanliness, and technical technique.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Provide mock parlor scenarios to build client-interaction confidence.',
      excellenceRecommendation: 'Trainees exhibited professional grace and technical speed.'
    },
    {
      id: 'beauty-04',
      designation: 'Beautification Teacher',
      title: 'Cosmetic Inventory & Chemical Material Management',
      description: 'Manage parlor cosmetics, hair products, bleaches, and maintain safe expiry registers.',
      weight: 10,
      unit: 'Inventory Audits',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Dispose expired chemicals immediately; store flammable sprays in metal lockers.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Update chemical stock usage logs daily to minimize product wastage.',
      excellenceRecommendation: 'Cost-effective inventory control with zero cosmetic expiration loss.'
    }
  ],

  'ICT Instructor': [
    {
      id: 'ict-01',
      designation: 'ICT Instructor',
      title: 'Computer Literacy, Typing & Office Applications',
      description: 'Train street and shelter children in English/Bangla typing, MS Word, Excel, and PowerPoint basics.',
      weight: 40,
      unit: 'Computer Lab Sessions',
      defaultTarget: 36,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Target typing speed benchmark of 25 WPM in English and 15 WPM in Bangla Bijoy/Avro.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Incorporate gamified typing games (TuxTyping) to boost keyboard familiarity.',
      excellenceRecommendation: 'Exceptional student progress in office computing and spreadsheet management.'
    },
    {
      id: 'ict-02',
      designation: 'ICT Instructor',
      title: 'Safe Internet Research & Digital Citizenship',
      description: 'Teach ethical web browsing, educational research, email communication, and cyber safety.',
      weight: 25,
      unit: 'Internet Research Modules',
      defaultTarget: 16,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Educate on online predators, phishing scams, and digital privacy safeguards.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Set up strict child-safe DNS filtering and review student browsing history weekly.',
      excellenceRecommendation: 'Cultivated mature, responsible digital citizens among shelter youth.'
    },
    {
      id: 'ict-03',
      designation: 'ICT Instructor',
      title: 'Computer Lab Hardware, OS & Antivirus Maintenance',
      description: 'Maintain lab computers, troubleshoot OS errors, clean dust filters, and update antivirus software.',
      weight: 20,
      unit: 'Maintenance Audits',
      defaultTarget: 12,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure 100% workstation uptime and network connectivity for learning hours.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Implement weekly disk cleanups and backup student assignment folders on external drive.',
      excellenceRecommendation: 'Flawless computer lab uptime without needing expensive outside technician calls.'
    },
    {
      id: 'ict-04',
      designation: 'ICT Instructor',
      title: 'Graphic Design & Freelancing Readiness Coaching',
      description: 'Introduce older adolescent students to basic Canva, Photoshop image editing, and digital freelance awareness.',
      weight: 15,
      unit: 'Creative Design Projects',
      defaultTarget: 10,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Guide students to design digital greeting cards, posters, and simple banners.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Assign practical design challenges for internal LEEDO event flyers.',
      excellenceRecommendation: 'Students produced stunning graphic work demonstrating high employability potential.'
    }
  ],

  'Music Teacher': [
    {
      id: 'mus-01',
      designation: 'Music Teacher',
      title: 'Vocal Training, Harmonium & Patriotic Songs',
      description: 'Instruct children in vocal warm-ups, classical ragas, national anthem, and inspiring patriotic songs.',
      weight: 40,
      unit: 'Music Lessons Delivered',
      defaultTarget: 30,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Use music as a therapeutic medium to nurture emotional healing and self-confidence.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Focus on rhythm exercises and breathing techniques before teaching complex lyrics.',
      excellenceRecommendation: 'Formed a wonderful children choir celebrated at national cultural events.'
    },
    {
      id: 'mus-02',
      designation: 'Music Teacher',
      title: 'Instrumental Music Practice (Tabla, Guitar, Keyboard)',
      description: 'Provide hands-on practice on musical instruments, tempo control, and rhythm synchronization.',
      weight: 30,
      unit: 'Instrumental Sessions',
      defaultTarget: 20,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Nurture individual student instrumental talents through personalized coaching.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Encourage paired practice sessions between advanced and beginner students.',
      excellenceRecommendation: 'Multiple students developed high proficiency in tabla and acoustic guitar.'
    },
    {
      id: 'mus-03',
      designation: 'Music Teacher',
      title: 'Cultural Performance Readiness & Rehearsals',
      description: 'Prepare children for stage performances, donor receptions, Independence Day, and Children’s Day celebrations.',
      weight: 20,
      unit: 'Stage Rehearsals',
      defaultTarget: 12,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Build stage presence, microphone discipline, and collective performance harmony.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Conduct mock stage rehearsals to eliminate stage fright among shy performers.',
      excellenceRecommendation: 'Children delivered captivating musical performances that deeply touched visitors.'
    },
    {
      id: 'mus-04',
      designation: 'Music Teacher',
      title: 'Musical Instruments Maintenance & Safe Storage',
      description: 'Care for harmoniums, tablar skins, guitars, sound amplifiers, and maintain storage cabinets.',
      weight: 10,
      unit: 'Care Checks',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Protect delicate instruments from monsoon humidity and moisture.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Use silica gel packets in instrument cases to prevent acoustic wood damage.',
      excellenceRecommendation: 'Well-preserved musical inventory with zero instrument damage.'
    }
  ],

  'Football Couch': [
    {
      id: 'fb-01',
      designation: 'Football Couch',
      title: 'Physical Conditioning, Agility & Football Training Drills',
      description: 'Conduct tactical training, passing drills, stamina running, dribbling, and ball control for shelter teams.',
      weight: 40,
      unit: 'Training Sessions',
      defaultTarget: 26,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Inculcate teamwork, sportsmanship, and mental resilience among former street children.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Introduce structured interval sprinting and tactical positioning drills.',
      excellenceRecommendation: 'Built a fiercely competitive, disciplined football squad representing LEEDO with pride.'
    },
    {
      id: 'fb-02',
      designation: 'Football Couch',
      title: 'Team Discipline, Mental Agility & Anti-Drug Motivation',
      description: 'Instill fair play, anger management, mutual respect on the pitch, and anti-substance abuse discipline.',
      weight: 30,
      unit: 'Discipline Mentorship Sessions',
      defaultTarget: 16,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Use sports metaphors to teach life coping mechanisms and anger de-escalation.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Engage senior team captains to model exemplary conflict resolution during matches.',
      excellenceRecommendation: 'Remarkable improvement in player emotional control and mutual support on and off the field.'
    },
    {
      id: 'fb-03',
      designation: 'Football Couch',
      title: 'Match Tournaments & Friendly Competition Coordination',
      description: 'Organize inter-center matches, club friendly fixtures, and participation in district youth tournaments.',
      weight: 20,
      unit: 'Competitive Matches',
      defaultTarget: 6,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Ensure every eligible child receives fair playing time and pitch encouragement.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Partner with local sports academies for weekend friendly invitation matches.',
      excellenceRecommendation: 'Led LEEDO youth team to tournament victory, boosting organizational pride.'
    },
    {
      id: 'fb-04',
      designation: 'Football Couch',
      title: 'Sports Kit, First Aid & Pitch Safety Oversight',
      description: 'Manage jerseys, footballs, shin guards, turf safety, and on-field sprain/injury medical treatment.',
      weight: 10,
      unit: 'Safety & Kit Audits',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Keep ice packs and sports stretch bandages ready on the sideline.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Mandate dynamic warm-up and cool-down stretching routines to prevent hamstring strains.',
      excellenceRecommendation: 'Flawless safety management with zero preventable sports injuries.'
    }
  ],

  'Cricket Coach': [
    {
      id: 'crick-01',
      designation: 'Cricket Coach',
      title: 'Net Practice, Batting, Bowling & Fielding Fundamentals',
      description: 'Train youth in batting stance, spin/pace bowling techniques, catching drills, and wicketkeeping.',
      weight: 40,
      unit: 'Coaching Sessions',
      defaultTarget: 26,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Build focus, hand-eye coordination, and strategic patience through cricket.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Incorporate target-cone bowling drills and reflex slip catching routines.',
      excellenceRecommendation: 'Transformed raw street talents into sharp, technically proficient cricket players.'
    },
    {
      id: 'crick-02',
      designation: 'Cricket Coach',
      title: 'Game Strategy, Decision-Making & Team Leadership',
      description: 'Teach match awareness, field placement strategy, run-chase planning, and captaincy skills.',
      weight: 30,
      unit: 'Strategy Chalk-Talks',
      defaultTarget: 14,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Empower rotating captains to take tactical decisions during simulated match scenarios.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Review match video clips to analyze batting shot selection and running between wickets.',
      excellenceRecommendation: 'Instilled great strategic maturity and tactical thinking in team leaders.'
    },
    {
      id: 'crick-03',
      designation: 'Cricket Coach',
      title: 'Tournament Matches & Inter-Club Exposure Fixtures',
      description: 'Arrange competitive fixtures against local schools, clubs, and NGO leagues.',
      weight: 20,
      unit: 'Tournament Matches',
      defaultTarget: 5,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Promote spirit of cricket and dignity regardless of match win/loss outcomes.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Coordinate with Bangladesh Cricket Board (BCB) grassroots coordinators for scout exposure.',
      excellenceRecommendation: 'Outstanding performances highlighted in local press coverage.'
    },
    {
      id: 'crick-04',
      designation: 'Cricket Coach',
      title: 'Cricket Gear Custody, Protective Helmet & Pitch Maintenance',
      description: 'Maintain leather/tape balls, bats, batting pads, helmets, and cricket practice pitch.',
      weight: 10,
      unit: 'Gear Inspections',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Strictly enforce helmet wearing during all fast bowling sessions.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Inspect helmet strap integrity and bat grip maintenance regularly.',
      excellenceRecommendation: 'Perfect equipment upkeep and rigorous head safety adherence.'
    }
  ],

  'Assistant Home Super': [
    {
      id: 'ahs-01',
      designation: 'Assistant Home Super',
      title: 'Shelter Daily Routine, Discipline & Child Safeguarding',
      description: 'Supervise 24/7 shelter operations, morning wake-up routines, study hours, and night bedtime security.',
      weight: 35,
      unit: 'Daily Supervision Cycles',
      defaultTarget: 28,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Ensure a warm, orderly, trauma-free home environment for all resident children.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Conduct daily evening roll calls with center mothers to resolve minor frictions early.',
      excellenceRecommendation: 'Exemplary shelter atmosphere characterized by peace, respect, and joy.'
    },
    {
      id: 'ahs-02',
      designation: 'Assistant Home Super',
      title: 'Healthcare Monitoring, Medication & Hospital Visits',
      description: 'Coordinate regular doctor checkups, vaccination schedules, prescription administration, and emergency clinics.',
      weight: 30,
      unit: 'Health Checks & Clinic Escorts',
      defaultTarget: 16,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Maintain individual child medical logbooks and medication dispensing registers.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Schedule monthly pediatric visits and ensure sick bay isolation protocols are active.',
      excellenceRecommendation: 'Proactive healthcare management preventing seasonal disease outbreaks in the home.'
    },
    {
      id: 'ahs-03',
      designation: 'Assistant Home Super',
      title: 'Nutrition Oversight, Dining Supervision & Kitchen Hygiene',
      description: 'Oversee daily meal preparation, balanced diet menus, cook hygiene, and clean dining hall seating.',
      weight: 20,
      unit: 'Meal Inspections',
      defaultTarget: 30,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Verify children receive sufficient protein, fresh vegetables, and purified drinking water.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Inspect food storage dryness and enforce kitchen cook apron/hairnet usage.',
      excellenceRecommendation: 'High dietary quality resulting in healthy child weight gain and vitality.'
    },
    {
      id: 'ahs-04',
      designation: 'Assistant Home Super',
      title: 'Logbook Entries, Incident Reports & Emergency Response',
      description: 'Maintain daily shelter occurrence book, record unusual incidents, and report immediately to Program Manager.',
      weight: 15,
      unit: 'Daily Log Entries',
      defaultTarget: 30,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Record all visitors, child movements, and medical treatments without omission.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Ensure night handover notes between shifts are signed off diligently.',
      excellenceRecommendation: 'Impeccable documentation safeguarding organizational transparency and child safety.'
    }
  ],

  'Mother': [
    {
      id: 'moth-01',
      designation: 'Mother',
      title: 'Maternal Care, Emotional Nurturing & Bedtime Comfort',
      description: 'Provide parental affection, tuck children into bed, comfort weeping or frightened youth, and offer motherly guidance.',
      weight: 40,
      unit: 'Daily Care Days',
      defaultTarget: 28,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Be a trusted maternal confidante for traumatized children who have never experienced maternal love.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Spend dedicated evening storytelling time with newly admitted or lonely children.',
      excellenceRecommendation: 'Incredible maternal warmth that healed broken hearts and built profound emotional trust.'
    },
    {
      id: 'moth-02',
      designation: 'Mother',
      title: 'Personal Hygiene Guidance, Bathing & Clothing Cleanliness',
      description: 'Teach children daily tooth brushing, proper bathing, hair combing, clothing change, and clean laundry.',
      weight: 30,
      unit: 'Hygiene Inspections',
      defaultTarget: 28,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Inspect clean fingernails, washed school uniforms, and clean beddings.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Establish a fun morning cleanliness checklist for dorm rooms.',
      excellenceRecommendation: 'Children consistently appear neat, well-groomed, and beaming with dignity.'
    },
    {
      id: 'moth-03',
      designation: 'Mother',
      title: 'Dining Etiquette & Nutritious Eating Encouragement',
      description: 'Sit with children during meals, encourage picky eaters to eat vegetables, and teach table manners.',
      weight: 20,
      unit: 'Meal Care Sessions',
      defaultTarget: 56,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Ensure children wash hands thoroughly before meals and avoid wasting food.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Praise children who finish their healthy vegetables and share with peers.',
      excellenceRecommendation: 'Created a joyous, harmonious family dining table atmosphere.'
    },
    {
      id: 'moth-04',
      designation: 'Mother',
      title: 'Sick Child Care & Nighttime Vigilance',
      description: 'Monitor children at night, comfort those suffering nightmares, administer prescribed cough syrups, and check fevers.',
      weight: 10,
      unit: 'Night Watch Cycles',
      defaultTarget: 20,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Alert home supervisor immediately if child fever spikes above 101°F.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Check dormitory blankets during midnight hours to ensure children stay warm in cool weather.',
      excellenceRecommendation: 'Selfless, compassionate care that ensured sick children recovered swiftly.'
    }
  ],

  'Cook': [
    {
      id: 'cook-01',
      designation: 'Cook',
      title: 'On-Time Nutritious Meal Preparation (Breakfast, Lunch, Dinner)',
      description: 'Cook balanced, delicious, and culturally appropriate meals for shelter children and staff on strict schedule.',
      weight: 40,
      unit: 'Meal Shifts Completed',
      defaultTarget: 60,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Adhere strictly to designated meal serving times without delay.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Start vegetable prep one hour earlier to avoid meal delivery delays.',
      excellenceRecommendation: 'Delicious, appetizing food praised by children and international visiting guests.'
    },
    {
      id: 'cook-02',
      designation: 'Cook',
      title: 'Kitchen Cleanliness, Utensil Sterilization & Food Safety',
      description: 'Wash cooking pots thoroughly, sanitize countertops, sweep/mop kitchen floor, and store food in covered containers.',
      weight: 30,
      unit: 'Daily Sanitization Audits',
      defaultTarget: 28,
      strategicPillar: 'Shelter, Health & Holistic Care',
      guidanceNotes: 'Prevent pest/cockroach infestation through spotless cleanliness after every cooking shift.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Boil dishcloths daily and scrub cooking stoves after dinner service.',
      excellenceRecommendation: 'Spotless, sparkling kitchen meeting hospital-grade food safety standards.'
    },
    {
      id: 'cook-03',
      designation: 'Cook',
      title: 'Ration Inventory Tracking & Spoilage Prevention',
      description: 'Monitor rice, lentils, oil, spices, and vegetable reserves; report shortages 3 days in advance.',
      weight: 20,
      unit: 'Ration Audits',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Store grains off the ground on wooden pallets to prevent dampness.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Practice First-In First-Out (FIFO) rotation for cooking oils and lentils.',
      excellenceRecommendation: 'Zero food wastage and economical, precise portion management.'
    },
    {
      id: 'cook-04',
      designation: 'Cook',
      title: 'Gas Cylinder & Kitchen Stove Fire Safety',
      description: 'Check gas regulators, extinguish embers, and ensure fire safety extinguishers are accessible.',
      weight: 10,
      unit: 'Safety Verifications',
      defaultTarget: 28,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Turn off main gas cylinder valve every evening after cooking.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Conduct daily soapy water bubble tests on gas pipe connections.',
      excellenceRecommendation: 'Zero safety incidents; exemplary caution in kitchen operations.'
    }
  ],

  'Logistics Officer': [
    {
      id: 'log-01',
      designation: 'Logistics Officer',
      title: 'Center Supplies, Food Rations & Asset Logistics Movement',
      description: 'Coordinate timely delivery of food rations, educational materials, hygiene supplies, and furniture to centers.',
      weight: 35,
      unit: 'Logistics Dispatches',
      defaultTarget: 16,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Obtain stamped delivery acknowledgments for every transported consignment.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Consolidate center delivery routes twice weekly to reduce transport costs.',
      excellenceRecommendation: 'Flawless supply chain; zero center stockouts of critical food and hygiene rations.'
    },
    {
      id: 'log-02',
      designation: 'Logistics Officer',
      title: 'Fleet Vehicle Maintenance, Fuel Tracking & Route Planning',
      description: 'Oversee NGO transport vehicles, motorbikes, scheduled servicing, fuel logbooks, and driver duty rosters.',
      weight: 30,
      unit: 'Fleet Service Audits',
      defaultTarget: 8,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Reconcile kilometers driven against fuel purchase receipts monthly.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Implement weekly tire pressure, brake fluid, and engine oil check protocols.',
      excellenceRecommendation: 'Outstanding vehicle reliability and notable fuel consumption efficiency.'
    },
    {
      id: 'log-03',
      designation: 'Logistics Officer',
      title: 'Vendor Quotations, Procurement Transparency & Purchase Orders',
      description: 'Collect minimum 3 competitive quotations for supplies, negotiate prices, and draft purchase orders.',
      weight: 20,
      unit: 'Procurement Batches',
      defaultTarget: 6,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure transparency and price fairness aligned with procurement committee rules.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Build an approved pre-qualified vendor directory for emergency procurements.',
      excellenceRecommendation: 'Secured substantial cost savings through robust competitive bidding.'
    },
    {
      id: 'log-04',
      designation: 'Logistics Officer',
      title: 'Central Warehouse Inventory & Asset Tagging Audits',
      description: 'Conduct bi-weekly stock physical counts, tag newly purchased assets, and update the central asset register.',
      weight: 15,
      unit: 'Inventory Audits',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Apply indelible barcode/tag numbers to all electronics and office equipment.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Reconcile warehouse bin cards with digital inventory ledger weekly.',
      excellenceRecommendation: 'Impeccable inventory integrity with zero variance between stock and ledger.'
    }
  ],

  'Driver': [
    {
      id: 'drv-01',
      designation: 'Driver',
      title: 'Safe Punctual Transport for Street Rescue & Field Teams',
      description: 'Safely drive NGO ambulance/microbus for emergency street child rescues, donor tours, and staff field movements.',
      weight: 45,
      unit: 'Trips Completed Safely',
      defaultTarget: 50,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Strictly observe traffic laws, speed limits, and defensive driving techniques.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Plan alternative routes around peak traffic hours to avoid transport delays.',
      excellenceRecommendation: 'Flawless 100% safety driving record; praised for punctuality and gentle driving.'
    },
    {
      id: 'drv-02',
      designation: 'Driver',
      title: 'Vehicle Preventative Maintenance, Cleanliness & Fluid Checks',
      description: 'Daily check engine oil, coolant, battery water, tire inflation, and keep vehicle interior and exterior clean.',
      weight: 30,
      unit: 'Maintenance Inspections',
      defaultTarget: 26,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Wash vehicle daily; immediately notify Logistics Officer of any engine rattles or brake wear.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Establish a morning 10-minute pre-ignition vehicle checklist.',
      excellenceRecommendation: 'Vehicle kept in spotless, showroom condition with zero breakdown incidents.'
    },
    {
      id: 'drv-03',
      designation: 'Driver',
      title: 'Trip Logbook Recording & Odometer Entries',
      description: 'Record trip date, departure/destination, starting/ending kilometer reading, purpose, and passenger signature.',
      weight: 15,
      unit: 'Logbook Entries',
      defaultTarget: 50,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure every trip has a valid travel authorization from Administration.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Request passenger signatures immediately upon concluding each trip.',
      excellenceRecommendation: 'Pristine logbook documentation with accurate fuel consumption rates.'
    },
    {
      id: 'drv-04',
      designation: 'Driver',
      title: 'Passenger Security & First Aid Box Readiness',
      description: 'Ensure all passengers wear seatbelts, child passengers are secured, and vehicle first-aid kit is stocked.',
      weight: 10,
      unit: 'Safety Checks',
      defaultTarget: 26,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Check vehicle fire extinguisher expiry and first aid emergency bandages.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Replenish antiseptics and motion sickness medication in vehicle glove compartment.',
      excellenceRecommendation: 'Highly attentive to child comfort and safety during high-stress rescue trips.'
    }
  ],

  'Security Guard': [
    {
      id: 'sec-01',
      designation: 'Security Guard',
      title: 'Gate Security, Visitor Registration & Identity Verification',
      description: 'Screen all visitors, check identification, register entry/exit times, and prohibit unauthorized entry to shelters.',
      weight: 40,
      unit: 'Gate Shift Audits',
      defaultTarget: 28,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Protect shelter children from estranged abusive relatives, traffickers, or unauthorized strangers.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Verify visitor photo ID and call shelter supervisor prior to opening gate.',
      excellenceRecommendation: 'Impenetrable gate vigilance protecting child residents round the clock.'
    },
    {
      id: 'sec-02',
      designation: 'Security Guard',
      title: 'Perimeter Patrol, Night Vigilance & Child Safeguarding',
      description: 'Conduct hourly perimeter patrols of shelter premises, check fences, boundary walls, and rooftop access locks.',
      weight: 35,
      unit: 'Night Patrol Rounds',
      defaultTarget: 50,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Use patrol torch and check all exterior latch points every 60 minutes.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Log each hourly round in the night guard register book.',
      excellenceRecommendation: 'High alertness and physical vigilance; prevented trespass attempts.'
    },
    {
      id: 'sec-03',
      designation: 'Security Guard',
      title: 'Incident Prevention, Emergency Response & Gate Logbook',
      description: 'Maintain neat gate registers, report power outages, water leakage, or electrical sparks immediately.',
      weight: 15,
      unit: 'Incident Reports Logged',
      defaultTarget: 28,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Know fire extinguisher operating instructions and emergency police/ambulance phone numbers.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Practice monthly emergency gate lock-down drills.',
      excellenceRecommendation: 'Prompt reporting prevented infrastructure hazard from escalating.'
    },
    {
      id: 'sec-04',
      designation: 'Security Guard',
      title: 'Asset, Generator & Water Pump Operation Safeguards',
      description: 'Operate standby diesel generator during load-shedding and ensure water pump valves are operated safely.',
      weight: 10,
      unit: 'Utility Checks',
      defaultTarget: 28,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Monitor fuel level in generator and prevent water tank overflow.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Check generator battery electrolyte and diesel filters weekly.',
      excellenceRecommendation: 'Reliable utility operations ensuring continuous light and water for children.'
    }
  ],

  'Office Assistant': [
    {
      id: 'oa-01',
      designation: 'Office Assistant',
      title: 'Office Cleanliness, Meeting Room Readiness & Reception',
      description: 'Clean desks, dust computers, empty wastebaskets, and prepare conference rooms with water and stationery.',
      weight: 35,
      unit: 'Daily Facility Cycles',
      defaultTarget: 26,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure the office is clean, fresh, and welcoming 30 minutes before official opening time.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Complete room dusting and waste disposal prior to 8:45 AM daily.',
      excellenceRecommendation: 'Spotless head office premises admired by visiting partner delegations.'
    },
    {
      id: 'oa-02',
      designation: 'Office Assistant',
      title: 'Document Photocopying, Binding & Supply Distribution',
      description: 'Photocopy training modules, bind project reports, and distribute office stationery to departments.',
      weight: 30,
      unit: 'Service Requests Completed',
      defaultTarget: 40,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Handle printing requests accurately without misplacing original confidential documents.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Confirm number of copies and staple format before bulk printing runs.',
      excellenceRecommendation: 'High work speed and meticulous document organization.'
    },
    {
      id: 'oa-03',
      designation: 'Office Assistant',
      title: 'Meeting Refreshments, Tea/Coffee Service & Hospitality',
      description: 'Serve tea, coffee, drinking water, and snacks during executive board meetings and staff workshops.',
      weight: 20,
      unit: 'Hospitality Events Served',
      defaultTarget: 30,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Maintain clean tea mugs, sterilized tray cloths, and courteous serving manners.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Keep tea and biscuits inventory stocked 3 days in advance.',
      excellenceRecommendation: 'Warm, hospitable service praised by guests and staff alike.'
    },
    {
      id: 'oa-04',
      designation: 'Office Assistant',
      title: 'Courier Dispatch, Utility Bill Payment & Urgent Errands',
      description: 'Deliver official letters to NGO Affairs bureau, postal courier dispatch, and bill payments.',
      weight: 15,
      unit: 'Errands Dispatched',
      defaultTarget: 16,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Collect stamped dispatch receipts and verify cash change immediately.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Record postal tracking numbers immediately in dispatch ledger.',
      excellenceRecommendation: 'Prompt, trustworthy handling of sensitive organizational couriers.'
    }
  ],

  'Fund Acquisition Manager': [
    {
      id: 'fam-01',
      designation: 'Fund Acquisition Manager',
      title: 'Grant Proposals, Concept Notes & Donor Pitches',
      description: 'Research international and national grant opportunities, write high-scoring proposals, and submit concept notes.',
      weight: 40,
      unit: 'Proposals Submitted',
      defaultTarget: 4,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Align proposals with UN Sustainable Development Goals (SDG 1, 4, 16) and donor guidelines.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Organize collaborative proposal review sessions with M&E and Finance teams 5 days prior to deadline.',
      excellenceRecommendation: 'Secured substantial institutional grants expanding shelter capacity.'
    },
    {
      id: 'fam-02',
      designation: 'Fund Acquisition Manager',
      title: 'Corporate CSR Outreach & Institutional Pitching',
      description: 'Pitch to domestic corporate banks, telecom companies, and multinational corporations for CSR funding.',
      weight: 30,
      unit: 'Corporate CSR Pitches',
      defaultTarget: 8,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Prepare compelling CSR decks showcasing measurable return on social impact.',
      underperformingThreshold: 65,
      underperformingRecommendation: 'Target upcoming corporate financial year-end CSR allocation cycles.',
      excellenceRecommendation: 'Brokered multi-year corporate sponsorship for street children nutrition.'
    },
    {
      id: 'fam-03',
      designation: 'Fund Acquisition Manager',
      title: 'Donor Grant Reporting & SLA Compliance Management',
      description: 'Track donor grant milestones, review reporting obligations, and submit high-quality narrative reports.',
      weight: 20,
      unit: 'Donor Reports Submitted',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Ensure 100% compliance with donor reporting deadlines and formatting guidelines.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Draft reports alongside Project Coordinator 10 days before contractual due date.',
      excellenceRecommendation: 'Flawless compliance record resulting in automatic grant renewals.'
    },
    {
      id: 'fam-04',
      designation: 'Fund Acquisition Manager',
      title: 'Fundraising Pipeline Analytics & CRM Database Upkeep',
      description: 'Maintain donor prospect database, track win-loss conversion rates, and forecast quarterly funding pipeline.',
      weight: 10,
      unit: 'Pipeline Analytics Reviews',
      defaultTarget: 4,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Keep comprehensive contact records of donor portfolio managers and embassy attachés.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Update CRM interaction logs within 24 hours of every donor exchange.',
      excellenceRecommendation: 'Robust funding pipeline ensuring organizational fiscal resilience.'
    }
  ],

  'Co-ordinator, Partnership': [
    {
      id: 'part-01',
      designation: 'Co-ordinator, Partnership',
      title: 'Institutional Alliances, University & NGO MoUs',
      description: 'Build strategic collaborations with educational institutions, volunteer networks, hospitals, and civil society.',
      weight: 40,
      unit: 'Partnership Agreements/MoUs',
      defaultTarget: 4,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Secure pro-bono healthcare, student internships, and educational resource sharing.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Approach leading medical universities for free regular dental and eye checkup camps.',
      excellenceRecommendation: 'Formed high-value university partnerships delivering 500+ volunteer teaching hours.'
    },
    {
      id: 'part-02',
      designation: 'Co-ordinator, Partnership',
      title: 'Government Stakeholder Liaison & Regulatory Networking',
      description: 'Coordinate with Ministry of Social Welfare, Dhaka City Corporation, and police commissioner offices.',
      weight: 30,
      unit: 'Government Liaison Engagements',
      defaultTarget: 6,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Ensure official recognition, protection clearance, and municipal permissions for street schools.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Invite local district social welfare officials to attend LEEDO milestone ceremonies.',
      excellenceRecommendation: 'Exceptional goodwill generated with public welfare regulators.'
    },
    {
      id: 'part-03',
      designation: 'Co-ordinator, Partnership',
      title: 'Partner Event Coordination & Sponsor Engagements',
      description: 'Organize joint seminars, donor appreciation luncheons, and philanthropic field exposure tours.',
      weight: 20,
      unit: 'Exposure Tours/Events',
      defaultTarget: 4,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Provide unforgettable, dignifying experiences for visiting partner representatives.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Send customized thank-you letters and photo albums within 48 hours of visits.',
      excellenceRecommendation: 'Visiting partners turned into passionate, long-term goodwill ambassadors.'
    },
    {
      id: 'part-04',
      designation: 'Co-ordinator, Partnership',
      title: 'Partnership Impact Documentation & Periodic Reviews',
      description: 'Compile quarterly partnership review reports, documenting collaborative outputs and resource contributions.',
      weight: 10,
      unit: 'Review Documents',
      defaultTarget: 2,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Measure quantified in-kind contributions and medical support received.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Maintain clear valuation logs of non-cash in-kind donations received.',
      excellenceRecommendation: 'Comprehensive reporting highlighting substantial leveraged value.'
    }
  ],

  'Communication & Media Manager': [
    {
      id: 'med-01',
      designation: 'Communication & Media Manager',
      title: 'Media Advocacy, Press Releases & National Coverage',
      description: 'Pitch feature stories to national print and electronic television media on street children rights and LEEDO models.',
      weight: 35,
      unit: 'Media Features/Press Releases',
      defaultTarget: 6,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Ensure strict compliance with child identity protection and dignity ethics in all press coverage.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Build media partnerships around International Day for Street Children (April 12).',
      excellenceRecommendation: 'Secured primetime national TV documentary spotlights on LEEDO children.'
    },
    {
      id: 'med-02',
      designation: 'Communication & Media Manager',
      title: 'Social Media Strategy, Video Content & Digital Engagement',
      description: 'Manage Facebook, YouTube, LinkedIn, and website stories, growing digital advocacy and public donations.',
      weight: 30,
      unit: 'Campaign Posts & Impact Videos',
      defaultTarget: 20,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Highlight inspiring turnaround stories, cricket victories, and education achievements.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Incorporate authentic short-form reels focusing on daily life in the Peace Home.',
      excellenceRecommendation: 'Viral social campaigns reaching over 500,000 views and driving organic public donations.'
    },
    {
      id: 'med-03',
      designation: 'Communication & Media Manager',
      title: 'Branding Integrity & Visual Communication Standards',
      description: 'Maintain official LEEDO logo usage, brand guidelines, annual report layouts, and newsletter publications.',
      weight: 20,
      unit: 'Publications Produced',
      defaultTarget: 3,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Ensure uniform branding across all field center signboards, t-shirts, and publications.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Review all department presentations and documents before external distribution.',
      excellenceRecommendation: 'World-class visual branding that elevated organizational prestige.'
    },
    {
      id: 'med-04',
      designation: 'Communication & Media Manager',
      title: 'Crisis Communication & Child Consent Archive Management',
      description: 'Maintain digital child consent release forms and maintain rapid rebuttal protocols for public relations.',
      weight: 15,
      unit: 'Consent Audits',
      defaultTarget: 4,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Ensure 100% written or recorded consent before publishing any beneficiary image.',
      underperformingThreshold: 85,
      underperformingRecommendation: 'Audit digital photo database quarterly to blur faces of sensitive protective cases.',
      excellenceRecommendation: 'Flawless ethical child communications standards with zero breaches.'
    }
  ],

  'Content Creator': [
    {
      id: 'cc-01',
      designation: 'Content Creator',
      title: 'High-Impact Photography & Video Production',
      description: 'Capture photojournalism-grade images and film video footage of field street schools and shelter life.',
      weight: 35,
      unit: 'Produced Media Assets',
      defaultTarget: 24,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Frame children with dignity, resilience, and hope rather than helpless despair.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Experiment with natural lighting and close-up expressions during classroom activities.',
      excellenceRecommendation: 'Breathtaking visual storytelling that evoked widespread emotional resonance.'
    },
    {
      id: 'cc-02',
      designation: 'Content Creator',
      title: 'Short-Form Reels, TikTok & Social Editing',
      description: 'Edit dynamic, trending reels, vertical videos, and TikTok-style educational snippets with engaging subtitles.',
      weight: 30,
      unit: 'Edited Social Videos',
      defaultTarget: 16,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Hook viewer attention within the first 3 seconds with authentic children smiles and music.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Study trending social audio tracks to amplify organic algorithm reach.',
      excellenceRecommendation: 'Skyrocketing engagement metrics and high follower growth among youth demographics.'
    },
    {
      id: 'cc-03',
      designation: 'Content Creator',
      title: 'Graphic Posters, Infographics & Campaign Creatives',
      description: 'Design banners, donor appeals, event posters, and fundraising infographics for digital channels.',
      weight: 20,
      unit: 'Graphic Designs Finalized',
      defaultTarget: 18,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Follow official LEEDO red and white brand colors and crisp legible typography.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Utilize clean vector illustrations and concise statistics on child impact.',
      excellenceRecommendation: 'Polished creative assets that set a new benchmark for NGO marketing.'
    },
    {
      id: 'cc-04',
      designation: 'Content Creator',
      title: 'Digital Media Library Archiving & Tagging',
      description: 'Organize high-resolution raw files, categorize folders by event and date, and maintain backup drives.',
      weight: 15,
      unit: 'Archive Audits',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Tag photos with event location, date, and consent clearance tags.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Standardize file naming convention: YYYYMMDD_Location_Event_Number.',
      excellenceRecommendation: 'Seamless digital asset library allowing instant retrieval of past event footage.'
    }
  ],

  'Documentation Coordinator': [
    {
      id: 'doc-01',
      designation: 'Documentation Coordinator',
      title: 'Beneficiary Digital Database & Case File Upkeep',
      description: 'Maintain detailed biographical profiles, rescue dates, family background, and progress logs for all children.',
      weight: 35,
      unit: 'Case Files Updated',
      defaultTarget: 60,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Ensure every enrolled child has a comprehensive physical dossier and digital backup.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Establish weekly data-sync with field street educators to capture new registrations.',
      excellenceRecommendation: 'Pristine, audit-proof beneficiary database with zero missing records.'
    },
    {
      id: 'doc-02',
      designation: 'Documentation Coordinator',
      title: 'Programmatic Impact Stories & Case Study Writing',
      description: 'Interview children, social mobilizers, and families to author deeply moving case studies of rehabilitation.',
      weight: 30,
      unit: 'In-Depth Case Studies',
      defaultTarget: 6,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Capture authentic voice, previous street hardships, and tangible turnaround milestones.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Conduct semi-structured interviews with former street children now enrolled in school.',
      excellenceRecommendation: 'Captivating narrative prose featured prominently in international donor newsletters.'
    },
    {
      id: 'doc-03',
      designation: 'Documentation Coordinator',
      title: 'Monthly Progress Bulletin & Cross-Center Reports Archiving',
      description: 'Compile monthly programmatic bulletins aggregating numbers across all street centers and shelters.',
      weight: 20,
      unit: 'Monthly Bulletins Compiled',
      defaultTarget: 2,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Cross-check statistical tables with Monitoring Officer before final sign-off.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Send bulletin draft to ED 3 days prior to month-end distribution.',
      excellenceRecommendation: 'Comprehensive statistical summaries that empower executive decision-making.'
    },
    {
      id: 'doc-04',
      designation: 'Documentation Coordinator',
      title: 'Institutional Memory, Certificate & Record Preservation',
      description: 'Archive official government permissions, child birth registration certificates, and awards safely.',
      weight: 15,
      unit: 'Archive Audits',
      defaultTarget: 4,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Scan birth certificates and official legal documents into fireproof cloud storage.',
      underperformingThreshold: 80,
      underperformingRecommendation: 'Perform quarterly backup of all scanned legal records to secondary offline drive.',
      excellenceRecommendation: 'Rock-solid legal and institutional memory safeguarding child rights.'
    }
  ],

  'Young Volunteer': [
    {
      id: 'vol-01',
      designation: 'Young Volunteer',
      title: 'Street School Classroom Support & Play Activities',
      description: 'Assist street educators during open-air teaching sessions, organize games, and assist younger children.',
      weight: 40,
      unit: 'Volunteer Field Days',
      defaultTarget: 18,
      strategicPillar: 'Education, Skills & Life Training',
      guidanceNotes: 'Bring youthful energy, enthusiasm, and active play to brighten children’s days.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Plan interactive storytelling and group drawing games before field sessions.',
      excellenceRecommendation: 'Beloved by children for boundless enthusiasm and patient guidance.'
    },
    {
      id: 'vol-02',
      designation: 'Young Volunteer',
      title: 'Event Logistics & Special Campaign Mobilization',
      description: 'Assist in setting up sound equipment, managing crowds, distributing snacks, and helping during NGO events.',
      weight: 30,
      unit: 'Campaigns/Events Supported',
      defaultTarget: 6,
      strategicPillar: 'Partnerships, Media & Resource Mobilization',
      guidanceNotes: 'Support center coordinators with enthusiasm and dependable follow-through.',
      underperformingThreshold: 70,
      underperformingRecommendation: 'Arrive 45 minutes prior to event start for task allocation briefing.',
      excellenceRecommendation: 'Indispensable event helper with exceptional dependability.'
    },
    {
      id: 'vol-03',
      designation: 'Young Volunteer',
      title: 'Data Entry & Media Sorting Assistance',
      description: 'Help documentation officers enter attendance registers and sort photo collections from field drives.',
      weight: 20,
      unit: 'Data Entry Tasks Completed',
      defaultTarget: 10,
      strategicPillar: 'Admin & Financial Governance',
      guidanceNotes: 'Pay close attention to spelling of child names and registration codes.',
      underperformingThreshold: 75,
      underperformingRecommendation: 'Double-check entries against physical sign-in sheets before submitting.',
      excellenceRecommendation: 'Fast and accurate data entry support that expedited reporting.'
    },
    {
      id: 'vol-04',
      designation: 'Young Volunteer',
      title: 'Child Safeguarding Adherence & Volunteer Conduct',
      description: 'Strictly observe LEEDO child protection code of conduct and report any safety concerns immediately.',
      weight: 10,
      unit: 'Conduct Compliance Days',
      defaultTarget: 18,
      strategicPillar: 'Child Rights & Street Protection',
      guidanceNotes: 'Never remain alone in secluded spaces with children; maintain professional boundaries.',
      underperformingThreshold: 90,
      underperformingRecommendation: 'Re-read the volunteer code of conduct handbook monthly.',
      excellenceRecommendation: 'Exemplary role model for youth volunteerism and ethics.'
    }
  ]
};

// Fallback generator for designations that might have slight variations (e.g. Senior Social Mobilizer, Social Mobilizer (Incharge))
export const getJDTemplateForDesignation = (designation: string): JDTaskTemplate[] => {
  if (JD_TEMPLATES_BY_DESIGNATION[designation]) {
    return JD_TEMPLATES_BY_DESIGNATION[designation];
  }

  // Handle incharge and variations
  if (designation.includes('Social Mobilizer') || designation.includes('Senior Social Mibilzer')) {
    return JD_TEMPLATES_BY_DESIGNATION['Social Mobilizer'];
  }
  if (designation.includes('Special Educator')) {
    return JD_TEMPLATES_BY_DESIGNATION['Special Educator'];
  }
  if (designation.includes('Street Educator')) {
    return JD_TEMPLATES_BY_DESIGNATION['Street Educator'];
  }
  if (designation.includes('Accountant')) {
    return JD_TEMPLATES_BY_DESIGNATION['Accountant'];
  }
  if (designation.includes('Cook')) {
    return JD_TEMPLATES_BY_DESIGNATION['Cook'];
  }
  if (designation.includes('Mother')) {
    return JD_TEMPLATES_BY_DESIGNATION['Mother'];
  }
  if (designation.includes('Coach') || designation.includes('Couch')) {
    return designation.toLowerCase().includes('cricket') 
      ? JD_TEMPLATES_BY_DESIGNATION['Cricket Coach']
      : JD_TEMPLATES_BY_DESIGNATION['Football Couch'];
  }
  if (designation.includes('Teacher')) {
    if (designation.includes('Sewing')) return JD_TEMPLATES_BY_DESIGNATION['Sewing Teacher'];
    if (designation.includes('Beautification')) return JD_TEMPLATES_BY_DESIGNATION['Beautification Teacher'];
    if (designation.includes('Music')) return JD_TEMPLATES_BY_DESIGNATION['Music Teacher'];
    return JD_TEMPLATES_BY_DESIGNATION['Teacher'];
  }
  if (designation.includes('ICT')) {
    return JD_TEMPLATES_BY_DESIGNATION['ICT Instructor'];
  }
  if (designation.includes('Security')) {
    return JD_TEMPLATES_BY_DESIGNATION['Security Guard'];
  }
  if (designation.includes('Office Assistant')) {
    return JD_TEMPLATES_BY_DESIGNATION['Office Assistant'];
  }
  if (designation.includes('Fund Acquisition')) {
    return JD_TEMPLATES_BY_DESIGNATION['Fund Acquisition Manager'];
  }
  if (designation.includes('Coordinator') || designation.includes('Co-ordinator')) {
    if (designation.includes('Partnership')) return JD_TEMPLATES_BY_DESIGNATION['Co-ordinator, Partnership'];
    if (designation.includes('Documentation')) return JD_TEMPLATES_BY_DESIGNATION['Documentation Coordinator'];
    return JD_TEMPLATES_BY_DESIGNATION['Program Coordinator'];
  }
  if (designation.includes('Media') || designation.includes('Communication')) {
    return JD_TEMPLATES_BY_DESIGNATION['Communication & Media Manager'];
  }

  // Generic fallback if none matched
  return JD_TEMPLATES_BY_DESIGNATION['Street Educator'];
};
