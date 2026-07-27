import Link from "next/link";
import { getSiteContent } from "@/lib/cms";
import { FaMeta } from 'react-icons/fa6';

export default async function PlacementsPage() {
  const cmsData = await getSiteContent("public-placements");

  return (
    <div className="min-h-screen pt-32 pb-20 animate-fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero */}
        <div className="text-center max-w-4xl mx-auto mb-20">
          <div className="inline-block px-4 py-1.5 rounded-full mb-6 font-semibold text-sm" style={{ background: 'var(--bg-elevated)', color: 'var(--accent-primary)', border: '1px solid var(--border-soft)' }}>
             Career Outcomes
          </div>
          <h1 className="heading-font text-5xl md:text-6xl font-bold mb-6">{cmsData?.heading || "Where our alumni work"}</h1>
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>{cmsData?.subtitle || "JCRM Technology graduates don't just pass interviews; they hit the ground running on day one. Here's where they are building the future."}</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
           {(cmsData?.stats && cmsData.stats.filter((s: any) => s.isActive !== false).length > 0) ? (
             cmsData.stats.filter((s: any) => s.isActive !== false).map((stat: any, i: number) => (
               <div key={i} className="p-8 text-center rounded-[24px]" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                  <h3 className="text-4xl font-bold mb-2 gradient-text">{stat.value}</h3>
                  <h4 className="font-bold text-lg mb-2">{stat.title}</h4>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{stat.sub}</p>
               </div>
             ))
           ) : (
             <div className="md:col-span-3 text-center py-10 text-gray-500 italic border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-soft)' }}>
                No stats provided in CMS
             </div>
           )}
        </div>

        {/* Logos Marquee static grid */}
        <div className="mb-24 text-center">
           <h3 className="font-bold mb-10 text-xl" style={{ color: 'var(--text-secondary)' }}>Hiring Partners</h3>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {(cmsData?.companies && cmsData.companies.filter((c: any) => c.isActive !== false).length > 0) ? (
                cmsData.companies.filter((c: any) => c.isActive !== false).map((company: any, i: number) => {
                   const renderHoverContent = (name: string) => {
                     const n = name.toLowerCase();
                     if (n.includes('google')) {
                       return (
                         <div className="flex items-center justify-center w-full h-full bg-white font-sans text-[28px] font-medium tracking-tighter">
                           <span className="text-[#4285F4]">G</span>
                           <span className="text-[#EA4335]">o</span>
                           <span className="text-[#FBBC05]">o</span>
                           <span className="text-[#4285F4]">g</span>
                           <span className="text-[#34A853]">l</span>
                           <span className="text-[#EA4335]">e</span>
                         </div>
                       );
                     }
                     if (n.includes('amazon')) {
                       return (
                         <div className="flex flex-col items-center justify-center w-full h-full bg-white text-black relative">
                           <span className="font-bold text-3xl tracking-tighter leading-none mt-2">amazon</span>
                           <svg viewBox="0 0 100 25" className="w-16 h-4 text-[#FF9900] -mt-1" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round">
                             <path d="M 5,5 Q 50,20 95,5" />
                             <polyline points="85,2 95,5 88,15" strokeLinejoin="round" />
                           </svg>
                         </div>
                       );
                     }
                     if (n.includes('microsoft')) {
                       return (
                         <div className="flex items-center justify-center w-full h-full bg-white gap-2 text-[#5E5E5E]">
                           <div className="grid grid-cols-2 gap-[2px] w-[22px] h-[22px]">
                             <div className="bg-[#F25022]"></div>
                             <div className="bg-[#7FBA00]"></div>
                             <div className="bg-[#00A4EF]"></div>
                             <div className="bg-[#FFB900]"></div>
                           </div>
                           <span className="font-semibold text-[22px] tracking-tight">Microsoft</span>
                         </div>
                       );
                     }
                     if (n.includes('meta') || n.includes('facebook')) {
                       return (
                         <div className="flex items-center justify-center w-full h-full bg-[#041B49] text-white gap-2">
                           <svg width="0" height="0" className="absolute">
                             <defs>
                               <linearGradient id={`meta-grad-${i}`} x1="0" y1="0" x2="1" y2="0">
                                 <stop offset="0%" stopColor="#0668E1" />
                                 <stop offset="100%" stopColor="#c13584" />
                               </linearGradient>
                             </defs>
                           </svg>
                           <FaMeta style={{ fill: `url(#meta-grad-${i})` }} className="text-4xl" />
                           <span className="font-semibold text-3xl tracking-wide ml-1">Meta</span>
                         </div>
                       );
                     }
                     if (n.includes('netflix')) {
                       return (
                         <div className="flex items-center justify-center w-full h-full bg-black text-[#E50914] font-black text-[26px] tracking-widest uppercase">
                           Netflix
                         </div>
                       );
                     }
                     return (
                       <div className="flex items-center justify-center w-full h-full bg-white text-black font-bold text-xl">
                         {name}
                       </div>
                     );
                   };
                   
                   return (
                     <div key={i} className="group h-20 relative flex items-center justify-center rounded-xl font-bold text-xl cursor-pointer overflow-hidden transition-transform hover:scale-105" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                        <div className="absolute inset-0 flex items-center justify-center transition-opacity duration-300 opacity-100 group-hover:opacity-0" style={{ color: 'var(--text-secondary)' }}>
                           {company.name}
                        </div>
                        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
                           {renderHoverContent(company.name)}
                        </div>
                     </div>
                   );
                })
              ) : (
                <div className="col-span-2 md:col-span-5 text-center py-10 text-gray-500 italic border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-soft)' }}>
                   No hiring partners provided in CMS
                </div>
              )}
           </div>
        </div>

        {/* Alumni Spotlights */}
        <div>
           <h2 className="heading-font text-3xl font-bold text-center mb-12">Alumni Spotlights</h2>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(cmsData?.alumni && cmsData.alumni.filter((a: any) => a.isActive !== false).length > 0) ? (
                cmsData.alumni.filter((a: any) => a.isActive !== false).map((alumni: any, i: number) => (
                   <div key={i} className="p-8 rounded-[24px] relative overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                      <div className="absolute top-0 right-0 w-32 h-32 blur-[50px] opacity-20" style={{ background: 'var(--accent-primary)' }}></div>
                      <div className="relative z-10">
                         {alumni.imgUrl ? (
                           <img src={alumni.imgUrl} alt={alumni.name} className="w-16 h-16 rounded-full mb-6 object-cover border-2" style={{ borderColor: 'var(--bg-surface)' }} />
                         ) : (
                           <div className="w-16 h-16 rounded-full mb-6 border-2 flex items-center justify-center font-bold text-white shadow-lg" style={{ borderColor: 'var(--bg-surface)', background: 'var(--accent-primary)' }}>
                             {alumni.name?.[0] || "?"}
                           </div>
                         )}
                         <h3 className="font-bold text-xl mb-1">{alumni.name}</h3>
                         
                         <div className="flex flex-col gap-2 mt-4 mb-6 text-sm">
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-1 rounded bg-black/5 font-semibold" style={{ color: 'var(--text-secondary)' }}>Before</span>
                               <span>{alumni.prev}</span>
                            </div>
                            <div className="flex items-center gap-2">
                               <span className="px-2 py-1 rounded font-semibold text-txt-primary" style={{ background: 'var(--accent-primary)' }}>After</span>
                               <span className="font-bold" style={{ color: 'var(--text-primary)' }}>{alumni.now}</span>
                            </div>
                         </div>
                         
                         <p className="italic" style={{ color: 'var(--text-secondary)' }}>"{alumni.quote}"</p>
                      </div>
                   </div>
                ))
              ) : (
                <div className="md:col-span-3 text-center py-10 text-gray-500 italic border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-soft)' }}>
                   No alumni spotlights provided in CMS
                </div>
              )}
           </div>
        </div>

      </div>
    </div>
  );
}