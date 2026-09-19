"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function FacultyLayoutClient({ children, cmsData }: { children: React.ReactNode, cmsData?: any }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Dashboard", href: "/faculty" },
    { name: "My Courses", href: "/faculty/courses" },
    { name: "Students", href: "/faculty/students" },
    { name: "Submissions", href: "/faculty/submissions", badge: "12" },
    { name: "Analytics", href: "/faculty/analytics" },
    { name: "Announcements", href: "/faculty/announcements" },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg-base)' }}>
       {/* Top Navbar */}
       <header 
          className={`sticky top-0 z-40 transition-all duration-300 ${scrolled ? 'backdrop-blur-xl' : ''}`}
          style={{ 
             background: scrolled ? 'color-mix(in srgb, var(--bg-card) 90%, transparent)' : 'var(--bg-card)',
             borderBottom: '1px solid var(--border-soft)'
          }}
       >
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
             <div className="flex justify-between items-center h-16">
                
                {/* Logo & Branding */}
                <div className="flex items-center gap-6">
                   <Link href="/faculty" className="flex items-center gap-2">
                      <img
                        src="/logo - JCRM.jpeg"
                        alt="JCRM Technologies"
                        className="h-10 w-10 rounded-full object-contain bg-white shrink-0"
                      />
                      <span className="heading-font text-xl font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>JCRM Technology</span>
                   </Link>
                   <div className="hidden sm:block h-6 w-px" style={{ background: 'var(--border-soft)' }}></div>
                   <span className="badge-warning px-2.5 py-1 rounded-md text-xs font-bold hidden sm:block">Instructor Portal</span>
                </div>

                {/* Desktop Nav */}
                <nav className="hidden lg:flex items-center gap-1">
                   {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                         <Link
                            key={link.name}
                            href={link.href}
                            className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 group`}
                            style={{ 
                               color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                               background: isActive ? 'var(--bg-surface)' : 'transparent'
                            }}
                         >
                            <span className={`group-hover:text-[var(--text-primary)] transition-colors`}>{link.name}</span>
                            {link.badge && (
                               <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 text-[10px] font-bold text-txt-primary rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
                                  {link.badge}
                               </span>
                            )}
                         </Link>
                      )
                   })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                   
                   {cmsData?.showNotifications !== false && (
                      <div className="relative cursor-pointer w-10 h-10 rounded-full flex items-center justify-center transition-colors hover:bg-black/5 dark:hover:bg-surf-elevated text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
                         <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/></svg>
                         <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-500 border-2" style={{ borderColor: 'var(--bg-card)' }}></span>
                      </div>
                   )}

                   <Link href="/faculty/settings" className="relative group ml-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-amber-400 to-amber-600 p-[2px]">
                         <div className="w-full h-full rounded-full border-2 flex items-center justify-center font-bold text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card)' }}>
                            AV
                         </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-amber-500 border-2" style={{ borderColor: 'var(--bg-card)' }}></div>
                   </Link>

                   <button 
                     onClick={() => signOut({ callbackUrl: '/auth' })}
                     className="hidden sm:flex ml-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/20"
                   >
                     Sign out
                   </button>

                   {/* Mobile Toggle */}
                   <button 
                      onClick={() => setMobileMenuOpen(true)}
                      className="lg:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-surf-elevated" style={{ color: 'var(--text-primary)' }}
                   >
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
                   </button>
                </div>

             </div>
          </div>
       </header>

       {/* Mobile Menu Drawer */}
       {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
             <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)}></div>
             <div className="absolute right-0 top-0 bottom-0 w-64 shadow-2xl flex flex-col slide-in-right" style={{ background: 'var(--bg-card)' }}>
                <div className="p-4 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
                   <span className="font-bold">Menu</span>
                   <button onClick={() => setMobileMenuOpen(false)} className="p-2" style={{ color: 'var(--text-secondary)' }}>
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/></svg>
                   </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                   {navLinks.map((link) => {
                      const isActive = pathname === link.href;
                      return (
                         <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className="flex items-center justify-between p-3 rounded-xl font-medium"
                            style={{
                               background: isActive ? 'var(--bg-surface)' : 'transparent',
                               color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)'
                            }}
                         >
                            <span className="flex items-center gap-3">
                               {link.name}
                            </span>
                            {link.badge && <span className="bg-rose-500 text-txt-primary text-[10px] font-bold px-2 py-0.5 rounded-full">{link.badge}</span>}
                         </Link>
                      )
                   })}
                </div>
             </div>
          </div>
       )}

       {/* Main Content Area */}
       <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
          {children}
       </main>
    </div>
  );
}