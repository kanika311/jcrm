import Link from "next/link";
import Image from "next/image";
import VideoModalIsland from "./VideoModalIsland";

export default function HeroSection({
  title,
  highlight,
  subtitle,
}: {
  title?: string;
  highlight?: string;
  subtitle?: string;
}) {
  const displayTitle = title || "JCRM Technologies :";
  const displayHighlight = highlight || "Enterprise ERP & Engineering Education";
  const displaySubtitle =
    subtitle ||
"";

  return (
    <section className="relative min-h-0 sm:min-h-[calc(100vh-80px)] flex items-center justify-center py-8 sm:py-16 md:py-24 overflow-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center my-auto">
        <h1 className="heading-font text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-[1400px] mb-3 sm:mb-6 leading-tight drop-shadow-xl text-slate-900">
          <span className="inline-block">{displayTitle}</span>{" "}
          <span className="shimmer-text inline-block">{displayHighlight}</span>
        </h1>

        <p className="text-xs sm:text-base md:text-xl max-w-3xl mb-6 sm:mb-10 font-normal sm:font-medium leading-relaxed text-slate-600">
          {displaySubtitle}
        </p>

        <div className="flex flex-row flex-wrap sm:flex-nowrap gap-3 mb-6 sm:mb-10 justify-center items-center w-full">
          <Link
            href="/contact"
            className="px-5 py-3 sm:px-8 sm:py-4 rounded-full text-xs sm:text-base md:text-lg font-extrabold flex items-center justify-center gap-2 text-white transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-blue-500/30"
            style={{ background: "#0055FF" }}
          >
            Request Free Demo
            <svg className="w-4 h-4 sm:w-5 sm:h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
              <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
          <VideoModalIsland />
        </div>

        <div className="flex items-center gap-2.5 sm:gap-4 bg-white/70 backdrop-blur-md px-3.5 py-1.5 sm:px-6 sm:py-3 rounded-full border border-blue-100/80 shadow-md">
          <div className="flex -space-x-2 sm:-space-x-3">
            {[11, 12, 13, 14, 15].map((imgNum, idx) => (
              <div key={idx} className="w-7 h-7 sm:w-10 sm:h-10 rounded-full border-2 border-white overflow-hidden shadow-xs relative bg-slate-100">
                <Image
                  src={`https://i.pravatar.cc/100?img=${imgNum}`}
                  alt={`JCRM Trainee ${idx + 1}`}
                  width={40}
                  height={40}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
          <div className="text-xs sm:text-base font-bold flex flex-col items-start text-slate-800">
            <div className="flex text-amber-400 text-xs sm:text-sm">★★★★★</div>
            <span className="text-[11px] sm:text-sm">4.9/5 from 2,400+ student reviews</span>
          </div>
        </div>
      </div>
    </section>
  );
}
