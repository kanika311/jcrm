export interface ServicePlan {
  id: string;
  name: string;
  badge?: string;
  isPopular?: boolean;
  price: number; // base price in INR per month
  gstPercent: number; // usually 18%
  period: string; // e.g. "month"
  icon: "star" | "crown" | "diamond" | string;
  features: string[];
  isActive: boolean;
}

export interface ServiceCategory {
  id: string;
  slug: string;
  title: string;
  headline: string;
  subtitle: string;
  badge: string;
  description: string;
  trustTag: string;
  platforms?: string[];
  highlights: { title: string; subtitle: string; icon: string }[];
  plans: ServicePlan[];
  isActive: boolean;
  contactPhone: string;
  contactEmail: string;
  website: string;
}

export interface ServiceOrder {
  id: string;
  serviceId: string;
  serviceTitle: string;
  planId: string;
  planName: string;
  baseAmount: number;
  gstAmount: number;
  totalAmount: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessName?: string;
  websiteUrl?: string;
  notes?: string;
  paymentId?: string;
  orderId?: string;
  signature?: string;
  status: "PENDING" | "PAID" | "ACTIVE" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_SERVICES: ServiceCategory[] = [
  {
    id: "srv_seo",
    slug: "seo",
    title: "AI-Powered SEO Packages",
    headline: "HIGHER RANKS. MAXIMUM RESULTS.",
    subtitle: "SMARTER SEO. STRONGER GROWTH.",
    badge: "GROW YOUR BUSINESS WITH JCRM",
    description:
      "",
    trustTag: "TRUSTED BY SCHOOLS & ENTERPRISES. DRIVEN BY TECHNOLOGY. DELIVERED WITH EXCELLENCE.",
    contactPhone: "+91 8310531309",
    contactEmail: "hr@jcrm.in",
    website: "www.jcrm.in",
    isActive: true,
    highlights: [
      {
        title: "AI-Powered Strategies",
        subtitle: "Future-ready ranking models",
        icon: "shield",
      },
      {
        title: "Higher Rankings",
        subtitle: "Better visibility & traffic",
        icon: "trending-up",
      },
      {
        title: "White Hat SEO",
        subtitle: "100% safe & penalty proof",
        icon: "lock",
      },
      {
        title: "Measurable Results",
        subtitle: "Real growth & transparent ROI",
        icon: "bar-chart",
      },
    ],
    plans: [
      {
        id: "seo_essential",
        name: "ESSENTIAL",
        icon: "star",
        price: 8999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "25 Keywords",
          "150 Quality Backlinks",
          "Pre Optimization Website Analysis",
          "Keyword Research & Analysis",
          "Conversational Optimization",
          "Content Audit for AI-Readiness",
          "Baseline Ranking",
        ],
      },
      {
        id: "seo_advanced",
        name: "ADVANCED",
        icon: "crown",
        badge: "MOST POPULAR",
        price: 11999,
        gstPercent: 18,
        period: "month",
        isPopular: true,
        isActive: true,
        features: [
          "40 Keywords",
          "300 Quality Backlinks",
          "Pre Optimization Website Analysis",
          "Keyword Research & Analysis",
          "Conversational Optimization",
          "Content Audit for AI-Readiness",
          "Baseline Ranking",
          "Google Business Profile (Local SEO)",
          "Competitor Analysis",
          "Duplicate Content Check",
          "Google Penalty Check",
          "Backlink Analysis",
          "Onsite SEO Blogs - 4 per month",
          "GMB Reviews - 8-10 per month",
        ],
      },
      {
        id: "seo_professional",
        name: "PROFESSIONAL",
        icon: "diamond",
        price: 14999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "60 Keywords",
          "450 Quality Backlinks",
          "Pre Optimization Website Analysis",
          "Keyword Research & Analysis",
          "Conversational Optimization",
          "Content Audit for AI-Readiness",
          "Baseline Ranking",
          "Google Business Profile (Local SEO)",
          "Competitor Analysis",
          "Duplicate Content Check",
          "Google Penalty Check",
          "Backlink Analysis",
          "G.E.O (Generative Engine Optimization)",
          "A.E.O (Answer Engine Optimization)",
          "Voice Search Optimization",
          "PAA (People Also Ask) Targeting",
          "Optimized for ChatGPT / Gemini / Perplexity",
          "Onsite SEO Blogs - 4 per month",
          "GMB Reviews - 8-10 per month",
          "Landing Page SEO Optimization + Blog Integration (If Required)",
        ],
      },
    ],
  },
  {
    id: "srv_smm",
    slug: "social-media",
    title: "Social Media Management Services",
    headline: "STRONGER BRANDS. MAXIMUM GROWTH.",
    subtitle: "BUILD ENGAGEMENT. GROW TRUST. DRIVE RESULTS.",
    badge: "GROW YOUR BUSINESS WITH JCRM",
    description:
      "",
    trustTag: "TRUSTED BY BRANDS. DRIVEN BY STRATEGY. DELIVERED WITH EXCELLENCE.",
    platforms: ["FACEBOOK", "LINKEDIN", "INSTAGRAM", "YOUTUBE"],
    contactPhone: "+91 8310531309",
    contactEmail: "hr@jcrm.in",
    website: "www.jcrm.in",
    isActive: true,
    highlights: [
      {
        title: "Consistent Brand Presence",
        subtitle: "Multi-platform brand authority",
        icon: "shield",
      },
      {
        title: "Higher Engagement",
        subtitle: "Better reach & followers",
        icon: "trending-up",
      },
      {
        title: "100% Quality Content",
        subtitle: "Graphics, reels & copy",
        icon: "lock",
      },
      {
        title: "Real Results",
        subtitle: "Real growth & inquiries",
        icon: "bar-chart",
      },
    ],
    plans: [
      {
        id: "smm_essential",
        name: "ESSENTIAL",
        icon: "star",
        price: 8999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "3 Social Media Platforms",
          "12 Posts per Month (4 per week)",
          "Content Creation (Graphics + Captions)",
          "Basic Hashtag Research",
          "Page Optimization",
          "Monthly Performance Report",
          "Inbox Monitoring (Business Hours)",
          "1 Round of Revisions",
        ],
      },
      {
        id: "smm_advanced",
        name: "ADVANCED",
        icon: "crown",
        badge: "MOST POPULAR",
        price: 14999,
        gstPercent: 18,
        period: "month",
        isPopular: true,
        isActive: true,
        features: [
          "3 Social Media Platforms",
          "20 Posts per Month (5 per week)",
          "Custom Content Creation (Graphics + Captions + Reels)",
          "Advanced Hashtag Research",
          "Page Optimization",
          "Community Engagement (Comments & Messages)",
          "Monthly Performance Report with Insights",
          "Competitor Analysis",
          "Ad Management (Up to ₹10,000 Ad Spend)",
          "2 Rounds of Revisions",
        ],
      },
      {
        id: "smm_professional",
        name: "PROFESSIONAL",
        icon: "diamond",
        price: 24999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "3 Social Media Platforms",
          "30 Posts per Month (7-8 per week)",
          "Premium Content Creation (Graphics + Captions + Reels + Videos)",
          "Advanced Hashtag & Trend Research",
          "Complete Page Optimization & Branding",
          "Community Engagement (Comments, Messages, DMs)",
          "Monthly Performance Report with Detailed Insights",
          "Competitor Analysis",
          "Ad Management (Up to ₹25,000 Ad Spend)",
          "Influencer Outreach (If Applicable)",
          "Crisis Management Support",
          "3 Rounds of Revisions",
        ],
      },
    ],
  },
  {
    id: "srv_web_dev",
    slug: "website-development",
    title: "Website & Web App Development",
    headline: "BLAZING-FAST WEBSITES. MODERN ARCHITECTURE.",
    subtitle: "NEXT.JS, FULL-STACK & CMS SOLUTIONS BUILT TO GROW YOUR BUSINESS",
    badge: "ENTERPRISE WEB ENGINEERING",
    description:
      "Custom website and web application development engineered for conversion, lightning-fast speed, and enterprise reliability. From corporate brand showcases and high-converting landing pages to full-scale e-commerce stores and custom SaaS platforms built on Next.js, React, Node.js, and scalable cloud infrastructure.",
    trustTag: "ENGINEERED FOR SPEED, CONVERSIONS & ROCK-SOLID 99.9% UPTIME.",
    platforms: ["NEXT.JS", "REACT", "NODE.JS", "WORDPRESS"],
    contactPhone: "+91 8310531309",
    contactEmail: "hr@jcrm.in",
    website: "www.jcrm.in",
    isActive: true,
    highlights: [
      {
        title: "Next.js & Modern Stack",
        subtitle: "Blazing fast SSR & edge caching",
        icon: "shield",
      },
      {
        title: "95+ PageSpeed & SEO",
        subtitle: "Optimized for Google Core Web Vitals",
        icon: "trending-up",
      },
      {
        title: "Bank-Grade Security",
        subtitle: "SSL, DDoS hardened & automated backups",
        icon: "lock",
      },
      {
        title: "Turnkey Launch",
        subtitle: "Domain, hosting, CDN & email setup",
        icon: "bar-chart",
      },
    ],
    plans: [
      {
        id: "web_business",
        name: "BUSINESS SITE",
        icon: "star",
        price: 14999,
        gstPercent: 18,
        period: "project",
        isPopular: false,
        isActive: true,
        features: [
          "Modern 5-Page Responsive Corporate Website",
          "Next.js & Tailwind CSS / WordPress Architecture",
          "100% Mobile, Tablet & Desktop Optimized",
          "Lead Capture Contact Forms & WhatsApp Chat Integration",
          "On-Page Technical SEO & Google Search Console Setup",
          "Cloudflare Fast CDN & Free SSL Certificate Configuration",
          "Social Media & Google Maps Integration",
          "30 Days Free Maintenance & Hosting Setup Support",
        ],
      },
      {
        id: "web_growth",
        name: "GROWTH & E-COMMERCE",
        icon: "crown",
        badge: "MOST POPULAR",
        price: 29999,
        gstPercent: 18,
        period: "project",
        isPopular: true,
        isActive: true,
        features: [
          "Up to 15 Pages or Full E-Commerce Storefront",
          "Custom Next.js Frontend with Headless CMS / Admin Dashboard",
          "Product Catalog, Shopping Cart & Checkout Flow",
          "Razorpay / Stripe Online Payment Gateway Integration",
          "Dynamic Blog Engine & High-Converting Landing Pages",
          "95+ Google PageSpeed Guarantee & Advanced Schema Markup",
          "Customer Reviews, Testimonials & WhatsApp Order Alerts",
          "Automated Transactional Emails & Inquiry Alerts",
          "Google Analytics 4 & Meta Pixel Setup",
          "60 Days Dedicated Technical Maintenance & Updates",
        ],
      },
      {
        id: "web_enterprise",
        name: "CUSTOM WEB PLATFORM",
        icon: "diamond",
        price: 59999,
        gstPercent: 18,
        period: "project",
        isPopular: false,
        isActive: true,
        features: [
          "Custom SaaS / Web Application Architecture with Node.js & Prisma",
          "Role-Based Multi-User Authentication (RBAC) & Portals",
          "Custom Admin Dashboard, Reports & Data Analytics Charts",
          "ERP / CRM / Telephony Third-Party API Integrations",
          "PostgreSQL / MongoDB Scalable Database Architecture",
          "Automated Daily Cloud Backups & Zero-Downtime Migration",
          "Enterprise Security Hardening & Vulnerability Mitigation",
          "Microservices Architecture & Docker Containerization",
          "High-Concurrency Load Testing & 99.9% SLA Guarantee",
          "Dedicated Lead Engineer & 6 Months VIP Priority Support",
        ],
      },
    ],
  },
  {
    id: "srv_mobile_app",
    slug: "mobile-app-development",
    title: "Mobile App Development",
    headline: "HIGH-PERFORMANCE IOS & ANDROID APPS",
    subtitle: "INTUITIVE DESIGN. SCALABLE ARCHITECTURE. FAST APP STORE LAUNCH.",
    badge: "ENTERPRISE MOBILE ENGINEERING",
    description:
      "End-to-end mobile app design and engineering for fast-growing startups and enterprises. JCRM builds cross-platform Flutter/React Native and native iOS/Android applications featuring silky-smooth 60 FPS performance, offline local caching, biometric security, push notifications, and full App Store & Google Play publishing support.",
    trustTag: "TRUSTED BY EDTECH, HEALTHCARE & LOGISTICS ENTERPRISES ACROSS INDIA.",
    platforms: ["IOS", "ANDROID", "FLUTTER", "REACT NATIVE"],
    contactPhone: "+91 8310531309",
    contactEmail: "hr@jcrm.in",
    website: "www.jcrm.in",
    isActive: true,
    highlights: [
      {
        title: "Cross-Platform & Native",
        subtitle: "Flutter, React Native, Swift & Kotlin",
        icon: "shield",
      },
      {
        title: "Silky 60 FPS Performance",
        subtitle: "Fluid animations & responsive UX",
        icon: "trending-up",
      },
      {
        title: "Enterprise Grade Security",
        subtitle: "Biometrics, OAuth2 & encrypted storage",
        icon: "lock",
      },
      {
        title: "100% Store Approval",
        subtitle: "App Store & Google Play deployment",
        icon: "bar-chart",
      },
    ],
    plans: [
      {
        id: "app_starter",
        name: "STARTER MVP",
        icon: "star",
        price: 24999,
        gstPercent: 18,
        period: "project",
        isPopular: false,
        isActive: true,
        features: [
          "Hybrid Cross-Platform Mobile App (Android + iOS)",
          "Up to 7 Clean UI/UX Custom Designed Screens",
          "User Authentication (Email, Phone OTP, Google Login)",
          "REST API & Database Cloud Integration",
          "Firebase Cloud Messaging for Push Notifications",
          "Google Play Store Publishing & App Listing Support",
          "Basic Analytics & Crash Reporting Setup",
          "30 Days Post-Launch Maintenance & Bug Fixes",
        ],
      },
      {
        id: "app_growth",
        name: "BUSINESS APP",
        icon: "crown",
        badge: "MOST POPULAR",
        price: 49999,
        gstPercent: 18,
        period: "project",
        isPopular: true,
        isActive: true,
        features: [
          "High-Performance Flutter / React Native App",
          "Up to 15 Premium Custom Designed Screens",
          "Dual Store Launch: Apple App Store & Google Play Store",
          "Payment Gateway Integration (Razorpay / Stripe)",
          "Real-time In-App Notifications & Live Chat Support",
          "Role-Based Admin Panel Web Dashboard",
          "Offline Local Caching & Background Data Sync",
          "Social Login & Biometric (Fingerprint/FaceID) Auth",
          "Google Analytics 4 & Crashlytics Event Tracking",
          "60 Days Dedicated Technical Support & Feature Updates",
        ],
      },
      {
        id: "app_enterprise",
        name: "ENTERPRISE SUITE",
        icon: "diamond",
        price: 99999,
        gstPercent: 18,
        period: "project",
        isPopular: false,
        isActive: true,
        features: [
          "Full-Scale Custom Mobile Application Ecosystem",
          "Unlimited Screens & Complex Workflow Architecture",
          "Native iOS (Swift) & Android (Kotlin) or High-End Flutter",
          "Custom Backend APIs, Microservices & PostgreSQL DB",
          "Real-Time WebSockets Sync & Multi-tenant Architecture",
          "ERP / CRM / Payment / Telephony API Integrations",
          "Military-Grade Data Encryption & OWASP Mobile Compliance",
          "CI/CD Automated Deployment Pipeline",
          "Guaranteed App Store & Play Store Approval Guarantee",
          "Dedicated Project Manager & 6 Months Priority SLA Support",
        ],
      },
    ],
  },
  {
    id: "srv_ai_video",
    slug: "ai-video-production",
    title: "AI Video Production & Editing",
    headline: "NEXT-GEN AI VIDEOS. MAXIMUM RETENTION.",
    subtitle: "AI SPOKESPERSON AVATARS, 4K CINEMATIC REELS & VIRAL AD PRODUCTION",
    badge: "CREATIVE AI MEDIA PRODUCTION",
    description:
      "Elevate your brand storytelling with cutting-edge Generative AI video creation and professional studio post-production. JCRM crafts hyper-realistic AI avatars, voiceovers in 30+ languages, viral short-form Reels and TikToks, 3D product animations, and high-converting commercial advertisements engineered to maximize engagement and ROI.",
    trustTag: "AI-POWERED CREATIVITY BACKED BY EXPERT VIDEO EDITORS & STORYTELLERS.",
    platforms: ["RUNWAY AI", "MIDJOURNEY", "PREMIERE PRO", "AFTER EFFECTS"],
    contactPhone: "+91 8310531309",
    contactEmail: "hr@jcrm.in",
    website: "www.jcrm.in",
    isActive: true,
    highlights: [
      {
        title: "Generative AI Avatars",
        subtitle: "Ultra-realistic spokesperson & voiceovers",
        icon: "shield",
      },
      {
        title: "High-Retention Hooks",
        subtitle: "Formulated for viral Instagram Reels & Shorts",
        icon: "trending-up",
      },
      {
        title: "4K Studio Post-Production",
        subtitle: "Cinematic color grading & SFX audio design",
        icon: "lock",
      },
      {
        title: "Multilingual Dubbing",
        subtitle: "Hindi, English & 30+ regional languages",
        icon: "bar-chart",
      },
    ],
    plans: [
      {
        id: "video_reels",
        name: "REELS & SHORTS",
        icon: "star",
        price: 9999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "10 High-Engagement Vertical Videos (Instagram Reels / Shorts)",
          "AI Generated Scriptwriting & Viral Hook Formulation",
          "AI Voiceover in Studio Quality (Hindi or English)",
          "Dynamic Kinetic Captions & Animated Subtitles",
          "Custom B-Roll Selection, Sound Effects & Trending Audio",
          "Full HD 1080p Resolution Delivery",
          "2 Revisions per Video Included",
        ],
      },
      {
        id: "video_commercial",
        name: "COMMERCIAL & ADS",
        icon: "crown",
        badge: "MOST POPULAR",
        price: 19999,
        gstPercent: 18,
        period: "month",
        isPopular: true,
        isActive: true,
        features: [
          "20 Premium Social Media Videos (Reels / Shorts / TikToks)",
          "2 Long-Form Corporate / YouTube Explainers (up to 3 mins)",
          "Hyper-Realistic AI Spokesperson / Digital Twin Avatars",
          "Custom Midjourney / Flux Backgrounds & 3D Visual Elements",
          "Multilingual Dubbing (Hindi + English + Regional Languages)",
          "Professional Premiere Pro & After Effects Motion Graphics",
          "High-Converting Ad Creatives for Meta & Google Ads",
          "Custom Storyboard & Script Approval Workflow",
          "4K Ultra HD Export Quality",
          "Dedicated Video Strategist & Fast 48h Delivery Turnaround",
        ],
      },
      {
        id: "video_enterprise",
        name: "ENTERPRISE MEDIA LAB",
        icon: "diamond",
        price: 39999,
        gstPercent: 18,
        period: "month",
        isPopular: false,
        isActive: true,
        features: [
          "Unlimited Video Pipeline (Up to 40 Custom Videos / month)",
          "Custom Cloned Brand Ambassador AI Avatar & Voice Clones",
          "Cinematic 3D Product Renders & Motion Typography",
          "Complete Brand Storytelling: Explainer, Ads & Testimonial formats",
          "A/B Creative Hook Testing for Performance Marketing",
          "Source Project Files & Asset Library Access",
          "Commercial Copyright & Full IP Licensing Transfer",
          "Dedicated Creative Director, Motion Graphic Designer & Editor",
          "Ultra-Fast 24-Hour Express Turnaround",
          "Unlimited Revisions & VIP Slack/WhatsApp Channel",
        ],
      },
    ],
  },
];
