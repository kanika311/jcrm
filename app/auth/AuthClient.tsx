"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import PhoneInput, { isPossiblePhoneNumber } from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { auth } from "@/lib/firebase";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

export default function AuthClient({ cmsData }: { cmsData: any }) {
  const [isLogin, setIsLogin] = useState(true);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [pendingSignupVerification, setPendingSignupVerification] = useState<"none" | "choose" | "email" | "phone">("none");
  const [signupVerifyMethod, setSignupVerifyMethod] = useState<"email" | "phone">("email");
  
  // New OTP States
  const [loginMethod, setLoginMethod] = useState<"password" | "emailOtp" | "phoneOtp">("password");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/student";

  useEffect(() => {
    const error = searchParams.get("error");
    if (error) {
      setErrorMsg(error);
    }
  }, [searchParams]);

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    
    if (!isLogin) {
      if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
        setErrorMsg("Please enter a valid phone number.");
        setIsLoading(false);
        return;
      }

      await handleSendSignupOtp(signupVerifyMethod);
      return;
    }

    // Normal Login Flow
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    setIsLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
    } else {
      // Fetch session to determine role and route correctly
      try {
        const sessionRes = await fetch("/api/auth/session");
        const sessionData = await sessionRes.json();
        const role = sessionData?.user?.role;
        
        let redirectUrl = callbackUrl;
        try {
          const parsedUrl = new URL(redirectUrl, window.location.origin);
          if (parsedUrl.pathname === "/student") {
            if (role === "ADMIN") redirectUrl = "/admin";
            else if (role === "INSTRUCTOR") redirectUrl = "/faculty";
          }
        } catch (e) {
          if (redirectUrl === "/student") {
            if (role === "ADMIN") redirectUrl = "/admin";
            else if (role === "INSTRUCTOR") redirectUrl = "/faculty";
          }
        }
        
        router.push(redirectUrl);
        router.refresh();
      } catch (err) {
        router.push(callbackUrl);
        router.refresh();
      }
    }
  };

  const setupRecaptcha = () => {
    if (!(window as any).recaptchaVerifier) {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
      });
    }
  };

  const handleSendOtp = async () => {
    setIsLoading(true);
    setErrorMsg("");

    try {
      if (loginMethod === "emailOtp") {
        if (!email) throw new Error("Please enter an email");
        
        const res = await fetch("/api/auth/send-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to send OTP");
        }
        
        setOtpSent(true);
      } else if (loginMethod === "phoneOtp") {
        if (!phoneNumber || !isPossiblePhoneNumber(phoneNumber)) {
          throw new Error("Please enter a valid phone number");
        }

        try {
          setupRecaptcha();
          const appVerifier = (window as any).recaptchaVerifier;
          const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
          setConfirmationResult(result);
          setOtpSent(true);
        } catch (firebaseErr: any) {
          console.warn("Firebase login SMS failed, falling back to Local Mock Mode:", firebaseErr);
          if (
            firebaseErr.message?.includes("api-key-not-valid") || 
            firebaseErr.message?.includes("invalid-api-key") || 
            firebaseErr.message?.includes("auth/api-key-not-valid") ||
            window.location.hostname === "localhost"
          ) {
            setConfirmationResult({
              confirm: async (code: string) => {
                console.log("Mock Phone Login verification code confirmed:", code);
                return { user: { getIdToken: async () => "mock-token" } };
              }
            });
            setOtpSent(true);
            setErrorMsg("Notice: Real Firebase SMS failed (API Key invalid). Switched to Local Mock Mode. Enter any 6-digit code to verify.");
          } else {
            throw firebaseErr;
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
      if ((window as any).recaptchaVerifier) {
        (window as any).recaptchaVerifier.render().then((widgetId: any) => {
          (window as any).grecaptcha.reset(widgetId);
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      let res;
      if (loginMethod === "emailOtp") {
        res = await signIn("email-otp", {
          redirect: false,
          email,
          otp: otpCode,
        });
      } else if (loginMethod === "phoneOtp") {
        if (!confirmationResult) throw new Error("No confirmation result");
        
        const result = await confirmationResult.confirm(otpCode);
        const idToken = await result.user.getIdToken();
        
        res = await signIn("phone-otp", {
          redirect: false,
          idToken,
        });
      }

      setIsLoading(false);

      if (res?.error) {
        setErrorMsg(res.error);
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid OTP");
      setIsLoading(false);
    }
  };

  const handleSendSignupOtp = async (type: "email" | "phone") => {
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (type === "email") {
        const res = await fetch("/api/auth/send-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.message || "Failed to send OTP");
        }
        setPendingSignupVerification("email");
      } else {
        try {
          setupRecaptcha();
          const appVerifier = (window as any).recaptchaVerifier;
          const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
          setConfirmationResult(result);
          setPendingSignupVerification("phone");
        } catch (firebaseErr: any) {
          console.warn("Firebase signup SMS failed, falling back to Local Mock Mode:", firebaseErr);
          if (
            firebaseErr.message?.includes("api-key-not-valid") || 
            firebaseErr.message?.includes("invalid-api-key") || 
            firebaseErr.message?.includes("auth/api-key-not-valid") ||
            window.location.hostname === "localhost"
          ) {
            setConfirmationResult({
              confirm: async (code: string) => {
                console.log("Mock Phone Signup verification code confirmed:", code);
                return { user: { getIdToken: async () => "mock-token" } };
              }
            });
            setPendingSignupVerification("phone");
            setErrorMsg("Notice: Real Firebase SMS failed (API Key invalid). Switched to Local Mock Mode. Enter any 6-digit code to verify.");
          } else {
            throw firebaseErr;
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const executeFinalSignup = async () => {
    const signupRes = await fetch("/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, password, phoneNumber, role: "STUDENT" }),
    });

    if (!signupRes.ok) {
      const data = await signupRes.json();
      throw new Error(data.message || "Failed to create account");
    }
    
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      throw new Error(res.error);
    } else {
      router.push("/onboarding");
      router.refresh();
    }
  };

  const handleVerifySignupOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");
    try {
      if (pendingSignupVerification === "email") {
        const verifyRes = await fetch("/api/auth/verify-email-otp", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: otpCode }),
        });
        if (!verifyRes.ok) {
          const data = await verifyRes.json();
          throw new Error(data.message || "Invalid OTP");
        }
        await executeFinalSignup();
      } else if (pendingSignupVerification === "phone") {
        if (!confirmationResult) throw new Error("No confirmation result");
        await confirmationResult.confirm(otpCode);
        await executeFinalSignup();
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Invalid OTP or Account creation failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
       {/* Left side (Visual) */}
       <div className="hidden lg:flex lg:w-1/2 relative bg-[#0B0F19] overflow-hidden flex-col justify-between p-12 border-r" style={{ borderColor: 'var(--border-soft)' }}>
          <div className="absolute inset-0 dot-grid opacity-30"></div>
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 mix-blend-screen" style={{ background: 'var(--accent-primary)' }}></div>
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[120px] opacity-40 mix-blend-screen" style={{ background: 'var(--accent-cyan)' }}></div>
          
          <Link href="/" className="relative z-10 flex items-center gap-2 group w-max">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#0EA5E9] p-0.5">
                <div className="w-full h-full bg-[#0B0F19] rounded-full flex items-center justify-center">
                   <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
             </div>
             <span className="heading-font text-2xl font-bold text-white tracking-tight">JCRM Technology</span>
          </Link>

          <div className="relative z-10 max-w-lg mt-20">
             <h1 className="text-5xl font-bold text-white mb-6 leading-tight">
                {cmsData?.heading ? (
                   <span dangerouslySetInnerHTML={{ __html: cmsData.heading.replace('mastery starts here.', '<span class="shimmer-text">mastery starts here.</span>') }} />
                ) : (
                   <>Your journey to <br/> <span className="shimmer-text">mastery starts here.</span></>
                )}
             </h1>
             
             <div className="space-y-6 mt-12">
                {(cmsData?.bulletPoints && cmsData.bulletPoints.filter((b: any) => b.isActive !== false).length > 0) ? (
                  cmsData.bulletPoints.filter((b: any) => b.isActive !== false).map((item: any, i: number) => (
                     <div key={i} className="flex items-center gap-4 text-white/80">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                           <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span className="text-lg">{item.text}</span>
                     </div>
                  ))
                ) : (
                  [
                     "Build production-ready applications.",
                     "Learn from senior engineers at top tech companies.",
                     "Earn verifiable credentials employers trust."
                  ].map((item, i) => (
                     <div key={i} className="flex items-center gap-4 text-white/80">
                        <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 border border-white/20">
                           <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/></svg>
                        </div>
                        <span className="text-lg">{item}</span>
                     </div>
                  ))
                )}
             </div>
          </div>

          <div className="relative z-10 mt-auto pt-20">
             <div className="glass-md p-6 rounded-2xl border border-white/10 text-white/90 shadow-2xl">
                <div className="flex gap-1 text-amber-400 mb-3 text-sm">★★★★★</div>
                <p className="italic mb-4">"The best investment I've made in my career. The curriculum is exactly what you need to pass senior engineering loops."</p>
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center font-bold">DK</div>
                   <div>
                      <div className="font-bold text-sm">David Kim</div>
                      <div className="text-xs text-white/60">Software Engineer at Vercel</div>
                   </div>
                </div>
             </div>
          </div>
       </div>

       {/* Right side (Form) */}
       <div className="w-full lg:w-1/2 flex items-center justify-center p-8 relative" style={{ background: 'var(--bg-base)' }}>
          {/* Mobile Logo */}
          <Link href="/" className="lg:hidden absolute top-8 left-8 flex items-center gap-2">
             <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#0EA5E9] p-0.5">
                <div className="w-full h-full rounded-full" style={{ background: 'var(--bg-base)' }}></div>
             </div>
          </Link>

          <div className="max-w-md w-full animate-fade-in-up">
              <div>
                 <div className="text-center mb-8">
                    <h2 className="heading-font text-3xl font-bold mb-2">
                       {isLogin ? "Welcome Back" : "Create an Account"}
                    </h2>
                    <p style={{ color: 'var(--text-secondary)' }}>{isLogin ? 'Sign in to continue to your dashboard' : 'Create an account to start your journey'}</p>
                 </div>

                 {errorMsg && (
                   <div className="p-4 mb-6 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-semibold text-center">
                     {errorMsg}
                   </div>
                 )}
                 
                 <div className="flex bg-black/5 p-1 rounded-xl mb-6" style={{ background: 'var(--bg-surface)' }}>
                    <button onClick={() => { setIsLogin(true); setLoginMethod("password"); setPendingSignupVerification("none"); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} style={isLogin ? {background: 'var(--bg-card)'} : {}}>Sign In</button>
                    <button onClick={() => { setIsLogin(false); setLoginMethod("password"); setPendingSignupVerification("none"); }} className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} style={!isLogin ? {background: 'var(--bg-card)'} : {}}>Sign Up</button>
                 </div>

                 <div className="space-y-4 mb-6">
                    <button 
                      onClick={handleGoogleLogin}
                      className="w-full flex items-center justify-center gap-3 py-3 rounded-xl border border-gray-300 bg-white text-gray-800 font-bold hover:bg-gray-50 transition-colors shadow-sm"
                    >
                      <svg className="w-5 h-5" viewBox="0 0 24 24">
                         <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                         <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                         <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                         <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                      </svg>
                      Continue with Google
                    </button>
                 </div>

                 <div className="relative mb-6">
                   <div className="absolute inset-0 flex items-center">
                     <div className="w-full border-t border-gray-200" style={{ borderColor: 'var(--border-soft)' }}></div>
                   </div>
                   <div className="relative flex justify-center text-sm">
                     <span className="px-2" style={{ background: 'var(--bg-base)', color: 'var(--text-secondary)' }}>Or choose a sign-in method</span>
                   </div>
                 </div>

                 {pendingSignupVerification !== "none" ? (
                    <div>
                       {pendingSignupVerification === "choose" && (
                         <div className="space-y-4 animate-fade-in-up text-center">
                            <h3 className="text-xl font-bold mb-4">Verify Your Identity</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>Choose a method to verify your account. You can verify the other method later in your profile.</p>
                            <button onClick={() => handleSendSignupOtp("email")} disabled={isLoading} className="btn-secondary w-full py-3 rounded-xl font-bold">
                              Send Code via Email
                            </button>
                            <button onClick={() => handleSendSignupOtp("phone")} disabled={isLoading} className="btn-secondary w-full py-3 rounded-xl font-bold">
                              Send Code via SMS
                            </button>
                            <button onClick={() => setPendingSignupVerification("none")} className="text-sm mt-4 underline text-gray-500">Back</button>
                         </div>
                       )}
                       
                       {(pendingSignupVerification === "email" || pendingSignupVerification === "phone") && (
                         <form onSubmit={handleVerifySignupOtp} className="space-y-5 animate-fade-in-up text-center">
                            <h3 className="text-xl font-bold mb-2">Enter Verification Code</h3>
                            <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                              Sent to {pendingSignupVerification === "email" ? email : phoneNumber}
                            </p>
                            <input
                              type="text"
                              maxLength={6}
                              value={otpCode}
                              onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                              placeholder="000000"
                              className="input-premium w-full text-center text-3xl tracking-[1em] py-4 rounded-xl font-mono font-bold"
                              required
                            />
                            <button type="submit" disabled={isLoading || otpCode.length < 6} className="btn-primary w-full py-4 rounded-xl text-lg font-bold">
                              {isLoading ? "Verifying..." : "Verify & Create Account"}
                            </button>
                            <button type="button" onClick={() => setPendingSignupVerification("none")} className="text-sm mt-4 underline text-gray-500">Back to Signup</button>
                         </form>
                       )}
                    </div>
                 ) : (
                    <>
                       {/* Login Method Tabs */}
                       {isLogin && !otpSent && (
                   <div className="flex bg-black/5 p-1 rounded-xl mb-6" style={{ background: 'var(--bg-surface)' }}>
                      <button onClick={() => setLoginMethod("password")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginMethod === "password" ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} style={loginMethod === "password" ? {background: 'var(--bg-card)'} : {}}>Password</button>
                      <button onClick={() => setLoginMethod("emailOtp")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginMethod === "emailOtp" ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} style={loginMethod === "emailOtp" ? {background: 'var(--bg-card)'} : {}}>Email OTP</button>
                      <button onClick={() => setLoginMethod("phoneOtp")} className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${loginMethod === "phoneOtp" ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`} style={loginMethod === "phoneOtp" ? {background: 'var(--bg-card)'} : {}}>Phone OTP</button>
                   </div>
                 )}

                 <form onSubmit={otpSent ? handleVerifyOtp : (loginMethod === "password" ? handleSubmit : handleSendOtp)} className="space-y-5">
                    {otpSent ? (
                       <div className="animate-fade-in-up">
                          <label className="block text-sm font-medium mb-2">Enter the 6-digit code</label>
                          <input 
                            type="text" 
                            required 
                            className="input-premium w-full px-4 py-3 rounded-xl text-center text-2xl tracking-widest font-bold" 
                            placeholder="••••••" 
                            value={otpCode}
                            onChange={(e) => setOtpCode(e.target.value)}
                            maxLength={6}
                          />
                          <button type="button" onClick={() => setOtpSent(false)} className="mt-4 text-sm text-[var(--text-secondary)] hover:underline">
                             Use a different method
                          </button>
                       </div>
                    ) : (
                       <>
                          {!isLogin && loginMethod === "password" && (
                             <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="Jane Doe" />
                             </div>
                          )}
                          
                          {(loginMethod === "password" || loginMethod === "emailOtp") && (
                             <div>
                                <label className="block text-sm font-medium mb-2">Email</label>
                                <input 
                                  type="email" 
                                  required 
                                  className="input-premium w-full px-4 py-3 rounded-xl" 
                                  placeholder="jane@example.com" 
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                             </div>
                          )}

                          {(!isLogin && loginMethod === "password") && (
                             <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <PhoneInput
                                  international
                                  defaultCountry="IN"
                                  value={phoneNumber}
                                  onChange={(val) => setPhoneNumber(val?.toString() || "")}
                                  className="input-premium w-full px-4 py-3 rounded-xl phone-input-container"
                                />
                             </div>
                          )}

                          {loginMethod === "phoneOtp" && (
                             <div>
                                <label className="block text-sm font-medium mb-2">Phone Number</label>
                                <PhoneInput
                                  international
                                  defaultCountry="IN"
                                  value={phoneNumber}
                                  onChange={(val) => setPhoneNumber(val?.toString() || "")}
                                  className="input-premium w-full px-4 py-3 rounded-xl phone-input-container"
                                />
                             </div>
                          )}
                          
                          {loginMethod === "password" && (
                             <div>
                                <div className="flex justify-between items-center mb-2">
                                   <label className="block text-sm font-medium">Password</label>
                                   {isLogin && <Link href="#" className="text-xs font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>Forgot?</Link>}
                                </div>
                                <input 
                                  type="password" 
                                  required 
                                  className="input-premium w-full px-4 py-3 rounded-xl" 
                                  placeholder="••••••••" 
                                  value={password}
                                  onChange={(e) => setPassword(e.target.value)}
                                />
                             </div>
                          )}
                          
                          {!isLogin && (
                              <div>
                                 <label className="block text-sm font-medium mb-2">Preferred Verification Method</label>
                                 <div className="flex gap-6 p-4 rounded-xl" style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-soft)' }}>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                       <input 
                                          type="radio" 
                                          name="signupVerifyMethod" 
                                          value="email" 
                                          checked={signupVerifyMethod === "email"} 
                                          onChange={() => setSignupVerifyMethod("email")}
                                          className="w-4 h-4 accent-[#7C3AED]"
                                       />
                                       Verify Email
                                    </label>
                                    <label className="flex items-center gap-2 cursor-pointer text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                                       <input 
                                          type="radio" 
                                          name="signupVerifyMethod" 
                                          value="phone" 
                                          checked={signupVerifyMethod === "phone"} 
                                          onChange={() => setSignupVerifyMethod("phone")}
                                          className="w-4 h-4 accent-[#7C3AED]"
                                       />
                                       Verify Phone Number
                                    </label>
                                 </div>
                              </div>
                           )}
                          
                          <div id="recaptcha-container"></div>
                       </>
                    )}

                    <button type="submit" disabled={isLoading} className="btn-primary w-full py-4 rounded-xl text-lg font-bold flex justify-center items-center mt-6">
                       {isLoading ? (
                          <svg className="animate-spin h-6 w-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                       ) : (
                          otpSent ? "Verify Code" : 
                          (loginMethod === "password" ? (isLogin ? "Continue to Dashboard" : "Create Account") : "Send OTP Code")
                       )}
                    </button>
                 </form>
                    </>
                 )}
              </div>
          </div>
       </div>
    </div>
  );
}
