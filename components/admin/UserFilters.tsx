"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get("search") || "";
  const currentRole = searchParams.get("role") || "ALL";

  const [searchTerm, setSearchTerm] = useState(currentSearch);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(name, value);
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push(`?${createQueryString("search", searchTerm)}`);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchTerm, router, createQueryString]);

  const setRoleFilter = (role: string) => {
    router.push(`?${createQueryString("role", role === "ALL" ? "" : role)}`);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
      <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg shrink-0">
        <button 
          onClick={() => setRoleFilter("ALL")}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${currentRole === "ALL" ? "bg-white dark:bg-gray-700 shadow" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
        >
          All Users
        </button>
        <button 
          onClick={() => setRoleFilter("STUDENT")}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${currentRole === "STUDENT" ? "bg-white dark:bg-gray-700 shadow" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
        >
          Students
        </button>
        <button 
          onClick={() => setRoleFilter("INSTRUCTOR")}
          className={`px-4 py-2 rounded-md text-sm font-bold transition-colors ${currentRole === "INSTRUCTOR" ? "bg-white dark:bg-gray-700 shadow" : "text-gray-500 hover:text-gray-900 dark:hover:text-gray-100"}`}
        >
          Instructors
        </button>
      </div>

      <div className="flex gap-2 w-full md:w-auto flex-1 justify-end">
        <input 
          type="text" 
          placeholder="Search by email or name..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input-premium px-4 py-2 rounded-lg text-sm w-full md:w-64 max-w-md" 
        />
      </div>
    </div>
  );
}
