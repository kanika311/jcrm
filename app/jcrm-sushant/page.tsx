import { Metadata } from "next";
import AdminLoginClient from "./AdminLoginClient";

export const metadata: Metadata = {
  title: "JCRM Admin Console — Authorized Access Only",
  description: "Secure administrative login portal for JCRM Technologies.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLoginPage() {
  return <AdminLoginClient />;
}
