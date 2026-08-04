"use client";

import { motion } from "framer-motion";
import Link from "next/link";


export default function CommunityClient({ initialData }: { initialData: any }) {
  const features = initialData?.features || [
    {
      title: "Private Discord Server",
      description: "Get 24/7 access to our private Discord where students, alumni, and faculty hang out and talk tech.",
      icon: "💬"
    },
    {
      title: "Code Reviews",
      description: "Drop your PRs in the review channel and get feedback from top 1% engineers before you merge.",
      icon: "👀"
    },
    {
      title: "Mock Interviews",
      description: "Practice your system design and DSA skills with peers who are also interviewing at FAANG.",
      icon: "🎤"
    }
  ];

  const members = initialData?.members || [
    "Frontend Developers", "Backend Engineers", "Full-Stack Devs", "System Architects", "Product Managers"
  ];

  const joinLink = initialData?.joinLink || "/auth";

  return (
    <>
      <div className="min-h-screen pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 backdrop-blur-md" style={{ background: 'var(--glass-bg)', border: '1px solid var(--border-soft)' }}>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              <span className="text-sm font-semibold">{initialData?.onlineCount || "1,204"} Members Online</span>
            </div>
            <h1 className="heading-font text-4xl md:text-6xl font-bold mb-6">{initialData?.heroTitle || "Join the Developer Network"}</h1>
            <p className="text-lg md:text-xl style-text-secondary mb-10">
              {initialData?.heroSubtitle || "Your network is your net worth. Connect with thousands of ambitious engineers building the next generation of software."}
            </p>
            <Link href={joinLink} className="btn-primary px-10 py-5 rounded-2xl text-xl inline-flex items-center gap-3 shadow-[0_0_30px_rgba(124,58,237,0.6)]">
               {initialData?.joinButtonText || "Join the Community"}
               <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z"/></svg>
            </Link>
          </motion.div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-24">
            {features.map((feature: any, index: number) => (
              <motion.div 
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="p-8 rounded-[32px] border backdrop-blur-md"
                style={{ background: 'var(--glass-bg)', borderColor: 'var(--glass-border)' }}
              >
                <div className="text-4xl mb-6">{feature.icon}</div>
                <h3 className="heading-font text-2xl font-bold mb-3">{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)' }}>{feature.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Members Marquee */}
          <div className="text-center mb-10">
            <h3 className="heading-font text-2xl font-bold mb-8">Who you'll meet</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {members.map((member: string, i: number) => (
                <span key={i} className="px-6 py-3 rounded-full text-sm font-bold border backdrop-blur-md" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
                  {member}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
