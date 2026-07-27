import { getSiteContent } from "@/lib/cms";
import ErpCatalogClient from "./ErpCatalogClient";

export const erpProducts = [
  // 1. Education & Academies
  {
    id: "institute-lms-erp",
    title: "Institute & Academy LMS ERP",
    category: "Education & Academies",
    badge: "Most Popular for Academies",
    modulesCount: 14,
    roiMetric: "Saves 35+ hrs/wk in admin workload",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80",
    description: "End-to-end education ERP automating student admissions, automated fee collection with GST receipts, live online class delivery, attendance tracking, and parent communication via WhatsApp.",
    modules: ["Student Admission", "Fee Management", "LMS & Live Classes", "Parent Portal", "WhatsApp Gateway", "Examination & Report Cards"]
  },
  {
    id: "coaching-edtech-erp",
    title: "Coaching & Test-Prep Academy ERP",
    category: "Education & Academies",
    badge: "High Conversion EdTech",
    modulesCount: 12,
    roiMetric: "Increases student renewal rates by 40%",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    description: "Specialized coaching ERP featuring online mock test engines, student performance analytics, automated batch scheduling, fee installment tracking, and digital study material delivery.",
    modules: ["Mock Test Engine", "Batch Scheduling", "Installment Tracker", "Performance Analytics", "Study Material Portal", "SMS/WhatsApp Alerts"]
  },

  // 2. Healthcare & Wellness
  {
    id: "healthcare-hospital-erp",
    title: "Healthcare & Clinical Hospital ERP",
    category: "Healthcare & Wellness",
    badge: "NABH Compliant",
    modulesCount: 16,
    roiMetric: "Cuts patient OPD wait times by 60%",
    image: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=800&q=80",
    description: "Integrated hospital management software powering OPD/IPD patient registration, Electronic Health Records (EHR), pharmacy inventory control, diagnostic lab LIMS, and doctor appointment scheduling.",
    modules: ["OPD/IPD Management", "Electronic Health Records", "Pharmacy Billing", "Diagnostic LIMS", "Bed Inventory", "Telemedicine"]
  },
  {
    id: "clinic-dental-pharmacy-erp",
    title: "Polyclinic & Pharmacy Chain ERP",
    category: "Healthcare & Wellness",
    badge: "Multi-Branch Clinic",
    modulesCount: 13,
    roiMetric: "Prevents medicine stockouts by 100%",
    image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight polyclinic & pharmacy chain software for multi-doctor appointment queues, e-prescriptions, inventory batch tracking, medicine expiry alerts, and GST billing.",
    modules: ["Doctor Queue Token", "E-Prescriptions", "Pharmacy Batch Audit", "Expiry Alerts", "Lab Sample Dispatch", "Patient Medical History"]
  },

  // 3. Manufacturing & Logistics
  {
    id: "manufacturing-scm-erp",
    title: "Smart Manufacturing & Supply Chain ERP",
    category: "Manufacturing & Logistics",
    badge: "Industry 4.0 Ready",
    modulesCount: 18,
    roiMetric: "Boosts shop floor throughput by 32%",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80",
    description: "Enterprise manufacturing ERP regulating Bill of Materials (BOM), multi-warehouse raw material procurement, shop floor scheduling, quality inspection, and automated vendor logistics.",
    modules: ["Bill of Materials (BOM)", "Shop Floor Control", "Multi-Warehouse Stock", "Vendor Procurement", "Quality Control (QC)", "Logistics Tracking"]
  },
  {
    id: "fleet-logistics-erp",
    title: "Fleet & Warehouse Logistics ERP",
    category: "Manufacturing & Logistics",
    badge: "GPS & IoT Tracking",
    modulesCount: 15,
    roiMetric: "Reduces fleet fuel & maintenance cost by 25%",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    description: "Automated logistics and fleet management platform for vehicle tracking, dispatch route optimization, driver trip expenses, warehouse bin location management, and proof-of-delivery digital signatures.",
    modules: ["GPS Live Vehicle Track", "Route Optimization", "Driver Trip Expenses", "Warehouse Bin Mapping", "Proof of Delivery", "Fuel Audit"]
  },

  // 4. Retail & E-Commerce
  {
    id: "retail-pos-inventory-erp",
    title: "Multi-Branch Retail & Omnichannel POS ERP",
    category: "Retail & E-Commerce",
    badge: "GST Auto-Filing",
    modulesCount: 12,
    roiMetric: "Speeds up POS checkout billing 4x",
    image: "https://images.unsplash.com/photo-1556742049-0a67568d0490?auto=format&fit=crop&w=800&q=80",
    description: "Omnichannel retail POS and inventory management system synchronizing stock across physical stores & e-commerce channels, barcode billing, customer loyalty programs, and GST e-invoicing.",
    modules: ["Omnichannel POS Billing", "Multi-Store Stock Sync", "Barcode Generator", "Loyalty Rewards", "Supplier Orders", "GST E-Invoicing"]
  },
  {
    id: "restaurant-hotel-pos-erp",
    title: "Restaurant & Hotel POS Cloud ERP",
    category: "Retail & E-Commerce",
    badge: "Kitchen Order Display (KOT)",
    modulesCount: 14,
    roiMetric: "Eliminates food order errors by 99%",
    image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    description: "Complete hospitality POS software managing table reservation, Kitchen Order Tickets (KOT), Swiggy/Zomato online delivery integration, room booking, recipe inventory costing, and cashier audit.",
    modules: ["Table POS & KOT", "Swiggy/Zomato Sync", "Room Booking Engine", "Recipe Food Costing", "Cashier Drawer Audit", "QR Table Ordering"]
  },

  // 5. Corporate & Services
  {
    id: "finance-hrms-erp",
    title: "Enterprise Finance & HRMS ERP",
    category: "Corporate & Services",
    badge: "Automated Payroll",
    modulesCount: 15,
    roiMetric: "Cuts monthly payroll processing to 15 mins",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80",
    description: "Complete financial accounting and human resource management ERP for automated payroll calculation (PF/ESI/TDS), biometric attendance tracking, expense claims, and double-entry ledger auditing.",
    modules: ["Automated Payroll & Tax", "Biometric Attendance", "General Ledger", "Expense Management", "Employee Onboarding", "Performance Review"]
  },
  {
    id: "agency-project-crm-erp",
    title: "IT Agency & Client Billing CRM ERP",
    category: "Corporate & Services",
    badge: "Agile Project Tracking",
    modulesCount: 13,
    roiMetric: "Increases billable agency hours by 30%",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    description: "Built for software agencies and consultancies: track client project milestones, employee timesheets, recurring invoice billing, retainer budgets, and lead acquisition pipelines.",
    modules: ["Client Lead CRM", "Project Kanban & Sprint", "Timesheet Tracking", "Retainer Invoicing", "Client Portal", "Expense Accounting"]
  },

  // 6. Real Estate & Construction
  {
    id: "realestate-crm-erp",
    title: "Real Estate & Property Management ERP",
    category: "Real Estate & Construction",
    badge: "High Lead Conversion",
    modulesCount: 13,
    roiMetric: "Increases lead conversion by 45%",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
    description: "Specialized real estate ERP featuring lead pipeline CRM, property unit inventory, installment booking schedules, tenant maintenance ticketing, and broker payouts.",
    modules: ["Lead Pipeline CRM", "Unit Inventory", "Payment Installment Tracker", "Tenant Portal", "Broker Commissions", "Site Visit Scheduler"]
  },

  // 7. Daily Operations & Smart Automation
  {
    id: "smart-field-workforce-erp",
    title: "Field Workforce & Ticket Automation ERP",
    category: "Daily Operations & Smart Automation",
    badge: "Day-to-Day Operations Solver",
    modulesCount: 14,
    roiMetric: "Resolves customer service tickets 3x faster",
    image: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?auto=format&fit=crop&w=800&q=80",
    description: "Solves daily operational field problems: track field service technicians on map, automate service ticketing, issue spare parts inventory, capture customer feedback signatures, and automate SLA escalations.",
    modules: ["GPS Field Tech Map", "Automated Service Tickets", "Spare Parts Stock", "Digital Signature Capture", "SLA Escalation Engine", "WhatsApp Status Updates"]
  }
];

export default async function ErpSolutionsPage() {
  const cmsData = await getSiteContent("public-erp-solutions");
  return <ErpCatalogClient products={erpProducts} />;
}
