"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  FiSearch,
  FiChevronLeft,
  FiChevronRight,
  FiStar,
  FiArrowRight,
  FiX,
  FiSliders,
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
}: {
  cmsData?: any;
  courses: Course[];
}) {
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
    <div className="min-h-screen pt-24 pb-20 bg-[#f8fafc] dark:bg-gray-950">
      
      {/* 2-Column Responsive Layout: Left Filter + Right Courses */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-start gap-6">

          {/* DESKTOP LEFT FILTER SIDEBAR (Blue & White Border & Theme, Sticky on scroll) */}
          <aside className="hidden lg:block w-[280px] shrink-0 sticky top-24 h-[calc(100vh-7.5rem)] rounded-2xl border border-blue-200/80 bg-white shadow-md ring-1 ring-blue-500/10 dark:border-blue-950 dark:bg-gray-900 overflow-hidden">
            {FilterSidebarContent}
          </aside>

          {/* MOBILE FILTER MODAL DRAWER */}
          {mobileFilterOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div
                className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
                onClick={() => setMobileFilterOpen(false)}
              />
              <aside className="absolute left-0 top-0 flex h-full w-[min(320px,88vw)] max-w-full flex-col overflow-hidden bg-white shadow-2xl dark:bg-gray-900">
                {FilterSidebarContent}
              </aside>
            </div>
          )}

          {/* RIGHT COLUMN: STICKY BLUE-WHITE SEARCH BAR + COURSES GRID */}
          <main className="flex-1 min-w-0 w-full">

            {/* STICKY SEARCH BAR (Pure Blue & White Theme) */}
            <div className="sticky top-20 z-30 mb-6 bg-[#f8fafc]/90 dark:bg-gray-950/90 backdrop-blur-md pt-1 pb-3">
              <div className="flex items-center gap-2 sm:gap-3">

                {/* Mobile Filter Toggle Button */}
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className={`relative flex h-[50px] shrink-0 items-center justify-center gap-2 rounded-2xl border-2 px-3.5 text-xs font-bold shadow-xs transition active:scale-95 lg:hidden ${
                    activeFilterCount > 0
                      ? "border-[#0055FF] bg-[#0055FF] text-white ring-2 ring-blue-500/20"
                      : "border-blue-200 bg-white text-slate-800 ring-2 ring-blue-500/10 hover:border-[#0055FF] dark:border-blue-900 dark:bg-gray-900 dark:text-white"
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

                {/* Main Prominent Sticky Search Box (Blue Border & White Background) */}
                <div className="relative flex flex-1 items-center rounded-2xl border-2 border-[#0055FF] bg-white shadow-sm ring-2 ring-blue-500/15 dark:border-[#0055FF] dark:bg-gray-900">
                  <FiSearch className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#0055FF]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search courses, skills, technologies..."
                    className="w-full rounded-2xl bg-transparent py-3.5 pl-11 pr-10 text-sm font-medium text-slate-800 dark:text-white outline-none placeholder:text-slate-400"
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
                <span className="font-bold text-slate-500 dark:text-slate-400">
                  SHOWING <strong className="text-slate-800 dark:text-white">{filteredCourses.length}</strong> OF {courses.length} COURSES
                </span>
                {activeFilterCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-[#0055FF] hover:text-blue-700 font-bold transition flex items-center gap-1"
                  >
                    <span>Reset All Filters</span>
                    <FiX className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>

            {/* COURSES CARDS GRID */}
            {filteredCourses.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-dashed border-blue-200 dark:border-gray-800 p-8 shadow-sm">
                <p className="text-base font-extrabold text-slate-800 dark:text-white mb-2">
                  No courses found matching your criteria
                </p>
                <p className="text-xs text-slate-500 mb-4">
                  Try adjusting your search query, price range, or category filter.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-[#0055FF] hover:bg-blue-600 transition shadow-sm"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedCourses.map((course) => (
                    <Link
                      href={`/courses/${course.id}`}
                      key={course.id}
                      className="group block rounded-2xl bg-white dark:bg-gray-900 border border-slate-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
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
                              <span className="px-2.5 py-0.5 text-[10px] font-extrabold rounded-full bg-white text-[#0055FF] shadow-sm">
                                {course.badge}
                              </span>
                            )}
                            <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-black/60 text-white backdrop-blur-md border border-white/20">
                              {course.level || "Beginner"}
                            </span>
                          </div>

                          <div className="relative z-10">
                            <h3 className="heading-font text-lg font-extrabold text-white leading-tight drop-shadow-sm group-hover:text-blue-200 transition-colors line-clamp-1">
                              {course.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          {/* Instructor & Rating */}
                          <div className="flex items-center justify-between mb-2 text-xs">
                            <span className="font-bold text-slate-700 dark:text-slate-300 truncate max-w-[140px]">
                              {course.instructor || "JCRM Faculty"}
                            </span>
                            <div className="flex items-center gap-1 font-black text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-200 dark:border-amber-900 shrink-0">
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
                              {course.tags.slice(0, 3).map((tag, j) => (
                                <span
                                  key={j}
                                  className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-blue-50 dark:bg-blue-900/30 text-slate-600 dark:text-slate-300"
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
                            <span className="heading-font text-base font-black text-slate-900 dark:text-white">
                              {course.price || "₹12,999"}
                            </span>
                          </div>

                          <span className="px-3.5 py-1.5 rounded-xl text-xs font-extrabold text-white bg-[#0055FF] group-hover:bg-blue-600 transition-all shadow-sm flex items-center gap-1.5">
                            <span>View Details</span>
                            <FiArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* PAGINATION CONTROLS (Blue & White) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-10 pt-6 border-t border-slate-200/80 dark:border-gray-800/80">
                    <button
                      type="button"
                      disabled={currentPage === 1}
                      onClick={() => goToPage(currentPage - 1)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#0055FF] dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-xs"
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
                          className={`w-8 h-8 rounded-xl text-xs font-bold transition-all ${
                            currentPage === page
                              ? "bg-[#0055FF] text-white shadow-md shadow-blue-500/25 scale-105"
                              : "bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-gray-800 hover:bg-blue-50 hover:text-[#0055FF] dark:hover:bg-gray-800"
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
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold border border-slate-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-slate-700 dark:text-slate-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-blue-50 hover:text-[#0055FF] dark:hover:bg-gray-800 transition-colors flex items-center gap-1.5 shadow-xs"
                    >
                      <span>Next</span>
                      <FiChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

          </main>
        </div>
      </div>

    </div>
  );
}
