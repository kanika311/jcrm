"use client";

import { useState, useTransition } from "react";
import {
  FiDollarSign,
  FiCreditCard,
  FiUsers,
  FiDownload,
  FiRefreshCw,
  FiCheckCircle,
  FiArrowUpRight,
  FiArrowDownRight,
  FiCalendar,
  FiAward,
  FiCheck,
  FiInbox,
} from "react-icons/fi";
import type { AdminReportData } from "@/lib/adminReports";

interface ReportsDashboardClientProps {
  initialReport?: AdminReportData;
}

type TimeRangeOption = "today" | "this_week" | "this_month" | "all" | "custom";

export default function ReportsDashboardClient({ initialReport }: ReportsDashboardClientProps) {
  const [report, setReport] = useState<AdminReportData | null>(initialReport || null);
  const [timeRange, setTimeRange] = useState<TimeRangeOption>(
    (initialReport?.timeRange as TimeRangeOption) || "this_month"
  );
  const [customStartDate, setCustomStartDate] = useState(
    initialReport?.startDate || new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().slice(0, 10)
  );
  const [customEndDate, setCustomEndDate] = useState(
    initialReport?.endDate || new Date().toISOString().slice(0, 10)
  );
  const [hoveredBarIndex, setHoveredBarIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const fetchFilteredReport = async (
    range: TimeRangeOption,
    startDate?: string,
    endDate?: string
  ) => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ range });
      if (range === "custom" && startDate && endDate) {
        params.set("startDate", startDate);
        params.set("endDate", endDate);
      }
      const res = await fetch(`/api/admin/reports?${params.toString()}`);
      if (res.ok) {
        const json = await res.json();
        const data = json.data || json;
        if (data && (data.totalRevenueFormatted !== undefined || data.chartData)) {
          startTransition(() => {
            setReport(data);
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRangeChange = (range: TimeRangeOption) => {
    setTimeRange(range);
    if (range !== "custom") {
      fetchFilteredReport(range);
    }
  };

  const handleApplyCustomDates = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customStartDate || !customEndDate) return;
    fetchFilteredReport("custom", customStartDate, customEndDate);
  };

  const handleDownloadCSV = () => {
    if (!report || !report.transactions) return;
    const transactions = report.transactions;

    const headers = ["Transaction ID", "Candidate Name", "Email", "Course / Item", "Amount (INR)", "Payment Method", "Status", "Date"];
    const rows = transactions.map((t) => [
      `"${t.id}"`,
      `"${t.name.replace(/"/g, '""')}"`,
      `"${t.email.replace(/"/g, '""')}"`,
      `"${t.type.replace(/"/g, '""')}"`,
      t.amount,
      `"${t.method}"`,
      `"${t.status}"`,
      `"${t.date}"`,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `JCRM_Report_${timeRange}_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Safe fallback values
  const totalRevenueFormatted = report?.totalRevenueFormatted || "₹0";
  const settledAmountFormatted = report?.settledAmountFormatted || "₹0";
  const revenueGrowth = report?.revenueGrowthVsPrevious ?? 0;
  const gatewaySuccessRate = report?.gatewaySuccessRate ?? 100;
  const totalMembersAndCandidates = report?.totalMembersAndCandidates ?? 0;
  const newMembersInPeriod = report?.newMembersInPeriod ?? 0;
  const totalPlacements = report?.totalPlacements ?? 0;

  const chartData = report?.chartData || [];
  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1000);
  const maxPayments = Math.max(...chartData.map((d) => d.payments), 5);

  const highestBucket = [...chartData].sort((a, b) => b.revenue - a.revenue)[0];
  const totalPeriodRevenue = chartData.reduce((s, c) => s + c.revenue, 0);
  const avgBucketRevenue = chartData.length > 0 ? Math.round(totalPeriodRevenue / chartData.length) : 0;

  const paymentMethods = report?.paymentMethods || [];
  const departmentStats = report?.departmentStats || [];
  const transactions = report?.transactions || [];

  return (
    <div className="space-y-8 pb-20 font-sans">
      {/* Top Header & Range Controls */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              Financial &amp; Performance Dashboard
            </h1>
            {isLoading && (
              <FiRefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
            )}
          </div>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">
            Real-time analytics for actual revenue, database enrollments, gateway transactions, and candidates.
          </p>
        </div>

        {/* Date Filter Bar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Filter Pills */}
          <div className="flex items-center p-1 bg-white border border-slate-200 rounded-xl shadow-xs">
            <button
              onClick={() => handleRangeChange("today")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === "today"
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleRangeChange("this_week")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === "this_week"
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleRangeChange("this_month")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === "this_month"
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => handleRangeChange("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === "all"
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              All Time
            </button>
            <button
              onClick={() => handleRangeChange("custom")}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === "custom"
                  ? "bg-[#0055FF] text-white shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FiCalendar className="w-3.5 h-3.5" />
              <span>Custom Date</span>
            </button>
          </div>

          {/* Export CSV button */}
          <button
            onClick={handleDownloadCSV}
            disabled={transactions.length === 0}
            className={`flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl shadow-xs transition-all cursor-pointer ${
              transactions.length === 0
                ? "bg-slate-200 text-slate-400 cursor-not-allowed"
                : "bg-slate-900 hover:bg-slate-800 text-white"
            }`}
            title={transactions.length === 0 ? "No transactions to export" : "Export current table as CSV"}
          >
            <FiDownload className="w-3.5 h-3.5" />
            <span>Export CSV ({transactions.length})</span>
          </button>
        </div>
      </div>

      {/* Custom Date Range Picker Accordion / Bar */}
      {timeRange === "custom" && (
        <form
          onSubmit={handleApplyCustomDates}
          className="p-4 bg-blue-50/70 border border-blue-200/80 rounded-2xl flex flex-wrap items-center gap-3 text-xs"
        >
          <div className="flex items-center gap-2 text-blue-900 font-bold">
            <FiCalendar className="w-4 h-4 text-blue-600" />
            <span>Custom Date Filter:</span>
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-semibold">From:</label>
            <input
              type="date"
              value={customStartDate}
              onChange={(e) => setCustomStartDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:outline-blue-500"
              required
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-slate-600 font-semibold">To:</label>
            <input
              type="date"
              value={customEndDate}
              onChange={(e) => setCustomEndDate(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 text-xs font-medium focus:outline-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs transition-colors cursor-pointer flex items-center gap-1.5"
          >
            {isLoading ? <FiRefreshCw className="w-3.5 h-3.5 animate-spin" /> : <FiCheck className="w-3.5 h-3.5" />}
            <span>Apply Filter</span>
          </button>
        </form>
      )}

      {/* Top 4 KPI Metrics (Real Data) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Gross Revenue */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Total Platform Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-[#0055FF] flex items-center justify-center font-bold">
              <FiDollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {totalRevenueFormatted}
          </div>
          <div
            className={`flex items-center gap-1.5 mt-2 text-xs font-bold ${
              revenueGrowth >= 0 ? "text-emerald-600" : "text-rose-600"
            }`}
          >
            {revenueGrowth >= 0 ? (
              <FiArrowUpRight className="w-4 h-4" />
            ) : (
              <FiArrowDownRight className="w-4 h-4" />
            )}
            <span>
              {revenueGrowth >= 0 ? `+${revenueGrowth}%` : `${revenueGrowth}%`} vs previous period
            </span>
          </div>
        </div>

        {/* Payments Settled */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Payments Settled
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <FiCreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {settledAmountFormatted}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-slate-600">
            <FiCheckCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span>
              {gatewaySuccessRate}% Success ({report?.settledCount ?? 0} settled)
            </span>
          </div>
        </div>

        {/* Active Team / Candidates */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Team &amp; Candidates
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <FiUsers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {totalMembersAndCandidates} Members
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-purple-600">
            <FiArrowUpRight className="w-3.5 h-3.5" />
            <span>+{newMembersInPeriod} Added in this period</span>
          </div>
        </div>

        {/* Placed Candidates */}
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs hover:shadow-md transition-all">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Placements &amp; Careers
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
              <FiAward className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {totalPlacements} Placed
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-700">
            <span>Verified Alumni &amp; Candidates</span>
          </div>
        </div>
      </div>

      {/* Main Graph & Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Revenue & Period Bar Graph */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Revenue Growth Trend</h2>
              <p className="text-xs text-slate-500">
                Period gross volume and candidate course revenue (in INR)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-md bg-[#0055FF]"></span>
              <span className="text-xs font-bold text-slate-600">Revenue</span>
              <span className="w-3 h-3 rounded-md bg-emerald-400 ml-2"></span>
              <span className="text-xs font-bold text-slate-600">Paid Txns</span>
            </div>
          </div>

          {/* Interactive Chart Container */}
          <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-4 pt-8 pb-2 border-b border-slate-100">
            {chartData.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs">
                <FiInbox className="w-8 h-8 mb-2 stroke-1" />
                <span>No transaction activity for this period</span>
              </div>
            ) : (
              chartData.map((d, index) => {
                const heightPercent = maxRevenue > 0 ? Math.min(100, Math.max(8, Math.round((d.revenue / maxRevenue) * 100))) : 8;
                const isHovered = hoveredBarIndex === index;

                return (
                  <div
                    key={d.label}
                    className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer relative"
                    onMouseEnter={() => setHoveredBarIndex(index)}
                    onMouseLeave={() => setHoveredBarIndex(null)}
                  >
                    {/* Tooltip on hover */}
                    {isHovered && (
                      <div className="absolute -top-12 z-20 bg-slate-900 text-white text-[11px] font-bold py-1 px-2.5 rounded-lg shadow-xl whitespace-nowrap pointer-events-none">
                        <div>
                          {d.label}: {d.formattedRevenue}
                        </div>
                        <div className="text-[10px] text-slate-300 font-medium">
                          {d.payments} transactions
                        </div>
                      </div>
                    )}

                    {/* Dual Bar (Revenue + Payments visual indicator) */}
                    <div className="w-full max-w-[36px] flex items-end gap-1 h-full">
                      <div
                        style={{ height: `${heightPercent}%` }}
                        className={`flex-1 rounded-t-lg transition-all duration-300 ${
                          isHovered
                            ? "bg-blue-600 shadow-md shadow-blue-500/30"
                            : d.revenue > 0
                            ? "bg-[#0055FF]/85 group-hover:bg-[#0055FF]"
                            : "bg-slate-200"
                        }`}
                      />
                      <div
                        style={{
                          height: `${
                            maxPayments > 0
                              ? Math.min(100, Math.max(6, Math.round((d.payments / maxPayments) * 100)))
                              : 6
                          }%`,
                        }}
                        className={`w-1.5 sm:w-2 rounded-t-md transition-all ${
                          d.payments > 0 ? "bg-emerald-400 opacity-90" : "bg-slate-200"
                        }`}
                      />
                    </div>

                    {/* Label */}
                    <span
                      className={`text-[10px] sm:text-[11px] mt-2 font-bold transition-colors truncate max-w-full text-center ${
                        isHovered ? "text-[#0055FF]" : "text-slate-500"
                      }`}
                    >
                      {d.label}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Graph Footer Summary */}
          <div className="grid grid-cols-3 gap-4 pt-5 text-center">
            <div className="border-r border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Period Highest</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                {highestBucket ? `${highestBucket.formattedRevenue} (${highestBucket.label})` : "₹0"}
              </p>
            </div>
            <div className="border-r border-slate-100">
              <span className="text-[11px] font-bold text-slate-400 uppercase">Average Interval</span>
              <p className="text-sm font-black text-slate-900 mt-0.5">
                ₹{avgBucketRevenue.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase">Settled Volume</span>
              <p className="text-sm font-black text-emerald-600 mt-0.5">
                {report?.settledCount ?? 0} Enrollments
              </p>
            </div>
          </div>
        </div>

        {/* Right Column (1 Col): Payment Methods Distribution */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Payment Breakdown</h2>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Active Gateways
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-6">
              Distribution of inbound transactions across connected payment methods.
            </p>

            {/* Payment Method Progress Bars */}
            <div className="space-y-4">
              {paymentMethods.map((pm) => (
                <div key={pm.name} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <span className="text-slate-700 truncate max-w-[200px]">{pm.name}</span>
                    <span className="text-slate-900">{pm.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.min(100, Math.max(pm.percentage, 0))}%` }}
                      className={`h-full ${pm.color} rounded-full transition-all duration-500`}
                    />
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400 font-medium">
                    <span>Volume</span>
                    <span>{pm.amount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Instant UPI &amp; Cards Enabled</span>
            <span className="text-emerald-600 font-bold">● Active 24x7</span>
          </div>
        </div>
      </div>

      {/* Team / Department Distribution & Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Talent Graph */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Talent &amp; Department Graph</h2>
          <p className="text-xs text-slate-500 mb-5">Current enrolled engineering interns &amp; team members</p>

          <div className="space-y-3.5">
            {departmentStats.map((dept) => (
              <div
                key={dept.name}
                className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${dept.color}`} />
                  <div>
                    <p className="text-xs font-bold text-slate-800">{dept.name}</p>
                    <p className="text-[11px] text-slate-500">{dept.count} Members active</p>
                  </div>
                </div>
                <span className="text-xs font-black text-slate-900 bg-white px-2 py-1 rounded-lg border border-slate-200 shadow-2xs">
                  {dept.share}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions Table (2 Cols) */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Period Transactions</h2>
              <p className="text-xs text-slate-500">
                Live transaction stream processed from MongoDB database ({transactions.length} total)
              </p>
            </div>
            {transactions.length > 0 && (
              <button
                onClick={handleDownloadCSV}
                className="text-xs font-bold text-[#0055FF] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Download CSV</span>
                <FiArrowUpRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="overflow-x-auto">
            {transactions.length === 0 ? (
              <div className="py-12 text-center text-slate-400">
                <FiInbox className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                <p className="text-sm font-bold text-slate-600">No transactions found</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  There are no payment enrollments in the selected timeframe ({report?.startDate} to {report?.endDate}).
                </p>
              </div>
            ) : (
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="pb-3">Txn ID</th>
                    <th className="pb-3">Candidate / Payer</th>
                    <th className="pb-3">Course / Item</th>
                    <th className="pb-3">Method</th>
                    <th className="pb-3 font-bold text-right">Amount</th>
                    <th className="pb-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {transactions.slice(0, 15).map((tx) => (
                    <tr key={tx.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-slate-600 max-w-[120px] truncate" title={tx.id}>
                        {tx.id}
                      </td>
                      <td className="py-3 font-bold text-slate-900">
                        <div>{tx.name}</div>
                        {tx.email && <div className="text-[10px] text-slate-400 font-normal">{tx.email}</div>}
                      </td>
                      <td className="py-3 text-slate-500 font-medium max-w-[180px] truncate" title={tx.type}>
                        {tx.type}
                      </td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700">
                          {tx.method}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-slate-900">{tx.amountFormatted}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                            tx.status === "Settled"
                              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                              : tx.status === "Pending"
                              ? "bg-amber-50 text-amber-700 border-amber-200"
                              : "bg-rose-50 text-rose-700 border-rose-200"
                          }`}
                        >
                          {tx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
