"use client";

import { motion } from "framer-motion";
import Link from "next/link";


export default function EngineersClient({ initialData, facultyList }: { initialData: any, facultyList: any[] }) {
  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="heading-font text-4xl md:text-6xl font-bold mb-6">{initialData?.heroTitle || "Meet the Top 1% Engineers"}</h1>
            <p className="text-lg md:text-xl style-text-secondary">
              {initialData?.heroSubtitle || "Learn directly from industry veterans who have built products scaling to millions of users. No influencers, just real engineers."}
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {facultyList.map((faculty, index) => (
              <motion.div 
                key={faculty.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="rounded-[32px] overflow-hidden border card-hover flex flex-col backdrop-blur-md"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
              >
                <div className="aspect-[4/3] relative overflow-hidden bg-gray-100 dark:bg-gray-800 border-b" style={{ borderColor: 'var(--border-soft)' }}>
                  {faculty.image ? (
                    <img src={faculty.image} alt={faculty.fullName || faculty.name || "Faculty"} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-6xl font-bold text-gray-300">
                      {(faculty.fullName || faculty.name || faculty.email).charAt(0).toUpperCase()}
                    </div>
                  )}
                  {faculty.profile?.experienceYears && (
                    <div className="gold-dogtag absolute bottom-4 right-4 px-4 py-1.5 rounded text-[11px] font-black uppercase tracking-widest shadow-xl border transform hover:scale-105 transition-transform" 
                         style={{ 
                           background: 'linear-gradient(135deg, #F9F295 0%, #E0AA3E 40%, #E0AA3E 60%, #B8860B 100%)', 
                           borderColor: '#FFF8DC', 
                           color: '#332200',
                           boxShadow: '0 4px 15px rgba(218, 165, 32, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6)'
                         }}>
                      {faculty.profile.experienceYears}+ Years Exp
                    </div>
                  )}
                </div>
                
                <div className="p-8 flex flex-col flex-1">
                  <h2 className="heading-font text-2xl font-bold mb-1">{faculty.fullName || faculty.name || "Anonymous Faculty"}</h2>
                  <p className="text-sm font-semibold uppercase tracking-wider mb-6 text-amber-500">
                    {faculty.profile?.organization ? `Engineer at ${faculty.profile.organization}` : "Senior Software Engineer"}
                  </p>
                  
                  <div className="mb-8 flex-1">
                    <h3 className="text-sm font-bold mb-2" style={{ color: 'var(--text-secondary)' }}>Teaches:</h3>
                    {faculty.courses && faculty.courses.length > 0 ? (
                      <ul className="space-y-1">
                        {faculty.courses.slice(0, 3).map((course: any, i: number) => (
                          <li key={i} className="text-sm font-medium flex items-start gap-2">
                            <span className="text-green-500 mt-0.5">✓</span>
                            <span>{course.title}</span>
                          </li>
                        ))}
                        {faculty.courses.length > 3 && (
                          <li className="text-sm italic" style={{ color: 'var(--text-secondary)' }}>+ {faculty.courses.length - 3} more...</li>
                        )}
                      </ul>
                    ) : (
                      <p className="text-sm italic" style={{ color: 'var(--text-tertiary)' }}>No published courses yet.</p>
                    )}
                  </div>
                  
                  <div className="mt-auto">
                    <Link href={`/engineers/${faculty.id}`} className="inline-flex items-center gap-2 text-sm font-bold hover:gap-3 transition-all" style={{ color: 'var(--accent-primary)' }}>
                      Know more <span>&gt;&gt;&gt;</span>
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
            
            {facultyList.length === 0 && (
              <div className="col-span-1 md:col-span-2 lg:col-span-3 text-center py-20 text-gray-500 italic border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-soft)' }}>
                 No faculty members found. Ensure instructors are registered and have their roles set to INSTRUCTOR.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
