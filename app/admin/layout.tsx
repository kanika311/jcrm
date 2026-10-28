import AdminLayoutClient from "./AdminLayoutClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/jcrm-sushant?error=AccessDenied");
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}