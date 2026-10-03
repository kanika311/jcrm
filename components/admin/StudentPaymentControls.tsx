"use client";

import { useState, useTransition } from "react";
import { setStudentPayment } from "@/app/admin/users/actions";

export function StudentPaymentControls({
  userId,
  fee,
  paid,
  courseBlocked,
}: {
  userId: string;
  fee: number;
  paid: boolean;
  courseBlocked: boolean;
}) {
  const [amount, setAmount] = useState(String(fee));
  const [blocked, setBlocked] = useState(courseBlocked);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  const save = () => {
    setMessage("");
    startTransition(async () => {
      const result = await setStudentPayment(userId, Number(amount), blocked);
      setMessage(result.error || "Saved");
    });
  };

  return (
    <div className="flex flex-col gap-2 min-w-[220px]">
      <div className="flex items-center gap-2">
        <span className="text-[11px] font-bold text-gray-500">Fee ₹</span>
        <input
          type="number"
          min={0}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          className="w-24 px-2 py-1.5 rounded-lg border text-sm"
          style={{ borderColor: "var(--border-soft)", background: "var(--bg-surface)" }}
        />
        <span className={`text-[10px] font-extrabold px-2 py-1 rounded ${paid || Number(amount) <= 0 ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {Number(amount) <= 0 ? "FREE" : paid ? "PAID" : "UNPAID"}
        </span>
      </div>
      <label className="flex items-center gap-2 text-xs font-semibold">
        <input
          type="checkbox"
          checked={blocked}
          onChange={(event) => setBlocked(event.target.checked)}
        />
        Block courses if further fee is unpaid
      </label>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={isPending}
          className="text-xs font-bold text-[var(--accent-primary)] hover:underline disabled:opacity-50"
        >
          {isPending ? "Saving..." : "Save payment"}
        </button>
        {message && <span className="text-[11px] text-gray-500">{message}</span>}
      </div>
    </div>
  );
}
