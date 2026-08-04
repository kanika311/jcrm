import { getSiteContent } from "@/lib/cms";

export default async function AnnouncementsPage() {
  const cmsData = await getSiteContent("faculty-announcements");

  return (
    <div className="max-w-[1200px] mx-auto space-y-8 animate-fade-in-up pb-24">
      <div>
        <h1 className="heading-font text-3xl font-extrabold mb-2">{cmsData?.heading || "Announcements"}</h1>
        <p className="font-medium" style={{ color: 'var(--text-secondary)' }}>Broadcast updates to your enrolled students.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Compose Form */}
        <div className="lg:col-span-2 border rounded-[24px] shadow-lg p-8 h-max" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <h3 className="text-lg font-bold mb-6">New Announcement</h3>
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Select Course Cohort</label>
              <select className="input-premium w-full rounded-xl px-4 py-3 text-sm transition-colors">
                <option>All Enrolled Students (15,690)</option>
                <option>Full-Stack React & TypeScript (12,480)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Subject</label>
              <input type="text" placeholder="e.g. New module uploaded!" className="input-premium w-full rounded-xl px-4 py-3 transition-colors" />
            </div>
            <div>
              <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Message</label>
              <textarea rows={6} placeholder="Write your broadcast message..." defaultValue={cmsData?.defaultTemplate || ""} className="input-premium w-full rounded-xl px-4 py-3 transition-colors resize-none"></textarea>
            </div>
            <button type="button" className="btn-primary px-8 py-3 font-bold rounded-xl transition-all">
              Send Broadcast
            </button>
          </form>
        </div>

        {/* History */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-lg font-bold mb-6">Recent Broadcasts</h3>
          <div className="border p-5 rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--accent-primary)' }}>Full-Stack React • 3 Days Ago</span>
            <h4 className="font-bold mb-2">Live Q&A Rescheduled</h4>
            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>Hi everyone, due to a scheduling conflict, our Thursday office hours will be moved to Friday at 4PM.</p>
          </div>
          <div className="border p-5 rounded-2xl" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
            <span className="text-[10px] font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--accent-primary)' }}>All Students • 2 Weeks Ago</span>
            <h4 className="font-bold mb-2">Welcome to the new platform!</h4>
            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-secondary)' }}>We just rolled out the new dark mode UI and improved video player. Let me know what you think!</p>
          </div>
        </div>
      </div>
    </div>
  );
}