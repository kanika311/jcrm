"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import ErpDemoModal from "./ErpDemoModal";
import SponsoredAdModal from "@/components/SponsoredAdModal";
import { SponsoredAd } from "@/lib/sponsoredAd";
import {
  FiSearch,
  FiSliders,
  FiX,
  FiArrowLeft,
  FiArrowRight,
  FiExternalLink,
  FiEdit,
  FiCheck,
  FiLayers,
  FiTrendingUp,
  FiShield,
  FiZap,
  FiGlobe,
  FiBookOpen,
  FiActivity,
  FiTruck,
  FiShoppingBag,
  FiBriefcase,
  FiHome,
  FiSettings,
  FiTag,
  FiGrid,
} from "react-icons/fi";

export default function ErpCatalogClient({
  products,
  initialSponsoredAd,
  isAdmin = false,
}: {
  products: any[];
  initialSponsoredAd: SponsoredAd;
  isAdmin?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Industries");
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  useEffect(() => {
    if (mobileFilterOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [mobileFilterOpen]);

  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Sponsored Ad State
  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(initialSponsoredAd);
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);

  // Interactive ROI Calculator State
  const [userCount, setUserCount] = useState(50);
  const [currentSpend, setCurrentSpend] = useState(45000);

  const categories = [
    "All Industries",
    "Education & Academies",
    "Healthcare & Wellness",
    "Manufacturing & Logistics",
    "Retail & E-Commerce",
    "Corporate & Services",
    "Real Estate & Construction",
    "Daily Operations & Smart Automation",
  ];

  const getCategoryIcon = (category: string, isSelected: boolean) => {
    const iconClass = `w-4 h-4 shrink-0 ${isSelected ? "text-white" : "text-[#0055FF]"}`;
    switch (category) {
      case "All Industries":
        return <FiGlobe className={iconClass} />;
      case "Education & Academies":
        return <FiBookOpen className={iconClass} />;
      case "Healthcare & Wellness":
        return <FiActivity className={iconClass} />;
      case "Manufacturing & Logistics":
        return <FiTruck className={iconClass} />;
      case "Retail & E-Commerce":
        return <FiShoppingBag className={iconClass} />;
      case "Corporate & Services":
        return <FiBriefcase className={iconClass} />;
      case "Real Estate & Construction":
        return <FiHome className={iconClass} />;
      case "Daily Operations & Smart Automation":
        return <FiZap className={iconClass} />;
      default:
        return <FiGrid className={iconClass} />;
    }
  };

  const filteredProducts = products.filter((product) => {
    const s = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !s ||
      product.title.toLowerCase().includes(s) ||
      product.description.toLowerCase().includes(s) ||
      (product.category || "").toLowerCase().includes(s) ||
      (product.modules || []).some((m: string) => m.toLowerCase().includes(s));

    const matchesCategory =
      activeCategory === "All Industries" ||
      (product.category || "").toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Reset index when category or search changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, searchQuery]);

  // Auto-play timer for slider (slides every 4 seconds when not hovered)
  useEffect(() => {
    if (isHovered || filteredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered, filteredProducts.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  const currentErp = filteredProducts[currentIndex] || filteredProducts[0];

  // Reusable Sidebar Content for Desktop Sticky Panel & Mobile Drawer
  const renderSidebarContent = (isMobile: boolean = false) => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#D4E8F8]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF]">
            <FiGrid className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
            Industries &amp; Topics
          </h3>
        </div>
        <span className="text-[11px] font-black text-[#0055FF] bg-blue-50 px-2 py-0.5 rounded-md border border-[#D4E8F8]">
          {products.length} Suites
        </span>
      </div>

      {/* Industry Categories List */}
      <div className={`space-y-1.5 ${isMobile ? "max-h-[260px] overflow-y-auto pr-1" : ""}`}>
        {categories.map((cat) => {
          const isSelected = activeCategory === cat;
          const count =
            cat === "All Industries"
              ? products.length
              : products.filter((p) => p.category.toLowerCase() === cat.toLowerCase()).length;

          return (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                isSelected
                  ? "bg-[#0055FF] text-white border-[#0055FF] shadow-xs"
                  : "bg-white text-slate-700 hover:bg-blue-50 hover:text-[#0055FF] border-slate-100"
              }`}
            >
              <span className="flex items-center gap-2.5 truncate">
                <span className={`p-1 rounded-lg ${isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-[#0055FF]"}`}>
                  {getCategoryIcon(cat, isSelected)}
                </span>
                <span className="truncate">{cat}</span>
              </span>
              <span
                className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Direct ERP Topic List in Selected Category */}
      <div className="pt-3 border-t border-[#D4E8F8] space-y-2">
        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block px-1">
          Products in {activeCategory}
        </span>

        <div className={`space-y-1.5 ${isMobile ? "max-h-[220px] overflow-y-auto pr-1" : ""}`}>
          {filteredProducts.map((p, idx) => {
            const isCurrent = currentErp?.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => {
                  setCurrentIndex(idx);
                  if (isMobile) setMobileFilterOpen(false);
                }}
                className={`w-full text-left p-2.5 rounded-xl text-xs font-bold transition flex items-center justify-between border cursor-pointer ${
                  isCurrent
                    ? "bg-blue-50 text-[#0055FF] border-[#0055FF]/40 font-extrabold shadow-2xs"
                    : "bg-white text-slate-700 hover:bg-slate-50 border-slate-100"
                }`}
              >
                <div className="truncate flex-1 min-w-0 pr-2">
                  <p className="truncate text-slate-900 font-extrabold">{p.title}</p>
                  <p className="text-[10px] text-slate-500 truncate">{p.tagline}</p>
                </div>
                <span className="text-[10px] font-mono text-slate-400 shrink-0">
                  {p.modulesCount} M
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Custom Architecture Card */}
      <div className="bg-gradient-to-br from-blue-50 to-white border border-[#D4E8F8] rounded-2xl p-4 shadow-xs text-center space-y-2">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] mx-auto shadow-2xs">
          <FiSettings className="w-5 h-5" />
        </div>
        <h5 className="text-xs font-black text-slate-900">
          Need a Custom Module?
        </h5>
        <p className="text-[11px] font-medium text-slate-600 leading-relaxed">
          Our architects can customize database schemas, RBAC permissions, and third-party APIs.
        </p>
        <a
          href="https://wa.me/918310531309?text=Hello%20Founder,%20we%20need%20custom%20modules%20for%20our%20enterprise%20ERP."
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-1.5 w-full py-2 rounded-xl bg-white border border-[#0055FF] text-[#0055FF] hover:bg-blue-50 text-xs font-bold transition shadow-2xs"
        >
          <span>Chat with Architect</span>
        </a>
      </div>
    </div>
  );

  return (
    <div className="pt-16 sm:pt-20 min-h-screen bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent font-sans">
      <div className="lg:h-[calc(100dvh-5rem)] lg:overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:h-full lg:min-h-0">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start lg:h-full lg:min-h-0">
          
          <aside className="hidden lg:flex lg:col-span-3 lg:h-full lg:min-h-0 lg:overflow-hidden">
            <div className="w-full h-full min-h-0 overflow-y-auto overscroll-contain bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-4 sm:p-5">
              {renderSidebarContent(false)}
            </div>
          </aside>

          <main className="lg:col-span-6 space-y-5 min-h-0 lg:h-full lg:overflow-y-scroll lg:overscroll-contain lg:pr-1 pb-24 lg:pb-16">
            <div className="sticky top-0 z-30 p-3 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D4E8F8] shadow-xs flex items-center gap-2.5 sm:gap-3">
              {/* Mobile Filter Toggle (Icon only on short screen) */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden p-2.5 sm:px-3 sm:py-2 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white flex items-center gap-1.5 cursor-pointer shrink-0 shadow-md shadow-blue-500/20 transition active:scale-95"
                title="Filter Industries & Topics"
                aria-label="Filter Industries & Topics"
              >
                <FiSliders className="w-4 h-4" />
                <span className="hidden sm:inline text-xs font-bold truncate max-w-[100px]">
                  {activeCategory}
                </span>
              </button>

              {/* Master Search Input */}
              <div className="relative flex-1">
                <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0055FF] pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search ERP modules, features, industries..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-9 py-2 rounded-xl bg-blue-50/50 hover:bg-white focus:bg-white border border-[#D4E8F8] text-slate-900 text-xs sm:text-sm font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0055FF]/20 transition-all shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 flex items-center justify-center cursor-pointer"
                    title="Clear search"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Request Demo Action CTA */}
              <button
                onClick={() =>
                  setSelectedProduct({
                    id: currentErp?.id || "custom-erp",
                    name: currentErp?.title || "Custom ERP Suite",
                  })
                }
                className="hidden sm:inline-flex items-center gap-1 px-3.5 py-2 rounded-xl bg-blue-50 hover:bg-blue-100 border border-[#D4E8F8] text-[#0055FF] text-xs font-bold transition shrink-0 cursor-pointer"
              >
                <span>Demo</span>
              </button>
            </div>
            {/* Top Carousel Navigation Bar with Left & Right Icons */}
            <div className="bg-white border border-[#D4E8F8] rounded-2xl p-3.5 sm:px-5 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 overflow-hidden">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0"></span>
                <span className="text-xs font-extrabold uppercase tracking-wider text-slate-700 truncate">
                  Showing {filteredProducts.length} Product Variants for {activeCategory}
                </span>
              </div>

              {/* Prev / Next Controls with Left and Right Icons */}
              {filteredProducts.length > 1 && (
                <div className="flex items-center gap-2.5 shrink-0">
                  <span className="text-xs font-mono font-bold text-slate-500">
                    {currentIndex + 1} / {filteredProducts.length}
                  </span>
                  <button
                    onClick={handlePrev}
                    className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#0055FF] hover:text-white border border-slate-200 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Previous ERP Suite (Left)"
                    aria-label="Previous ERP Suite"
                  >
                    <FiArrowLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-[#0055FF] hover:text-white border border-slate-200 text-slate-700 transition flex items-center justify-center cursor-pointer shadow-2xs"
                    title="Next ERP Suite (Right)"
                    aria-label="Next ERP Suite"
                  >
                    <FiArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Active ERP Solution Content Card */}
            {currentErp ? (
              <div
                className="bg-white border border-[#D4E8F8] rounded-3xl shadow-xs overflow-hidden animate-fade-in"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {/* Hero Image & Headline Header */}
                <div className="relative h-60 sm:h-72 bg-slate-900 overflow-hidden group">
                  <img
                    src={currentErp.image}
                    alt={currentErp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-6 flex flex-col justify-between">
                    <div className="flex items-center justify-between relative z-10">
                      <span className="px-3 py-1 text-xs font-black rounded-lg bg-white/95 text-[#0055FF] shadow-xs">
                        {currentErp.badge}
                      </span>
                      <span className="px-3 py-1 text-xs font-black rounded-lg bg-black/60 text-white backdrop-blur-md border border-white/20">
                        {currentErp.modulesCount} Modules
                      </span>
                    </div>

                    <div className="relative z-10 space-y-1.5">
                      <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest block">
                        {currentErp.category}
                      </span>
                      <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow-md">
                        {currentErp.title}
                      </h2>
                    </div>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-6 sm:p-8 space-y-6">
                  {/* ROI / Efficiency Metric */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-black">
                    <FiTrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{currentErp.roiMetric}</span>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                    {currentErp.description}
                  </p>

                  {/* Included Enterprise Modules */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400 block">
                      Included Enterprise Modules ({currentErp.modules?.length || 0})
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {currentErp.modules?.map((m: string, i: number) => (
                        <span
                          key={i}
                          className="text-xs font-bold px-3 py-1 rounded-lg bg-blue-50 text-[#0055FF] border border-[#D4E8F8]"
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions Row */}
                  <div className="pt-4 border-t border-[#D4E8F8] flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setSelectedProduct({ id: currentErp.id, name: currentErp.title })}
                      className="flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-black text-white bg-[#0055FF] hover:bg-blue-600 transition shadow-md shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer"
                    >
                      Request Live Demo
                    </button>

                    <Link
                      href={`/erp-solutions/${currentErp.id}`}
                      className="flex-1 py-3.5 rounded-xl text-xs sm:text-sm font-black text-[#0055FF] bg-blue-50 hover:bg-blue-100 border border-[#D4E8F8] transition flex items-center justify-center gap-1.5 shadow-2xs text-center"
                    >
                      <span>View Technical Specs &amp; Architecture</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>

                {/* Carousel Pagination Dots */}
                {filteredProducts.length > 1 && (
                  <div className="flex justify-center items-center gap-2 pb-5 border-t border-slate-100 pt-3">
                    {filteredProducts.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                          currentIndex === idx ? "w-7 bg-[#0055FF]" : "w-2 bg-blue-200 hover:bg-blue-300"
                        }`}
                        aria-label={`Go to ERP product ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="p-12 text-center text-slate-500 font-bold bg-white rounded-2xl border border-[#D4E8F8]">
                No ERP solutions found matching your search.
              </div>
            )}

            {/* INTERACTIVE ROI ESTIMATOR CALCULATOR */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-blue-400">
                  Interactive ROI Estimator
                </span>
                <span className="text-xs font-bold text-slate-400">
                  Zero Per-User Licensing Fees
                </span>
              </div>

              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white">
                  Calculate Annual Savings with JCRM ERP
                </h3>
                <p className="text-xs text-slate-300 font-medium mt-1">
                  Replace expensive legacy licenses with our one-time autonomous modular deployments.
                </p>
              </div>

              {/* Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Active Staff / Users</span>
                    <span className="text-blue-400 font-black">{userCount} Users</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="500"
                    step="5"
                    value={userCount}
                    onChange={(e) => setUserCount(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0055FF]"
                  />
                </div>

                <div className="space-y-2 bg-white/5 p-4 rounded-2xl border border-white/10">
                  <div className="flex justify-between text-xs font-bold text-slate-300">
                    <span>Current Monthly Software Spend</span>
                    <span className="text-emerald-400 font-black">₹{currentSpend.toLocaleString("en-IN")}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="10000"
                    max="200000"
                    step="5000"
                    value={currentSpend}
                    onChange={(e) => setCurrentSpend(Number(e.target.value))}
                    className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#0055FF]"
                  />
                </div>
              </div>
            </div>
          </main>

          {/* ====================================================================== */}
          {/* 3. RIGHT PANEL: SPONSORED BANNER (STICKY SIDEBAR)                      */}
          {/* ====================================================================== */}
          <aside className="lg:col-span-3 lg:h-full lg:min-h-0 lg:overflow-y-auto lg:overscroll-contain space-y-4">
            {sponsoredAd && sponsoredAd.isActive ? (
              <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-4 relative group">
                {/* Header: Only Sponsored badge */}
                <div className="flex items-center justify-start pb-2.5 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#0055FF] border border-[#D4E8F8] flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {/* Hero Graphic */}
                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden bg-slate-100 border border-[#D4E8F8] relative">
                    <img
                      src={sponsoredAd.image}
                      alt={sponsoredAd.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                {/* Headline & Description */}
                <div className="space-y-1.5">
                  <h4 className="text-sm font-black text-slate-900 group-hover:text-[#0055FF] transition-colors leading-snug">
                    {sponsoredAd.title}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sponsoredAd.description}
                  </p>
                </div>

                {/* CTA Action Button */}
                {sponsoredAd.ctaLink && (
                  <a
                    href={sponsoredAd.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-black shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{sponsoredAd.ctaText || "Book Your Consultation"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : null}

            {/* Enterprise Deployment Highlights */}
            <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#D4E8F8]">
                <FiShield className="w-4 h-4 text-[#0055FF]" />
                <h5 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                  Enterprise SLA
                </h5>
              </div>

              <div className="space-y-2 text-xs font-bold text-slate-700">
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </span>
                  <span>99.9% Uptime Guarantee</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </span>
                  <span>On-Premise or Private Cloud</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] flex items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </span>
                  <span>Full Source Code Access</span>
                </div>
              </div>
            </div>
          </aside>

        </div>
      </div>
      </div>

      {/* ====================================================================== */}
      {/* 4. MOBILE SLIDE-OUT INDUSTRIES / FILTER DRAWER (OPENS FROM LEFT)       */}
      {/* ====================================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-[9999] lg:hidden flex justify-start">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileFilterOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Pinned strictly to LEFT */}
          <aside className="relative w-[min(340px,88vw)] max-w-sm bg-white h-full shadow-2xl flex flex-col justify-between z-50 animate-drawer-left border-r border-[#D4E8F8]">
            {/* Drawer Header */}
            <div className="p-4 sm:p-5 border-b border-[#D4E8F8] flex items-center justify-between bg-blue-50/60 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-[#D4E8F8] flex items-center justify-center text-[#0055FF] shadow-2xs">
                  <FiSliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                    Industries &amp; Topics
                  </h3>
                  <p className="text-[10px] font-bold text-slate-500">
                    {products.length} ERP Suites Available
                  </p>
                </div>
              </div>

              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-[#D4E8F8] flex items-center justify-center text-slate-500 hover:text-slate-900 shadow-2xs cursor-pointer transition-colors"
                title="Close"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="p-4 sm:p-5 overflow-y-auto flex-1 overscroll-contain">
              {renderSidebarContent(true)}
            </div>
          </aside>
        </div>
      )}

      {/* ERP DEMO MODAL */}
      <ErpDemoModal
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        productName={selectedProduct?.name}
        productId={selectedProduct?.id}
      />
    </div>
  );
}
