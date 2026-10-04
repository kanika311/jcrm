"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ServiceCategory, ServicePlan } from "@/lib/servicesData";
import ServiceCheckoutModal from "@/components/ServiceCheckoutModal";
import {
  FiCheck,
  FiStar,
  FiArrowRight,
  FiArrowUpRight,
  FiGrid,
  FiLayers,
  FiShare2,
  FiCpu,
  FiZap,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
  FaGem,
  FaCrown,
  FaGoogle,
} from "react-icons/fa";

interface ServicesClientProps {
  services: ServiceCategory[];
  activeSlug?: string;
}

export default function ServicesClient({ services, activeSlug }: ServicesClientProps) {
  const router = useRouter();

  const [currentSlug, setCurrentSlug] = useState<string>(
    activeSlug || services[0]?.slug || "seo"
  );
  const [selectedService, setSelectedService] = useState<ServiceCategory | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<ServicePlan | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [expandedPlans, setExpandedPlans] = useState<Record<string, boolean>>({});

  const toggleExpand = (planId: string) => {
    setExpandedPlans((prev) => ({
      ...prev,
      [planId]: !prev[planId],
    }));
  };

  const activeService =
    services.find((s) => s.slug === currentSlug) || services[0];

  const handleSelectService = (slug: string) => {
    setCurrentSlug(slug);
    // update URL without full page reload
    window.history.pushState(null, "", `/services/${slug}`);
  };

  const handleOpenCheckout = (service: ServiceCategory, plan: ServicePlan) => {
    setSelectedService(service);
    setSelectedPlan(plan);
    setModalOpen(true);
  };

  const getPlanIcon = (iconName: string) => {
    switch (iconName) {
      case "crown":
        return <FaCrown className="w-5 h-5 text-amber-500" />;
      case "diamond":
        return <FaGem className="w-5 h-5 text-indigo-500" />;
      case "star":
      default:
        return <FiStar className="w-5 h-5 text-blue-500" />;
    }
  };

  if (!activeService) return null;

  const lowestPrice = Math.min(...activeService.plans.map((p) => p.price));

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-100 pb-28 pt-24 sm:pt-28">
      {/* Subtle Background Glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-blue-400/10 dark:bg-blue-600/10 blur-[130px] rounded-full pointer-events-none -z-10" />

      {/* Main 2-Panel Container */}
      <div className="max-w-[1550px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ========================================================= */}
          {/* LEFT PANEL: TOPIC OF SERVICES (Sidebar)                   */}
          {/* ========================================================= */}
          <aside className="lg:col-span-3 space-y-4 lg:sticky lg:top-28">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-[0_10px_30px_rgba(0,85,255,0.05)]">
              {/* Header: Our Service + Count Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-4">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/40 text-[#0055FF] flex items-center justify-center shadow-xs">
                    <FiLayers className="w-4 h-4" />
                  </div>
                  <h2 className="heading-font text-lg font-black text-slate-900 dark:text-white tracking-tight">
                    Our Services
                  </h2>
                </div>
                <span className="w-7 h-7 rounded-full bg-blue-50 dark:bg-slate-800 text-[#0055FF] font-black text-xs flex items-center justify-center border border-blue-100 dark:border-slate-700">
                  {services.length}
                </span>
              </div>

              {/* Service Topics List */}
              <div className="space-y-2.5">
                {services.map((srv) => {
                  const isSelected = srv.slug === currentSlug;

                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => handleSelectService(srv.slug)}
                      className={`w-full flex items-center justify-between p-3.5 sm:p-4 rounded-2xl font-black text-xs sm:text-sm tracking-wide text-left transition-all cursor-pointer ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50/70 dark:from-blue-950/60 dark:to-slate-900 text-[#0055FF] dark:text-blue-400 border-2 border-[#0055FF] shadow-sm shadow-blue-500/10 scale-[1.02]"
                          : "bg-slate-50/80 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 border border-slate-200/70 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0 pr-2">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            isSelected
                              ? "bg-[#0055FF] shadow-[0_0_8px_#0055FF]"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        />
                        <span className="uppercase truncate leading-tight font-black">
                          {srv.title}
                        </span>
                      </div>

                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform ${
                          isSelected
                            ? "bg-[#0055FF] text-white shadow-sm rotate-45"
                            : "bg-white dark:bg-slate-800 text-slate-400 border border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        <FiArrowUpRight className="w-3.5 h-3.5" />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* ========================================================= */}
          {/* CENTER / RIGHT PANEL: DETAILS & PLANS                     */}
          {/* ========================================================= */}
          <main className="lg:col-span-9 space-y-6">
            <div className="rounded-[2.5rem] bg-white/95 dark:bg-slate-900/95 border-2 border-blue-200/70 dark:border-slate-800 shadow-[0_20px_60px_rgba(0,85,255,0.06)] p-6 sm:p-10 lg:p-12">
              
              {/* Top Meta Section */}
              <div className="space-y-4 pb-8 border-b border-slate-200 dark:border-slate-800">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-block px-4 py-1.5 rounded-full bg-blue-100/80 dark:bg-blue-950/60 text-[#0055FF] font-black text-xs uppercase tracking-widest border border-blue-200 dark:border-blue-900">
                    {activeService.badge}
                  </div>

                  {/* Starting Price Pill (matching YogaSathi "From ₹25,000" style) */}
                  <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/30 border border-amber-300 dark:border-amber-800 text-amber-700 dark:text-amber-300 font-black text-xs sm:text-sm shadow-xs">
                    <span>From</span>
                    <strong className="text-amber-800 dark:text-amber-200 text-sm sm:text-base">
                      ₹{lowestPrice.toLocaleString("en-IN")}
                    </strong>
                    <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                      /month
                    </span>
                  </div>
                </div>

                {/* Primary Title & Headline */}
                <div>
                  <h1 className="heading-font text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {activeService.title}
                  </h1>
                  <p className="text-[#0055FF] font-extrabold text-sm sm:text-base uppercase tracking-wider mt-1.5">
                    {activeService.headline} &bull; {activeService.subtitle}
                  </p>
                </div>

                {/* Narrative Description */}
                <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base leading-relaxed max-w-4xl font-medium">
                  {activeService.description}
                </p>

                {/* Supported Platform Badges */}
                {activeService.platforms && activeService.platforms.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Target Networks:
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FaFacebookF className="text-[#1877F2]" />
                      <span>Facebook</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FaLinkedinIn className="text-[#0A66C2]" />
                      <span>LinkedIn</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FaInstagram className="text-[#E1306C]" />
                      <span>Instagram</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FaYoutube className="text-[#FF0000]" />
                      <span>YouTube</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap items-center gap-2.5 pt-2">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider mr-1">
                      Engine Coverage:
                    </span>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FaGoogle className="text-[#4285F4]" />
                      <span>Google Search</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FiCpu className="text-emerald-600" />
                      <span>ChatGPT & GEO</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <FiZap className="text-amber-500" />
                      <span>Perplexity AI</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Plans Section */}
              <div className="">
              

                {/* 3 Pricing Columns */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6 items-stretch">
                  {activeService.plans.map((plan) => {
                    const isPopular = plan.isPopular;
                    const basePrice = plan.price;
                    const gstPercent = plan.gstPercent || 18;
                    const totalWithGst = Math.round(
                      basePrice + (basePrice * gstPercent) / 100
                    );
                    const isExpanded = !!expandedPlans[plan.id];
                    const maxInitial = 5;
                    const visibleFeatures = isExpanded
                      ? plan.features
                      : plan.features.slice(0, maxInitial);
                    const hasMore = plan.features.length > maxInitial;
                    const remainingCount = plan.features.length - maxInitial;

                    return (
                      <div
                        key={plan.id}
                        className={`relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                          isPopular
                            ? "bg-gradient-to-b from-blue-50/90 via-white to-blue-50/50 dark:from-slate-800 dark:via-slate-900 dark:to-slate-800 border-2 border-[#0055FF] shadow-[0_15px_40px_rgba(0,85,255,0.18)] -translate-y-1"
                            : "bg-white dark:bg-slate-800/60 hover:shadow-xl"
                        }`}
                      >
                        {/* Angled Most Popular Ribbon */}
                        {isPopular && (
                          <div className="absolute -top-3.5 right-6 bg-gradient-to-r from-blue-700 to-[#0055FF] text-white text-[11px] font-black uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                            <FaCrown className="text-amber-300" />
                            <span>{plan.badge || "MOST POPULAR"}</span>
                          </div>
                        )}

                        <div>
                          {/* Plan Header */}
                          <div className="flex items-center gap-2.5 mb-4">
                            <div className="w-10 h-10 rounded-2xl bg-blue-100/80 dark:bg-blue-900/40 flex items-center justify-center shadow-xs">
                              {getPlanIcon(plan.icon)}
                            </div>
                            <h4 className="heading-font text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                              {plan.name}
                            </h4>
                          </div>

                          {/* Price Tag */}
                          <div className="py-4 border-y border-slate-200 dark:border-slate-700/80 mb-6">
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white">
                                ₹{basePrice.toLocaleString("en-IN")}
                              </span>
                              <span className="text-xs sm:text-sm font-bold text-slate-500">
                                /{plan.period || "month"}
                              </span>
                            </div>
                          </div>

                          {/* Features List */}
                          <ul className="space-y-2.5">
                            {visibleFeatures.map((feature, fIdx) => (
                              <li
                                key={fIdx}
                                className="flex items-start gap-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200"
                              >
                                <span className="w-4 h-4 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                                  <FiCheck className="w-3 h-3 stroke-[3]" />
                                </span>
                                <span className="leading-snug">{feature}</span>
                              </li>
                            ))}
                          </ul>

                          {/* Show More / Show Less Toggle Button */}
                          {hasMore && (
                            <button
                              type="button"
                              onClick={() => toggleExpand(plan.id)}
                              className="inline-flex items-center gap-1.5 text-xs font-black text-[#0055FF] dark:text-blue-400 hover:underline mt-2.5 mb-6 cursor-pointer"
                            >
                              <span>
                                {isExpanded
                                  ? "Show Less"
                                  : `+ ${remainingCount} More Features`}
                              </span>
                              {isExpanded ? (
                                <FiChevronUp className="w-3.5 h-3.5" />
                              ) : (
                                <FiChevronDown className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}

                          {!hasMore && <div className="mb-6" />}
                        </div>

                        {/* CTA Pay Button */}
                        <div>
                          <button
                            type="button"
                            onClick={() => handleOpenCheckout(activeService, plan)}
                            className={`w-full py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isPopular
                                ? "bg-gradient-to-r from-[#0055FF] to-blue-700 text-white hover:brightness-110 shadow-lg shadow-blue-500/30 hover:scale-[1.02]"
                                : "bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-[#0055FF] dark:hover:bg-[#0055FF] dark:hover:text-white transition-colors"
                            }`}
                          >
                            <span>Subscribe & Activate</span>
                            <FiArrowRight className="w-4 h-4" />
                          </button>
                          <p className="text-center text-[10px] text-slate-400 font-semibold mt-2">
                            Instant Razorpay Payment & Activation
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </main>
        </div>
      </div>

      {/* Checkout Modal with Razorpay */}
      {selectedService && selectedPlan && (
        <ServiceCheckoutModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          service={selectedService}
          plan={selectedPlan}
        />
      )}
    </div>
  );
}
