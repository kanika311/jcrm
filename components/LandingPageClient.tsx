"use client";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function LandingPageClient({
  initialData = {},
  initialPlacedCandidates,
}: {
  initialData?: any;
  initialPlacedCandidates?: any[];
}) {
  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 500], [0, 150]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const defaultPlacedCandidates = [
    {
      name: "Vanshika Srivastava",
      role: "Python Developer",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
      company: "Tech Mahindra"
    },
    {
      name: "Palak",
      role: "Business Analyst",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
      company: "Deloitte"
    },
    {
      name: "Yashika ghai",
      role: "Human Resource",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      company: "Lloyd Tech"
    },
    {
      name: "Neha Dahiya",
      role: "Sales & Marketing",
      image: "https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&w=400&q=80",
      company: "Cognizant"
    },
    {
      name: "Shruti Srivastava",
      role: "Relationship Manager",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80",
      company: "HDFC Bank"
    },
    {
      name: "Aarav Sharma",
      role: "Software Engineer",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
      company: "TCS"
    },
    {
      name: "Rohan Verma",
      role: "Cloud & DevOps Engineer",
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
      company: "Infosys"
    },
    {
      name: "Ananya Gupta",
      role: "Full Stack Developer",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      company: "Wipro"
    }
  ];

  const placedCandidates =
    Array.isArray(initialPlacedCandidates) && initialPlacedCandidates.length > 0
      ? initialPlacedCandidates
      : defaultPlacedCandidates;

  const [isHovered, setIsHovered] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [testimonialTab, setTestimonialTab] = useState<"text" | "video">("text");

  const clientQuotes = [
    {
      quote: "JCRM's ERP system unified our branch offices seamlessly. Our logistics, billing, and HR are now automated in a single cloud dashboard.",
      author: "Raghav Mishra",
      role: "Operations Director, V-Logistics",
      rating: 5
    },
    {
      quote: "Hands-on training at JCRM prepared me for real-world DevOps & Cloud deployment in just 3 months. Now working as a Senior Engineer!",
      author: "Shwati Singh",
      role: "DevOps Engineer @ Tech Solutions",
      rating: 5
    },
    {
      quote: "The LMS & Hospital ERP solutions built by JCRM Technologies exceeded our performance expectations. Highly reliable technical support.",
      author: "Dr. Rajesh Verma",
      role: "Managing Director, CityCare Health",
      rating: 5
    },
    {
      quote: "JCRM Technologies completely transformed my career. Their hands-on ERP development and real-world full-stack curriculum gave me the exact skills needed to transition to a senior role.",
      author: "Gautam Sahu",
      role: "Software Engineer @ LTI Mindtree",
      rating: 5
    },
    {
      quote: "The course curriculum at JCRM Technologies is top-notch and perfectly aligned with enterprise standards. Building actual hospital & LMS ERP modules made all the difference in my technical interviews.",
      author: "Prithvish",
      role: "Java Developer @ Top MNC",
      rating: 5
    },
    {
      quote: "The mentorship I received at JCRM Technologies was invaluable. Working on live production microservices & ERP API integrations gave me real industry confidence.",
      author: "Pronay Dey",
      role: "Backend Engineer @ Apexon",
      rating: 5
    },
    {
      quote: "I gained immense practical knowledge at JCRM Technologies. The instructors guided us through real database design, Spring AI integrations, and enterprise architecture step by step.",
      author: "Rashmi Mishra",
      role: "Backend Developer @ M-Junction",
      rating: 5
    },
    {
      quote: "I truly appreciate the level of knowledge and ERP product training at JCRM Technologies. Special thanks to my instructors for helping me master high-scale backend engineering.",
      author: "Abhishek Dey",
      role: "Back-end Engineer @ Cisco",
      rating: 5
    },
    {
      quote: "JCRM Technologies' ERP products and specialized training modules are exceptionally intuitive, scalable, and built for modern enterprise transformations.",
      author: "Neha Sharma",
      role: "ERP Solutions Specialist",
      rating: 5
    }
  ];

  const videoTestimonials = [
    {
      title: "How JCRM ERP Transformed Our Healthcare Operations",
      speaker: "Dr. Ananya Roy — Healthcare Director",
      thumbnail: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "From Trainee to Full-Stack Engineer at Global MNC",
      speaker: "Rohan Verma — Full-Stack Developer",
      thumbnail: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Scaling E-Commerce Logistics with JCRM Solutions",
      speaker: "Vikram Malhotra — Supply Chain Lead",
      thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=600&q=80"
    }
  ];

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (carouselRef.current) {
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, [mounted]);

  // Auto-scroll carousel every 2.5s, pause when mouse is hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 20) {
          carouselRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          carouselRef.current.scrollBy({ left: 300, behavior: "smooth" });
        }
      }
    }, 2500);

    return () => clearInterval(interval);
  }, [isHovered, mounted]);

  const handleScroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (isVideoOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVideoOpen]);

  return (
    <div className="min-h-screen pt-22">
      {/* 1. Hero Section */}
      <section className="relative min-h-[calc(100vh-88px)] flex items-center justify-center py-16 md:py-24 overflow-hidden">

        {/* Old Backgrounds Removed */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center my-auto"
        >

          <h1 className="heading-font text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight max-w-[1400px] mb-8 leading-[1.15] drop-shadow-xl text-slate-900">
            <span className="inline-block">{initialData.heroTitle || "Build skills that"}</span>
            <br />
            <span className="shimmer-text inline-block mt-3">{initialData.heroHighlight || "ship real products."}</span>
          </h1>
          <p className="text-xl sm:text-2xl md:text-3xl max-w-4xl mb-12 font-medium leading-relaxed text-slate-600">
            {initialData.heroSubtitle || "Project-based engineering courses taught by the industry's top 1%. Join 10,000+ developers building the future of software."}
          </p>

          <div className="flex flex-col sm:flex-row gap-5 mb-14 justify-center items-center w-full">
            <Link href="/contact" className="px-10 py-5 rounded-full text-lg md:text-xl font-extrabold flex items-center justify-center gap-3 text-white transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-blue-500/30" style={{ background: '#0055FF' }}>
              Request Free Demo
              <svg className="w-6 h-6 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
            </Link>
            <button onClick={() => setIsVideoOpen(true)} className="px-10 py-5 rounded-full text-lg md:text-xl font-extrabold flex items-center justify-center gap-3 text-white transition-all duration-300 hover:scale-105 shadow-2xl hover:shadow-red-500/30 cursor-pointer" style={{ background: '#FF0000' }}>
              <svg className="w-7 h-7 shrink-0 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              Why JCRM?
            </button>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="flex items-center gap-4 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-blue-100/80 shadow-md"
          >
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-white overflow-hidden shadow-md">
                  <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="Student" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="text-sm md:text-base font-bold flex flex-col items-start text-slate-800">
              <div className="flex text-amber-400">★★★★★</div>
              <span>4.9/5 from 2,400 reviews</span>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* 2. Stats strip */}
      <section className="py-12 md:py-16 backdrop-blur-xl border-y border-blue-100/60 bg-white/70 shadow-[0_4px_30px_rgba(255,255,255,0.8)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-y-12 gap-x-4 md:gap-8 divide-x divide-blue-100">
            {(initialData.stats || []).filter((s: any) => s.isActive !== false).map((stat: any, i: number) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className={`text-center px-2 md:px-4 ${i === 2 ? 'border-l-0 md:border-l' : ''} border-blue-100`}
              >
                <div className="heading-font text-3xl md:text-4xl font-extrabold mb-2 text-[#0055FF]">{stat.value}</div>
                <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Marquee */}
      <section className="py-20 overflow-hidden border-b border-blue-100/60 bg-white/40 backdrop-blur-md">
        <div className="text-center mb-10 relative z-20">
          <p className="text-sm font-bold uppercase tracking-widest text-slate-600">Engineers from top companies learn here</p>
        </div>

        {/* Marquee scroll area with contained fade masks */}
        <div className="relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-white/90 to-transparent"></div>
          <div className="absolute right-0 top-0 bottom-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-white/90 to-transparent"></div>

          <div className="flex animate-marquee whitespace-nowrap opacity-80 transition-all duration-500 hover:opacity-100">
            {Array.from({ length: 20 }).map((_, group) => (
              <div key={group} className="flex items-center gap-16 px-8 text-2xl font-bold font-mono shrink-0 text-slate-700">
                {(initialData.marquee && initialData.marquee.filter((m: any) => m.isActive !== false).length > 0) ? (
                  initialData.marquee.filter((m: any) => m.isActive !== false).map((company: any, i: number) => (
                    <span key={i}>{company.name}</span>
                  ))
                ) : (
                  <span className="opacity-50 italic">No companies added to CMS</span>
                )}
              </div>
            ))}
          </div>

          <div className="text-center mt-16 mb-10 relative z-20">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-600">
              {initialData.techStackHeading || "Mastering the most in-demand technologies"}
            </p>
          </div>

          {/* Tech Stack Marquee */}
          <div className="flex animate-marquee whitespace-nowrap opacity-70" style={{ animationDirection: 'reverse', animationDuration: '40s' }}>
            {Array.from({ length: 20 }).map((_, group) => (
              <div key={group} className="flex items-center gap-16 px-8 text-xl font-bold font-mono text-transparent bg-clip-text shrink-0 bg-gradient-to-r from-[#0055FF] to-sky-500">
                {(initialData.techStackMarquee && initialData.techStackMarquee.filter((t: any) => t.isActive !== false).length > 0) ? (
                  initialData.techStackMarquee.filter((t: any) => t.isActive !== false).map((tech: any, i: number) => (
                    <span key={i}>{tech.name}</span>
                  ))
                ) : (
                  <>
                    <span>React</span>
                    <span>Next.js</span>
                    <span>TypeScript</span>
                    <span>Node.js</span>
                    <span>PostgreSQL</span>
                    <span>Docker</span>
                    <span>AWS</span>
                    <span>Redis</span>
                    <span>TailwindCSS</span>
                    <span>GraphQL</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.5 Our ERP Products Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="heading-font text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900">
              Our <span className="text-[#0055FF]">ERP Products</span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mx-auto">
              Purpose-built solutions for every business need
            </p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-6">
            {[
              {
                title: "LMS",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0112 20.055a11.952 11.952 0 01-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                )
              },
              {
                title: "HR Management",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20H2v-2a3 3 0 015.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                )
              },
              {
                title: "Hospital ERP",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5m0 0v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4m-2-11v2m-1-1h2" />
                  </svg>
                )
              },
              {
                title: "Accounting",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                )
              },
              {
                title: "Gym Management",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5h16.5m-16.5 3h16.5M3.75 9h16.5m-16.5-3h16.5" />
                  </svg>
                )
              },
              {
                title: "Cab Booking",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 17a2 2 0 100 4 2 2 0 000-4zm8 0a2 2 0 100 4 2 2 0 000-4zM3 9l2-4h14l2 4M3 9v8a1 1 0 001 1h1m16-9v8a1 1 0 01-1 1h-1M3 9h18" />
                  </svg>
                )
              },
              {
                title: "Food Delivery",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )
              },
              {
                title: "E-Commerce",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                )
              },
              {
                title: "Chatbot",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                )
              },
              {
                title: "Fraud Detection",
                features: "Secure • Scalable • User-Friendly",
                icon: (
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                )
              }
            ].map((prod, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.05, duration: 0.5 }}
                className="group flex flex-col items-center text-center p-8 rounded-[28px] bg-white/80 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(0,85,255,0.08),0_0_20px_rgba(255,255,255,0.8)] hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-2 transition-all duration-300 relative overflow-hidden w-full sm:w-[calc(50%-12px)] lg:w-[calc(25%-18px)] max-w-[300px] shrink-0"
              >
                <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-[28px]"></div>

                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] mb-5 shadow-sm group-hover:scale-110 group-hover:bg-[#0055FF] group-hover:text-white transition-all duration-300 shrink-0">
                  {prod.icon}
                </div>

                <h3 className="heading-font font-extrabold text-slate-900 text-xl mb-2 tracking-tight group-hover:text-[#0055FF] transition-colors">
                  {prod.title}
                </h3>

                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100/70 text-slate-600 tracking-wide mt-auto">
                  {prod.features}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3.8 Transform Your Business CTA Banner */}
      <section className="py-12 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden p-10 md:p-14 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.12),0_0_35px_rgba(255,255,255,0.9)] text-center"
          >
            {/* Subtle icy blue background glow */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/60 via-sky-50/40 to-blue-50/60 pointer-events-none rounded-[36px]"></div>

            <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center">
              <h3 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Ready to <span className="text-[#0055FF]">Transform Your Business?</span>
              </h3>
              <p className="text-lg md:text-xl text-slate-600 font-medium max-w-2xl mb-8 leading-relaxed">
                Schedule a free demo and see how JCRM ERP can simplify your operations.
              </p>
              <Link
                href="/contact"
                className="px-10 py-4 md:py-5 rounded-full text-lg md:text-xl font-extrabold text-white bg-[#0055FF] shadow-2xl hover:shadow-blue-500/30 hover:scale-105 transition-all duration-300 inline-flex items-center gap-3"
              >
                Get Started Today
                <svg className="w-6 h-6 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* 4. Features section */}
      <section className="py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="heading-font text-4xl md:text-5xl font-extrabold mb-4 text-slate-900">
              Why Choose <span className="text-[#0055FF]">JCRM Technologies</span>
            </h2>

          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

            {/* Left Column - Bullet Points */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              {[
                "100% Job Oriented Training",
                "Industry Oriented Curriculum",
                "Practical & Hands-on Knowledge",
                "Real-Time Live Projects",
                "Interview Preparation & Mock Rounds",
                "HR References & Placement Support",
                "1-on-1 Live Online Sessions",
                "Long-Term Career Guidance"
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-4 bg-white/80 backdrop-blur-md border border-blue-100/80 rounded-full px-6 py-4 shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-300">
                  <div className="bg-[#0055FF] rounded-full text-white p-1 flex-shrink-0 shadow-md">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                  </div>
                  <span className="font-semibold text-slate-800 text-sm md:text-base tracking-wide">{item}</span>
                </div>
              ))}
            </motion.div>

            {/* Right Column - 2x2 Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-white/85 backdrop-blur-xl p-8 md:p-10 rounded-[36px] shadow-xl border border-blue-100 relative overflow-hidden"
            >
              {/* Subtle icy blue background glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50/70 via-sky-50/40 to-transparent rounded-[36px] pointer-events-none"></div>

              <div className="flex flex-col items-center text-center p-6 gap-3 relative z-10 hover:-translate-y-1 transition-transform bg-white/60 rounded-2xl border border-blue-50/80 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Secure</h3>
                <p className="text-sm text-slate-500 font-medium leading-tight">Role-based access & audit logs</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 gap-3 relative z-10 hover:-translate-y-1 transition-transform bg-white/60 rounded-2xl border border-blue-50/80 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Cloud Ready</h3>
                <p className="text-sm text-slate-500 font-medium leading-tight">Scalable & fast deployment</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 gap-3 relative z-10 hover:-translate-y-1 transition-transform bg-white/60 rounded-2xl border border-blue-50/80 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Analytics</h3>
                <p className="text-sm text-slate-500 font-medium leading-tight">Real-time insights & reports</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 gap-3 relative z-10 hover:-translate-y-1 transition-transform bg-white/60 rounded-2xl border border-blue-50/80 shadow-sm">
                <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <h3 className="font-bold text-slate-900 text-lg">Partnership</h3>
                <p className="text-sm text-slate-500 font-medium leading-tight">Built for long-term success</p>
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* 5. How it works */}
      <section className="py-32 relative backdrop-blur-md border-y border-blue-100/60 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="heading-font text-4xl font-extrabold mb-4 text-slate-900">How it works</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-0.5 border-t-2 border-dashed border-blue-200 z-0"></div>

            {(initialData.howItWorks && initialData.howItWorks.filter((h: any) => h.isActive !== false).length > 0) ? (
              initialData.howItWorks.filter((h: any) => h.isActive !== false).map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.2 }}
                  className="relative z-10 flex flex-col items-center text-center"
                >
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center heading-font text-3xl font-extrabold mb-6 shadow-xl backdrop-blur-xl bg-white/80 border-2 border-white text-[#0055FF] shadow-[0_8px_25px_rgba(0,85,255,0.15),0_0_20px_rgba(255,255,255,0.9)]">
                    {item.step || (i + 1)}
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-slate-900">{item.title}</h3>
                  <p className="text-slate-600 font-medium">{item.description}</p>
                </motion.div>
              ))
            ) : (
              <div className="md:col-span-3 text-center py-10 text-slate-500 italic">
                No "How It Works" steps added in CMS
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5.5 Training & 100% Placement Assistance Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto mb-16"
          >
            <h2 className="heading-font text-4xl sm:text-5xl font-extrabold mb-4 text-slate-900">
              Training & <span className="text-[#0055FF]">100% Placement Assistance</span>
            </h2>

          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Card - Internship & Training Programs (8 Columns) */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-8 p-8 md:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <h3 className="heading-font font-extrabold text-slate-900 text-2xl tracking-tight">
                    Internship & Training Programs
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                  {[
                    { title: "Frontend Development" },
                    { title: "Backend Development" },
                    { title: "AI & Machine Learning" },
                    { title: "Data Science" },
                    { title: "Cyber Security" },
                    { title: "Forensic Science" },
                    { title: "Cloud & DevOps" },
                    { title: "QA Automation" },
                    { title: "Digital Marketing" },
                    { title: "Zen AI" }
                  ].map((prog, idx) => (
                    <div
                      key={idx}
                      className="group flex items-center justify-between p-4 rounded-2xl bg-blue-50/50 border border-blue-100/70 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all duration-200"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-white border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-xs group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                          </svg>
                        </div>
                        <span className="font-bold text-slate-800 text-sm">{prog.title}</span>
                      </div>
                      <Link
                        href="/courses"
                        className="px-4 py-1.5 rounded-full text-xs font-extrabold text-[#0055FF] bg-white border border-blue-200 hover:bg-[#0055FF] hover:text-white transition-all shadow-xs shrink-0"
                      >
                        View
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-blue-100/80 text-center sm:text-left">
             
              </div>
            </motion.div>

            {/* Right Card - Join Our IT Talent Network (4 Columns) */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-4 p-8 md:p-10 rounded-[36px] bg-gradient-to-br from-white/90 via-blue-50/40 to-white/90 backdrop-blur-2xl border border-blue-100 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-[#0055FF] shadow-sm">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  </div>
                  <h3 className="heading-font font-extrabold text-slate-900 text-2xl tracking-tight">
                    Join Our IT Talent Network
                  </h3>
                </div>

                <p className="text-slate-600 font-medium text-sm md:text-base leading-relaxed mb-8">
                  Work on live ERP projects, collaborate with experienced mentors, and grow your career with flexible learning and placement support.
                </p>

                <div className="space-y-4 mb-8">
                  {[
                    { step: "1", text: "Click Apply Now on the Join Us page" },
                    { step: "2", text: "Fill the form and upload your resume" },
                    { step: "3", text: "Our team reviews and responds within 1–3 days" }
                  ].map((s, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <span className="w-7 h-7 rounded-full bg-[#0055FF] text-white font-extrabold text-xs flex items-center justify-center shrink-0 shadow-md mt-0.5">
                        {s.step}
                      </span>
                      <span className="text-sm font-semibold text-slate-800 leading-snug">{s.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <Link
                  href="/auth"
                  className="w-full py-4 rounded-2xl text-base md:text-lg font-extrabold text-white bg-[#0055FF] shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 mb-4"
                >
                  Apply Now
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
           
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.8 Successfully Placed Candidates Carousel Section */}
      <section className="py-24 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6"
          >
            <div className="text-left max-w-2xl">
              <h2 className="heading-font text-4xl sm:text-5xl font-extrabold text-slate-900 mb-3">
                Successfully Placed <span className="text-[#0055FF]">Candidates</span>
              </h2>
          
            </div>

            {/* Drag Hint & Controls */}
            <div className="flex items-center gap-4 shrink-0">
              <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-slate-500 bg-white/70 backdrop-blur-md px-4 py-2.5 rounded-full border border-blue-100 shadow-sm">
                <svg className="w-4 h-4 text-[#0055FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" /></svg>
                <span>Drag or scroll to explore</span>
              </div>
              <button
                onClick={() => handleScroll('left')}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-md hover:bg-[#0055FF] hover:text-white transition-all cursor-pointer"
                aria-label="Previous Slide"
              >
                <svg className="w-5 h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
              </button>
              <button
                onClick={() => handleScroll('right')}
                className="w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-blue-100 flex items-center justify-center text-slate-800 shadow-md hover:bg-[#0055FF] hover:text-white transition-all cursor-pointer"
                aria-label="Next Slide"
              >
                <svg className="w-5 h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          </motion.div>

          {/* Draggable & Touch Slider Container */}
          <div
            className="relative overflow-hidden cursor-grab active:cursor-grabbing rounded-[36px]"
            ref={carouselRef}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <motion.div
              drag="x"
              dragConstraints={{ right: 0, left: -width }}
              whileTap={{ cursor: "grabbing" }}
              className="flex gap-6 py-4 px-2"
            >
              {placedCandidates.map((candidate, i) => (
                <motion.div
                  key={i}
                  className="w-[260px] sm:w-[280px] shrink-0 p-6 rounded-[28px] bg-white/85 backdrop-blur-xl border border-white/90 shadow-[0_8px_30px_rgba(0,85,255,0.08),0_0_20px_rgba(255,255,255,0.8)] hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-1.5 transition-all duration-300 flex flex-col items-center text-center group pointer-events-auto select-none"
                >
                  <div className="w-full h-56 rounded-2xl overflow-hidden mb-5 border border-blue-100/80 relative shadow-sm group-hover:border-blue-300 transition-colors">
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 pointer-events-none"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent pointer-events-none"></div>
                  </div>

                  <h3 className="heading-font font-extrabold text-slate-900 text-xl mb-1.5 tracking-tight group-hover:text-[#0055FF] transition-colors">
                    {candidate.name}
                  </h3>

                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-50/90 border border-blue-100 text-[#0055FF] tracking-wide inline-block mb-3">
                    {candidate.role}
                  </span>

                  {candidate.company && (
                    <div className="text-xs font-semibold text-slate-500 flex items-center gap-1.5 mt-auto">
                      <svg className="w-3.5 h-3.5 text-emerald-500 shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                      <span>Placed at {candidate.company}</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* 5.9 Join Our Talent Network & Client Feedback Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

          {/* Block 1: Join Our Talent Network */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] grid grid-cols-1 lg:grid-cols-12 gap-8 items-center"
          >
            {/* Left Content */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                <h2 className="heading-font text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  Join Our <span className="text-[#0055FF]">Talent Network</span>
                </h2>
                <p className="text-slate-600 font-medium text-base md:text-lg mb-6 leading-relaxed">
                  We welcome UI/UX, Graphic Design, Frontend/Backend, Full Stack, Content Writing, Software Testing/QA, and Technical Support talent.
                </p>

                <ul className="space-y-3 mb-8">
                  {[
                    "Real, impactful ERP projects",
                    "Industry exposure & growth",
                    "Mentorship by industry leaders",
                    "Flexible & remote-friendly culture",
                    "Competitive compensation & benefits"
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-[#0055FF] text-white flex items-center justify-center text-xs font-extrabold shrink-0 shadow-xs">
                        ✓
                      </div>
                      <span className="text-sm md:text-base font-semibold text-slate-800">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4">
                <Link
                  href="/contact"
                  className="px-8 py-4 rounded-full text-base font-extrabold text-white bg-[#0055FF] shadow-xl hover:shadow-blue-500/30 hover:scale-105 transition-all inline-flex items-center gap-2.5"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                  Send Resume
                </Link>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-8 py-4 rounded-full text-base font-extrabold text-[#0055FF] bg-blue-50 border border-blue-200 hover:bg-[#0055FF] hover:text-white transition-all inline-flex items-center gap-2.5 shadow-xs"
                >
                  <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
                  </svg>
                  Connect
                </a>
              </div>
            </div>

            {/* Right Quote Box */}
            <div className="lg:col-span-5">
              <div className="p-8 md:p-10 rounded-[28px] bg-gradient-to-br from-blue-50/90 via-sky-50/50 to-white/90 border border-blue-100/90 shadow-md relative overflow-hidden flex flex-col justify-between h-full">
                <div className="text-[#0055FF] opacity-30 text-6xl font-serif leading-none mb-2">“</div>
                <blockquote className="text-xl md:text-2xl font-bold text-slate-800 italic leading-snug mb-6 relative z-10">
                  “Alone we can do so little; together we can do so much.”
                </blockquote>
                <div className="text-sm font-extrabold text-[#0055FF] tracking-wide">
                  — Helen Keller
                </div>
              </div>
            </div>
          </motion.div>

          {/* Block 2: What Clients & Trainees Say */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="p-8 md:p-12 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] text-center relative"
          >
            <div className="max-w-3xl mx-auto mb-6">
              <h2 className="heading-font text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">
                What <span className="text-[#0055FF]">Clients & Trainees Say</span>
              </h2>
              <p className="text-slate-600 font-medium text-base md:text-lg">
                Real feedback & video reviews from our valued enterprise clients and successfully placed trainees.
              </p>
            </div>

            {/* Toggle Switch Pill */}
            <div className="inline-flex items-center p-1.5 rounded-full bg-blue-50/80 border border-blue-100/90 mb-10 shadow-xs">
              <button
                onClick={() => setTestimonialTab("text")}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  testimonialTab === "text"
                    ? "bg-[#0055FF] text-white shadow-md"
                    : "text-slate-600 hover:text-[#0055FF]"
                }`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Text Reviews
              </button>
              <button
                onClick={() => setTestimonialTab("video")}
                className={`px-6 py-2.5 rounded-full text-xs md:text-sm font-extrabold transition-all duration-300 flex items-center gap-2 cursor-pointer ${
                  testimonialTab === "video"
                    ? "bg-[#0055FF] text-white shadow-md"
                    : "text-slate-600 hover:text-[#0055FF]"
                }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Video Testimonials
              </button>
            </div>

            {/* TAB 1: Text Reviews */}
            {testimonialTab === "text" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="max-w-4xl mx-auto p-8 md:p-12 rounded-[30px] bg-gradient-to-b from-blue-50/60 to-white/90 border border-blue-100/90 shadow-sm relative"
              >
                <div className="flex gap-1 justify-center text-amber-400 mb-5 text-xl drop-shadow-xs">
                  {"★".repeat(clientQuotes[quoteIndex].rating || 5)}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <button
                    onClick={() => setQuoteIndex((prev) => (prev === 0 ? clientQuotes.length - 1 : prev - 1))}
                    className="w-12 h-12 rounded-full bg-white border border-blue-200 text-[#0055FF] flex items-center justify-center shadow-md hover:bg-[#0055FF] hover:text-white transition-all shrink-0 cursor-pointer"
                    aria-label="Previous Review"
                  >
                    <svg className="w-5 h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                  </button>

                  <div className="px-4 py-2">
                    <p className="text-lg sm:text-2xl md:text-3xl font-bold text-slate-800 italic leading-relaxed mb-6">
                      "{clientQuotes[quoteIndex].quote}"
                    </p>
                    <div className="text-base md:text-lg font-extrabold text-[#0055FF]">
                      — {clientQuotes[quoteIndex].author}
                    </div>
                    {clientQuotes[quoteIndex].role && (
                      <div className="text-xs md:text-sm font-semibold text-slate-500 mt-1">
                        {clientQuotes[quoteIndex].role}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={() => setQuoteIndex((prev) => (prev === clientQuotes.length - 1 ? 0 : prev + 1))}
                    className="w-12 h-12 rounded-full bg-white border border-blue-200 text-[#0055FF] flex items-center justify-center shadow-md hover:bg-[#0055FF] hover:text-white transition-all shrink-0 cursor-pointer"
                    aria-label="Next Review"
                  >
                    <svg className="w-5 h-5 font-extrabold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </motion.div>
            )}

            {/* TAB 2: Video Testimonials */}
            {testimonialTab === "video" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left"
              >
                {videoTestimonials.map((vid, idx) => (
                  <div
                    key={idx}
                    className="group rounded-[28px] overflow-hidden bg-white border border-blue-100 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    <div
                      className="relative h-48 sm:h-52 overflow-hidden cursor-pointer"
                      onClick={() => setIsVideoOpen(true)}
                    >
                      <img
                        src={vid.thumbnail}
                        alt={vid.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-slate-900/40 group-hover:bg-slate-900/20 transition-colors flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-[#0055FF] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform">
                          <svg className="w-6 h-6 fill-current ml-1" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-extrabold bg-black/60 text-white backdrop-blur-md">
                        Video Review
                      </span>
                    </div>

                    <div className="p-6">
                      <h4 className="heading-font font-extrabold text-slate-900 text-lg mb-2 leading-snug group-hover:text-[#0055FF] transition-colors">
                        {vid.title}
                      </h4>
                      <p className="text-xs font-semibold text-slate-500">
                        {vid.speaker}
                      </p>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </motion.div>

        </div>
      </section>



      {/* Video Modal Overlay */}
      {mounted && isVideoOpen && createPortal(
        <div
          className="fixed inset-0 z-[99999] overflow-y-auto bg-black/85 backdrop-blur-md animate-fade-in"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
            <div
              className="relative w-full max-w-4xl my-6 text-left bg-black rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl border-2 border-red-600/60"
              style={{ boxShadow: '0 0 50px rgba(255, 0, 0, 0.5)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-3 right-3 z-50 p-2.5 rounded-full bg-black/70 text-white hover:bg-red-600 transition-colors cursor-pointer flex items-center justify-center border border-white/20 shadow-lg"
                aria-label="Close Video"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <div className="relative w-full pt-[56.25%] bg-black">
                <iframe
                  className="absolute top-0 left-0 w-full h-full border-0"
                  src="https://www.youtube.com/embed/AHzgyPR-Cy4?autoplay=1&rel=0"
                  title="Why JCRM?"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}
