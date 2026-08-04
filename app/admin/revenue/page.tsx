"use client";

import { useState } from "react";

export default function AdminRevenuePage() {
  const [activeTab, setActiveTab] = useState("payouts");

  const payouts = [
    { id: 1, faculty: "Aisha Verma", amount: "₹12,450.00", status: "Pending", method: "Bank Transfer", date: "Jul 1, 2026", initials: "AV", color: "from-fuchsia-500 to-pink-600" },
    { id: 2, faculty: "Marcus Chen", amount: "₹8,200.00", status: "Pending", method: "PayPal", date: "Jul 2, 2026", initials: "MC", color: "from-blue-500 to-cyan-500" },
    { id: 3, faculty: "Priya Nair", amount: "₹4,100.00", status: "Processed", method: "Bank Transfer", date: "Jun 15, 2026", initials: "PN", color: "from-emerald-500 to-teal-500" }
  ];

  return (
    <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-txt-primary mb-2">Global Revenue</h1>
          <p className="text-txt-secondary font-medium">Manage platform fees, transactions, and faculty payouts.</p>
        </div>
        <button className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-txt-primary font-bold rounded-xl transition-all shadow-lg shadow-emerald-900/50 text-sm">
          Export CSV Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#131B2F] border border-bdr-soft p-6 rounded-2xl shadow-lg">
          <p className="text-sm font-medium text-txt-secondary mb-2">Gross Volume (30d)</p>
          <h3 className="text-4xl font-extrabold text-txt-primary">₹142,500</h3>
        </div>
        <div className="bg-[#131B2F] border border-emerald-500/30 p-6 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.1)] relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-24 h-24 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path><path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path></svg>
          </div>
          <p className="text-sm font-medium text-emerald-400 mb-2 relative z-10">Platform Net Profit (20% fee)</p>
          <h3 className="text-4xl font-extrabold text-txt-primary relative z-10">₹28,500</h3>
        </div>
        <div className="bg-[#131B2F] border border-bdr-soft p-6 rounded-2xl shadow-lg">
          <p className="text-sm font-medium text-txt-secondary mb-2">Pending Payouts</p>
          <h3 className="text-4xl font-extrabold text-rose-400">₹20,650</h3>
        </div>
      </div>

      <div className="bg-[#131B2F] border border-bdr-soft rounded-[24px] shadow-lg overflow-hidden mt-8">
        <div className="flex items-center gap-6 px-8 pt-6 border-b border-bdr-soft">
          <button onClick={() => setActiveTab("payouts")} className={`pb-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "payouts" ? "text-emerald-400 border-emerald-500" : "text-txt-tertiary border-transparent hover:text-txt-secondary"}`}>
            Faculty Payouts
          </button>
          <button onClick={() => setActiveTab("transactions")} className={`pb-4 text-sm font-bold transition-colors border-b-2 ${activeTab === "transactions" ? "text-emerald-400 border-emerald-500" : "text-txt-tertiary border-transparent hover:text-txt-secondary"}`}>
            All Transactions
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.02] border-b border-bdr-soft text-xs font-bold text-txt-secondary uppercase tracking-wider">
                <th className="p-6 font-medium">Faculty</th>
                <th className="p-6 font-medium">Request Date</th>
                <th className="p-6 font-medium">Method</th>
                <th className="p-6 font-medium text-right">Amount</th>
                <th className="p-6 font-medium text-center">Status</th>
                <th className="p-6 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {payouts.map((payout) => (
                <tr key={payout.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="p-6">
                    <div className="flex items-center gap-4">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${payout.color} flex items-center justify-center text-txt-primary font-bold text-xs shadow-md shrink-0`}>{payout.initials}</div>
                      <span className="font-bold text-txt-primary group-hover:text-emerald-400 transition-colors">{payout.faculty}</span>
                    </div>
                  </td>
                  <td className="p-6 text-sm text-txt-secondary">{payout.date}</td>
                  <td className="p-6 text-sm text-txt-secondary">{payout.method}</td>
                  <td className="p-6 text-right font-bold text-txt-primary">{payout.amount}</td>
                  <td className="p-6 text-center">
                    <span className={`px-3 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${payout.status === 'Pending' ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-txt-secondary'}`}>
                      {payout.status}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    {payout.status === 'Pending' ? (
                      <button className="px-4 py-2 bg-emerald-600/20 text-emerald-400 hover:bg-emerald-600 hover:text-txt-primary text-xs font-bold rounded-lg transition-colors border border-emerald-500/30">Process</button>
                    ) : (
                      <span className="text-xs text-txt-tertiary font-bold">Paid</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}