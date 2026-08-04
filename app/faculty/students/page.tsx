import Link from "next/link";

export default function StudentsPage() {
  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">Student Directory</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Manage and view progress for enrolled students.</p>
          </div>
          
          <div className="flex gap-2">
             <div className="relative">
                <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-tertiary)] pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/></svg>
                <input type="text" placeholder="Search students..." className="input-premium !pl-10 pr-4 py-2 rounded-lg text-sm w-full md:w-64" />
             </div>
             <select className="select-premium px-4 py-2 rounded-lg text-sm bg-transparent appearance-none">
                <option>All Courses</option>
                <option>Full-Stack React & TS</option>
                <option>UI/UX for Developers</option>
             </select>
          </div>
       </div>

       <div className="rounded-[24px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          <div className="overflow-x-auto">
             <table className="data-table">
                <thead>
                   <tr>
                      <th>Student</th>
                      <th>Course</th>
                      <th>Enroll Date</th>
                      <th>Progress</th>
                      <th>Avg Grade</th>
                      <th>Action</th>
                   </tr>
                </thead>
                <tbody>
                   {[
                      { name: "Sanskar G", email: "sanskar@example.com", course: "Full-Stack React", date: "Jan 12, 2024", progress: 68, grade: "A", img: "5" },
                      { name: "Emily Rogers", email: "emily@example.com", course: "UI/UX Foundations", date: "Feb 01, 2024", progress: 24, grade: "B+", img: "9" },
                      { name: "James Carter", email: "james@example.com", course: "Full-Stack React", date: "Dec 15, 2023", progress: 100, grade: "A+", img: "11" },
                      { name: "Anita Patel", email: "anita@example.com", course: "System Design", date: "Jan 28, 2024", progress: 12, grade: "-", img: "44" },
                   ].map((s, i) => (
                      <tr key={i}>
                         <td>
                            <div className="flex items-center gap-3">
                               <img src={`https://i.pravatar.cc/150?img=${s.img}`} className="w-8 h-8 rounded-full" />
                               <div>
                                  <div className="font-bold text-sm">{s.name}</div>
                                  <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="text-sm font-semibold text-[var(--text-secondary)]">{s.course}</td>
                         <td className="text-sm text-[var(--text-secondary)]">{s.date}</td>
                         <td>
                            <div className="flex items-center gap-2">
                               <div className="w-24 h-1.5 rounded-full bg-black/10 dark:bg-surf-hover overflow-hidden">
                                  <div className="h-full rounded-full bg-[var(--accent-primary)]" style={{ width: `${s.progress}%` }}></div>
                               </div>
                               <span className="text-xs font-bold w-8">{s.progress}%</span>
                            </div>
                         </td>
                         <td className="font-bold">{s.grade}</td>
                         <td>
                            <button className="text-sm font-semibold text-[var(--accent-primary)] hover:underline">Message</button>
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