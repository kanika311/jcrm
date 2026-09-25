"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { SponsoredAd, DEFAULT_SPONSORED_AD } from "@/lib/sponsoredAd";
import SponsoredAdModal from "@/components/SponsoredAdModal";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiArrowRight,
  FiX,
  FiSliders,
  FiEdit2,
  FiExternalLink,
  FiMessageCircle,
  FiUserCheck,
  FiTag,
} from "react-icons/fi";

const ITEMS_PER_PAGE = 6;

interface Course {
  id: string;
  title: string;
  slug?: string;
  description?: string;
  instructor?: string;
  rating?: string | number;
  price?: string;
  level?: string;
  badge?: string;
  category?: string;
  tags?: string[];
  image?: string;
}

export default function CoursesCatalogClient({
  courses = [],
  initialSponsoredAd,
}: {
  cmsData?: any;
  courses: Course[];
  initialSponsoredAd?: SponsoredAd;
}) {
  const { data: session } = useSession();
  const isAdmin = session?.user?.role === "ADMIN";

  const [sponsoredAd, setSponsoredAd] = useState<SponsoredAd>(
    initialSponsoredAd || DEFAULT_SPONSORED_AD
  );
  const [isSponsoredModalOpen, setIsSponsoredModalOpen] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("All Levels");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedInstructor, setSelectedInstructor] = useState("All Instructors");
  const [sortBy, setSortBy] = useState("featured");
  const [maxPrice, setMaxPrice] = useState(50000);
  const [currentPage, setCurrentPage] = useState(1);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Extract unique categories and instructors
  const { categories, instructors, highestCoursePrice } = useMemo(() => {
    const cats = new Set<string>();
    const insts = new Set<string>();
    let maxP = 30000;

    courses.forEach((c) => {
      if (c.category) cats.add(c.category);
      if (c.tags && Array.isArray(c.tags)) {
        c.tags.forEach((t) => {
          if (t && t.length < 25) cats.add(t);
        });
      }
      if (c.instructor) insts.add(c.instructor);

      const parsedPrice = parseInt(String(c.price || "").replace(/[^0-9]/g, ""), 10);
      if (!isNaN(parsedPrice) && parsedPrice > maxP) {
        maxP = parsedPrice;
      }
    });

    return {
      categories: Array.from(cats),
      instructors: Array.from(insts),
      highestCoursePrice: Math.ceil(maxP / 5000) * 5000,
    };
  }, [courses]);

  // Set initial max price dynamically if needed
  useEffect(() => {
    if (highestCoursePrice > 50000) {
      setMaxPrice(highestCoursePrice);
    }
  }, [highestCoursePrice]);

  // Reset filters handler
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedLevel("All Levels");
    setSelectedCategory("All Categories");
    setSelectedInstructor("All Instructors");
    setSortBy("featured");
    setMaxPrice(highestCoursePrice || 50000);
    setCurrentPage(1);
  };

  // Calculate active filter count for badges
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (selectedLevel !== "All Levels") count++;
    if (selectedCategory !== "All Categories") count++;
    if (selectedInstructor !== "All Instructors") count++;
    if (sortBy !== "featured") count++;
    if (maxPrice < (highestCoursePrice || 50000)) count++;
    if (searchQuery.trim().length > 0) count++;
    return count;
  }, [selectedLevel, selectedCategory, selectedInstructor, sortBy, maxPrice, searchQuery, highestCoursePrice]);

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    const result = courses.filter((course) => {
      // Search
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        course.title.toLowerCase().includes(q) ||
        (course.description && course.description.toLowerCase().includes(q)) ||
        (course.instructor && course.instructor.toLowerCase().includes(q)) ||
        (course.tags && course.tags.some((t) => t.toLowerCase().includes(q)));

      // Level
      const matchesLevel =
        selectedLevel === "All Levels" ||
        (course.level && course.level.toLowerCase() === selectedLevel.toLowerCase());

      // Category
      const matchesCategory =
        selectedCategory === "All Categories" ||
        (course.category && course.category.toLowerCase() === selectedCategory.toLowerCase()) ||
        (course.tags && course.tags.some((t) => t.toLowerCase() === selectedCategory.toLowerCase()));

      // Instructor
      const matchesInstructor =
        selectedInstructor === "All Instructors" ||
        (course.instructor && course.instructor.toLowerCase() === selectedInstructor.toLowerCase());

      // Price
      const numPrice = parseInt(String(course.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
      const matchesPrice = numPrice <= maxPrice;

      return matchesSearch && matchesLevel && matchesCategory && matchesInstructor && matchesPrice;
    });

    // Sorting
    if (sortBy === "rating_desc") {
      result.sort((a, b) => (parseFloat(String(b.rating || "0")) || 0) - (parseFloat(String(a.rating || "0")) || 0));
    } else if (sortBy === "price_asc") {
      result.sort((a, b) => {
        const pa = parseInt(String(a.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
        const pb = parseInt(String(b.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
        return pa - pb;
      });
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => {
        const pa = parseInt(String(a.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
        const pb = parseInt(String(b.price || "0").replace(/[^0-9]/g, ""), 10) || 0;
        return pb - pa;
      });
    } else if (sortBy === "title_asc") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    }

    return result;
  }, [courses, searchQuery, selectedLevel, selectedCategory, selectedInstructor, sortBy, maxPrice]);

  // Reset to page 1 on filter/search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedLevel, selectedCategory, selectedInstructor, sortBy, maxPrice]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredCourses.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedCourses = filteredCourses.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const goToPage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reusable Filter Sidebar Content (Pure Blue & White Theme)
  const FilterSidebarContent = (
    <div className="flex h-full flex-col bg-white dark:bg-gray-900">
      {/* Sidebar Header (Blue & White Header) */}
      <div className="shrink-0 flex items-center justify-between border-b-2 border-blue-600 bg-[#0055FF] px-4 py-3 text-white">
        <div className="flex items-center gap-2.5">
          <span className="rounded-lg bg-white/20 p-1.5 shadow-xs">
            <FiSliders className="h-4 w-4 text-white" />
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-white">FIND YOUR COURSE</span>
        </div>
        {mobileFilterOpen && (
          <button
            type="button"
            onClick={() => setMobileFilterOpen(false)}
            className="rounded-lg p-1 text-white hover:bg-white/10 lg:hidden"
          >
            <FiX className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Filter Sections Scrollable Area */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-2 text-xs divide-y divide-blue-50 dark:divide-gray-800">
        
        {/* Course Level */}
        <div className="py-3.5">
          <h4 className="mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-slate-800 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-[#0055FF]" />
            COURSE LEVEL
          </h4>
          <select
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50/70 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20"
          >
            <option value="All Levels">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
            <option value="Specialized">Specialized</option>
          </select>
        </div>

        {/* Domain / Category */}
        <div className="py-3.5">
          <h4 className="mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-slate-800 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-[#0055FF]" />
            DOMAIN / CATEGORY
          </h4>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50/70 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20"
          >
            <option value="All Categories">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Instructor */}
        {instructors.length > 0 && (
          <div className="py-3.5">
            <h4 className="mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-slate-800 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-[#0055FF]" />
              FACULTY / INSTRUCTOR
            </h4>
            <select
              value={selectedInstructor}
              onChange={(e) => setSelectedInstructor(e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50/70 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20"
            >
              <option value="All Instructors">All Instructors</option>
              {instructors.map((inst) => (
                <option key={inst} value={inst}>
                  {inst}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Sort By */}
        <div className="py-3.5">
          <h4 className="mb-2 flex items-center gap-2 font-bold uppercase tracking-wider text-slate-800 dark:text-blue-300">
            <span className="h-2 w-2 rounded-full bg-[#0055FF]" />
            SORT BY
          </h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold bg-slate-50/70 dark:bg-gray-800 border border-blue-100 dark:border-gray-700 text-slate-700 dark:text-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/20"
          >
            <option value="featured">Featured First</option>
            <option value="rating_desc">Rating: High to Low</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="title_asc">Title: A to Z</option>
          </select>
        </div>

        {/* Maximum Tuition Fee */}
        <div className="py-3.5">
          <div className="flex items-center justify-between mb-2">
            <h4 className="flex items-center gap-2 font-bold uppercase tracking-wider text-slate-800 dark:text-blue-300">
              <span className="h-2 w-2 rounded-full bg-[#0055FF]" />
              MAX TUITION
            </h4>
            <span className="font-black text-[#0055FF]">
              ₹{maxPrice.toLocaleString()}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={highestCoursePrice || 50000}
            step={1000}
            value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))}
            className="w-full h-1.5 bg-blue-100 rounded-lg appearance-none cursor-pointer accent-[#0055FF]"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-semibold">
            <span>₹0</span>
            <span>₹{(highestCoursePrice || 50000).toLocaleString()}</span>
          </div>
        </div>

      </div>

      {/* Sidebar Footer with Blue/White Clear All */}
      <div className="shrink-0 border-t border-blue-100 dark:border-gray-800 bg-slate-50 dark:bg-gray-900 p-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleResetFilters}
            className="flex-1 py-2.5 rounded-xl border border-blue-200 dark:border-blue-900 bg-white dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-gray-700 text-[#0055FF] dark:text-blue-400 font-bold text-xs transition shadow-xs"
          >
            Clear All
          </button>
          {mobileFilterOpen && (
            <button
              type="button"
              onClick={() => setMobileFilterOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white font-bold text-xs transition shadow-xs"
            >
              Apply ({filteredCourses.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-20 bg-white font-sans">
      
      {/* 3-Panel Responsive Layout: Left Filter + Center Courses + Right Highlights */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">

          {/* ================================================================ */}
          {/* 1. LEFT PANEL: FILTERS SIDEBAR (Pure White & Light Blue)          */}
          {/* ================================================================ */}
          <aside className="hidden lg:block w-64 lg:w-72 shrink-0 sticky top-24 max-h-[calc(100vh-7.5rem)] rounded-2xl border border-[#D4E8F8] bg-white shadow-xs overflow-hidden">
            {FilterSidebarContent}
          </aside>

          {/* MOBILE FILTER MODAL DRAWER */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden flex">
              <div
                className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              />
              <aside className="relative left-0 top-0 flex h-full w-[min(320px,88vw)] max-w-full flex-col overflow-hidden bg-white shadow-2xl z-50">
                {FilterSidebarContent}
              </aside>
            </div>
          )}

          {/* ================================================================ */}
          {/* 2. CENTER PANEL: SEARCH BAR + COURSES GRID                       */}
          {/* ================================================================ */}
          <main className="flex-1 min-w-0 w-full">

            {/* STICKY SEARCH BAR (Pure Blue & White Theme) */}
            <div className="sticky top-20 z-30 mb-5 bg-white/95 backdrop-blur-md pt-1 pb-3">
              <div className="flex items-center gap-2 sm:gap-3">

                {/* Mobile Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className={`relative flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-2xl border-2 px-3.5 text-xs font-bold shadow-xs transition active:scale-95 lg:hidden ${
                    activeFilterCount > 0
                      ? "border-[#0055FF] bg-[#0055FF] text-white ring-2 ring-blue-500/20"
                      : "border-[#D4E8F8] bg-white text-slate-800 ring-2 ring-blue-500/10 hover:border-[#0055FF]"
                  }`}
                  aria-label="Open filters"
                >
                  <FiSliders className={`h-4 w-4 ${activeFilterCount > 0 ? "text-white" : "text-[#0055FF]"}`} />
                  <span className="hidden sm:inline">Filters</span>
                  {activeFilterCount > 0 && (
                    <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-white text-[#0055FF] px-1 text-[10px] font-bold shadow-xs">
                      {activeFilterCount}
                    </span>
                  )}
                </button>

                {/* Main Prominent Sticky Search Box (Pure Blue Border & White Background) */}
                <div className="relative flex flex-1 items-center rounded-2xl border-2 border-[#0055FF] bg-white shadow-xs">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0055FF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, skills, technologies..."
                    className="w-full rounded-2xl bg-transparent py-3.5 pl-11 pr-10 text-sm font-bold text-slate-900 outline-none placeholder:text-slate-400 placeholder:font-normal"
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

              </div>

              {/* Showing count & active filters badge indicator */}
              <div className="flex items-center justify-between mt-2.5 px-1 text-xs">
                <span className="font-bold text-slate-500">
                  SHOWING <strong className="text-slate-900">{filteredCourses.length}</strong> OF {courses.length} COURSES
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[#0055FF] hover:underline font-bold transition flex items-center gap-1 cursor-pointer"
                  >
                    <span>Reset All Filters</span>
                    <FiX className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* COURSES CARDS GRID (2 columns in Center Panel) */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-16 bg-blue-50/30 rounded-2xl border border-dashed border-[#D4E8F8] p-8 shadow-xs">
                <p className="text-base font-extrabold text-slate-900 mb-1.5">
                  No courses found matching your criteria
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Try adjusting your search query, price range, or category filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition shadow-xs cursor-pointer"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {paginatedCourses.map((course) => (
                    <Link
                      href={`/courses/${course.id}`}
                      key={course.id}
                      className="group block rounded-2xl bg-white border border-[#D4E8F8] shadow-xs hover:shadow-md hover:border-[#0055FF]/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
                    >
                      {/* Thumbnail Image */}
                      <div className="h-44 w-full relative overflow-hidden bg-slate-900">
                        <img
                          src={course.image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80"}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/30 to-black/20 p-4 flex flex-col justify-between">
                          <div className="flex items-center justify-between relative z-10">
                            {course.badge && (
                              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white text-[#0055FF] shadow-xs">
                                {course.badge}
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                              {course.level || "Beginner"}
                            </span>
                          </div>

                          <div className="relative z-10">
                            <h3 className="heading-font text-base sm:text-lg font-extrabold text-white leading-tight drop-shadow-xs group-hover:text-blue-200 transition-colors line-clamp-1">
                              {course.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Instructor & Rating */}
                          <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-bold text-slate-800 truncate max-w-[140px]">
                              {course.instructor || "JCRM Faculty"}
                            </span>
                            <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 shrink-0">
                              <FiStar className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{course.rating || "4.9"}</span>
                            </div>
                          </div>

                          {/* Description */}
                          <p className="text-xs text-slate-600 leading-relaxed line-clamp-2 mb-3">
                            {course.description}
                          </p>

                          {/* Tags */}
                          {course.tags && course.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                              {course.tags.slice(0, 3).map((tag, j) => (
                                <span
                                  key={j}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-[#0055FF] border border-[#D4E8F8]"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Price and CTA */}
                        <div className="pt-3 border-t border-[#D4E8F8] flex items-center justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 block uppercase tracking-wider">
                              TUITION FEE
                            </span>
                            <span className="heading-font text-base font-black text-slate-900">
                              {course.price || "₹12,999"}
                            </span>
                          </div>

                          <span className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-xs flex items-center gap-1.5">
                            <span>View Details</span>
                            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* PAGINATION CONTROLS (Blue & White) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8 pt-5 border-t border-[#D4E8F8]">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#D4E8F8] bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#0055FF] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
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
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            currentPage === page
                              ? "bg-[#0055FF] text-white shadow-xs"
                              : "bg-white text-slate-700 border border-[#D4E8F8] hover:bg-blue-50 hover:text-[#0055FF]"
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
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-[#D4E8F8] bg-white text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#0055FF] transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                    >
                      <span>Next</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

            {/* Mobile / Tablet Sponsored Banner */}
            {sponsoredAd.isActive && (
              <div className="xl:hidden mt-8 bg-white border border-[#D4E8F8] rounded-2xl p-5 shadow-xs space-y-3.5">
                <div className="flex items-center justify-start pb-3 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-50">
                    <img
                      src={sponsoredAd.image}
                      alt={sponsoredAd.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900">{sponsoredAd.title}</h4>
                  <p className="text-xs text-slate-600 font-medium leading-relaxed">
                    {sponsoredAd.description}
                  </p>
                </div>

                {sponsoredAd.ctaLink && (
                  <a
                    href={sponsoredAd.ctaLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2"
                  >
                    <span>{sponsoredAd.ctaText || "Learn More"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

          </main>

          {/* ================================================================ */}
          {/* 3. RIGHT PANEL: SPONSORED BANNER & ENTERPRISE TRAINING SPOTLIGHT  */}
          {/* ================================================================ */}
          <aside className="w-72 lg:w-80 shrink-0 hidden xl:block sticky top-24 self-start space-y-5">
            {/* SPONSORED ADVERTISEMENT CARD */}
            {sponsoredAd.isActive ? (
              <div className="bg-white border border-[#D4E8F8] rounded-2xl shadow-xs p-5 space-y-3.5 relative overflow-hidden group hover:border-[#0055FF]/40 transition-all">
                {/* Header: Only Sponsored Badge */}
                <div className="flex items-center justify-start pb-3 border-b border-[#D4E8F8]">
                  <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0055FF] border border-[#D4E8F8] text-[10px] font-black tracking-wider uppercase flex items-center gap-1.5">
                    <FiTag className="w-3 h-3 text-[#0055FF]" />
                    <span>SPONSORED</span>
                  </span>
                </div>

                {/* Optional Banner Image */}
                {sponsoredAd.image && (
                  <div className="w-full h-36 rounded-xl overflow-hidden border border-[#D4E8F8] bg-slate-50 relative">
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
                    className="w-full py-2.5 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-bold shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>{sponsoredAd.ctaText || "Learn More"}</span>
                    <FiExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            ) : null}
          </aside>

        </div>
      </div>

    </div>
  );
}
