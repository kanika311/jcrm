export default function AdminTeamLoading() {
  return (
    <div className="max-w-[1300px] mx-auto space-y-6 pb-20 animate-pulse">
      {/* Top Action Bar Skeleton */}
      <div className="flex items-center gap-2.5">
        <div className="h-8 w-28 bg-blue-100 rounded-lg" />
        <div className="h-8 w-32 bg-emerald-100 rounded-lg" />
        <div className="h-8 w-36 bg-amber-100 rounded-lg" />
        <div className="h-8 w-28 bg-slate-100 rounded-lg ml-auto" />
      </div>

      {/* Title Skeleton */}
      <div className="space-y-1.5">
        <div className="h-7 w-64 bg-slate-200 rounded-md" />
        <div className="h-3.5 w-96 bg-slate-100 rounded" />
      </div>

      {/* Controls Bar Skeleton */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
        <div className="flex items-center gap-2">
          <div className="h-7 w-28 bg-slate-100 rounded-md" />
          <div className="h-8 w-64 bg-slate-100 rounded-xl" />
        </div>
        <div className="h-8 w-64 bg-slate-100 rounded-md" />
      </div>

      {/* Table Skeleton */}
      <div className="rounded-2xl overflow-hidden shadow-xs bg-white border border-slate-200">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between">
          <div className="h-3.5 w-32 bg-slate-200 rounded" />
          <div className="h-3.5 w-24 bg-slate-200 rounded" />
          <div className="h-3.5 w-28 bg-slate-200 rounded" />
          <div className="h-3.5 w-16 bg-slate-200 rounded" />
        </div>
        <div className="divide-y divide-slate-100">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="p-4 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-xl bg-slate-200 shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-3.5 w-28 bg-slate-200 rounded" />
                  <div className="h-2.5 w-36 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="space-y-1.5 hidden sm:block">
                <div className="h-3.5 w-32 bg-slate-200 rounded" />
                <div className="h-2.5 w-20 bg-slate-100 rounded" />
              </div>
              <div className="h-6 w-20 bg-slate-100 rounded-full hidden md:block" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-slate-100 rounded-lg" />
                <div className="h-8 w-14 bg-slate-100 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
