import { getSiteContent } from "@/lib/cms";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import SettingsClient from "./SettingsClient";

export default async function AdminSettingsPage() {
  const [cmsData, session] = await Promise.all([
    getSiteContent("admin-settings"),
    getServerSession(authOptions),
  ]);

  return (
    <div className="max-w-[1100px] mx-auto space-y-8 animate-fade-in-up pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="heading-font text-3xl font-extrabold">{cmsData?.heading || "Admin & Platform Settings"}</h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage administrators, change security credentials, and configure system preferences.
          </p>
        </div>
      </div>

      {cmsData?.maintenanceMode && (
        <div
          className="p-4 rounded-xl text-sm font-bold mb-4"
          style={{
            background: "color-mix(in srgb, var(--accent-danger) 10%, transparent)",
            color: "var(--accent-danger)",
            border: "1px solid var(--accent-danger)",
          }}
        >
          ⚠️ Maintenance Mode is currently enabled. Non-admin users cannot access the site.
        </div>
      )}

      <SettingsClient currentAdminEmail={session?.user?.email} cmsData={cmsData} />
    </div>
  );
}