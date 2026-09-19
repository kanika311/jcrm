"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function LeadsClient({ initialLeads, cmsData }: { initialLeads: any[], cmsData: any }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sourceFilter, setSourceFilter] = useState("ALL");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (selectedLead) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selectedLead]);

  const filteredLeads = initialLeads.filter(lead => {
    const matchesSearch = lead.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          lead.phone.includes(searchTerm);
    const matchesSource = sourceFilter === "ALL" || lead.source.includes(sourceFilter);
    return matchesSearch && matchesSource;
  });

  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Source", "Status", "Created At", "Details"];
    const rows = filteredLeads.map(lead => [
      `"${lead.name}"`,
      `"${lead.email}"`,
      `"${lead.phone}"`,
      `"${lead.source}"`,
      `"${lead.status}"`,
      `"${new Date(lead.createdAt).toISOString()}"`,
      `"${lead.details}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "Lead Center"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Centralized view of all generated leads.</p>
          </div>
          
          <div className="flex gap-2 w-full md:w-auto">
             <select 
               className="input-premium px-4 py-2 rounded-lg text-sm"
               value={sourceFilter}
               onChange={e => setSourceFilter(e.target.value)}
             >
               <option value="ALL">All Sources</option>
               <option value="Signup">Signups</option>
               <option value="Contact Form">Contact Forms</option>
               <option value="Career Guidance">Career Guidance</option>
             </select>
             <input 
               type="text" 
               placeholder="Search leads..." 
               className="input-premium px-4 py-2 rounded-lg text-sm flex-1 md:w-64"
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
             />
             <button onClick={exportCSV} className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center">Export CSV</button>
          </div>
       </div>

       <div className="rounded-[24px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          <div className="overflow-x-auto">
             <table className="data-table w-full text-left">
                <thead>
                   <tr className="border-b" style={{ borderColor: 'var(--border-soft)' }}>
                      <th className="p-4">Lead</th>
                      <th className="p-4">Contact</th>
                      <th className="p-4">Source</th>
                      <th className="p-4">Date</th>
                   </tr>
                </thead>
                <tbody>
                   {filteredLeads.map((lead, i) => (
                      <tr 
                         key={i} 
                         className="border-b last:border-0 hover:bg-white/5 cursor-pointer transition-colors" 
                         style={{ borderColor: 'var(--border-soft)' }}
                         onClick={() => setSelectedLead(lead)}
                      >
                         <td className="p-4">
                            <div className="font-bold text-sm">{lead.name}</div>
                            <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{lead.details}</div>
                         </td>
                         <td className="p-4">
                            <div className="text-sm">{lead.email}</div>
                            <div className="text-xs font-medium mt-1">{lead.phone}</div>
                         </td>
                         <td className="p-4">
                            <span className="px-2 py-1 rounded text-xs font-bold badge-neutral">{lead.source}</span>
                         </td>
                         <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(lead.createdAt).toLocaleDateString()}
                         </td>
                      </tr>
                   ))}
                   {filteredLeads.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No leads found.</td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>

       {/* Lead Details Modal */}
       {mounted && selectedLead && createPortal(
          <div 
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-sm animate-fade-in" 
            style={{ margin: 0 }}
            onClick={() => setSelectedLead(null)}
          >
             <div 
               className="relative w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden m-auto" 
               style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}
               onClick={e => e.stopPropagation()}
             >
                {/* Header */}
                <div className="px-6 py-4 border-b flex justify-between items-center shrink-0" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)' }}>
                   <div>
                      <h3 className="text-xl font-bold">{selectedLead.name}</h3>
                      <p className="text-xs text-[var(--text-secondary)] mt-0.5">{selectedLead.source} • {new Date(selectedLead.createdAt).toLocaleString()}</p>
                   </div>
                   <button 
                     onClick={() => setSelectedLead(null)} 
                     className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 text-gray-400 hover:text-white transition-colors cursor-pointer"
                   >
                      ✕
                   </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0">
                   {/* Basic Contact Info */}
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-base)' }}>
                         <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">Email</div>
                         <div className="font-medium text-sm break-all">{selectedLead.email}</div>
                      </div>
                      <div className="p-4 rounded-xl" style={{ background: 'var(--bg-base)' }}>
                         <div className="text-xs font-bold text-[var(--text-secondary)] mb-1">Phone</div>
                         <div className="font-medium text-sm">{selectedLead.phone}</div>
                      </div>
                   </div>

                   {/* Raw Data Fields */}
                   <div className="space-y-4">
                      <h4 className="font-bold border-b pb-2 text-sm uppercase tracking-wider" style={{ borderColor: 'var(--border-soft)' }}>Submitted Details</h4>
                      <div className="grid grid-cols-1 gap-4">
                         {Object.entries(selectedLead.rawData || {}).map(([key, value]) => {
                            if (["id", "createdAt", "updatedAt", "firstName", "lastName", "fullName", "email", "phone", "phoneNumber"].includes(key)) return null;
                            if (!value) return null;
                            
                            return (
                               <div key={key} className="text-sm">
                                  <span className="font-bold text-[var(--text-secondary)] uppercase text-xs block mb-1">
                                     {key.replace(/([A-Z])/g, ' $1').trim()}
                                  </span>
                                  <div className="p-3 rounded-xl whitespace-pre-wrap" style={{ background: 'var(--bg-base)' }}>
                                     {String(value)}
                                  </div>
                               </div>
                            )
                         })}
                      </div>
                   </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t flex justify-end shrink-0" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)' }}>
                   <button
                     onClick={() => setSelectedLead(null)}
                     className="btn-secondary px-5 py-2 rounded-xl text-sm font-bold cursor-pointer"
                   >
                      Close
                   </button>
                </div>

             </div>
          </div>,
          document.body
       )}
    </div>
  );
}
