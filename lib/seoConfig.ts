import type { Metadata } from "next";

export interface PageSeoItem {
  page: string;
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  url: string;
}

export const DEFAULT_OG_IMAGE = "https://www.jcrm.in/og-image.png";

export const SEO_CONFIG: Record<string, PageSeoItem> = {
  "/": {
    page: "Home",
    metaTitle: "JCRM Technologies | IT Training, ERP & SEO Services Noida",
    metaDescription:
      "JCRM Technologies, Noida: industry-ready IT courses with internships & placement support, custom ERP software, and AI-powered SEO & social media services.",
    keywords:
      "JCRM Technologies, IT training institute Noida, ERP software company India, SEO services Noida, internship with placement",
    url: "https://www.jcrm.in",
  },
  "/courses": {
    page: "Courses (listing)",
    metaTitle: "IT & Engineering Courses with Placement | JCRM Noida",
    metaDescription:
      "Explore job-oriented IT courses at JCRM Technologies - web development, AI/ML, data science, cyber security & more with internships and placement assistance.",
    keywords:
      "IT courses Noida, engineering courses with placement, coding classes Noida, internship training program, job oriented courses",
    url: "https://www.jcrm.in/courses",
  },
  "/erp-solutions": {
    page: "ERP Solutions (listing)",
    metaTitle: "ERP Software for Education & Healthcare | JCRM Noida",
    metaDescription:
      "Custom ERP solutions from JCRM Technologies - institute LMS ERP, coaching EdTech ERP, hospital and clinic management systems built for Indian organisations.",
    keywords:
      "ERP software India, education ERP, healthcare ERP, hospital management system, school management software",
    url: "https://www.jcrm.in/erp-solutions",
  },
  "/services": {
    page: "Services (listing)",
    metaTitle: "Digital Marketing Services - SEO & Social Media | JCRM",
    metaDescription:
      "Grow your business with JCRM's AI-powered digital marketing services - SEO packages and social media management designed for startups and SMEs in India.",
    keywords:
      "digital marketing services Noida, SEO company India, social media marketing agency, AI marketing services",
    url: "https://www.jcrm.in/services",
  },
  "/services/seo": {
    page: "SEO Services",
    metaTitle: "AI-Powered SEO Services & Packages in Noida | JCRM",
    metaDescription:
      "Rank higher on Google with JCRM's AI-powered SEO services - keyword research, on-page & technical SEO, content and link building in affordable monthly packages.",
    keywords:
      "SEO services Noida, SEO packages India, AI SEO agency, local SEO company, affordable SEO services",
    url: "https://www.jcrm.in/services/seo",
  },
  "/services/social-media": {
    page: "Social Media Services",
    metaTitle: "Social Media Management Services | JCRM Technologies",
    metaDescription:
      "End-to-end social media management by JCRM - content creation, posting, engagement and ads across Instagram, Facebook & LinkedIn. Plans for every budget.",
    keywords:
      "social media management Noida, SMM packages India, Instagram marketing agency, social media agency for small business",
    url: "https://www.jcrm.in/services/social-media",
  },
  "/services/website-development": {
    page: "Website Development",
    metaTitle: "Website & Web App Development Services Noida | JCRM Technologies",
    metaDescription:
      "Custom, high-converting websites and full-stack web applications by JCRM Technologies Noida. Next.js, React, Node.js, and e-commerce solutions built for speed and ROI.",
    keywords:
      "website development Noida, web development company India, Next.js web development, custom web app development, ecommerce website Noida",
    url: "https://www.jcrm.in/services/website-development",
  },
  "/services/mobile-app-development": {
    page: "Mobile App Development",
    metaTitle: "Mobile App Development Services Noida | iOS & Android Apps JCRM",
    metaDescription:
      "Build high-performance iOS, Android, and Flutter mobile applications with JCRM Technologies. Native & cross-platform solutions with intuitive UI/UX and store publishing.",
    keywords:
      "mobile app development Noida, iOS app developers India, Android app development, Flutter app development company, cross-platform apps",
    url: "https://www.jcrm.in/services/mobile-app-development",
  },
  "/services/ai-video-production": {
    page: "AI Video Production & Editing",
    metaTitle: "AI Video Production & Editing Services | JCRM Technologies",
    metaDescription:
      "High-retention AI videos, digital spokesperson avatars, viral Reels and commercial ads by JCRM Technologies. Studio-grade editing, AI voiceovers & 4K production.",
    keywords:
      "AI video production, AI video editing services India, Instagram reels video editor, AI avatar video generator, corporate video production Noida",
    url: "https://www.jcrm.in/services/ai-video-production",
  },
  "/about": {
    page: "About Us",
    metaTitle: "About JCRM Technologies - ISO Certified IT Company Noida",
    metaDescription:
      "Learn about JCRM Technologies, an ISO 9001:2015 certified, MSME-registered IT company in Noida offering training, ERP software and digital marketing services.",
    keywords:
      "about JCRM Technologies, IT company Noida, ISO certified software company, MSME registered IT firm",
    url: "https://www.jcrm.in/about",
  },
  "/contact": {
    page: "Contact",
    metaTitle: "Contact JCRM Technologies Noida | Enquiries & Support",
    metaDescription:
      "Get in touch with JCRM Technologies, Noida for course admissions, ERP demos or digital marketing enquiries. Call, email or visit our office today.",
    keywords:
      "contact JCRM, JCRM Technologies Noida address, ERP demo enquiry, course admission contact",
    url: "https://www.jcrm.in/contact",
  },
  "/key-clients": {
    page: "Key Clients",
    metaTitle: "Our Key Clients & Partners | JCRM Technologies",
    metaDescription:
      "See the schools, hospitals, startups and businesses that trust JCRM Technologies for ERP software, IT training and digital marketing across India.",
    keywords:
      "JCRM clients, ERP software clients India, IT company portfolio, trusted software partner",
    url: "https://www.jcrm.in/key-clients",
  },
  "/ourteam": {
    page: "Our Team",
    metaTitle: "Meet Our Team - Trainers & Developers | JCRM",
    metaDescription:
      "Meet the trainers, developers and digital marketers behind JCRM Technologies - industry professionals mentoring students and building enterprise software.",
    keywords:
      "JCRM team, IT trainers Noida, software development team, expert mentors",
    url: "https://www.jcrm.in/ourteam",
  },
  "/placements": {
    page: "Placements",
    metaTitle: "Student Placements & Success Stories | JCRM Noida",
    metaDescription:
      "JCRM placement records: students placed in top IT companies after our courses and internships. See our hiring partners, packages and success stories.",
    keywords:
      "JCRM placements, IT training with placement Noida, placement assistance courses, student success stories",
    url: "https://www.jcrm.in/placements",
  },
  "/testimonials": {
    page: "Testimonials",
    metaTitle: "Student & Client Testimonials | JCRM Technologies",
    metaDescription:
      "Read honest reviews from JCRM students and business clients - course experiences, placement outcomes, ERP implementations and marketing results.",
    keywords:
      "JCRM reviews, JCRM Technologies testimonials, student feedback, client reviews",
    url: "https://www.jcrm.in/testimonials",
  },
  "/workshop": {
    page: "Workshop",
    metaTitle: "Tech Workshops & Seminars for Students | JCRM Noida",
    metaDescription:
      "Hands-on tech workshops by JCRM Technologies - AI, coding, cyber security and career-focused seminars for colleges and students across Delhi NCR.",
    keywords:
      "tech workshop Noida, college workshops India, AI workshop for students, coding seminar Delhi NCR",
    url: "https://www.jcrm.in/workshop",
  },
  "/joinus": {
    page: "Join Us (Careers)",
    metaTitle: "Careers at JCRM - Jobs & Internships in Noida",
    metaDescription:
      "Join JCRM Technologies: open roles for trainers, developers and marketers, plus internship opportunities for students in Noida. Apply online today.",
    keywords:
      "JCRM careers, IT jobs Noida, internship opportunities Noida, trainer jobs, developer jobs",
    url: "https://www.jcrm.in/joinus",
  },
  "/legal/privacy": {
    page: "Privacy Policy",
    metaTitle: "Privacy Policy | JCRM Technologies",
    metaDescription:
      "Read how JCRM Technologies collects, uses and protects your personal data across our website, courses, ERP products and services.",
    keywords:
      "JCRM privacy policy, data protection, personal information policy",
    url: "https://www.jcrm.in/legal/privacy",
  },
  "/legal/terms": {
    page: "Terms & Conditions",
    metaTitle: "Terms & Conditions | JCRM Technologies",
    metaDescription:
      "Terms and conditions for using JCRM Technologies' website, courses, ERP products and digital marketing services.",
    keywords:
      "JCRM terms and conditions, terms of service, user agreement",
    url: "https://www.jcrm.in/legal/terms",
  },
  "/legal/refund": {
    page: "Refund Policy",
    metaTitle: "Refund & Cancellation Policy | JCRM Technologies",
    metaDescription:
      "JCRM Technologies' refund and cancellation policy for course fees, ERP subscriptions and digital marketing services.",
    keywords:
      "JCRM refund policy, course fee refund, cancellation policy",
    url: "https://www.jcrm.in/legal/refund",
  },
  "/legal/cookies": {
    page: "Cookie Policy",
    metaTitle: "Cookie Policy | JCRM Technologies",
    metaDescription:
      "Learn how JCRM Technologies uses cookies and similar technologies to improve your browsing experience on jcrm.in.",
    keywords:
      "JCRM cookie policy, cookies usage, website tracking policy",
    url: "https://www.jcrm.in/legal/cookies",
  },
  "/courses/frontend-development": {
    page: "Course: Frontend Development",
    metaTitle: "Frontend Development Course with Placement | JCRM Noida",
    metaDescription:
      "Learn HTML, CSS, JavaScript and React in JCRM's frontend development course - live projects, internship and placement assistance in Noida.",
    keywords:
      "frontend development course Noida, React course with placement, web development training, JavaScript classes",
    url: "https://www.jcrm.in/courses/frontend-development",
  },
  "/courses/backend-development": {
    page: "Course: Backend Development",
    metaTitle: "Backend Development Course - Node & APIs | JCRM Noida",
    metaDescription:
      "Master server-side development at JCRM - Node.js, databases, REST APIs and deployment with real projects, internship and placement support.",
    keywords:
      "backend development course Noida, Node.js training, API development course, full stack backend classes",
    url: "https://www.jcrm.in/courses/backend-development",
  },
  "/courses/ai-machine-learning": {
    page: "Course: AI & Machine Learning",
    metaTitle: "AI & Machine Learning Course with Placement | JCRM",
    metaDescription:
      "Build a career in AI with JCRM's machine learning course - Python, ML algorithms, deep learning and GenAI projects with internship & placement help.",
    keywords:
      "AI ML course Noida, machine learning training with placement, artificial intelligence course India, deep learning classes",
    url: "https://www.jcrm.in/courses/ai-machine-learning",
  },
  "/courses/data-science": {
    page: "Course: Data Science",
    metaTitle: "Data Science Course in Noida with Placement | JCRM",
    metaDescription:
      "JCRM's data science course covers Python, statistics, SQL, visualisation and ML - hands-on projects, internship and placement assistance included.",
    keywords:
      "data science course Noida, data analytics training, Python for data science, data science with placement",
    url: "https://www.jcrm.in/courses/data-science",
  },
  "/courses/cyber-security": {
    page: "Course: Cyber Security",
    metaTitle: "Cyber Security Course with Certification | JCRM Noida",
    metaDescription:
      "Train in ethical hacking, network security and security tools with JCRM's cyber security course - practical labs, internship and placement support.",
    keywords:
      "cyber security course Noida, ethical hacking training, network security certification, cyber security with placement",
    url: "https://www.jcrm.in/courses/cyber-security",
  },
  "/courses/forensic-science": {
    page: "Course: Forensic Science",
    metaTitle: "Forensic Science Course with Training | JCRM Noida",
    metaDescription:
      "Explore JCRM's forensic science program - digital forensics, investigation techniques and lab practice with expert mentors and career guidance.",
    keywords:
      "forensic science course Noida, digital forensics training, cyber forensics course, forensic investigation program",
    url: "https://www.jcrm.in/courses/forensic-science",
  },
  "/courses/cloud-devops": {
    page: "Course: Cloud & DevOps",
    metaTitle: "Cloud Computing & DevOps Course | JCRM Noida",
    metaDescription:
      "Learn AWS, Docker, Kubernetes and CI/CD pipelines in JCRM's cloud & DevOps course - real deployments, internship and placement assistance.",
    keywords:
      "cloud computing course Noida, DevOps training with placement, AWS course, Kubernetes Docker training",
    url: "https://www.jcrm.in/courses/cloud-devops",
  },
  "/courses/qa-automation": {
    page: "Course: QA Automation",
    metaTitle: "QA & Automation Testing Course | JCRM Noida",
    metaDescription:
      "Become a QA engineer with JCRM - manual testing, Selenium automation, API testing and frameworks, plus internship and placement support.",
    keywords:
      "software testing course Noida, QA automation training, Selenium course with placement, manual testing classes",
    url: "https://www.jcrm.in/courses/qa-automation",
  },
  "/courses/digital-marketing": {
    page: "Course: Digital Marketing",
    metaTitle: "Digital Marketing Course with Placement | JCRM Noida",
    metaDescription:
      "JCRM's digital marketing course covers SEO, social media, Google Ads and AI marketing tools - live campaigns, internship and placement assistance.",
    keywords:
      "digital marketing course Noida, SEO course with placement, social media marketing training, Google Ads course",
    url: "https://www.jcrm.in/courses/digital-marketing",
  },
  "/courses/zen-ai": {
    page: "Course: Zen AI",
    metaTitle: "Zen AI Program - Generative AI Course | JCRM",
    metaDescription:
      "Join JCRM's Zen AI program - hands-on generative AI, prompt engineering and AI tools training to future-proof your career. Internship included.",
    keywords:
      "generative AI course Noida, Zen AI JCRM, prompt engineering training, AI tools course",
    url: "https://www.jcrm.in/courses/zen-ai",
  },
  "/erp-solutions/institute-lms-erp": {
    page: "ERP: Institute LMS",
    metaTitle: "Institute LMS & ERP Software for Colleges | JCRM",
    metaDescription:
      "All-in-one institute ERP with LMS by JCRM - admissions, fees, attendance, exams and online learning for schools, colleges and universities.",
    keywords:
      "institute ERP software, college LMS India, school management ERP, campus management system",
    url: "https://www.jcrm.in/erp-solutions/institute-lms-erp",
  },
  "/erp-solutions/coaching-edtech-erp": {
    page: "ERP: Coaching & EdTech",
    metaTitle: "Coaching Institute & EdTech ERP Software | JCRM",
    metaDescription:
      "Run your coaching centre on JCRM's EdTech ERP - batch management, fee tracking, online classes, test series and parent communication in one platform.",
    keywords:
      "coaching institute software, EdTech ERP India, coaching management system, online class software",
    url: "https://www.jcrm.in/erp-solutions/coaching-edtech-erp",
  },
  "/erp-solutions/healthcare-hospital-erp": {
    page: "ERP: Healthcare & Hospital",
    metaTitle: "Hospital Management ERP Software | JCRM Technologies",
    metaDescription:
      "JCRM's hospital ERP streamlines OPD/IPD, billing, pharmacy, labs and patient records - a complete HMS for hospitals and multi-specialty clinics.",
    keywords:
      "hospital management software India, healthcare ERP, HMS software, hospital billing system",
    url: "https://www.jcrm.in/erp-solutions/healthcare-hospital-erp",
  },
  "/erp-solutions/clinic-dental-pharmacy-erp": {
    page: "ERP: Clinic, Dental & Pharmacy",
    metaTitle: "Clinic, Dental & Pharmacy Management Software | JCRM",
    metaDescription:
      "Manage appointments, prescriptions, billing and inventory with JCRM's clinic, dental and pharmacy ERP - simple software for small practices.",
    keywords:
      "clinic management software, dental practice software India, pharmacy billing software, clinic ERP",
    url: "https://www.jcrm.in/erp-solutions/clinic-dental-pharmacy-erp",
  },
};

/**
 * Returns a Next.js Metadata object configured per the requested path.
 * If the path is not explicitly configured, falls back to the Home page values.
 */
export function getSeoMetadata(path: string): Metadata {
  const normalizedPath =
    path !== "/" && path.endsWith("/") ? path.slice(0, -1) : path;
  const item = SEO_CONFIG[normalizedPath] || SEO_CONFIG["/"];

  return {
    title: {
      absolute: item.metaTitle,
    },
    description: item.metaDescription,
    keywords: item.keywords.split(",").map((k) => k.trim()),
    alternates: {
      canonical: item.url,
    },
    openGraph: {
      title: item.metaTitle,
      description: item.metaDescription,
      url: item.url,
      type: "website",
      siteName: "JCRM Technologies",
      locale: "en_IN",
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1200,
          height: 630,
          alt: item.metaTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: item.metaTitle,
      description: item.metaDescription,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
