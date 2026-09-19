import ContactForm from "./ContactForm";
import { getSiteContent } from "@/lib/cms";

export default async function ContactPage() {
  const cmsData = await getSiteContent("public-contact");

  return (
    <div className="min-h-screen pt-32 pb-24 relative overflow-hidden bg-gradient-to-b from-blue-50/50 via-sky-50/20 to-transparent">
      {/* Background Ambient Glow Effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-[#0055FF]/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 mb-3 text-xs md:text-sm font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50/90 rounded-full border border-blue-100/80 shadow-xs">
            GET IN TOUCH
          </span>
          <h1 className="heading-font text-4xl sm:text-5xl md:text-6xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Contact & <span className="text-[#0055FF]">Consultation</span>
          </h1>
        
        </div>

        {/* Top Grid: Info on Left (6 Cols), Form on Right (6 Cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          
          {/* Left Column (6 Cols): Coordinates & Contact Cards */}
          <div className="lg:col-span-6 h-full">
            <div className="p-8 md:p-10 rounded-[36px] bg-white/85 backdrop-blur-2xl border border-white/90 shadow-[0_12px_45px_rgba(0,85,255,0.1),0_0_35px_rgba(255,255,255,0.9)] h-full flex flex-col justify-between">
              <div>
                <span className="inline-block px-3.5 py-1 mb-4 text-xs font-extrabold uppercase tracking-widest text-[#0055FF] bg-blue-50 rounded-full border border-blue-100">
                  GET IN TOUCH
                </span>
                <h2 className="heading-font text-2xl sm:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                  Let's Build Something Smarter Together
                </h2>


                {/* 3 Contact Glass Cards */}
                <div className="space-y-4">
                  
                  {/* 1. Corporate HQ */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 flex items-start gap-4 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 text-[#0055FF] flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="heading-font font-bold text-slate-900 text-base mb-1">Corporate HQ</h4>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600 leading-relaxed">
                        404, 1st Floor, 4th A Cross Rd, HRBR Layout 2nd Block, Kalyan Nagar, Bengaluru, Karnataka 560043
                      </p>
                    </div>
                  </div>

                  {/* 2. HR & Careers Desk */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 flex items-start gap-4 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 text-[#0055FF] flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="heading-font font-bold text-slate-900 text-base mb-1">HR & Careers Desk</h4>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600">
                        <a href="mailto:hr@jcrm.in" className="hover:text-[#0055FF] transition-colors">hr@jcrm.in</a> • <a href="mailto:info@jcrm.in" className="hover:text-[#0055FF] transition-colors">info@jcrm.in</a>
                      </p>
                    </div>
                  </div>

                  {/* 3. Direct Support Helpline */}
                  <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100/80 flex items-start gap-4 hover:bg-white hover:border-blue-300 hover:shadow-md transition-all">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-blue-100 text-[#0055FF] flex items-center justify-center shrink-0 shadow-xs">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="heading-font font-bold text-slate-900 text-base mb-1">Direct Support Helpline</h4>
                      <p className="text-xs sm:text-sm font-semibold text-slate-600">
                        <a href="tel:+918310531309" className="hover:text-[#0055FF] transition-colors font-bold text-slate-900">+91 8310531309</a>
                        <span className="text-xs font-semibold text-slate-500 block mt-0.5">(24x7 Technical Desk)</span>
                      </p>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          {/* Right Column (6 Cols): ContactForm */}
          <div className="lg:col-span-6">
            <ContactForm />
          </div>

        </div>

        {/* Bottom Section: Full Width Interactive Location Map */}
        <div className="mt-12 w-full">
          <div className="p-6 md:p-8 rounded-[36px] bg-slate-900 text-white shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
                  <h3 className="heading-font font-extrabold text-white text-xl sm:text-2xl">
                    📍 Bengaluru HQ Location
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 font-medium">
                  JCRM Technologies Pvt Ltd • 404, 1st Floor, 4th A Cross Rd, HRBR Layout, Kalyan Nagar, Bengaluru
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-blue-400 bg-slate-800 px-3 py-1.5 rounded-xl border border-slate-700">
                  13.0199° N, 77.6432° E
                </span>
                <a
                  href="https://maps.google.com/?q=404+4th+A+Cross+Rd+HRBR+Layout+Kalyan+Nagar+Bengaluru"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl text-xs font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all flex items-center gap-1.5 shadow-md shrink-0"
                >
                  Get Directions
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Wide Full Width Map Frame */}
            <div className="w-full h-[400px] sm:h-[460px] rounded-2xl overflow-hidden border border-slate-700 shadow-inner relative bg-slate-800">
              <iframe
                title="JCRM Technologies HQ Location Map"
                className="w-full h-full border-0 grayscale contrast-125 opacity-90 hover:grayscale-0 transition-all duration-500"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.262529949989!2d77.640625!3d13.0199!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTPCsDAxJzExLjYiTiA3N8KwMzgnMzUuNSJF!5e0!3m2!1sen!2sin!4v1650000000000!5m2!1sen!2sin"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              
              {/* Overlay Badge */}
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700 text-xs font-extrabold text-white flex items-center gap-2.5 shadow-xl pointer-events-none">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                JCRM Technologies Pvt Ltd • Corporate Headquarters
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}