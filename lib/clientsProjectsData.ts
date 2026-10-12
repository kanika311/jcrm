export interface ClientProjectItem {
  id: string;
  projectName: string;
  clientName: string;
  category: string;
  badge?: string;
  description: string;
  image: string;
  logo?: string;
  projectUrl?: string;
  techStack: string[];
  stats?: string;
  featured?: boolean;
  orderIndex?: number;
  status: "PUBLISHED" | "DRAFT";
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_CLIENTS_PROJECTS: ClientProjectItem[] = [
  {
    id: "proj-1",
    projectName: "Enterprise Cloud ERP & Workforce Portal",
    clientName: "Tata Consultancy Services (TCS) Partner Network",
    category: "Enterprise ERP",
    badge: "Enterprise Scaled",
    description: "Multi-tenant resource deployment and automated engineer onboarding ecosystem handling 15,000+ technical users with compliance monitoring.",
    image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/erp-solutions",
    techStack: ["Next.js", "TypeScript", "PostgreSQL", "Docker", "AWS"],
    stats: "15k+ Users • 99.9% Uptime",
    featured: true,
    orderIndex: 1,
    status: "PUBLISHED",
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-03-20T12:00:00.000Z",
  },
  {
    id: "proj-2",
    projectName: "Automated Code Auditing & QA Pipeline",
    clientName: "CodeAssure Private Limited",
    category: "DevSecOps & Cloud",
    badge: "AI-Powered",
    description: "Automated vulnerability scanner and pull request inspection engine, slashing pull request security review time by 75%.",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/erp-solutions",
    techStack: ["Python", "FastAPI", "React", "Docker", "Kubernetes"],
    stats: "4x Faster Audits • 0 Critical Breaches",
    featured: true,
    orderIndex: 2,
    status: "PUBLISHED",
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-03-25T14:30:00.000Z",
  },
  {
    id: "proj-3",
    projectName: "Smart Fleet Telemetry & Warehouse Hub",
    clientName: "Apex Global Logistics",
    category: "Supply Chain & IoT",
    badge: "Live Production",
    description: "Real-time dispatch telemetry and dynamic cargo allocation engine processing nationwide deliveries with predictive route optimization.",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/erp-solutions",
    techStack: ["Node.js", "MongoDB", "Tailwind CSS", "Redis", "Kafka"],
    stats: "32% Cost Saved • 50k+ Shipments",
    featured: true,
    orderIndex: 3,
    status: "PUBLISHED",
    createdAt: "2026-02-10T08:00:00.000Z",
    updatedAt: "2026-04-01T11:00:00.000Z",
  },
  {
    id: "proj-4",
    projectName: "Instant Micro-Lending & Risk Underwriting",
    clientName: "FinVantage Capital",
    category: "FinTech Platform",
    badge: "High Impact",
    description: "Sub-second digital KYC verification, biometric fraud scoring, and instant UPI loan disbursement infrastructure for retail applicants.",
    image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/services",
    techStack: ["Next.js", "Prisma", "Express", "PostgreSQL", "Tailwind"],
    stats: "₹120Cr+ Disbursed • <3s Decision",
    featured: true,
    orderIndex: 4,
    status: "PUBLISHED",
    createdAt: "2026-02-15T09:30:00.000Z",
    updatedAt: "2026-04-05T16:00:00.000Z",
  },
  {
    id: "proj-5",
    projectName: "Interactive Cloud LMS & Coding Sandbox",
    clientName: "EduSphere Global Academy",
    category: "EdTech & LMS",
    badge: "Award Winner",
    description: "End-to-end learning lifecycle platform featuring in-browser code execution, proctored assessments, and automated certificate generation.",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/courses",
    techStack: ["Next.js 15", "WebRTC", "PostgreSQL", "Tailwind CSS"],
    stats: "45k+ Students • 94% Completion",
    featured: true,
    orderIndex: 5,
    status: "PUBLISHED",
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-04-10T09:20:00.000Z",
  },
  {
    id: "proj-6",
    projectName: "Hospital EHR & Telemedicine Suite",
    clientName: "MediPulse Health Systems",
    category: "HealthTech",
    badge: "HIPAA Compliant",
    description: "Secure electronic health records, OPD queue management, diagnostic report delivery, and high-definition doctor teleconsultation module.",
    image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=800&q=80",
    logo: "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80",
    projectUrl: "/erp-solutions",
    techStack: ["React", "FastAPI", "MongoDB", "WebSockets"],
    stats: "200+ Hospitals • 1M+ Records",
    featured: true,
    orderIndex: 6,
    status: "PUBLISHED",
    createdAt: "2026-03-12T11:00:00.000Z",
    updatedAt: "2026-04-11T15:00:00.000Z",
  },
];
