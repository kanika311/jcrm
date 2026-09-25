"use client";

import { useState, useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { FiSearch, FiDownload, FiX, FiEye } from "react-icons/fi";

export default function LeadsClient({
  initialLeads,
}: {
  initialLeads: any[];
  cmsData?: any;
}) {
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

  // Extract all distinct sources dynamically
  const uniqueSources = useMemo(() => {
    const set = new Set<string>();
    initialLeads.forEach((lead: any) => {
      if (lead.source) set.add(lead.source.trim());
    });
    return Array.from(set).sort();
  }, [initialLeads]);

  // Filter leads based on search term and source
  const filteredLeads = useMemo(() => {
    const s = searchTerm.toLowerCase().trim();
    return initialLeads.filter((lead) => {
      const matchesSearch =
        !s ||
        (lead.name || "").toLowerCase().includes(s) ||
        (lead.email || "").toLowerCase().includes(s) ||
        (lead.phone || "").toLowerCase().includes(s) ||
        (lead.source || "").toLowerCase().includes(s) ||
        (lead.details || "").toLowerCase().includes(s);

      const matchesSource =
        sourceFilter === "ALL" ||
        (lead.source || "").toLowerCase() === sourceFilter.toLowerCase() ||
        (lead.source || "").toLowerCase().includes(sourceFilter.toLowerCase());

      return matchesSearch && matchesSource;
    });
  }, [initialLeads, searchTerm, sourceFilter]);

  // CSV Export Handler
  const exportCSV = () => {
    const headers = ["Name", "Email", "Phone", "Source", "Status", "Created At", "Details"];
    const rows = filteredLeads.map((lead) => [
      `"${(lead.name || "").replace(/"/g, '""')}"`,
      `"${(lead.email || "").replace(/"/g, '""')}"`,
      `"${(lead.phone || "").replace(/"/g, '""')}"`,
      `"${(lead.source || "").replace(/"/g, '""')}"`,
      `"${(lead.status || "").replace(/"/g, '""')}"`,
      `"${lead.createdAt ? new Date(lead.createdAt).toISOString() : ""}"`,
      `"${(lead.details || "").replace(/"/g, '""')}"`,
    ]);
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `leads_export_${new Date().getTime()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4 pb-20 font-sans">
      {/* ====================================================================== */}
      {/* SINGLE-LINE ACTION & FILTER BAR (Search + All Sources + Export CSV)     */}
      {/* ====================================================================== */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-xs">
        {/* Search Input */}
        <div className="relative flex-1">
          <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search leads by name, email, phone, details..."
            className="w-full bg-slate-50 hover:bg-slate-100/80 focus:bg-white text-slate-900 placeholder-slate-400 text-xs font-semibold rounded-xl pl-10 pr-9 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] focus:ring-2 focus:ring-[#0055FF]/10 shadow-2xs transition"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
            >
              <FiX className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* All Sources Dropdown */}
        <select
          className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl px-3.5 py-2.5 border border-slate-200 focus:outline-none focus:border-[#0055FF] shadow-2xs cursor-pointer shrink-0 min-w-[170px]"
          value={sourceFilter}
          onChange={(e) => setSourceFilter(e.target.value)}
        >
          <option value="ALL">All Sources ({initialLeads.length})</option>
          {uniqueSources.map((src) => (
            <option key={src} value={src}>
              {src}
            </option>
          ))}
        </select>

        {/* Export CSV Button */}
        <button
          onClick={exportCSV}
          className="bg-[#0055FF] hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm shadow-blue-500/20 transition-all hover:scale-[1.02] cursor-pointer shrink-0"
        >
          <FiDownload className="w-4 h-4" />
          <span>Export CSV</span>
        </button>
      </div>

      {/* ====================================================================== */}
      {/* DIRECT LEADS TABLE                                                     */}
      {/* ====================================================================== */}
      <div className="rounded-2xl overflow-hidden shadow-xs bg-white border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-[11px] font-extrabold uppercase tracking-wider text-slate-600">
                <th className="py-3.5 px-4">Lead Name &amp; Profile</th>
                <th className="py-3.5 px-4">Contact Info</th>
                <th className="py-3.5 px-4">Source Channel</th>
                <th className="py-3.5 px-4">Created Date</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {filteredLeads.map((lead, i) => (
                <tr
                  key={lead.id || i}
                  className="hover:bg-slate-50/70 cursor-pointer transition-colors"
                  onClick={() => setSelectedLead(lead)}
                >
                  {/* Lead Name & Info */}
                  <td className="p-4 max-w-xs">
                    <div className="font-extrabold text-sm text-slate-900">{lead.name}</div>
                    <div className="text-xs text-slate-500 font-medium mt-0.5 truncate">
                      {lead.details || "No additional note"}
                    </div>
                  </td>

                  {/* Contact Details */}
                  <td className="p-4">
                    <div className="text-xs font-bold text-slate-800">{lead.email}</div>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      {lead.phone || "N/A"}
                    </div>
                  </td>

                  {/* Source Channel Badge */}
                  <td className="p-4">
                    <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-blue-50 text-[#0055FF] border border-[#D4E8F8]">
                      {lead.source}
                    </span>
                  </td>

                  {/* Created Date */}
                  <td className="p-4 text-xs font-semibold text-slate-500">
                    {new Date(lead.createdAt).toLocaleDateString()}
                  </td>

                  {/* View Details Action Button */}
                  <td className="p-4 text-right">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedLead(lead);
                      }}
                      className="p-2 rounded-lg bg-blue-50 hover:bg-blue-100 text-[#0055FF] border border-blue-200 transition-all shadow-2xs cursor-pointer inline-flex items-center gap-1.5 text-xs font-bold"
                      title="View Lead Details"
                    >
                      <FiEye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                  </td>
                </tr>
              ))}

              {filteredLeads.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-12 text-center text-slate-500 font-medium">
                    No leads found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Count Footer */}
        {filteredLeads.length > 0 && (
          <div className="px-5 py-3 border-t border-slate-200 bg-slate-50 text-xs font-semibold text-slate-600">
            Showing <strong className="text-slate-900 font-extrabold">{filteredLeads.length}</strong> of{" "}
            <strong className="text-slate-900 font-extrabold">{initialLeads.length}</strong> total leads
          </div>
        )}
      </div>

      {/* ====================================================================== */}
      {/* LEAD DETAILS MODAL                                                     */}
      {/* ====================================================================== */}
      {mounted &&
        selectedLead &&
        createPortal(
          <div
            className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm animate-fade-in font-sans"
            style={{ margin: 0 }}
            onClick={() => setSelectedLead(null)}
          >
            <div
              className="relative w-full max-w-2xl bg-white border border-[#D4E8F8] rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden m-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-[#D4E8F8] bg-blue-50/50 flex justify-between items-center shrink-0">
                <div>
                  <h3 className="text-lg font-black text-slate-900">{selectedLead.name}</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    {selectedLead.source} • {new Date(selectedLead.createdAt).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedLead(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-6 overflow-y-auto space-y-6 flex-1 min-h-0 bg-white">
                {/* Basic Contact Info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-[#D4E8F8]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      Email Address
                    </div>
                    <div className="font-bold text-sm text-slate-900 break-all">
                      {selectedLead.email}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-blue-50/40 border border-[#D4E8F8]">
                    <div className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                      Phone Number
                    </div>
                    <div className="font-bold text-sm text-slate-900">
                      {selectedLead.phone || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Submitted Details */}
                <div className="space-y-4">
                  <h4 className="font-black text-xs uppercase tracking-wider text-slate-700 border-b border-[#D4E8F8] pb-2">
                    Submitted Details &amp; Payload
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {Object.entries(selectedLead.rawData || {}).map(([key, value]) => {
                      if (
                        [
                          "id",
                          "createdAt",
                          "updatedAt",
                          "firstName",
                          "lastName",
                          "fullName",
                          "email",
                          "phone",
                          "phoneNumber",
                        ].includes(key)
                      )
                        return null;
                      if (!value) return null;

                      return (
                        <div key={key} className="text-sm">
                          <span className="font-extrabold text-slate-500 uppercase text-[11px] block mb-1">
                            {key.replace(/([A-Z])/g, " $1").trim()}
                          </span>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 whitespace-pre-wrap">
                            {String(value)}
                          </div>
                        </div>
                      );
                    })}

                    {(!selectedLead.rawData ||
                      Object.keys(selectedLead.rawData).length === 0) &&
                      selectedLead.details && (
                        <div>
                          <span className="font-extrabold text-slate-500 uppercase text-[11px] block mb-1">
                            Note / Details
                          </span>
                          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800">
                            {selectedLead.details}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-[#D4E8F8] bg-slate-50 flex justify-end shrink-0">
                <button
                  onClick={() => setSelectedLead(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 transition cursor-pointer"
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
