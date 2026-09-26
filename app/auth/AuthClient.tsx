"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";

export default function AuthClient({ cmsData }: { cmsData: any }) {
  // Mode: "login" or "signup"
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  
  // Role for Signup: "STUDENT" or "INSTRUCTOR"
  const [signupRole, setSignupRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");
  const [loginRole, setLoginRole] = useState<"STUDENT" | "INSTRUCTOR">("STUDENT");

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // States
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  useEffect(() => {
    const error = searchParams.get("error");
    if (!error) return;

    const oauthMessages: Record<string, string> = {
      OAuthSignin: "Google sign-in is not configured. Use email and password, or add GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.",
      OAuthCallback: "Google sign-in failed after redirect. Check the Google Cloud callback URL.",
      OAuthCreateAccount: "Could not create an account from Google. Try email signup instead.",
      OAuthAccountNotLinked: "This email is already registered. Sign in with email and password.",
      AccessDenied: "Google sign-in was cancelled or denied.",
      Configuration: "Login is misconfigured. Check NEXTAUTH_SECRET and Google keys in .env.",
      Default: "Sign-in failed. Try email and password.",
    };
    setErrorMsg(oauthMessages[error] || error);
  }, [searchParams]);

  // Route user according to their verified role
  const routeByRole = async () => {
    try {
      const sessionRes = await fetch("/api/auth/session");
      const sessionData = await sessionRes.json();
      const role = sessionData?.user?.role;

      // STRICT CHECK: Admin is NEVER allowed to log in from the public /auth portal
      if (role === "ADMIN") {
        await import("next-auth/react").then(m => m.signOut({ redirect: false }));
        setErrorMsg("Access Denied: Administrators must sign in through the Admin Console (/jcrm-sushant).");
        setIsLoading(false);
        return;
      }

      // Role match check for login
      if (activeTab === "login") {
        if (loginRole === "INSTRUCTOR" && role !== "INSTRUCTOR") {
          await import("next-auth/react").then(m => m.signOut({ redirect: false }));
          setErrorMsg("This account is registered as a Student. Please select 'Student' role to sign in.");
          setIsLoading(false);
          return;
        }
        if (loginRole === "STUDENT" && role !== "STUDENT") {
          await import("next-auth/react").then(m => m.signOut({ redirect: false }));
          setErrorMsg("This account is registered as an Instructor. Please select 'Teacher / Faculty' role to sign in.");
          setIsLoading(false);
          return;
        }
      }

      if (callbackUrl && callbackUrl !== "/student") {
        router.push(callbackUrl);
      } else if (role === "INSTRUCTOR") {
        router.push("/faculty");
      } else {
        router.push("/student");
      }
      router.refresh();
    } catch {
      router.push(signupRole === "INSTRUCTOR" ? "/faculty" : "/student");
      router.refresh();
    }
  };

  // 1. Handle Login Submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim(),
        password,
      });

      if (res?.error) {
        setErrorMsg(res.error || "Invalid email or password");
        setIsLoading(false);
        return;
      }

      await routeByRole();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to log in");
      setIsLoading(false);
    }
  };

  // 2. Handle Signup Submit (Students & Teachers with Email & Phone)
  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    setSuccessMsg("");

    if (!fullName.trim()) {
      setErrorMsg("Please enter your full name.");
      setIsLoading(false);
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Please enter a valid email address.");
      setIsLoading(false);
      return;
    }

    if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
      setErrorMsg("Please enter a valid phone number with country code.");
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // Call public signup API with selected role (STUDENT or INSTRUCTOR)
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          phoneNumber,
          password,
          role: signupRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to create account");
      }

      setSuccessMsg("Account created successfully! Logging you in...");

      // Automatically sign in the newly registered user
      const loginRes = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (loginRes?.error) {
        // Fallback: switch to login tab with pre-filled email
        setActiveTab("login");
        setErrorMsg("Account created. Please enter your password to sign in.");
        setIsLoading(false);
      } else {
        await routeByRole();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Signup failed. Please try again.");
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/student" });
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side (Visual branding) */}
      <div 
        className="hidden lg:flex lg:w-1/2 relative bg-[#0B0F19] overflow-hidden flex-col justify-between p-12 border-r"
        style={{ borderColor: "var(--border-soft)" }}
      >
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-30 bg-[#0055FF] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px] opacity-30 bg-sky-500 pointer-events-none" />

        {/* Top Logo */}
        <Link href="/" className="relative z-10 flex items-center gap-3 group w-max">
          <img
            src="/logo - JCRM.jpeg"
            alt="JCRM Technologies"
            className="w-11 h-11 rounded-full object-contain bg-white shrink-0 shadow-lg shadow-blue-500/25"
          />
          <div>
            <span className="heading-font text-2xl font-extrabold text-white tracking-tight">
              JCRM Technologies
            </span>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Learning & Mentorship Portal
            </span>
          </div>
        </Link>

        {/* Left Value Prop */}
        <div className="relative z-10 max-w-lg mt-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/15 border border-blue-500/30 text-[#38bdf8] text-xs font-extrabold mb-4">
            🚀 LEARN, BUILD & TEACH WITH THE BEST
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-6 leading-tight tracking-tight">
            Accelerate your tech career with <span className="text-[#38bdf8]">industry-standard</span> learning.
          </h1>

          <div className="space-y-4 mt-8">
            {[
              { title: "For Students & Interns", desc: "Hands-on projects, industry certifications & direct mentor reviews." },
              { title: "For Teachers & Instructors", desc: "Design syllabus, publish course tracks & guide next-gen engineers." },
              { title: "Placement & Verification", desc: "100% placement assisted tracks with verifiable portfolio profiles." },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3.5 text-white/90">
                <div className="w-6 h-6 rounded-full bg-blue-500/20 text-[#38bdf8] flex items-center justify-center shrink-0 border border-blue-400/30 font-bold text-xs mt-0.5">
                  ✓
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{item.title}</div>
                  <div className="text-xs text-slate-400">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust Testimonial */}
        <div className="relative z-10 mt-auto pt-12">
          <div className="p-5 rounded-2xl bg-white/[0.04] backdrop-blur-md border border-white/10 text-white/90">
            <div className="flex gap-1 text-amber-400 mb-2 text-xs">★★★★★</div>
            <p className="text-xs italic text-slate-300 mb-3">
              &quot;The curriculum and mentoring at JCRM helped me master full stack architectures and clear senior engineering interviews.&quot;
            </p>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-500/30 border border-blue-400/40 flex items-center justify-center font-bold text-xs text-white">
                AK
              </div>
              <div>
                <div className="font-bold text-xs text-white">Akasha S</div>
                <div className="text-[11px] text-slate-400">AI/ML Engineer, JCRM Alumni</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side (Form Container) */}
      <div 
        className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative overflow-y-auto"
        style={{ background: "var(--bg-base, #ffffff)" }}
      >
        {/* Mobile Header Logo */}
        <Link href="/" className="lg:hidden absolute top-6 left-6 flex items-center gap-2">
          <img
            src="/logo - JCRM.jpeg"
            alt="JCRM Technologies"
            className="w-9 h-9 rounded-full object-contain bg-white shrink-0"
          />
          <span className="font-extrabold text-slate-900 text-lg">JCRM</span>
        </Link>

        <div className="max-w-md w-full pt-12 lg:pt-0 my-auto">
          
          {/* Main Auth Card */}
          <div className="space-y-6">
            
            {/* Header */}
            <div className="text-center">
              <h2 className="heading-font text-3xl font-extrabold text-slate-900 mb-1.5 tracking-tight">
                {activeTab === "login" ? "Welcome Back" : "Join JCRM Technologies"}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                {activeTab === "login"
                  ? "Sign in to access your student or instructor dashboard"
                  : ""}
              </p>
            </div>

            {/* TAB SELECTOR (Sign In vs Create Account) */}
            <div className="flex p-1 rounded-2xl bg-slate-100 border border-slate-200/80">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("login");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === "login"
                    ? "bg-white text-[#0055FF] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("signup");
                  setErrorMsg("");
                  setSuccessMsg("");
                }}
                className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold transition-all cursor-pointer ${
                  activeTab === "signup"
                    ? "bg-white text-[#0055FF] shadow-sm"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                Create Account
              </button>
            </div>

            {/* Notifications */}
            {errorMsg && (
              <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-xs font-semibold flex items-start gap-2.5">
                <span className="text-sm shrink-0">⚠️</span>
                <span>{errorMsg}</span>
              </div>
            )}

            {successMsg && (
              <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold flex items-start gap-2.5">
                <span className="text-sm shrink-0">✓</span>
                <span>{successMsg}</span>
              </div>
            )}

            {/* ======================================================== */}
            {/* 1. SIGN IN FORM */}
            {/* ======================================================== */}
            {activeTab === "login" ? (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                {/* ROLE PICKER FOR LOGIN */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                    Sign In As:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole("STUDENT");
                        setErrorMsg("");
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        loginRole === "STUDENT"
                          ? "border-[#0055FF] bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">🎓</span>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          loginRole === "STUDENT" ? "border-[#0055FF] bg-[#0055FF]" : "border-slate-300"
                        }`}>
                          {loginRole === "STUDENT" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">Student</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        Course & lab portal
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setLoginRole("INSTRUCTOR");
                        setErrorMsg("");
                      }}
                      className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                        loginRole === "INSTRUCTOR"
                          ? "border-[#0055FF] bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-base">👨‍🏫</span>
                        <div className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                          loginRole === "INSTRUCTOR" ? "border-[#0055FF] bg-[#0055FF]" : "border-slate-300"
                        }`}>
                          {loginRole === "INSTRUCTOR" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">Teacher / Faculty</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        Instructor workspace
                      </div>
                    </button>
                  </div>
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="student@example.com or teacher@jcrm.in"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs font-bold text-[#0055FF] hover:underline"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••••••"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing In...
                    </>
                  ) : (
                    "Sign In to Dashboard →"
                  )}
                </button>

                {/* Google Sign In Divider */}
                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200" />
                  </div>
                  <div className="relative flex justify-center text-[11px] font-bold text-slate-400 uppercase">
                    <span className="bg-white px-2">Or continue with</span>
                  </div>
                </div>

                {/* Google Button */}
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full py-3 rounded-2xl text-xs sm:text-sm font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-all flex items-center justify-center gap-2.5 cursor-pointer"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  Continue with Google
                </button>
              </form>
            ) : (
              /* ======================================================== */
              /* 2. SIGN UP FORM (Students & Teachers with Email & Phone) */
              /* ======================================================== */
              <form onSubmit={handleSignupSubmit} className="space-y-4">
                
                {/* ROLE PICKER: STUDENT VS TEACHER */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-2">
                    I am joining as:
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSignupRole("STUDENT")}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        signupRole === "STUDENT"
                          ? "border-[#0055FF] bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">🎓</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          signupRole === "STUDENT" ? "border-[#0055FF] bg-[#0055FF]" : "border-slate-300"
                        }`}>
                          {signupRole === "STUDENT" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">Student</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        Enroll in courses & labs
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSignupRole("INSTRUCTOR")}
                      className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                        signupRole === "INSTRUCTOR"
                          ? "border-[#0055FF] bg-blue-50/70 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xl">👨‍🏫</span>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                          signupRole === "INSTRUCTOR" ? "border-[#0055FF] bg-[#0055FF]" : "border-slate-300"
                        }`}>
                          {signupRole === "INSTRUCTOR" && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>
                      <div className="text-xs font-extrabold text-slate-900">Teacher / Faculty</div>
                      <div className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5">
                        Create & mentor courses
                      </div>
                    </button>
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                  />
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. rahul@gmail.com"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* Phone Number with Country Code */}
                <div>
                  <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600 mb-1.5">
                    Phone Number (Required)
                  </label>
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1 focus-within:ring-2 focus-within:ring-[#0055FF] focus-within:bg-white transition-all">
                    <PhoneInput
                      international
                      defaultCountry="IN"
                      value={phoneNumber}
                      onChange={(value) => setPhoneNumber(value || "")}
                      className="text-xs sm:text-sm font-medium py-1.5"
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-600">
                      Create Password
                    </label>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-xs font-bold text-[#0055FF] hover:underline"
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Minimum 6 characters"
                    className="w-full px-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#0055FF] focus:bg-white transition-all"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                {/* Submit Signup Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3.5 rounded-2xl text-xs sm:text-sm font-extrabold text-white bg-[#0055FF] hover:bg-blue-600 transition-all shadow-md shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99] cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Creating Account...
                    </>
                  ) : (
                    `Complete ${signupRole === "INSTRUCTOR" ? "Teacher" : "Student"} Registration →`
                  )}
                </button>
              </form>
            )}

            {/* Bottom Help Text */}
            <div className="text-center pt-2 text-xs text-slate-500 font-medium">
              By continuing, you agree to JCRM Technologies&apos;{" "}
              <Link href="/legal" className="text-[#0055FF] hover:underline">Terms</Link> &{" "}
              <Link href="/legal" className="text-[#0055FF] hover:underline">Privacy Policy</Link>.
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}