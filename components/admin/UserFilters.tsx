"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState, useEffect } from "react";

export function UserFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentSearch = searchParams.get("search") || "";

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

  return (
    <input
      type="text"
      placeholder="Search by email or name..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      className="input-premium px-4 py-2.5 rounded-lg text-sm w-full"
    />
  );
}
