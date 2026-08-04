import Link from "next/link";
import Image from "next/image";
import { getSiteContent } from "@/lib/cms";
import { prisma } from "@/lib/prisma";
import { UserFilters } from "@/components/admin/UserFilters";
import { UserActionsRow } from "@/components/admin/UserActionsRow";
import { Suspense } from "react";

export const dynamic = 'force-dynamic';

export default async function AdminUsersPage({ searchParams }: { searchParams: Promise<{ search?: string, role?: string }> | { search?: string, role?: string } }) {
  const cmsData = await getSiteContent("admin-users");
  
  const resolvedParams = await searchParams;
  const search = resolvedParams?.search || "";
  const role = resolvedParams?.role || "ALL";

  const where: any = {};
  
  if (role !== "ALL") {
    where.role = role;
  }
  
  if (search) {
    where.OR = [
      { email: { contains: search, mode: 'insensitive' } },
      { name: { contains: search, mode: 'insensitive' } },
      { fullName: { contains: search, mode: 'insensitive' } },
    ];
  }

  const users = await prisma.user.findMany({
    where,
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="space-y-8 pb-20">
       <div className="flex flex-col md:items-start justify-between gap-4">
          <div>
             <h1 className="heading-font text-3xl font-bold mb-2">{cmsData?.heading || "User Management"}</h1>
             <p style={{ color: 'var(--text-secondary)' }}>Manage all platform users and roles.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 w-full justify-between mt-4">
             <Suspense fallback={<div className="h-10 w-full animate-pulse bg-gray-200 dark:bg-gray-800 rounded-lg"></div>}>
               <UserFilters />
             </Suspense>
             <Link href="/admin/users/add" className="btn-primary px-4 py-2 rounded-lg text-sm font-bold flex items-center justify-center shrink-0">Add User</Link>
          </div>
       </div>

       <div className="rounded-[24px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          <div className="overflow-x-auto">
             <table className="data-table w-full text-left">
                <thead>
                   <tr className="border-b" style={{ borderColor: 'var(--border-soft)' }}>
                      <th className="p-4">User</th>
                      <th className="p-4">Role</th>
                      <th className="p-4">Joined</th>
                      <th className="p-4">Actions</th>
                   </tr>
                </thead>
                <tbody>
                   {users.map((u) => (
                      <tr key={u.id} className={`border-b last:border-0 ${u.isBlocked ? 'opacity-50' : ''}`} style={{ borderColor: 'var(--border-soft)' }}>
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
                            <span className={`px-2 py-1 rounded text-xs font-bold ${
                               u.role === 'ADMIN' ? 'badge-danger' :
                               u.role === 'INSTRUCTOR' ? 'badge-warning' : 'badge-primary'
                            }`}>{u.role}</span>
                         </td>
                         <td className="p-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
                            {new Date(u.createdAt).toLocaleDateString()}
                         </td>
                         <td className="p-4">
                            <div className="flex gap-4 items-center">
                               <Link href={`/admin/users/edit/${u.id}`} className="text-xs font-bold text-[var(--accent-primary)] hover:underline">Edit</Link>
                               {u.role !== 'ADMIN' && (
                                 <UserActionsRow userId={u.id} isBlocked={u.isBlocked} />
                               )}
                            </div>
                         </td>
                      </tr>
                   ))}
                   {users.length === 0 && (
                     <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-500">No users found.</td>
                     </tr>
                   )}
                </tbody>
             </table>
          </div>
       </div>
    </div>
  );
}