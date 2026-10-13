"use client";

import { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiExternalLink, FiChevronLeft, FiChevronRight, FiLayers } from "react-icons/fi";
import { ClientProjectItem, DEFAULT_CLIENTS_PROJECTS } from "@/lib/clientsProjectsData";

interface ClientsProjectsSectionProps {
  initialProjects?: ClientProjectItem[];
}

export default function ClientsProjectsSection({
  initialProjects = DEFAULT_CLIENTS_PROJECTS,
}: ClientsProjectsSectionProps) {
  const projects = Array.isArray(initialProjects) && initialProjects.length > 0
    ? initialProjects.filter((p) => p.status !== "DRAFT")
    : DEFAULT_CLIENTS_PROJECTS;

  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [isHovered, setIsHovered] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // Extract unique categories
  const categories = ["All", ...Array.from(new Set(projects.map((p) => p.category)))];

  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => p.category.toLowerCase() === activeCategory.toLowerCase());

  // Check scroll position to update buttons
  const checkScroll = () => {
    if (!scrollContainerRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
  };

  useEffect(() => {
    checkScroll();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScroll);
      return () => container.removeEventListener("scroll", checkScroll);
    }
  }, [filteredProjects]);

  // Handle smooth manual scrolling
  const handleScroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === "left" ? -380 : 380;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Auto-scroll effect every 3.5 seconds, pause when hovered
  useEffect(() => {
    if (isHovered) return;
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isHovered]);

  return (
    <section className="py-12 sm:py-20 md:py-24 relative z-10 overflow-hidden bg-gradient-to-b from-transparent via-blue-50/30 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
          className="space-y-4 mb-6 sm:mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50/90 border border-blue-200/80 text-[#0055FF] text-xs font-black uppercase tracking-wider mb-2 sm:mb-3 shadow-xs">
                <span className="w-2 h-2 rounded-full bg-[#0055FF] animate-pulse" />
                <span>Enterprise Portfolio & Case Studies</span>
              </div>
              <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
                Our <span className="text-[#0055FF]">Clients & Projects</span>
              </h2>
           
            </div>

            {/* Drag Hint & Scroll Controls */}
            <div className="flex items-center gap-2 sm:gap-3 shrink-0 self-start sm:self-auto">
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/80 backdrop-blur-md px-3.5 py-2 rounded-full border border-blue-100 shadow-xs">
                <svg
                  className="w-4 h-4 text-[#0055FF]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
                  />
                </svg>
                <span>Drag or scroll</span>
              </div>

              <button
                onClick={() => handleScroll("left")}
                disabled={!canScrollLeft}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-xs hover:bg-[#0055FF] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 transition-all cursor-pointer shrink-0"
                aria-label="Previous Project"
              >
                <FiChevronLeft className="w-5 h-5 font-bold" />
              </button>

              <button
                onClick={() => handleScroll("right")}
                disabled={!canScrollRight}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/95 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-xs hover:bg-[#0055FF] hover:text-white disabled:opacity-40 disabled:hover:bg-white disabled:hover:text-slate-800 transition-all cursor-pointer shrink-0"
                aria-label="Next Project"
              >
                <FiChevronRight className="w-5 h-5 font-bold" />
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          {categories.length > 2 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
              {categories.map((cat) => {
                const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0055FF] text-white shadow-sm shadow-blue-500/25"
                        : "bg-white/80 text-slate-600 hover:text-slate-900 hover:bg-white border border-slate-200/80"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Scrollable Container with Custom Modern Scrollbar */}
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="overflow-x-auto pb-6 pt-2 flex gap-4 sm:gap-6 scroll-smooth cursor-grab active:cursor-grabbing select-none"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(0, 85, 255, 0.25) transparent",
          }}
        >
          {filteredProjects.map((project, idx) => {
            const clientInitial = project.clientName?.charAt(0) || "C";
            return (
              <motion.div
                key={project.id || idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="w-[280px] sm:w-[360px] md:w-[390px] shrink-0 rounded-2xl sm:rounded-[32px] bg-white/90 backdrop-blur-xl border border-white/95 shadow-[0_4px_24px_rgba(0,85,255,0.08)] hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group pointer-events-auto"
              >
                {/* Project Cover & Category Badges */}
                <div className="relative h-44 sm:h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.projectName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent pointer-events-none" />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between gap-2 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-black uppercase tracking-wider bg-white/95 backdrop-blur-md text-slate-900 shadow-xs border border-white">
                      {project.category}
                    </span>

                    {project.badge && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold bg-[#0055FF] text-white shadow-xs">
                        {project.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Client Identifier */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2.5 pointer-events-none">
                    {project.logo ? (
                      <img
                        src={project.logo}
                        alt={project.clientName}
                        className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover bg-white p-0.5 border border-white/80 shrink-0 shadow-xs"
                      />
                    ) : (
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600 text-white font-black text-xs flex items-center justify-center shrink-0 border border-white/60 shadow-xs">
                        {clientInitial}
                      </div>
                    )}
                    <span className="text-white text-xs sm:text-sm font-bold truncate drop-shadow-md">
                      {project.clientName}
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-4 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="heading-font font-extrabold text-slate-900 text-base sm:text-lg group-hover:text-[#0055FF] transition-colors leading-snug line-clamp-2">
                      {project.projectName}
                    </h3>

                    <p className="text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Impact Metric & Tech Stack */}
                  <div className="space-y-3 pt-2 border-t border-slate-100">
                    {project.stats && (
                      <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-extrabold text-emerald-700 bg-emerald-50/90 px-2.5 py-1 rounded-lg border border-emerald-200/80">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>{project.stats}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1.5">
                      {project.techStack.map((tech, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-slate-100/90 text-slate-700 text-[10px] sm:text-[11px] font-semibold border border-slate-200/50"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Card Action Link */}
                  {project.projectUrl && (
                    <div className="pt-2">
                      <Link
                        href={project.projectUrl}
                        className="inline-flex items-center justify-between w-full px-4 py-2.5 rounded-xl bg-blue-50/70 hover:bg-[#0055FF] text-[#0055FF] hover:text-white border border-blue-100 text-xs font-bold transition-all duration-200 group/btn"
                      >
                        <span>Explore Project Details</span>
                        <FiExternalLink className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* View All Tie-Ups Banner */}
        <div className="mt-8 text-center">
          <Link
            href="/key-clients"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-blue-50 text-[#0055FF] border border-blue-200 text-xs sm:text-sm font-extrabold shadow-xs hover:shadow-md transition-all"
          >
            <span>Explore All 150+ Key Clients & Job Tie-Up Companies</span>
            <FiChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
