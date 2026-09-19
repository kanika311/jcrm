"use client";

interface CertificatePreviewProps {
  workshopTitle: string;
  certificateCode: string;
  domain: string;
}

export default function CertificatePreview({ workshopTitle, certificateCode, domain }: CertificatePreviewProps) {
  return (
    <div className="relative w-full rounded-2xl overflow-hidden border-2 border-blue-200 shadow-md bg-[#FAF9F6] p-6 sm:p-8 select-none" onContextMenu={(e) => e.preventDefault()}>
      
      {/* SECURITY OVERLAY WATERMARK (PREVENTS EDITING & UNAUTHORIZED DOWNLOAD) */}
      <div className="absolute inset-0 z-30 pointer-events-none flex items-center justify-center rotate-[-25deg] opacity-15">
        <span className="text-3xl sm:text-5xl font-black text-slate-900 uppercase tracking-widest text-center border-4 border-dashed border-slate-900 px-6 py-3">
          VERIFIED JCRM CERTIFICATE TEMPLATE<br />
          <span className="text-xl">NOT FOR INDIVIDUAL DOWNLOAD</span>
        </span>
      </div>

      {/* Decorative Outer Border */}
      <div className="border-4 border-double border-[#0055FF]/30 p-5 rounded-xl relative z-10 bg-white/90">
        
        {/* Certificate Header */}
        <div className="flex items-center justify-between pb-4 border-b border-blue-100 mb-6">
          <div className="flex items-center gap-3">
            <img
              src="/logo - JCRM.jpeg"
              alt="JCRM Technologies"
              className="w-10 h-10 rounded-full object-contain bg-white shrink-0 shadow-md"
            />
            <div>
              <span className="heading-font font-extrabold text-slate-900 text-sm tracking-wide block">
                JCRM TECHNOLOGIES
              </span>
              <span className="text-[10px] font-bold text-[#0055FF] uppercase tracking-wider block">
                VERIFIED ACADEMIC & INDUSTRY CERTIFICATION
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold text-slate-400 block uppercase">VERIFICATION CODE</span>
            <span className="text-xs font-mono font-bold text-[#0055FF] bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100">
              {certificateCode}
            </span>
          </div>
        </div>

        {/* Certificate Title */}
        <div className="text-center space-y-2 mb-6">
          <h4 className="heading-font text-2xl sm:text-3xl font-black text-slate-900 tracking-tight uppercase">
            Certificate of Participation
          </h4>
          <p className="text-xs font-serif italic text-slate-600">
            This is proudly presented to certify that
          </p>

          <div className="py-2 border-b-2 border-slate-300 max-w-sm mx-auto">
            <span className="text-xl font-extrabold text-[#0055FF] font-serif">
              SAMPLE / PARTICIPANT NAME
            </span>
          </div>

          <p className="text-xs text-slate-600 font-medium max-w-lg mx-auto leading-relaxed pt-2">
            has successfully completed the intensive hands-on technical workshop on
          </p>
          
          <h5 className="heading-font text-base sm:text-lg font-extrabold text-slate-900 px-4 py-1.5 bg-blue-50/80 rounded-lg inline-block border border-blue-100">
            {workshopTitle}
          </h5>
        </div>

        {/* Certificate Footer Seals */}
        <div className="flex items-end justify-between pt-4 border-t border-blue-100 text-left">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">ISSUE DATE</span>
            <span className="text-xs font-extrabold text-slate-800">2026 Batch</span>
          </div>

          {/* Official JCRM Gold/Blue Stamp */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-400 via-amber-300 to-yellow-500 p-1 shadow-md flex items-center justify-center text-center">
            <div className="w-full h-full rounded-full border-2 border-white border-dashed flex flex-col items-center justify-center p-1 bg-amber-500 text-white">
              <span className="text-[8px] font-black uppercase leading-tight">OFFICIAL</span>
              <span className="text-[10px] font-extrabold">SEAL</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold text-slate-400 uppercase block">AUTHORIZED SIGNATURE</span>
            <span className="text-xs font-serif font-bold text-[#0055FF]">JCRM Academic Directorate</span>
          </div>
        </div>

      </div>
    </div>
  );
}
