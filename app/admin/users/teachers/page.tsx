"use client";

import Link from "next/link";
import { useState } from "react";

export default function AdminTeachersPage() {
  const [search, setSearch] = useState("");

  const teachers = [
    { id: 1, name: "Aisha Verma", email: "aisha@example.com", status: "Active", courses: 4, revenue: "₹612K", initials: "AV", color: "from-fuchsia-500 to-pink-600" },
    { id: 2, name: "Marcus Chen", email: "marcus@example.com", status: "Active", courses: 2, revenue: "₹240K", initials: "MC", color: "from-fuchsia-500 to-pink-600" },
    { id: 3, name: "Priya Nair", email: "priya@example.com", status: "Pending Approval", courses: 0, revenue: "₹0", initials: "PN", color: "from-amber-500 to-orange-600" },
  ];

  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-txt-tertiary mb-2">
            <Link href="/admin/users" className="hover:text-fuchsia-400 transition-colors">Users</Link>
            <span>/</span>
            <span className="text-fuchsia-400">Teachers</span>
          </div>
          <h1 className="text-3xl font-extrabold text-txt-primary mb-2">Teacher Roster</h1>
          <p className="text-txt-secondary font-medium">Manage facultys, approve applications, and view revenue generated.</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-txt-tertiary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input type="text" placeholder="Search teachers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-64 md:w-80 pl-10 pr-4 py-2.5 bg-[#131B2F] border border-bdr-soft rounded-xl text-sm text-txt-primary placeholder-slate-500 focus:outline-none focus:border-fuchsia-500 transition-colors" />
          </div>
          <Link href="/admin/users/teachers/invite" className="px-6 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-700 text-txt-primary font-bold rounded-xl transition-all shadow-lg shadow-fuchsia-900/50 text-sm">
            Invite Teacher
          </Link>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-[#131B2F] border border-bdr-soft rounded-[24px] shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-bdr-soft text-xs font-bold text-txt-secondary uppercase tracking-wider">
                <th className="p-6 font-medium">Faculty</th>
                <th className="p-6 font-medium">Email</th>
                <th className="p-6 font-medium text-center">Published Courses</th>
                <th className="p-6 font-medium text-right">Gross Revenue</th>
                <th className="p-6 font-medium">Status</th>
                <th className="p-6 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeachers.length === 0 && (
                 <tr>
                   <td colSpan={6} className="p-6 text-center text-txt-secondary">No teachers found matching "{search}"</td>
                 </tr>
              )}
              {filteredTeachers.map((teacher) => (
                <tr key={teacher.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${teacher.color} flex items-center justify-center text-txt-primary font-bold text-sm shadow-md shrink-0`}>{teacher.initials}</div>
                      <h4 className="font-bold text-txt-primary group-hover:text-fuchsia-400 transition-colors">{teacher.name}</h4>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-txt-secondary">{teacher.email}</td>
                  <td className="p-6 text-center text-txt-primary font-bold">{teacher.courses}</td>
                  <td className="p-6 text-right font-bold text-emerald-400">{teacher.revenue}</td>
                  <td className="p-6">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      teacher.status === 'Active' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {teacher.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <Link href={`/admin/users/teachers/${teacher.id}`} className="px-4 py-2 bg-surf-elevated hover:bg-fuchsia-600 hover:text-txt-primary text-txt-secondary text-xs font-bold rounded-lg transition-colors border border-bdr-soft hover:border-fuchsia-500 inline-block">Manage</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}