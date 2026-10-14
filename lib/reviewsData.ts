export interface ReviewItem {
  id: string;
  author: string;          // Reviewer's full name
  role: string;            // Designation / Title (e.g. "DevOps Engineer @ Tech Solutions")
  company?: string;        // Company or institution
  quote: string;           // Review / testimonial text
  rating: number;          // 1 to 5
  avatar?: string;         // Optional profile picture URL
  screenshot?: string;     // Optional review screenshot / certificate / proof URL
  status: "ACTIVE" | "INACTIVE" | "PENDING";
  isActive: boolean;       // Active toggle
  featured?: boolean;      // Show on homepage
  userSubmitted?: boolean; // Submitted by user from website
  email?: string;          // Optional user email
  orderIndex?: number;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    author: "Raghav Mishra",
    role: "Operations Director, V-Logistics",
    company: "V-Logistics",
    quote: "JCRM Technologies ERP system unified our branch operations seamlessly. Our billing, logistics, and student admissions are now completely automated in a single cloud dashboard.",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 1,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-01-10T10:00:00.000Z",
  },
  {
    id: "rev-2",
    author: "Shwati Singh",
    role: "DevOps Engineer @ Tech Solutions",
    company: "Tech Solutions",
    quote: "Hands-on engineering training at JCRM Technologies prepared me for real-world DevOps & Cloud deployment in just 3 months. Now working as a Senior Engineer at Tech Solutions!",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 2,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-01-15T10:00:00.000Z",
  },
  {
    id: "rev-3",
    author: "Dr. Rajesh Verma",
    role: "Managing Director, CityCare Health",
    company: "CityCare Health",
    quote: "The LMS & Hospital ERP solutions built by JCRM Technologies exceeded our performance expectations. Fast database queries, secure EHR records, and reliable technical support.",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 3,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-02-01T10:00:00.000Z",
  },
  {
    id: "rev-4",
    author: "Gautam Sahu",
    role: "Software Engineer @ LTI Mindtree",
    company: "LTI Mindtree",
    quote: "JCRM Technologies completely transformed my career. Their hands-on ERP development and real-world full-stack curriculum gave me the exact skills needed to transition to a senior role.",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 4,
    createdAt: "2026-02-12T10:00:00.000Z",
    updatedAt: "2026-02-12T10:00:00.000Z",
  },
  {
    id: "rev-5",
    author: "Pronay Dey",
    role: "Backend Engineer @ Apexon",
    company: "Apexon",
    quote: "The mentorship I received at JCRM Technologies was invaluable. Working on live production microservices & ERP API integrations gave me real industry confidence in technical interviews.",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 5,
    createdAt: "2026-02-20T10:00:00.000Z",
    updatedAt: "2026-02-20T10:00:00.000Z",
  },
  {
    id: "rev-6",
    author: "Abhishek Dey",
    role: "Back-end Engineer @ Cisco",
    company: "Cisco",
    quote: "I truly appreciate the level of knowledge and ERP product training at JCRM Technologies. Special thanks to my instructors for helping me master high-scale backend engineering.",
    rating: 5,
    status: "ACTIVE",
    isActive: true,
    featured: true,
    orderIndex: 6,
    createdAt: "2026-03-01T10:00:00.000Z",
    updatedAt: "2026-03-01T10:00:00.000Z",
  },
];
