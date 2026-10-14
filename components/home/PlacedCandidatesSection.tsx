import Image from "next/image";
import CandidateCarouselIsland from "./CandidateCarouselIsland";

export default function PlacedCandidatesSection({
  candidates,
}: {
  candidates?: any[];
}) {
  const defaultCandidates = [
    {
      name: "Vanshika Srivastava",
      role: "Python Developer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Tech Mahindra",
    },
    {
      name: "Palak",
      role: "Business Analyst",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Deloitte",
    },
    {
      name: "Yashika Ghai",
      role: "Human Resource",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Lloyd Tech",
    },
    {
      name: "Neha Dahiya",
      role: "Sales & Marketing",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Cognizant",
    },
    {
      name: "Shruti Srivastava",
      role: "Relationship Manager",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "HDFC Bank",
    },
    {
      name: "Aarav Sharma",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "TCS",
    },
    {
      name: "Rohan Verma",
      role: "Cloud & DevOps Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Infosys",
    },
    {
      name: "Ananya Gupta",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fm=webp&fit=crop&w=320&q=80",
      company: "Wipro",
    },
  ];

  const list =
    Array.isArray(candidates) && candidates.length > 0
      ? candidates
      : defaultCandidates;

  return (
    <section className="py-10 sm:py-20 md:py-24 relative z-10 overflow-hidden" id="placements">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-8 gap-3">
          <div>
            <h2 className="heading-font text-2xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Successfully Placed <span className="text-[#0055FF]">Candidates</span>
            </h2>
          
          </div>
        </div>

        <CandidateCarouselIsland>
          {list.map((c: any, i: number) => (
            <div
              key={i}
              className="w-[200px] sm:w-[280px] shrink-0 p-3.5 sm:p-6 rounded-2xl sm:rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_4px_20px_rgba(0,85,255,0.08)] hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group pointer-events-auto select-none"
            >
              <div className="w-full h-44 sm:h-56 rounded-xl sm:rounded-2xl overflow-hidden mb-3 sm:mb-5 border border-blue-100/80 relative shadow-xs group-hover:border-blue-300 transition-colors bg-slate-100">
                <Image
                  src={c.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fm=webp&fit=crop&w=320&q=80"}
                  alt={`${c.name} - ${c.role}`}
                  width={320}
                  height={320}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none" />
              </div>

              <h3 className="heading-font font-extrabold text-slate-900 text-sm sm:text-xl mb-1 sm:mb-1.5 tracking-tight group-hover:text-[#0055FF] transition-colors truncate w-full">
                {c.name}
              </h3>

              <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-blue-50/90 border border-blue-100 text-[#0055FF] tracking-wide inline-block mb-2 sm:mb-3 truncate max-w-full">
                {c.role}
              </span>

              {c.company && (
                <div className="text-[10px] sm:text-xs font-semibold text-slate-500 flex items-center gap-1 sm:gap-1.5 mt-auto truncate max-w-full">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="truncate">Placed at {c.company}</span>
                </div>
              )}
            </div>
          ))}
        </CandidateCarouselIsland>
      </div>
    </section>
  );
}
