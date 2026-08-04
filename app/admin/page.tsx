import Link from "next/link";
import { getSiteContent } from "@/lib/cms";

export default async function AdminDashboard() {
  const cmsData = await getSiteContent("admin-dashboard");
  
  return (
    <div className="space-y-6 pb-20">
       
       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-1">{cmsData?.heading || "Platform Overview"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>System metrics and global activity.</p>
          </div>
       </div>

       {/* Metric Cards */}
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
             { label: "Total Users", value: "24,592", trend: "+1.2k this month", color: "var(--accent-primary)", show: true },
             { label: "MRR", value: "₹284,000", trend: "+5.4%", color: "var(--accent-success)", show: cmsData?.showRevenue !== false },
             { label: "Active Courses", value: "142", trend: "+12 new", color: "var(--accent-warning)", show: true },
             { label: "System Uptime", value: "99.99%", trend: "Healthy", color: "var(--accent-cyan)", show: true }
          ].filter(s => s.show).map((stat, i) => (
             <div key={i} className="p-6 rounded-[24px] card-hover" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
                <div className="text-sm font-medium mb-4" style={{ color: 'var(--text-secondary)' }}>{stat.label}</div>
                <div className="heading-font text-3xl font-bold mb-2">{stat.value}</div>
                <div className="text-xs font-bold" style={{ color: stat.color }}>{stat.trend}</div>
             </div>
          ))}
       </div>

       {/* Main Layout */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <div className="rounded-[24px] p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <h2 className="heading-font text-lg font-bold mb-6">Recent Signups</h2>
             <table className="data-table">
                <thead>
                   <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Joined</th>
                   </tr>
                </thead>
                <tbody>
                   <tr>
                      <td className="font-bold">alice@example.com</td>
                      <td><span className="badge-primary px-2 py-1 rounded text-xs">Student</span></td>
                      <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>2 mins ago</td>
                   </tr>
                   <tr>
                      <td className="font-bold">david.m@university.edu</td>
                      <td><span className="badge-warning px-2 py-1 rounded text-xs">Faculty</span></td>
                      <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>1 hour ago</td>
                   </tr>
                   <tr>
                      <td className="font-bold">zack@example.com</td>
                      <td><span className="badge-primary px-2 py-1 rounded text-xs">Student</span></td>
                      <td className="text-xs" style={{ color: 'var(--text-secondary)' }}>3 hours ago</td>
                   </tr>
                </tbody>
             </table>
             <Link href="/admin/users" className="block text-center mt-4 text-sm font-bold text-[var(--accent-primary)] hover:underline">View All Users</Link>
          </div>

          <div className="rounded-[24px] p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
             <h2 className="heading-font text-lg font-bold mb-6">System Alerts</h2>
             <div className="space-y-4">
                <div className="flex items-start gap-4 p-4 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                   <div className="w-8 h-8 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                   </div>
                   <div>
                      <h4 className="font-bold text-sm">Failed Webhook Deliveries</h4>
                      <p className="text-xs mt-1" style={{ color: 'var(--text-secondary)' }}>Stripe payment webhooks are experiencing a 5% failure rate.</p>
                      <button className="text-xs font-bold text-rose-500 mt-2">Investigate</button>
                   </div>
                </div>
             </div>
          </div>
          
       </div>
    </div>
  );
}