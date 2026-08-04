"use client";

import { motion } from "framer-motion";
import Link from "next/link";


export default function EngineerPortfolioClient({ faculty }: { faculty: any }) {
  const profile = faculty.profile || {};
  const courses = faculty.courses || [];
  
  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link href="/engineers" className="text-sm font-bold flex items-center gap-2 mb-12 hover:underline" style={{ color: 'var(--text-secondary)' }}>
            &lt; Back to Engineers
          </Link>

          {/* Hero Section */}
          <div className="flex flex-col md:flex-row gap-12 items-center md:items-start mb-24">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="w-48 h-48 md:w-64 md:h-64 rounded-full overflow-hidden shadow-2xl shrink-0 border-4"
              style={{ borderColor: 'var(--bg-card)' }}
            >
              {faculty.image ? (
                <img src={faculty.image} alt={faculty.fullName || faculty.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-7xl font-bold bg-gray-200 text-gray-500">
                  {(faculty.fullName || faculty.name || faculty.email).charAt(0).toUpperCase()}
                </div>
              )}
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-center md:text-left flex-1"
            >
              <h1 className="heading-font text-4xl md:text-5xl font-bold mb-4">{faculty.fullName || faculty.name || "Anonymous Faculty"}</h1>
              <p className="text-xl font-semibold mb-6 text-amber-500">
                {profile.organization ? `Engineer at ${profile.organization}` : "Senior Software Engineer"}
                {profile.experienceYears ? ` • ${profile.experienceYears}+ Years Exp` : ""}
              </p>
              
              <div className="flex gap-4 justify-center md:justify-start mb-8">
                {profile.githubUrl && (
                  <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border hover:scale-105 transition-transform" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                    GitHub
                  </a>
                )}
                {profile.linkedinUrl && (
                  <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border hover:scale-105 transition-transform" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                    LinkedIn
                  </a>
                )}
                {profile.portfolioUrl && (
                  <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="p-3 rounded-full border hover:scale-105 transition-transform" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                    Website
                  </a>
                )}
              </div>

              <div className="prose prose-lg dark:prose-invert">
                <p style={{ color: 'var(--text-secondary)' }}>
                  {profile.bio || "This instructor hasn't added a biography yet, but their code speaks for itself. Check out the courses they teach below."}
                </p>
              </div>
            </motion.div>
          </div>

          {/* Courses Section */}
          <motion.div 
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: 0.2 }}
          >
            <h2 className="heading-font text-3xl font-bold mb-8 border-b pb-4" style={{ borderColor: 'var(--border-soft)' }}>
              Courses by {faculty.fullName?.split(' ')[0] || faculty.name?.split(' ')[0] || "Instructor"}
            </h2>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {courses.map((course: any) => (
                  <Link href={`/courses/${course.id}`} key={course.id} className="block group">
                    <div className="p-6 rounded-[24px] border backdrop-blur-sm card-hover h-full" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--accent-primary)] transition-colors">{course.title}</h3>
                      <p className="text-sm line-clamp-3" style={{ color: 'var(--text-secondary)' }}>{course.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 italic">No published courses yet.</p>
            )}
          </motion.div>

        </div>
      </div>
    </>
  );
}
