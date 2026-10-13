import { Metadata } from "next";
import { Suspense } from "react";
import AdminLoginClient from "./AdminLoginClient";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "JCRM Admin Console — Authorized Access Only",
  description: "Secure administrative login portal for JCRM Technologies.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0A0D14]" />}>
      <AdminLoginClient />
    </Suspense>
  );
}
