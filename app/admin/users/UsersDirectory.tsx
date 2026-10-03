import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { UserFilters } from "@/components/admin/UserFilters";
import { UserActionsRow } from "@/components/admin/UserActionsRow";
import { StudentPaymentControls } from "@/components/admin/StudentPaymentControls";
import { feeAmount } from "@/lib/courseAccess";
import { Suspense } from "react";

type DirectoryRole = "STUDENT" | "INSTRUCTOR";

const copy: Record<DirectoryRole, { title: string; description: string; addLabel: string; empty: string; badge: string }> = {
  STUDENT: {
    title: "",
    description: "",
    addLabel: "Add Student",
    empty: "No students found.",
    badge: "STUDENT",
  },
  INSTRUCTOR: {
    title: "",
    description: "",
    addLabel: "Add Faculty",
    empty: "No faculty found.",
    badge: "FACULTY",
  },
};

export default async function UsersDirectory({
  role,
  search = "",
}: {
  role: DirectoryRole;
  search?: string;
}) {
  const text = copy[role];
  const where: any = { role };

  if (search) {
    where.OR = [
      { email: { contains: search, mode: "insensitive" } },
      { name: { contains: search, mode: "insensitive" } },
      { fullName: { contains: search, mode: "insensitive" } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5 pb-20">
      {(text.title || text.description) && (
        <div>
          {text.title && <h1 className="heading-font text-3xl font-bold mb-2">{text.title}</h1>}
          {text.description && <p style={{ color: "var(--text-secondary)" }}>{text.description}</p>}
        </div>
      )}

      <div className="flex items-center gap-3 w-full">
        <div className="flex-1 min-w-0">
          <Suspense fallback={<div className="h-11 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
            <UserFilters />
          </Suspense>
        </div>
        <Link href="/admin/users/add" className="btn-primary px-5 py-2.5 rounded-lg text-sm font-bold flex items-center justify-center shrink-0 whitespace-nowrap">
          {text.addLabel}
        </Link>
      </div>

      <div className="rounded-[24px] overflow-hidden" style={{ background: "var(--bg-card)", border: "1px solid var(--border-soft)" }}>
        <div className="overflow-x-auto">
          <table className="data-table w-full text-left">
            <thead>
              <tr className="border-b" style={{ borderColor: "var(--border-soft)" }}>
                <th className="p-4">User</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                {role === "STUDENT" && <th className="p-4">Registration</th>}
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className={`border-b last:border-0 ${u.isBlocked ? "opacity-50" : ""}`} style={{ borderColor: "var(--border-soft)" }}>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200 shrink-0">
                        {u.image ? (
                          <Image src={u.image} alt="Profile" fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center font-bold text-gray-500">
                            {u.email.charAt(0).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-sm">{u.fullName || u.name || "N/A"}</div>
                        <div className="text-xs text-gray-500">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${role === "INSTRUCTOR" ? "badge-warning" : "badge-primary"}`}>
                      {text.badge}
                    </span>
                  </td>
                  <td className="p-4 text-xs" style={{ color: "var(--text-secondary)" }}>
                    {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  {role === "STUDENT" && (
                    <td className="p-4">
                      <StudentPaymentControls
                        userId={u.id}
                        fee={feeAmount(u.registrationFee)}
                        paid={u.registrationPaid}
                        courseBlocked={u.courseAccessBlocked}
                      />
                    </td>
                  )}
                  <td className="p-4">
                    <div className="flex gap-4 items-center">
                      <Link href={`/admin/users/edit/${u.id}`} className="text-xs font-bold text-[var(--accent-primary)] hover:underline">Edit</Link>
                      <UserActionsRow userId={u.id} isBlocked={u.isBlocked} />
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={role === "STUDENT" ? 5 : 4} className="p-8 text-center text-gray-500">{text.empty}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
