import { prisma } from "@/lib/prisma";
import MessagesClient from "./MessagesClient";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export const dynamic = 'force-dynamic';

export default async function AdminMessagesPage() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "ADMIN") {
      redirect("/auth");
    }

    const instructors = await prisma.user.findMany({
      where: { role: "INSTRUCTOR" },
      select: {
        id: true,
        fullName: true,
        name: true,
        email: true,
      },
    });

    return <MessagesClient instructors={instructors} />;
  } catch (error: any) {
    if (
      error.digest?.startsWith("NEXT_REDIRECT") ||
      error.digest === "DYNAMIC_SERVER_USAGE" ||
      error.message?.includes("Dynamic server usage")
    ) {
      throw error;
    }
    console.error("ADMIN_MESSAGES_PAGE_ERROR:", error);
    return (
      <div className="p-8 max-w-2xl mx-auto mt-12 text-center rounded-2xl border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-soft)' }}>
        <h3 className="heading-font text-xl font-bold text-red-500 mb-2">Failed to load messages page</h3>
        <p className="text-sm font-semibold mb-4" style={{ color: 'var(--text-secondary)' }}>
          A runtime server error occurred. Please check the message details below:
        </p>
        <div className="p-4 rounded-xl bg-red-500/10 text-red-500 text-left font-mono text-xs overflow-x-auto">
          {error.stack || error.message || String(error)}
        </div>
      </div>
    );
  }
}
