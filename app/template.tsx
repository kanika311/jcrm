import React from "react";

export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 flex flex-col w-full min-h-0 page-fade-in">
      {children}
    </div>
  );
}

