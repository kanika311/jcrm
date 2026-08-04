"use client";

import { useTransition } from "react";
import { toggleUserStatus, deleteUser } from "@/app/admin/users/actions";
import { useRouter } from "next/navigation";

export function UserActionsRow({ userId, isBlocked }: { userId: string; isBlocked: boolean }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = () => {
    startTransition(async () => {
      await toggleUserStatus(userId, isBlocked);
    });
  };

  const handleDelete = () => {
    if (confirm("Are you sure you want to permanently delete this user? This cannot be undone.")) {
      startTransition(async () => {
        await deleteUser(userId);
      });
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button 
        onClick={handleToggle}
        disabled={isPending}
        title={isBlocked ? "Unblock User" : "Block User"}
        className={`w-10 h-5 rounded-full flex items-center p-1 transition-colors ${isBlocked ? "bg-red-500" : "bg-green-500"} ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
      >
        <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform duration-300 ${isBlocked ? "translate-x-5" : "translate-x-0"}`} />
      </button>

      <button 
        onClick={handleDelete}
        disabled={isPending}
        className="text-xs font-bold text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  );
}
