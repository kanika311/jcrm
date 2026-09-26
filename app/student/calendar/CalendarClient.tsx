"use client";

import { useMemo, useState } from "react";

export type CalendarEvent = {
  id: string;
  title: string;
  subtitle: string;
  at: string;
  type: "live" | "assignment";
  durationMin?: number;
};

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function formatAgendaDay(date: Date) {
  const today = startOfDay(new Date());
  const that = startOfDay(date);
  const diff = Math.round((that.getTime() - today.getTime()) / 86400000);
  const label = date.toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" });
  if (diff === 0) return `Today, ${label}`;
  if (diff === 1) return `Tomorrow, ${label}`;
  return label;
}

function timeLabel(iso: string, durationMin?: number) {
  const start = new Date(iso);
  const time = start.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" });
  if (!durationMin) return time;
  const end = new Date(start.getTime() + durationMin * 60000);
  return `${time} – ${end.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}`;
}

export default function CalendarClient({
  cmsData,
  events,
}: {
  cmsData: any;
  events: CalendarEvent[];
}) {
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const today = new Date();

  const cells = useMemo(() => {
    const firstWeekday = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    const items: { date: Date; inMonth: boolean }[] = [];

    for (let i = firstWeekday - 1; i >= 0; i--) {
      items.push({ date: new Date(year, month - 1, daysInPrev - i), inMonth: false });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      items.push({ date: new Date(year, month, d), inMonth: true });
    }
    while (items.length % 7 !== 0) {
      const last = items[items.length - 1].date;
      items.push({ date: new Date(last.getFullYear(), last.getMonth(), last.getDate() + 1), inMonth: false });
    }
    return items;
  }, [year, month]);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    for (const event of events) {
      const d = new Date(event.at);
      if (isNaN(d.getTime())) continue;
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const list = map.get(key) || [];
      list.push(event);
      map.set(key, list);
    }
    return map;
  }, [events]);

  const upcoming = useMemo(() => {
    const now = Date.now() - 60 * 60 * 1000;
    return events.filter((e) => new Date(e.at).getTime() >= now).slice(0, 8);
  }, [events]);

  const agendaGroups = useMemo(() => {
    const groups: { key: string; label: string; items: CalendarEvent[] }[] = [];
    for (const event of upcoming) {
      const d = new Date(event.at);
      const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
      const last = groups[groups.length - 1];
      if (!last || last.key !== key) {
        groups.push({ key, label: formatAgendaDay(d), items: [event] });
      } else {
        last.items.push(event);
      }
    }
    return groups;
  }, [upcoming]);

  const monthLabel = cursor.toLocaleDateString("en-IN", { month: "long", year: "numeric" });

  return (
    <div className="space-y-8 pb-20">
      <div>
        <h1 className="heading-font text-3xl font-bold mb-2 text-slate-900">{cmsData?.heading || "Schedule"}</h1>
        <p className="text-sm font-medium text-slate-500">
          Live classes and assignment due dates from your enrolled courses.
        </p>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        <div className="flex-1 p-6 rounded-[24px] bg-white border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-slate-900">{monthLabel}</h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCursor(new Date(year, month - 1, 1))}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date(today.getFullYear(), today.getMonth(), 1))}
                className="px-4 py-2 font-bold text-sm rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setCursor(new Date(year, month + 1, 1))}
                className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-px rounded-xl overflow-hidden border border-slate-200 bg-slate-200">
            {WEEKDAYS.map((d) => (
              <div key={d} className="p-3 text-center text-xs font-bold uppercase tracking-wider bg-slate-50 text-slate-500">
                {d}
              </div>
            ))}

            {cells.map((cell, i) => {
              const key = `${cell.date.getFullYear()}-${cell.date.getMonth()}-${cell.date.getDate()}`;
              const dayEvents = eventsByDay.get(key) || [];
              const isToday = sameDay(cell.date, today);

              return (
                <div
                  key={i}
                  className={`min-h-[100px] p-2 bg-white ${cell.inMonth ? "" : "opacity-40"}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold mb-1 ${
                      isToday ? "bg-[#0055FF] text-white" : "text-slate-800"
                    }`}
                  >
                    {cell.date.getDate()}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 3).map((event) => (
                      <div
                        key={event.id}
                        className={`text-[10px] font-bold px-2 py-1 rounded truncate text-white ${
                          event.type === "live" ? "bg-rose-500" : "bg-amber-500"
                        }`}
                        title={event.title}
                      >
                        {event.type === "live" ? event.title : event.title.replace(/ due$/i, "")}
                      </div>
                    ))}
                    {dayEvents.length > 3 && (
                      <div className="text-[10px] font-bold text-slate-400 px-1">+{dayEvents.length - 3} more</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="w-full xl:w-96 shrink-0">
          <div className="p-6 rounded-[24px] bg-white border border-slate-200 shadow-sm">
            <h3 className="font-bold text-lg mb-6 text-slate-900">Agenda</h3>
            {agendaGroups.length === 0 ? (
              <p className="text-sm text-slate-500">
                No upcoming live classes or assignment due dates yet. When your instructor schedules them, they will appear here.
              </p>
            ) : (
              <div className="space-y-6">
                {agendaGroups.map((group) => (
                  <div key={group.key}>
                    <h4 className="text-sm font-bold mb-3 pb-2 border-b border-slate-100 text-slate-500">{group.label}</h4>
                    <div className="space-y-3">
                      {group.items.map((event) => (
                        <div key={event.id} className="flex gap-4">
                          <div
                            className={`w-1 rounded-full shrink-0 ${
                              event.type === "live" ? "bg-rose-500" : "bg-amber-500"
                            }`}
                          />
                          <div>
                            <div
                              className={`text-xs font-bold mb-0.5 ${
                                event.type === "live" ? "text-rose-500" : "text-amber-600"
                              }`}
                            >
                              {timeLabel(event.at, event.durationMin)}
                            </div>
                            <div className="font-bold text-sm text-slate-900">{event.title}</div>
                            <div className="text-xs mt-1 text-slate-500">{event.subtitle}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
