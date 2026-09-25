import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import Link from "next/link";
import TeamEditClient from "../TeamEditClient";

export const dynamic = "force-dynamic";

export default async function AdminTeamEditPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || session.user.role !== "ADMIN") {
    redirect("/auth");
  }

  const { id } = await params;
  const member = await prisma.teamMember.findUnique({ where: { id } });

  if (!member) {
    return (
      <div className="max-w-xl mx-auto mt-12 text-center bg-white border border-slate-200 rounded-2xl p-8">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2 tracking-tight">Member not found</h2>
        <p className="text-sm text-slate-600 mb-5">This team member could not be loaded.</p>
        <Link href="/admin/team" className="text-sm font-semibold text-[#0055FF] hover:underline">
          ← Back to team
        </Link>
      </div>
    );
  }

  const serialized = {
    ...member,
    createdAt: member.createdAt.toISOString(),
    updatedAt: member.updatedAt.toISOString(),
  };

  return <TeamEditClient initialMember={serialized as any} />;
}
