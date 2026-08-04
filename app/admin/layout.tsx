"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Overview", href: "/admin" },
    { name: "Users", href: "/admin/users" },
    { name: "Courses", href: "/admin/courses" },
    { name: "Messages", href: "/admin/messages" },
    { name: "CMS", href: "/admin/cms" },
    { name: "Leads", href: "/admin/leads" },
    { name: "Reports", href: "/admin/reports" },
    { name: "Settings", href: "/admin/settings" },
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
                   <Link href="/admin" className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#0EA5E9] p-0.5">
                         <div className="w-full h-full rounded-full" style={{ background: 'var(--bg-card)' }}></div>
                      </div>
                      <span className="heading-font text-xl font-bold tracking-tight hidden sm:block" style={{ color: 'var(--text-primary)' }}>JCRM Technology</span>
                   </Link>
                   <div className="hidden sm:block h-6 w-px" style={{ background: 'var(--border-soft)' }}></div>
                   <span className="badge-danger px-2.5 py-1 rounded-md text-xs font-bold hidden sm:block">Admin Console</span>
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
                         </Link>
                      )
                   })}
                </nav>

                {/* Right Actions */}
                <div className="flex items-center gap-4">
                   
                   <Link href="/admin/settings" className="relative group ml-2">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-400 to-rose-600 p-[2px]">
                         <div className="w-full h-full rounded-full border-2 flex items-center justify-center font-bold text-xs" style={{ background: 'var(--bg-card)', borderColor: 'var(--bg-card)' }}>
                            AD
                         </div>
                      </div>
                      <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-rose-500 border-2" style={{ borderColor: 'var(--bg-card)' }}></div>
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