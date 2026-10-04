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
];
