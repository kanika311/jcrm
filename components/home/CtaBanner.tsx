import Link from "next/link";

export default function CtaBanner() {
  return (
    <section className="py-6 sm:py-12 relative z-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden p-6 sm:p-10 md:p-14 rounded-2xl sm:rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_8px_35px_rgba(0,85,255,0.1)] text-center">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-sky-50/40 to-blue-50/60 pointer-events-none rounded-2xl sm:rounded-[36px]" />

          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
            <h3 className="heading-font text-xl sm:text-3xl md:text-5xl font-extrabold text-slate-900 mb-2 sm:mb-4 tracking-tight">
              Ready to <span className="text-[#0055FF]">Transform Your Business?</span>
            </h3>
           
            <Link
              href="/contact"
              className="px-6 py-2.5 sm:px-10 sm:py-4 md:py-5 rounded-full text-xs sm:text-base md:text-xl font-extrabold text-white bg-[#0055FF] shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 inline-flex items-center gap-2 sm:gap-3"
            >
              Get Started Today
              <svg className="w-4 h-4 sm:w-6 sm:h-6 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
