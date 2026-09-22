"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiSearch, FiChevronLeft, FiChevronRight, FiStar, FiArrowRight, FiX } from "react-icons/fi";

const ITEMS_PER_PAGE = 6;

export default function CoursesCatalogClient({
  courses,
}: {
  cmsData?: any;
  courses: any[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All Courses");
  const [currentPage, setCurrentPage] = useState(1);

  // Filter courses based on search & category
  const filteredCourses = courses.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.tags && course.tags.some((t: string) => t.toLowerCase().includes(searchQuery.toLowerCase())));

    const matchesFilter =
      activeFilter === "All Courses" ||
      course.level?.toLowerCase() === activeFilter.toLowerCase();

    return matchesSearch && matchesFilter;
  });

  // Reset to page 1 on filter or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeFilter]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen pt-24 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* STICKY SEARCH & FILTER BAR AT THE TOP */}
      <div className="sticky top-20 z-40 bg-white/90 dark:bg-gray-950/90 backdrop-blur-xl border-b border-slate-200/80 dark:border-gray-800/80 shadow-xs mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Sticky Search Input */}
          <div className="relative flex-1 max-w-xl">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses by title, skill, or technology..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 dark:bg-gray-900 border border-slate-200 dark:border-gray-800 text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] shadow-xs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Compact Filter Pills Beside / In Sticky Bar */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0">
            {["All Courses", "Beginner", "Intermediate", "Advanced", "Specialized"].map((filter) => {
              const active = activeFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    active
                      ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/20 scale-105"
                      : "bg-slate-100 dark:bg-gray-900 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-gray-800"
                  }`}
                >
                  {filter}
                </button>
              );
            })}
          </div>

        </div>
      </div>

      {/* MAIN COURSES SECTION - NO UNWANTED TEXT HEADERS */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {filteredCourses.length === 0 ? (
          <div className="text-center py-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-[32px] border border-blue-100 dark:border-gray-800 p-8 shadow-sm">
            <p className="text-lg font-extrabold text-slate-800 dark:text-white mb-2">
              No courses found matching &quot;{searchQuery}&quot;
            </p>
            <p className="text-sm font-semibold text-slate-500">
              Try adjusting your search terms or category filter.
            </p>
          </div>
        ) : (
          <>
            {/* Courses Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginatedCourses.map((course) => (
                <Link
                  href={`/courses/${course.id}`}
                  key={course.id}
                  className="group block rounded-[28px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-slate-200/80 dark:border-gray-800/80 shadow-md hover:-translate-y-1.5 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                >
                  {/* Thumbnail Image */}
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900">
                    <img
                      src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/30 to-black/20 p-5 flex flex-col justify-between">
                      <div className="flex items-center justify-between relative z-10">
                        {course.badge && (
                          <span className="px-3 py-1 text-[11px] font-extrabold rounded-full bg-white text-[#0055FF] shadow-md">
                            {course.badge}
                          </span>
                        )}
                        <span className="px-2.5 py-0.5 text-[11px] font-bold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                          {course.level}
                        </span>
                      </div>

                      <div className="relative z-10">
                        <h3 className="heading-font text-xl font-extrabold text-white leading-tight drop-shadow-sm group-hover:text-blue-200 transition-colors">
                          {course.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      {/* Instructor & Rating */}
                      <div className="flex items-center justify-between mb-3 text-xs">
                        <span className="font-bold text-slate-700 dark:text-slate-300">
                          {course.instructor || "JCRM Faculty"}
                        </span>
                        <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900">
                          <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{course.rating || "4.9"}</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 mb-3">
                        {course.description}
                      </p>

                      {/* Tags */}
                      {course.tags && course.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5">
                          {course.tags.slice(0, 3).map((tag: string, j: number) => (
                            <span
                              key={j}
                              className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-blue-50/80 dark:bg-blue-900/30 text-slate-600 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Price and CTA */}
                    <div className="pt-3 border-t border-slate-100 dark:border-gray-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                          TUITION FEE
                        </span>
                        <span className="heading-font text-lg font-black text-slate-900 dark:text-white">
                          {course.price || "₹12,999"}
                        </span>
                      </div>

                      <span className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-md flex items-center gap-1.5">
                        <span>View Details</span>
                        <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-14 pt-8 border-t border-slate-200/80 dark:border-gray-800/80">
                <button
                  type="button"
                  disabled={currentPage === 1}
                  onClick={() => goToPage(currentPage - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <FiChevronLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>

                <div className="flex items-center gap-1.5">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      type="button"
                      onClick={() => goToPage(page)}
                      className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                        currentPage === page
                          ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/25 scale-105"
                          : "bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-gray-800 hover:bg-slate-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  disabled={currentPage === totalPages}
                  onClick={() => goToPage(currentPage + 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Next</span>
                  <FiChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
