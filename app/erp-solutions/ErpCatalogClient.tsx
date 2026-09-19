"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import ErpDemoModal from "./ErpDemoModal";

export default function ErpCatalogClient({ products }: { products: any[] }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Industries");
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; name: string } | null>(null);
  
  // Slider State
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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
    "Daily Operations & Smart Automation"
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.modules.some((m: string) => m.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      activeCategory === "All Industries" ||
      product.category.toLowerCase() === activeCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  // Reset index when category or search changes
  useEffect(() => {
    setCurrentIndex(0);
  }, [activeCategory, searchQuery]);

  // Auto-play timer for slider (slides every 3.5 seconds when not hovered)
  useEffect(() => {
    if (isHovered || filteredProducts.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered, filteredProducts.length]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + filteredProducts.length) % filteredProducts.length);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % filteredProducts.length);
  };

  // Calculate annual savings
  const jcrmCostPerYear = Math.max(120000, userCount * 1200);
  const currentAnnualSpend = currentSpend * 12;
  const annualSavings = Math.max(0, currentAnnualSpend - jcrmCostPerYear);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[150px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header & Tagline */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in-up">
       
          <h1 className="heading-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight leading-tight">
            Smart ERP Solutions Built for <span className="text-[#0055FF]">Scale & Autonomy</span>
          </h1>

        </div>

        {/* Business-Type Industry Filter Tabs & Search Bar */}
        <div className="mb-10 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            
            {/* Category Pills Header */}
            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-slate-400 block mb-1">
                FILTER BY BUSINESS INDUSTRY / TYPE
              </span>
              <h2 className="heading-font text-2xl font-extrabold text-slate-900">
                Industry Solution Catalog
              </h2>
            </div>

            {/* Search Bar */}
            <div className="relative w-full md:w-80 shrink-0">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search ERP modules, features..."
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/90 border border-blue-100/90 text-slate-900 placeholder:text-slate-400 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Business Type Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2.5 rounded-full text-xs sm:text-sm font-extrabold transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20 scale-105"
                    : "bg-white/80 text-slate-700 hover:text-[#0055FF] hover:bg-blue-50/80 border border-blue-100"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Controls Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="text-xs font-extrabold uppercase tracking-widest text-slate-700">
              Showing {filteredProducts.length} Product Variants for {activeCategory}
            </span>
          </div>

          {/* Prev / Next Controls */}
          {filteredProducts.length > 1 && (
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold text-slate-500 mr-1">
                {currentIndex + 1} / {filteredProducts.length}
              </span>
              <button
                onClick={handlePrev}
                className="w-10 h-10 rounded-full bg-white/90 border border-blue-200 text-slate-700 hover:bg-[#0055FF] hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer font-black text-base"
                title="Previous ERP Suite"
              >
                ←
              </button>
              <button
                onClick={handleNext}
                className="w-10 h-10 rounded-full bg-white/90 border border-blue-200 text-slate-700 hover:bg-[#0055FF] hover:text-white transition-all shadow-sm flex items-center justify-center cursor-pointer font-black text-base"
                title="Next ERP Suite"
              >
                →
              </button>
            </div>
          )}
        </div>

        {/* CLEAN AUTO-SLIDING CAROUSEL CONTAINER (STRICT OVERFLOW-HIDDEN, NO PEEKING EDGES) */}
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white/80 backdrop-blur-xl rounded-[32px] border border-blue-100 p-8 shadow-sm">
            <p className="text-lg font-extrabold text-slate-800 mb-2">No ERP Suites found matching "{searchQuery}" in {activeCategory}</p>
            <p className="text-sm font-semibold text-slate-500">Try switching business type category pills or clearing your search query.</p>
          </div>
        ) : (
          <div
            className="w-full relative overflow-hidden rounded-[36px] bg-white/40 p-2 border border-blue-100/60 shadow-lg mb-16"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div
              className="flex transition-transform duration-700 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {filteredProducts.map((erp) => (
                <div
                  key={erp.id}
                  className="w-full shrink-0 px-2 sm:px-4"
                >
                  <div className="max-w-4xl mx-auto rounded-[32px] bg-white/90 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
                    
                    {/* Left 6 Cols - Clickable Image & Badge */}
                    <Link
                      href={`/erp-solutions/${erp.id}`}
                      className="lg:col-span-6 block relative overflow-hidden bg-slate-900 group/img cursor-pointer min-h-[260px] sm:min-h-[320px]"
                    >
                      <img
                        src={erp.image}
                        alt={erp.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.target as HTMLElement).style.opacity = '0';
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-black/20 p-6 sm:p-8 flex flex-col justify-between">
                        <div className="flex items-center justify-between relative z-10">
                          <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-white/95 text-[#0055FF] shadow-md">
                            {erp.badge}
                          </span>
                          <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                            {erp.modulesCount} Modules
                          </span>
                        </div>

                        <div className="relative z-10 space-y-2">
                          <span className="text-xs font-mono font-bold text-blue-300 uppercase tracking-widest block">
                            {erp.category}
                          </span>
                          <h3 className="heading-font text-2xl sm:text-3xl font-extrabold text-white leading-tight drop-shadow-md group-hover/img:text-blue-200 transition-colors">
                            {erp.title}
                          </h3>
                        </div>
                      </div>
                    </Link>

                    {/* Right 6 Cols - Content & High-Visibility Actions */}
                    <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                      <div>
                        {/* Business Impact ROI Pill */}
                        <div className="mb-4 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-extrabold">
                          <span>⚡</span>
                          <span>{erp.roiMetric}</span>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed mb-6">
                          {erp.description}
                        </p>

                        {/* Built-in Key Modules List */}
                        <div>
                          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
                            INCLUDED ENTERPRISE MODULES
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {erp.modules.map((m: string, i: number) => (
                              <span
                                key={i}
                                className="text-xs font-bold px-2.5 py-1 rounded-lg bg-blue-50/70 border border-blue-100/80 text-slate-800"
                              >
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Actions Row */}
                      <div className="pt-4 border-t border-blue-100/80 space-y-3">
                        {/* Primary Action Button */}
                        <button
                          onClick={() => setSelectedProduct({ id: erp.id, name: erp.title })}
                          className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md hover:shadow-blue-500/25 flex items-center justify-center gap-2 cursor-pointer hover:scale-[1.01]"
                        >
                          Request Live Demo 🚀
                        </button>

                        {/* PROMINENT HIGH-VISIBILITY SECONDARY BUTTON */}
                        <Link
                          href={`/erp-solutions/${erp.id}`}
                          className="w-full py-3 rounded-2xl text-xs sm:text-sm font-extrabold text-[#0055FF] bg-blue-50/90 hover:bg-blue-100/80 border border-blue-200/90 transition-all flex items-center justify-center gap-1.5 shadow-xs hover:shadow-md cursor-pointer text-center"
                        >
                          View Technical Specs & Architecture →
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              ))}
            </div>

            {/* Carousel Pagination Dots */}
            {filteredProducts.length > 1 && (
              <div className="flex justify-center items-center gap-2 pt-4 pb-2">
                {filteredProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 cursor-pointer ${
                      currentIndex === idx ? "w-8 bg-[#0055FF]" : "w-2.5 bg-blue-200 hover:bg-blue-300"
                    }`}
                    aria-label={`Go to slide ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* INTERACTIVE ROI SAVINGS CALCULATOR SECTION */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-2xl mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#0055FF]/20 rounded-full blur-[100px] pointer-events-none"></div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
            
            {/* Left 6 Cols - Calculator Controls */}
            <div className="lg:col-span-6 space-y-6">
              <span className="inline-block px-3.5 py-1 text-xs font-extrabold uppercase tracking-widest text-blue-400 bg-blue-500/10 rounded-full border border-blue-400/20">
                INTERACTIVE ROI ESTIMATOR
              </span>

              <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-white">
                Calculate Your Annual Savings with <span className="text-blue-400">JCRM ERP</span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed">
                Traditional legacy ERP solutions charge exorbitant per-user license fees. JCRM offers self-customizable, modular deployment with zero lock-ins.
              </p>

              {/* Slider 1: User Count */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span>Number of Staff / Active Users</span>
                  <span className="text-blue-400 font-black text-sm">{userCount} Users</span>
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

              {/* Slider 2: Current Spend */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-extrabold text-slate-300">
                  <span>Current Monthly Software Spend</span>
                  <span className="text-emerald-400 font-black text-sm">₹{currentSpend.toLocaleString("en-IN")}/mo</span>
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

            {/* Right 6 Cols - Estimated Savings Output */}
            <div className="lg:col-span-6">
              <div className="p-8 rounded-[32px] bg-white/10 backdrop-blur-xl border border-white/15 text-center space-y-6">
                <div>
                  <span className="text-xs font-extrabold text-slate-300 uppercase tracking-widest block mb-1">
                    ESTIMATED ANNUAL ROI SAVINGS
                  </span>
                  <h3 className="heading-font text-4xl sm:text-5xl font-black text-emerald-400">
                    ₹{annualSavings.toLocaleString("en-IN")} <span className="text-xs text-white font-bold">/ year</span>
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10 text-left">
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                    <span className="text-[11px] font-extrabold text-slate-400 block uppercase">Deployment Time</span>
                    <span className="text-sm font-extrabold text-white">Under 48 Hours</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
                    <span className="text-[11px] font-extrabold text-slate-400 block uppercase">Data Ownership</span>
                    <span className="text-sm font-extrabold text-white">100% Self-Hosted</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProduct({ id: "custom-erp", name: "Custom Enterprise ERP Suite" })}
                  className="w-full py-4 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 cursor-pointer"
                >
                  Claim Your Custom ERP Savings Plan ➔
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* TRUST BADGES SECTION */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="p-6 rounded-3xl bg-white/80 border border-blue-100 shadow-xs">
            <span className="text-2xl mb-2 block">🔒</span>
            <h4 className="heading-font font-extrabold text-slate-900 text-sm">Self-Hostable</h4>
            <p className="text-xs text-slate-500 font-medium">On-Premise or Private Cloud</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/80 border border-blue-100 shadow-xs">
            <span className="text-2xl mb-2 block">📱</span>
            <h4 className="heading-font font-extrabold text-slate-900 text-sm">WhatsApp Alerts</h4>
            <p className="text-xs text-slate-500 font-medium">Automated Notifications</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/80 border border-blue-100 shadow-xs">
            <span className="text-2xl mb-2 block">⚡</span>
            <h4 className="heading-font font-extrabold text-slate-900 text-sm">99.99% Uptime</h4>
            <p className="text-xs text-slate-500 font-medium">Enterprise Grade SLA</p>
          </div>
          <div className="p-6 rounded-3xl bg-white/80 border border-blue-100 shadow-xs">
            <span className="text-2xl mb-2 block">🤝</span>
            <h4 className="heading-font font-extrabold text-slate-900 text-sm">Custom API Plugins</h4>
            <p className="text-xs text-slate-500 font-medium">Seamless Integration</p>
          </div>
        </div>

      </div>

      {/* LEAD CAPTURE DEMO MODAL */}
      <ErpDemoModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        productName={selectedProduct?.name}
        productId={selectedProduct?.id}
      />
    </div>
  );
}
