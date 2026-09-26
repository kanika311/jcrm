"use client";

import { useEffect, useMemo, useState } from "react";

const WEEK = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function toDateValue(year: number, month: number, day: number) {
  return `${year}-${pad(month + 1)}-${pad(day)}`;
}

function parseDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  return { year: Number(match[1]), month: Number(match[2]) - 1, day: Number(match[3]) };
}

function parseTime(value: string) {
  const match = /^(\d{2}):(\d{2})/.exec(value);
  if (!match) return { hour12: 8, minute: 30, ampm: "AM" as const };
  const hour24 = Number(match[1]);
  const minute = Number(match[2]);
  const ampm = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 || 12;
  return { hour12, minute, ampm: ampm as "AM" | "PM" };
}

function toTimeValue(hour12: number, minute: number, ampm: "AM" | "PM") {
  let hour24 = hour12 % 12;
  if (ampm === "PM") hour24 += 12;
  return `${pad(hour24)}:${pad(minute)}`;
}

function ClockFace({
  hour12,
  minute,
  mode,
  onHour,
  onMinute,
}: {
  hour12: number;
  minute: number;
  mode: "hour" | "minute";
  onHour: (h: number) => void;
  onMinute: (m: number) => void;
}) {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const liveSec = now.getSeconds();
  const liveMin = now.getMinutes() + liveSec / 60;
  const liveHour = (now.getHours() % 12) + liveMin / 60;

  const items = mode === "hour" ? Array.from({ length: 12 }, (_, i) => i + 1) : [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];

  return (
    <div className="relative mx-auto w-52 h-52 rounded-full border-4 border-slate-200 bg-gradient-to-b from-white to-slate-50 shadow-inner">
      <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 24px rgba(15,23,42,0.06)" }} />
      {items.map((value, index) => {
        const angle = (index / 12) * 360 - 90;
        const rad = (angle * Math.PI) / 180;
        const x = 50 + Math.cos(rad) * 38;
        const y = 50 + Math.sin(rad) * 38;
        const selected = mode === "hour" ? value === hour12 : value === minute;
        return (
          <button
            key={`${mode}-${value}`}
            type="button"
            onClick={() => (mode === "hour" ? onHour(value) : onMinute(value))}
            className={`absolute w-8 h-8 -ml-4 -mt-4 rounded-full text-xs font-black ${
              selected ? "bg-[#0055FF] text-white shadow-md" : "text-slate-700 hover:bg-slate-100"
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            {mode === "minute" ? pad(value) : value}
          </button>
        );
      })}
      <div
        className="absolute left-1/2 top-1/2 origin-bottom bg-slate-400/70"
        style={{ width: 2, height: "22%", transform: `translate(-50%, -100%) rotate(${liveHour * 30}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 origin-bottom bg-slate-500/80"
        style={{ width: 2, height: "30%", transform: `translate(-50%, -100%) rotate(${liveMin * 6}deg)` }}
      />
      <div
        className="absolute left-1/2 top-1/2 origin-bottom bg-rose-500"
        style={{ width: 1, height: "34%", transform: `translate(-50%, -100%) rotate(${liveSec * 6}deg)` }}
      />
      <div className="absolute left-1/2 top-1/2 w-2.5 h-2.5 -ml-1.5 -mt-1.5 rounded-full bg-[#0055FF]" />
    </div>
  );
}

export default function CalendarClockPicker({
  date,
  time,
  onDateChange,
  onTimeChange,
}: {
  date: string;
  time: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
}) {
  const selected = parseDate(date);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: selected?.year ?? now.getFullYear(), month: selected?.month ?? now.getMonth() };
  });
  const parsedTime = parseTime(time);
  const [hour12, setHour12] = useState(parsedTime.hour12);
  const [minute, setMinute] = useState(parsedTime.minute);
  const [ampm, setAmpm] = useState<"AM" | "PM">(parsedTime.ampm);
  const [clockMode, setClockMode] = useState<"hour" | "minute">("hour");

  const days = useMemo(() => {
    const first = new Date(view.year, view.month, 1).getDay();
    const count = new Date(view.year, view.month + 1, 0).getDate();
    const cells: Array<number | null> = [...Array(first).fill(null), ...Array.from({ length: count }, (_, i) => i + 1)];
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [view]);

  const applyTime = (nextHour: number, nextMinute: number, nextAmpm: "AM" | "PM") => {
    setHour12(nextHour);
    setMinute(nextMinute);
    setAmpm(nextAmpm);
    onTimeChange(toTimeValue(nextHour, nextMinute, nextAmpm));
  };

  const [open, setOpen] = useState<"date" | "time" | null>(null);

  const labelDate = selected
    ? new Date(selected.year, selected.month, selected.day).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Pick date";

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setOpen((v) => (v === "date" ? null : "date"))}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Date</span>
            <span className="block text-sm font-bold text-slate-900">{labelDate}</span>
          </span>
        </button>
        <button
          type="button"
          onClick={() => setOpen((v) => (v === "time" ? null : "time"))}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-left"
        >
          <span className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
          <span>
            <span className="block text-[10px] font-bold uppercase tracking-wide text-slate-400">Time</span>
            <span className="block text-sm font-bold text-slate-900">
              {hour12}:{pad(minute)} {ampm}
            </span>
          </span>
        </button>
      </div>

      {open === "date" && (
      <div className="rounded-2xl border border-slate-200 p-3 bg-white">
        <div className="flex items-center justify-between mb-2">
          <button
            type="button"
            onClick={() => setView((v) => (v.month === 0 ? { year: v.year - 1, month: 11 } : { year: v.year, month: v.month - 1 }))}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold"
          >
            ‹
          </button>
          <div className="text-sm font-black text-slate-900">
            {MONTHS[view.month]} {view.year}
          </div>
          <button
            type="button"
            onClick={() => setView((v) => (v.month === 11 ? { year: v.year + 1, month: 0 } : { year: v.year, month: v.month + 1 }))}
            className="w-8 h-8 rounded-lg bg-slate-100 text-slate-700 font-bold"
          >
            ›
          </button>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-1">
          {WEEK.map((d) => (
            <div key={d} className="text-[10px] font-black text-slate-400 py-1">
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const isSelected =
              day && selected && selected.year === view.year && selected.month === view.month && selected.day === day;
            return (
              <button
                key={`${view.year}-${view.month}-${index}`}
                type="button"
                disabled={!day}
                onClick={() => {
                  if (!day) return;
                  onDateChange(toDateValue(view.year, view.month, day));
                  setOpen(null);
                }}
                className={`h-8 rounded-lg text-xs font-bold ${
                  !day
                    ? "opacity-0"
                    : isSelected
                      ? "bg-[#0055FF] text-white"
                      : "text-slate-800 hover:bg-blue-50"
                }`}
              >
                {day || ""}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs font-semibold text-[#0055FF]">{labelDate}</p>
      </div>
      )}

      {open === "time" && (
      <div className="rounded-2xl border border-slate-200 p-3 bg-white">
        <div className="flex items-center justify-between mb-3">
          <div className="text-sm font-black text-slate-900">
            {hour12}:{pad(minute)} {ampm}
          </div>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => setClockMode("hour")}
              className={`px-2 py-1 rounded-lg text-[10px] font-black ${clockMode === "hour" ? "bg-[#0055FF] text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Hour
            </button>
            <button
              type="button"
              onClick={() => setClockMode("minute")}
              className={`px-2 py-1 rounded-lg text-[10px] font-black ${clockMode === "minute" ? "bg-[#0055FF] text-white" : "bg-slate-100 text-slate-600"}`}
            >
              Minute
            </button>
          </div>
        </div>
        <ClockFace
          hour12={hour12}
          minute={minute}
          mode={clockMode}
          onHour={(h) => {
            applyTime(h, minute, ampm);
            setClockMode("minute");
          }}
          onMinute={(m) => {
            applyTime(hour12, m, ampm);
            setOpen(null);
          }}
        />
        <div className="flex justify-center gap-2 mt-3">
          {(["AM", "PM"] as const).map((slot) => (
            <button
              key={slot}
              type="button"
              onClick={() => applyTime(hour12, minute, slot)}
              className={`px-4 py-1.5 rounded-lg text-xs font-black ${
                ampm === slot ? "bg-[#0055FF] text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {slot}
            </button>
          ))}
        </div>
      </div>
      )}
    </div>
  );
}
