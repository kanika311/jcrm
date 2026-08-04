import Link from "next/link";
import ErpDetailClient from "./ErpDetailClient";

export async function generateStaticParams() {
  return [
    { product_id: 'institute-lms-erp' },
    { product_id: 'healthcare-hospital-erp' },
    { product_id: 'manufacturing-scm-erp' },
    { product_id: 'retail-pos-inventory-erp' },
    { product_id: 'finance-hrms-erp' },
    { product_id: 'realestate-crm-erp' }
  ];
}

const ERP_DETAILS_DATA: Record<string, any> = {
  "institute-lms-erp": {
    title: "Institute & Academy LMS ERP",
    category: "Education & LMS",
    badge: "Most Popular for Academies",
    modulesCount: 14,
    roiMetric: "Saves 35+ hrs/wk in admin workload & 98% fee recovery",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    description: "Comprehensive educational institution management suite. Streamline student lifecycle management, fee collection with automated GST invoices, live virtual classrooms, parent communication via WhatsApp, and automated report card generation.",
    keyFeatures: [
      "Online & Offline Student Admission Workflow",
      "Automated Fee Reminders & WhatsApp Gateway Integration",
      "Live Classrooms, Recorded Lectures & Quiz Portal",
      "Biometric & RFID Student Attendance Tracking",
      "Parent Mobile Portal for Fee & Performance Updates",
      "Staff Payroll, Teacher Allocation & Leave Management",
      "CBSE / University Grade Calculation Engine",
      "Custom Domain Branding & Self-Hosting Options"
    ],
    modulesDetail: [
      { name: "Student Admission & Profiling", desc: "Digital application forms, document verification, enrollment numbers, and student ID generation." },
      { name: "Fee Management & GST Billing", desc: "Automated payment gateway links, partial payments, scholarship discounts, and downloadable GST receipts." },
      { name: "LMS & Online Course Delivery", desc: "Host video lectures, assignments, downloadable PDFs, and automated grading quizzes." },
      { name: "WhatsApp & SMS Gateway", desc: "Instant automated WhatsApp alerts for fees, attendance, exam schedules, and holiday announcements." }
    ]
  },
  "healthcare-hospital-erp": {
    title: "Healthcare & Clinical Hospital ERP",
    category: "Healthcare & Hospitals",
    badge: "NABH Compliant",
    modulesCount: 16,
    roiMetric: "Cuts patient OPD wait times by 60%",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    description: "End-to-end NABH compliant hospital ERP system connecting OPD registration, IPD ward allocation, Electronic Health Records (EHR), pharmacy stock management, diagnostic lab LIMS, and doctor commission accounting.",
    keyFeatures: [
      "OPD Patient Token System & Smart Queue Management",
      "IPD Bed Allocation, Nursing Charts & Discharge Summaries",
      "Electronic Health Records (EHR) & Prescriptions",
      "Pharmacy Batch Stock Tracking & Expiry Alerts",
      "Diagnostic Lab LIMS with Automated Email/WhatsApp Reports",
      "Insurance TPA Desk & Automated Billing Claims",
      "Doctor Consultation Scheduling & Split Commissions",
      "HIPAA / NABH Security Compliance & Data Encryption"
    ],
    modulesDetail: [
      { name: "OPD/IPD Registration & Bed Management", desc: "Fast patient registration, bed availability matrix, admission notes, and discharge billing." },
      { name: "Electronic Prescriptions & Diagnostic LIMS", desc: "Digital prescription builder, direct lab test orders, and automated PDF report delivery." },
      { name: "Pharmacy Inventory & Batch Control", desc: "Real-time stock audit, medicine batch tracking, expiry date alerts, and POS counter billing." },
      { name: "TPA & Insurance Claims Engine", desc: "Pre-authorization form tracking, cashless billing workflows, and insurance claim ledgering." }
    ]
  },
  "manufacturing-scm-erp": {
    title: "Smart Manufacturing & Supply Chain ERP",
    category: "Manufacturing & SCM",
    badge: "Industry 4.0 Ready",
    modulesCount: 18,
    roiMetric: "Boosts shop floor throughput by 32%",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    description: "Enterprise manufacturing and supply chain software regulating multi-level Bill of Materials (BOM), shop floor work orders, multi-warehouse raw material procurement, quality control inspections, and logistics tracking.",
    keyFeatures: [
      "Multi-Level Bill of Materials (BOM) & Cost Estimation",
      "Shop Floor Work Order Scheduling & Capacity Planning",
      "Multi-Warehouse Inventory & Re-order Threshold Alerts",
      "Raw Material Procurement & Vendor Quotation Matrix",
      "Quality Assurance (QA) & Inspection Checklists",
      "Automated Maintenance Scheduling for Factory Machinery",
      "Serial Number & Batch Tracking across Supply Chain",
      "Custom REST APIs for IoT Machinery Sensor Data"
    ],
    modulesDetail: [
      { name: "Bill of Materials (BOM) & Work Orders", desc: "Define raw material recipes, track scrap percentages, and issue automated job work cards." },
      { name: "Multi-Warehouse Inventory Audit", desc: "Real-time stock movement, bin location mapping, and automated purchase requisitions." },
      { name: "Quality Control (QC) Inspection", desc: "Stage-wise quality inspection gates for inbound raw materials and finished goods." },
      { name: "Vendor Management & Logistics", desc: "Purchase order approval hierarchies, vendor rating scorecards, and shipment tracking." }
    ]
  },
  "retail-pos-inventory-erp": {
    title: "Multi-Branch Retail & Omnichannel POS ERP",
    category: "Retail & POS",
    badge: "GST Auto-Filing",
    modulesCount: 12,
    roiMetric: "Speeds up POS checkout billing 4x",
    image: "https://images.unsplash.com/photo-1556742049-0a67568d0490?auto=format&fit=crop&w=800&q=80",
    description: "High-speed retail point-of-sale and inventory system synchronizing multi-store stock, barcode billing, loyalty points, supplier purchase orders, and automated e-invoicing for GST compliance.",
    keyFeatures: [
      "Offline-Capable Touchscreen POS Billing Counter",
      "Barcode & QR Code Printing & Instant Scanning",
      "Real-Time Multi-Branch Stock Transfer & Tracking",
      "Customer Loyalty Points, Coupons & Discounts Engine",
      "Supplier Purchase Order Management & Goods Return",
      "GST E-Invoicing & Automated GSTR-1 / GSTR-3B Reports",
      "E-Commerce Sync (Shopify / WooCommerce / Custom App)",
      "Daily Sales Cash Drawer & Audit Logs"
    ],
    modulesDetail: [
      { name: "High-Speed POS Counter Billing", desc: "Process transactions in 3 seconds, accept cash/UPI/cards, and print thermal receipt bills." },
      { name: "Multi-Store Inventory Synchronization", desc: "Instant stock visibility across all retail outlets with inter-branch transfer orders." },
      { name: "Customer Loyalty & Promotions", desc: "Reward repeat shoppers with points, discount vouchers, and automated birthday promos." },
      { name: "GST Auto-Filing & E-Way Bills", desc: "Generate government-compliant e-invoices and export monthly GSTR data files." }
    ]
  },
  "finance-hrms-erp": {
    title: "Enterprise Finance & HRMS ERP",
    category: "Finance & HRMS",
    badge: "Automated Payroll",
    modulesCount: 15,
    roiMetric: "Cuts monthly payroll processing to 15 mins",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    description: "Integrated financial accounting and human resource management platform. Automate complex payroll calculations (TDS, PF, ESI, Bonus), biometric attendance integration, expense reimbursement workflows, and general ledger audits.",
    keyFeatures: [
      "1-Click Automated Monthly Payroll Engine",
      "Statutory Deductions (PF, ESI, Professional Tax, TDS)",
      "Biometric Machine & Geofenced Mobile Attendance",
      "Leave Request Approval Hierarchies & Encashment",
      "Double-Entry Financial Accounting & General Ledger",
      "Employee Self-Service Portal (Pay Slips & Form 16)",
      "Expense Claim Submission & Reimbursement Workflows",
      "Performance Appraisal & Goal Tracking Matrix"
    ],
    modulesDetail: [
      { name: "Automated Payroll & Statutory Tax", desc: "Generate monthly salary slips with automated PF, ESI, TDS calculations and bank transfer files." },
      { name: "Biometric & Mobile Attendance Sync", desc: "Capture real-time check-ins from fingerprint devices, facial recognition, or GPS mobile app." },
      { name: "Double-Entry Financial Accounting", desc: "Manage chart of accounts, journal vouchers, trial balance, and balance sheet reports." },
      { name: "Employee Self-Service Portal", desc: "Empower staff to apply for leave, submit expense receipts, and download salary slips." }
    ]
  },
  "realestate-crm-erp": {
    title: "Real Estate & Property Management ERP",
    category: "Real Estate & CRM",
    badge: "High Lead Conversion",
    modulesCount: 13,
    roiMetric: "Increases lead conversion by 45%",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    description: "Specialized ERP for property developers and real estate firms. Manage lead pipelines, site visit schedules, property unit availability, payment installment collection, tenant maintenance ticketing, and broker payouts.",
    keyFeatures: [
      "Lead Capture Pipeline & WhatsApp Instant Drips",
      "Interactive 2D/3D Unit Inventory Matrix",
      "Property Booking & Installment Payment Schedules",
      "Tenant Lease Agreement & Monthly Rent Invoicing",
      "Broker Commission Tracking & Payout Approvals",
      "Site Visit Scheduler for Sales Reps",
      "Facility Maintenance Ticketing Portal",
      "Construction Milestone & Budget Expense Tracking"
    ],
    modulesDetail: [
      { name: "Lead Pipeline CRM & Follow-Up Drips", desc: "Capture lead inquiries from portals, assign to sales agents, and send automated WhatsApp brochures." },
      { name: "Unit Inventory & Booking Matrix", desc: "Real-time status of available, booked, and sold flats or commercial spaces." },
      { name: "Installment Schedule & Demand Letters", desc: "Automate construction-linked payment demand letters with interest penalty calculations." },
      { name: "Tenant Lease & Maintenance Portal", desc: "Manage lease renewal dates, rent billing receipts, and maintenance service tickets." }
    ]
  }
};

export default async function ErpProductDetailPage({ params }: { params: Promise<{ product_id: string }> }) {
  const { product_id } = await params;
  
  const product = ERP_DETAILS_DATA[product_id] || {
    title: product_id.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
    category: "Enterprise ERP",
    badge: "Self-Customizable",
    modulesCount: 12,
    roiMetric: "Streamlines enterprise operations & cuts costs by 40%",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    description: "Modular enterprise software tailored for your business needs.",
    keyFeatures: [
      "Customizable Workflow Engine",
      "Role-Based Access Control & Security",
      "API Integrations & Webhooks",
      "Self-Hostable Infrastructure"
    ],
    modulesDetail: [
      { name: "Core System Engine", desc: "Centralized database architecture with multi-branch management." }
    ]
  };

  return <ErpDetailClient product={product} productId={product_id} />;
}
