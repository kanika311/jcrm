"use client";

import { motion } from "framer-motion";
import Link from "next/link";

function locationLabel(profile: any) {
  return [profile.city, profile.state, profile.country].filter(Boolean).join(", ");
}

export default function EngineerPortfolioClient({ faculty }: { faculty: any }) {
  const profile = faculty.profile || {};
  const courses = faculty.courses || [];
  const firstName = (faculty.fullName || faculty.name || "Instructor").split(" ")[0];
  const displayName = faculty.fullName || faculty.name || "Anonymous Faculty";
  const location = locationLabel(profile);
  const techStack = Array.isArray(profile.techStack) ? profile.techStack.filter(Boolean) : [];
  const languages = Array.isArray(profile.languages) ? profile.languages.filter(Boolean) : [];

  const extraDetails = [
    profile.lifeStage && { label: "Status", value: profile.lifeStage },
    profile.organization && { label: "Organization", value: profile.organization },
    profile.degree && { label: "Degree", value: profile.degree },
    profile.experienceYears && { label: "Experience", value: `${profile.experienceYears}+ years` },
    location && { label: "Location", value: location },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="min-h-screen pt-24 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/engineers"
          className="inline-flex text-sm font-bold items-center gap-2 mb-6 hover:underline text-slate-500"
        >
          &lt; Back to Engineers
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start lg:h-[calc(100dvh-8.5rem)] lg:overflow-hidden">
          <aside className="lg:col-span-5 xl:col-span-4 lg:h-full lg:min-h-0 lg:sticky lg:top-24">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-[28px] border border-slate-200 bg-white p-6 sm:p-8 shadow-sm h-auto lg:h-full lg:overflow-y-auto lg:overscroll-contain"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-md shrink-0 mb-5 bg-slate-100">
                  {faculty.image ? (
                    <img
                      src={faculty.image}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-400">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <h1 className="text-3xl font-extrabold text-slate-900 tracking-normal">
                  {displayName}
                </h1>
                <p className="mt-2 text-sm font-bold text-amber-500">
                  {profile.organization ? `Engineer at ${profile.organization}` : "Senior Software Engineer"}
                  {profile.experienceYears ? ` • ${profile.experienceYears}+ Years Exp` : ""}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">
                    Biography
                  </h2>
                  <p className="text-sm leading-relaxed text-slate-600">
                    {profile.bio ||
                      "This instructor hasn't added a biography yet, but their code speaks for itself. Check out the courses they teach."}
                  </p>
                </div>

                {extraDetails.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Extra Details
                    </h2>
                    <dl className="space-y-2.5">
                      {extraDetails.map((item) => (
                        <div key={item.label} className="flex justify-between gap-4 text-sm">
                          <dt className="font-semibold text-slate-400 shrink-0">{item.label}</dt>
                          <dd className="font-bold text-slate-800 text-right">{item.value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {techStack.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Tech Stack
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {techStack.map((tech: string) => (
                        <span
                          key={tech}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#0055FF] text-xs font-bold border border-blue-100"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {languages.length > 0 && (
                  <div className="pt-4 border-t border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Languages
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((lang: string) => (
                        <span
                          key={lang}
                          className="px-2.5 py-1 rounded-lg bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200"
                        >
                          {lang}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {(profile.githubUrl || profile.linkedinUrl || profile.portfolioUrl) && (
                  <div className="pt-4 border-t border-slate-100">
                    <h2 className="text-xs font-black uppercase tracking-wider text-slate-400 mb-3">
                      Links
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {profile.githubUrl && (
                        <a
                          href={profile.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#0055FF] hover:text-[#0055FF]"
                        >
                          GitHub
                        </a>
                      )}
                      {profile.linkedinUrl && (
                        <a
                          href={profile.linkedinUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#0055FF] hover:text-[#0055FF]"
                        >
                          LinkedIn
                        </a>
                      )}
                      {profile.portfolioUrl && (
                        <a
                          href={profile.portfolioUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-full border border-slate-200 bg-white text-xs font-bold text-slate-700 hover:border-[#0055FF] hover:text-[#0055FF]"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </aside>

          <main className="lg:col-span-7 xl:col-span-8 min-w-0 min-h-0 lg:h-full lg:overflow-y-scroll lg:overscroll-contain lg:pr-1 pb-8">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-6 tracking-normal">
                Courses by {firstName}
              </h2>

              {courses.length > 0 ? (
                <div className="space-y-4">
                  {courses.map((course: any) => (
                    <Link href={`/courses/${course.id}`} key={course.id} className="block group">
                      <div className="p-6 rounded-2xl border border-slate-200 bg-white shadow-sm h-full group-hover:border-[#0055FF]/40 group-hover:shadow-md transition-all">
                        <h3 className="text-lg font-extrabold text-slate-900 mb-2 group-hover:text-[#0055FF] transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm leading-relaxed text-slate-500 line-clamp-3">
                          {course.description}
                        </p>
                        {typeof course.price === "number" && (
                          <p className="mt-4 text-sm font-black text-[#0055FF]">
                            {course.price === 0 ? "Free" : `₹${course.price.toLocaleString("en-IN")}`}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-8 rounded-2xl border border-slate-200 bg-white text-slate-500 font-medium">
                  No published courses yet.
                </div>
              )}
            </motion.div>
          </main>
        </div>
      </div>
    </div>
  );
}
