"use client";

import { motion } from "framer-motion";
import Link from "next/link";


export default function ProjectsClient({ initialData }: { initialData: any }) {
  const projects = initialData?.projects || [
    {
      title: "Full-Stack AI LMS Platform",
      description: "A complete learning management system with AI integrations, real-time chat, and video streaming. Built with Next.js, Prisma, and PostgreSQL.",
      githubLink: "https://github.com",
      demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
      techStack: ["Next.js", "React", "PostgreSQL", "Prisma"],
      isActive: true
    },
    {
      title: "Real-Time Collaborative Code Editor",
      description: "A browser-based code editor supporting multiple users typing simultaneously with syntax highlighting and live execution.",
      githubLink: "https://github.com",
      demoVideoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800",
      techStack: ["Node.js", "Socket.io", "React", "Docker"],
      isActive: true
    }
  ];

  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h1 className="heading-font text-4xl md:text-6xl font-bold mb-6">{initialData?.heroTitle || "Alumni Projects"}</h1>
            <p className="text-lg md:text-xl style-text-secondary">
              {initialData?.heroSubtitle || "Explore production-grade applications built by our students. This is the portfolio you will graduate with."}
            </p>
          </motion.div>

          <div className="space-y-24">
            {projects.filter((p: any) => p.isActive !== false).map((project: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                className="flex flex-col lg:flex-row gap-12 items-center"
              >
                {/* Video/Image Section */}
                <div className={`w-full lg:w-1/2 ${index % 2 === 1 ? 'lg:order-2' : ''}`}>
                  <div className="rounded-[32px] overflow-hidden border shadow-2xl relative aspect-video" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
                    {project.demoVideoUrl ? (
                      <iframe 
                        src={project.demoVideoUrl} 
                        className="w-full h-full absolute inset-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      ></iframe>
                    ) : (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full lg:w-1/2">
                  <div className="flex gap-2 flex-wrap mb-4">
                    {project.techStack?.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1 text-xs font-bold rounded-full" style={{ background: 'color-mix(in srgb, var(--accent-primary) 15%, transparent)', color: 'var(--accent-primary)' }}>
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h2 className="heading-font text-3xl font-bold mb-4">{project.title}</h2>
                  <p className="text-lg mb-8" style={{ color: 'var(--text-secondary)' }}>
                    {project.description}
                  </p>
                  <div className="flex gap-4">
                    {project.githubLink && (
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="btn-secondary px-6 py-3 rounded-xl flex items-center gap-2">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                        View Source Code
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {(!projects || projects.length === 0) && (
              <div className="text-center py-20 text-gray-500 italic border border-dashed rounded-3xl" style={{ borderColor: 'var(--border-soft)' }}>
                 No projects have been added to the CMS yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
