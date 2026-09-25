export interface SponsoredAd {
  id?: string;
  isActive: boolean;
  badge: string;
  title: string;
  company: string;
  description: string;
  image?: string;
  ctaText: string;
  ctaLink: string;
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_SPONSORED_ADS: SponsoredAd[] = [
  {
    id: "sp_default_1",
    isActive: true,
    badge: "SPONSORED",
    title: "Cloud & AI Placement Accelerator",
    company: "Apex Tech Innovations Partner",
    description: "Pre-screened candidates get guaranteed interview opportunities with top tech startups. 100% practical portfolio review.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    ctaText: "Book Your Consultation",
    ctaLink: "https://wa.me/918310531309?text=Hello%20Founder,%20I%20am%20interested%20in%20the%20Sponsored%20Placement%20Accelerator%20program.",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const DEFAULT_SPONSORED_AD: SponsoredAd = DEFAULT_SPONSORED_ADS[0];
