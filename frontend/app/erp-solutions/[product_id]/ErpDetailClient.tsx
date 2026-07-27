"use client";

import { useState } from "react";
import Link from "next/link";
import ErpDemoModal from "../ErpDemoModal";

export default function ErpDetailClient({ product, productId }: { product: any; productId: string }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      
      {/* Background Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Breadcrumb Navigation */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2 text-xs sm:text-sm font-bold text-slate-500">
            <Link href="/" className="hover:text-[#0055FF] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/erp-solutions" className="hover:text-[#0055FF] transition-colors">ERP Solutions</Link>
            <span>/</span>
            <span className="text-[#0055FF] font-extrabold">{product.title}</span>
          </div>

          <Link
            href="/erp-solutions"
            className="text-xs sm:text-sm font-extrabold text-[#0055FF] hover:underline flex items-center gap-1.5"
          >
            ← Back to ERP Catalog
          </Link>
        </div>

        {/* Hero Section Card */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12)] mb-12 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left 7 Cols - Product Details */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap gap-2.5">
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-[#0055FF] text-white shadow-xs">
                  {product.badge}
                </span>
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-blue-50 text-[#0055FF] border border-blue-100">
                  {product.modulesCount} Enterprise Modules
                </span>
                <span className="px-3.5 py-1 text-xs font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  ⚡ {product.roiMetric}
                </span>
              </div>

              <h1 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {product.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed">
                {product.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all flex items-center gap-2 cursor-pointer"
                >
                  Request Customized Demo 🚀
                </button>

                <a
                  href="tel:+918310531309"
                  className="px-8 py-4 rounded-2xl text-base font-extrabold text-slate-800 bg-white border border-blue-200 hover:bg-blue-50/80 transition-all flex items-center gap-2 shadow-xs"
                >
                  📞 Call Technical Advisor
                </a>
              </div>
            </div>

            {/* Right 5 Cols - Hero Thumbnail Preview Card */}
            <div className="lg:col-span-5">
              <div className="rounded-[28px] overflow-hidden border border-blue-100 shadow-2xl relative bg-slate-900 group">
                <div className="h-64 sm:h-72 w-full relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-transparent p-6 flex flex-col justify-end pointer-events-none">
                    <span className="text-xs font-mono font-bold text-blue-400 uppercase tracking-widest mb-1">
                      SELF-CUSTOMIZABLE ENTERPRISE SUITE
                    </span>
                    <h3 className="heading-font text-2xl font-extrabold text-white">
                      {product.title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 bg-white space-y-4">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-blue-50 pb-3">
                    <span>Deployment Architecture</span>
                    <span className="text-[#0055FF] font-extrabold">On-Premise / Private Cloud</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 border-b border-blue-50 pb-3">
                    <span>Customization Option</span>
                    <span className="text-emerald-600 font-extrabold">100% Self-Customizable</span>
                  </div>

                  <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                    <span>Integration Support</span>
                    <span className="text-slate-900 font-extrabold">WhatsApp + Tally + REST APIs</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Feature Matrix & Capabilities */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1)] mb-12">
          <h2 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6">
            Core Enterprise Capabilities
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {product.keyFeatures.map((feat: string, i: number) => (
              <div key={i} className="flex items-start gap-3 p-4 rounded-2xl bg-blue-50/40 border border-blue-100/70">
                <div className="w-6 h-6 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                  ✓
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 leading-snug">{feat}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Module Workflows */}
        <div className="p-8 sm:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1)] mb-12">
          <h2 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Module Deep-Dive & Workflows
          </h2>
          <p className="text-xs sm:text-sm font-semibold text-slate-500 mb-8">
            Click on any module to inspect how it automates your business workflow.
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 4 Cols - Module Navigation Tabs */}
            <div className="lg:col-span-4 space-y-2">
              {product.modulesDetail.map((mod: any, i: number) => (
                <button
                  key={i}
                  onClick={() => setActiveTab(i)}
                  className={`w-full text-left p-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer flex items-center justify-between ${
                    activeTab === i
                      ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20 scale-[1.02]"
                      : "bg-blue-50/50 text-slate-700 hover:bg-blue-100/60"
                  }`}
                >
                  <span>{mod.name}</span>
                  <span>→</span>
                </button>
              ))}
            </div>

            {/* Right 8 Cols - Active Module Description */}
            <div className="lg:col-span-8">
              <div className="p-8 rounded-[28px] bg-gradient-to-br from-blue-50/50 via-sky-50/20 to-white border border-blue-100 shadow-sm h-full flex flex-col justify-between">
                <div>
                  <span className="text-xs font-extrabold text-[#0055FF] uppercase tracking-wider block mb-2">
                    MODULE DETAILS
                  </span>
                  <h3 className="heading-font text-2xl font-extrabold text-slate-900 mb-4">
                    {product.modulesDetail[activeTab]?.name}
                  </h3>
                  <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed">
                    {product.modulesDetail[activeTab]?.desc}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-blue-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">Fully Customizable Workflow</span>
                  <button
                    onClick={() => setIsDemoModalOpen(true)}
                    className="text-xs font-extrabold text-[#0055FF] hover:underline flex items-center gap-1"
                  >
                    Request Demo for this Module →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lead Capture CTA Box */}
        <div className="p-8 sm:p-12 rounded-[36px] bg-slate-900 text-white shadow-2xl text-center space-y-6">
          <h2 className="heading-font text-3xl sm:text-4xl font-extrabold">
            Ready to Automate Your Business with {product.title}?
          </h2>
          <p className="text-sm sm:text-base text-slate-300 font-medium max-w-xl mx-auto leading-relaxed">
            Schedule a free 1-on-1 guided live demo with our Senior Solutions Architect to review your custom workflow requirements.
          </p>

          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-10 py-4 rounded-2xl text-base font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-xl hover:shadow-blue-500/30 cursor-pointer inline-flex items-center gap-2"
          >
            Get Customized Live Demo Access 🚀
          </button>
        </div>

      </div>

      {/* Demo Modal */}
      <ErpDemoModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
        productName={product.title}
        productId={productId}
      />
    </div>
  );
}
