export default function StatsStrip({ stats }: { stats?: any[] }) {
  const defaultStats = [
    { value: "10,000+", label: "Engineers Trained" },
    { value: "150+", label: "Hiring Partners" },
    { value: "94%", label: "Placement Rate" },
    { value: "4.9/5", label: "Average Student Rating" },
  ];

  const activeStats = (stats && stats.length > 0)
    ? stats.filter((s: any) => s.isActive !== false)
    : defaultStats;

  return (
    <section className="py-6 sm:py-12 md:py-16 backdrop-blur-xl border-y border-blue-100/60 bg-white/70 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 sm:gap-y-12 gap-x-3 md:gap-8 divide-x divide-blue-100">
          {activeStats.map((stat: any, i: number) => (
            <div
              key={i}
              className={`text-center px-2 md:px-4 ${i === 2 ? "border-l-0 md:border-l" : ""} border-blue-100`}
            >
              <div className="heading-font text-2xl sm:text-3xl md:text-4xl font-extrabold mb-1 text-[#0055FF]">
                {stat.value}
              </div>
              <div className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
