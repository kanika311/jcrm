"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export default function AdminLoginClient() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const router = useRouter();

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setErrorMsg("Invalid administrator credentials. Please verify email and password.");
        setIsLoading(false);
        return;
      }

      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;
      const userEmail = sessionData?.user?.email;

      const isSuperAdmin =
        userEmail === "jcrm technology97@gmail.com" ||
        userEmail === "pandey.ashutosh699@gmail.com";

      if (role === "ADMIN" || isSuperAdmin) {
        router.push("/admin");
        router.refresh();
      } else {
        await signOut({ redirect: false });
        setErrorMsg(
          "Access Denied: This portal is strictly reserved for JCRM Administrators."
        );
        setIsLoading(false);
      }
    } catch {
      setErrorMsg("An unexpected error occurred during admin authentication.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 w-full min-h-[calc(100vh-2rem)] flex items-center justify-center p-4 sm:p-6 py-10 relative">
      {/* Dark luxury background backdrop for admin portal */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-none -z-10" />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-login-title"
        className="relative z-10 w-full max-w-[420px] rounded-[28px] bg-slate-900 border border-slate-700/80 shadow-[0_24px_80px_rgba(0,0,0,0.65)] p-6 sm:p-8"
      >
        <Link
          href="/"
          aria-label="Close admin login"
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </Link>

        <div className="text-center mb-6">
          <img
            src="/logo - JCRM.jpeg"
            alt="JCRM Technologies"
            className="mx-auto mb-3 h-20 w-20 rounded-full object-contain bg-white shadow-[0_8px_24px_rgba(0,85,255,0.25)]"
          />
          <h1 id="admin-login-title" className="heading-font text-xl font-extrabold text-white tracking-tight">
            Admin Sign In
          </h1>
          <p className="mt-1 text-xs text-slate-400 font-medium">
            Authorized personnel only
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300 mb-1.5">
              Email
            </label>
            <input
              type="email"
              required
              autoFocus
              placeholder="admin@jcrmtechnologies.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-xs font-semibold text-slate-400 hover:text-white cursor-pointer"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-slate-950/80 border border-slate-700/80 text-white placeholder:text-slate-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:border-transparent"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-2xl text-sm font-extrabold text-white bg-gradient-to-r from-[#0055FF] to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg shadow-blue-500/25 hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isLoading ? "Signing in..." : "Access Admin Console →"}
          </button>
        </form>
      </div>
    </div>
  );
}
