import { getSiteContent } from "@/lib/cms";

export default async function AdminSettingsPage() {
  const cmsData = await getSiteContent("admin-settings");

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 animate-fade-in-up pb-24">
      <h1 className="heading-font text-3xl font-extrabold mb-8">{cmsData?.heading || "Platform Settings"}</h1>

      {cmsData?.maintenanceMode && (
         <div className="p-4 rounded-xl text-sm font-bold mb-4" style={{ background: 'color-mix(in srgb, var(--accent-danger) 10%, transparent)', color: 'var(--accent-danger)', border: '1px solid var(--accent-danger)' }}>
            ⚠️ Maintenance Mode is currently enabled. Non-admin users cannot access the site.
         </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-2">
          <button className="w-full text-left px-4 py-3 font-bold rounded-xl border transition-colors" style={{ background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', color: 'var(--accent-primary)', borderColor: 'color-mix(in srgb, var(--accent-primary) 20%, transparent)' }}>General Info</button>
          <button className="w-full text-left px-4 py-3 font-medium rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-surf-elevated" style={{ color: 'var(--text-secondary)' }}>Payment Gateways</button>
          <button className="w-full text-left px-4 py-3 font-medium rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-surf-elevated" style={{ color: 'var(--text-secondary)' }}>Email & Notifications</button>
          <button className="w-full text-left px-4 py-3 font-medium rounded-xl transition-colors hover:bg-black/5 dark:hover:bg-surf-elevated" style={{ color: 'var(--text-secondary)' }}>API Keys</button>
        </div>

        <div className="md:col-span-2 border rounded-[24px] shadow-lg p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
          <h2 className="heading-font text-xl font-bold mb-6 border-b pb-4" style={{ borderColor: 'var(--border-soft)' }}>General Platform Info</h2>
          
          <form className="space-y-6">
            <div>
              <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Platform Name</label>
              <input type="text" defaultValue="JCRM Technology" className="input-premium w-full rounded-xl px-4 py-3 transition-colors" />
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Support Email</label>
                <input type="email" defaultValue="support@jcrm technology.io" className="input-premium w-full rounded-xl px-4 py-3 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Global Currency</label>
                <select className="input-premium w-full rounded-xl px-4 py-3 transition-colors">
                  <option value="INR">INR (₹)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-2 uppercase" style={{ color: 'var(--text-secondary)' }}>Platform Fee (%)</label>
              <input type="number" defaultValue="20" className="input-premium w-full rounded-xl px-4 py-3 transition-colors" />
              <p className="text-xs mt-2" style={{ color: 'var(--text-tertiary)' }}>The percentage deducted from faculty sales before payouts.</p>
            </div>
            
            <div className="pt-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--border-soft)' }}>
              <button type="button" className="btn-primary px-6 py-3 text-sm font-bold rounded-xl shadow-lg transition-all">Save Global Settings</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}