"use client";

import { KEY_CLIENTS_DATA } from "@/lib/keyClientsData";
import { CompanyLogo } from "@/components/CompanyLogos";

export default function KeyClientsPageClient({ cmsData }: { cmsData?: any } = {}) {
  return (
    <div className="min-h-screen bg-white relative z-20 pt-28 sm:pt-36 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Directly show companies logos in a clean, elegant grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-x-10 sm:gap-x-14 lg:gap-x-16 gap-y-12 sm:gap-y-16 lg:gap-y-20 items-center justify-items-center">
          {KEY_CLIENTS_DATA.map((company) => (
            <div
              key={company.id}
              className="flex items-center justify-center w-full h-20 sm:h-24 p-2 transition-transform duration-200 hover:scale-105 cursor-default select-none"
              title={company.name}
            >
              <CompanyLogo
                logoKey={company.logoKey}
                className="max-h-12 sm:max-h-14 w-auto max-w-[85%] object-contain"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
