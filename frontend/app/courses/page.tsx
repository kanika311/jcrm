import { getSiteContent } from "@/lib/cms";
import CoursesCatalogClient from "./CoursesCatalogClient";

export const courses = [
  {
    id: "frontend-development",
    title: "Frontend Development",
    instructor: "Aisha Verma",
    rating: "4.9",
    level: "Beginner",
    tags: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    price: "₹14,999",
    badge: "100% Placement",
    badgeClass: "badge-warning",
    color: "from-[#0055FF] to-sky-400",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
    description: "Master modern responsive web apps, state management, and Next.js frontend architecture."
  },
  {
    id: "backend-development",
    title: "Backend Development",
    instructor: "Gautam Sahu",
    rating: "4.9",
    level: "Intermediate",
    tags: ["Java Spring Boot", "Node.js", "Microservices", "PostgreSQL"],
    price: "₹16,999",
    badge: "High Demand",
    badgeClass: "badge-warning",
    color: "from-blue-600 to-indigo-700",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    description: "Build high-scale microservices, REST APIs, Kafka streaming, and robust backend architectures."
  },
  {
    id: "ai-machine-learning",
    title: "AI & Machine Learning",
    instructor: "Dr. Sarah Jenkins",
    rating: "4.9",
    level: "Advanced",
    tags: ["Python", "PyTorch", "LLMs", "RAG Pipeline", "MLOps"],
    price: "₹19,999",
    badge: "Flagship",
    badgeClass: "badge-danger",
    color: "from-purple-600 to-indigo-600",
    image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    description: "Build Neural Networks, Generative AI models, Retrieval-Augmented Generation (RAG), and AI agents."
  },
  {
    id: "data-science",
    title: "Data Science",
    instructor: "Dr. Rajesh Verma",
    rating: "4.8",
    level: "Intermediate",
    tags: ["Python", "Pandas", "SQL", "Tableau", "Power BI"],
    price: "₹15,999",
    badge: "Popular",
    badgeClass: "badge-warning",
    color: "from-emerald-500 to-teal-600",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    description: "Master statistical modeling, data visualization, predictive analytics, and enterprise data warehousing."
  },
  {
    id: "cyber-security",
    title: "Cyber Security",
    instructor: "Vikram Malhotra",
    rating: "4.9",
    level: "Advanced",
    tags: ["Ethical Hacking", "VAPT", "SOC Operations", "SIEM"],
    price: "₹17,999",
    badge: "Critical Skill",
    badgeClass: "badge-danger",
    color: "from-rose-600 to-red-700",
    image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
    description: "Master network penetration testing, SOC monitoring, incident response, and ethical hacking protocols."
  },
  {
    id: "forensic-science",
    title: "Forensic Science",
    instructor: "Dr. Ananya Roy",
    rating: "4.8",
    level: "Specialized",
    tags: ["Digital Forensics", "Cyber Crime Investigation", "Memory Analysis"],
    price: "₹18,999",
    badge: "Specialized",
    badgeClass: "badge-success",
    color: "from-slate-700 to-blue-900",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    description: "Investigate digital evidence, memory & disk forensic analysis, mobile forensics, and chain of custody."
  },
  {
    id: "cloud-devops",
    title: "Cloud & DevOps",
    instructor: "Shwati Singh",
    rating: "4.9",
    level: "Intermediate",
    tags: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"],
    price: "₹16,999",
    badge: "Bestseller",
    badgeClass: "badge-warning",
    color: "from-sky-500 to-blue-600",
    image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    description: "Automate cloud deployment pipelines, container orchestration with Kubernetes, and IaC with Terraform."
  },
  {
    id: "qa-automation",
    title: "QA Automation",
    instructor: "Pronay Dey",
    rating: "4.8",
    level: "Beginner",
    tags: ["Selenium", "Cypress", "Java", "API Testing", "Playwright"],
    price: "₹13,999",
    badge: "Job Ready",
    badgeClass: "badge-success",
    color: "from-amber-500 to-orange-600",
    image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    description: "Master automated software testing, E2E browser testing, REST API automation, and CI test suites."
  },
  {
    id: "digital-marketing",
    title: "Digital Marketing",
    instructor: "Neha Sharma",
    rating: "4.7",
    level: "Beginner",
    tags: ["SEO", "Performance Ads", "Google Ads", "Meta Ads", "Analytics"],
    price: "₹12,999",
    badge: "Fast Track",
    badgeClass: "badge-success",
    color: "from-violet-500 to-pink-500",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    description: "Master performance marketing, Search Engine Optimization (SEO), PPC campaigns, and conversion analytics."
  },
  {
    id: "zen-ai",
    title: "Zen AI",
    instructor: "Rohan Verma",
    rating: "4.9",
    level: "Advanced",
    tags: ["Zen AI", "Autonomous Agents", "Prompt Engineering", "Multi-Agent Workflows"],
    price: "₹21,999",
    badge: "Cutting Edge",
    badgeClass: "badge-warning",
    color: "from-blue-600 via-indigo-600 to-purple-700",
    image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
    description: "Build autonomous AI agents, multi-agent orchestrations, and enterprise cognitive software with Zen AI."
  }
];

export default async function CoursesCatalog() {
  const cmsData = await getSiteContent("public-courses");
  return <CoursesCatalogClient cmsData={cmsData} courses={courses} />;
}