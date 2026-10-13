export default function MarqueeSection({
  companies,
  techStackHeading,
  techStack,
}: {
  companies?: any[];
  techStackHeading?: string;
  techStack?: any[];
}) {
  const defaultCompanies = [
    "Google", "Microsoft", "Amazon", "Deloitte", "Tech Mahindra",
    "Cognizant", "TCS", "Infosys", "Wipro", "LTI Mindtree", "Cisco", "Apexon",
  ];

  const defaultTech = [
    "React", "Next.js", "TypeScript", "Node.js", "Java Spring Boot",
    "PostgreSQL", "Docker", "AWS", "Kubernetes", "Redis", "TailwindCSS", "Python",
  ];

  const activeCompanies =
    companies && companies.filter((c: any) => c.isActive !== false).length > 0
      ? companies.filter((c: any) => c.isActive !== false).map((c: any) => c.name || c)
      : defaultCompanies;

  const activeTech =
    techStack && techStack.filter((t: any) => t.isActive !== false).length > 0
      ? techStack.filter((t: any) => t.isActive !== false).map((t: any) => t.name || t)
      : defaultTech;

  return (
    <section className="py-8 sm:py-14 md:py-20 overflow-hidden border-b border-blue-100/60 bg-white/40 backdrop-blur-md">
      <div className="text-center mb-4 sm:mb-10 relative z-20">
        <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-600">
          Engineers from top companies recruit and learn here
        </p>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-white/90 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-white/90 to-transparent" />

        {/* Company Marquee */}
        <div className="flex animate-marquee whitespace-nowrap opacity-80 transition-all duration-500 hover:opacity-100">
          {Array.from({ length: 12 }).map((_, group) => (
            <div key={group} className="flex items-center gap-8 sm:gap-16 px-4 sm:px-8 text-base sm:text-2xl font-bold font-mono shrink-0 text-slate-700">
              {activeCompanies.map((name: string, idx: number) => (
                <span key={`${group}-${idx}`}>{name}</span>
              ))}
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-16 mb-4 sm:mb-10 relative z-20">
          <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-slate-600">
            {techStackHeading || "Mastering the most in-demand enterprise technologies"}
          </p>
        </div>

        {/* Tech Stack Marquee */}
        <div className="flex animate-marquee whitespace-nowrap opacity-70" style={{ animationDirection: "reverse", animationDuration: "40s" }}>
          {Array.from({ length: 12 }).map((_, group) => (
            <div key={group} className="flex items-center gap-8 sm:gap-16 px-4 sm:px-8 text-sm sm:text-xl font-bold font-mono text-transparent bg-clip-text shrink-0 bg-gradient-to-r from-[#0055FF] to-sky-500">
              {activeTech.map((tech: string, idx: number) => (
                <span key={`${group}-${idx}`}>{tech}</span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
