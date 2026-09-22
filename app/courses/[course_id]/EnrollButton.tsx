"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useSession } from "next-auth/react";

interface EnrollButtonProps {
  courseId: string;
  courseTitle?: string;
  coursePrice?: number;
  price?: number;
  initialEnrolled?: boolean;
  isEnrolled?: boolean;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function EnrollButton({
  courseId,
  courseTitle = "Course",
  coursePrice,
  price,
  initialEnrolled = false,
  isEnrolled = false,
}: EnrollButtonProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const isLoggedIn = !!session?.user;
  const enrolled = initialEnrolled || isEnrolled;
  const finalPrice = coursePrice !== undefined ? coursePrice : (price || 0);

  // Load checkout.js helper
  const loadRazorpayScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (typeof window !== "undefined" && window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleEnrollOrBuy = async () => {
    setErrorMessage(null);

    // If not logged in, redirect to login with callback
    if (!isLoggedIn) {
      router.push(`/auth?callbackUrl=/courses/${courseId}`);
      return;
    }

    setLoading(true);

    try {
      // 1. Create Order on Backend
      const orderRes = await fetch("/api/payments/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });

      const orderData = await orderRes.json();

      if (!orderRes.ok || orderData.error) {
        setErrorMessage(orderData.error || "Failed to initiate payment");
        setLoading(false);
        return;
      }

      // If already enrolled
      if (orderData.alreadyEnrolled) {
        router.push("/student/courses");
        return;
      }

      // If course is free
      if (orderData.freeEnrollment) {
        alert("🎉 Congratulations! You have successfully enrolled in this course.");
        router.push("/student/courses");
        return;
      }

      // 2. Load Razorpay script
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        setErrorMessage("Failed to load Razorpay payment gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay Checkout Modal
      const options = {
        key: orderData.key,
        amount: orderData.amount,
        currency: orderData.currency || "INR",
        name: "JCRM Technologies",
        description: `Enrollment: ${orderData.courseTitle || courseTitle}`,
        image: "/logo - JCRM.jpeg",
        order_id: orderData.orderId,
        prefill: {
          name: orderData.user?.name || "",
          email: orderData.user?.email || "",
        },
        theme: {
          color: "#0055FF",
        },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          try {
            // 4. Verify payment on Backend
            const verifyRes = await fetch("/api/payments/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                courseId,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyRes.ok && verifyData.success) {
              alert("Payment Successful! Course has been added to My Courses.");
              router.push("/student/courses");
            } else {
              setErrorMessage(verifyData.error || "Payment verification failed. Please contact support.");
              setLoading(false);
            }
          } catch {
            setErrorMessage("Error verifying payment transaction.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.on("payment.failed", (resp: any) => {
        setErrorMessage(resp.error?.description || "Payment failed. Please try again.");
        setLoading(false);
      });

      razorpayInstance.open();
    } catch {
      setErrorMessage("Something went wrong while initiating payment.");
      setLoading(false);
    }
  };

  if (enrolled) {
    return (
      <div className="w-full space-y-2">
        <Link
          href="/student/courses"
          className="w-full py-4 px-6 rounded-xl font-extrabold text-base bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
        >
          <span>✓ Enrolled — Go to My Courses</span>
        </Link>
        <span className="text-center text-xs text-slate-400 block">
          You have active access to this course
        </span>
      </div>
    );
  }

  return (
    <div className="w-full space-y-3">
      {errorMessage && (
        <div className="p-3 text-xs font-bold rounded-xl bg-rose-50 border border-rose-200 text-rose-600">
          ⚠️ {errorMessage}
        </div>
      )}

      <button
        type="button"
        onClick={handleEnrollOrBuy}
        disabled={loading}
        className="w-full py-4 px-6 rounded-xl font-extrabold text-base text-white bg-[#0055FF] hover:bg-blue-600 shadow-xl shadow-blue-500/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] cursor-pointer disabled:opacity-60"
      >
        {loading ? (
          <>
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            Opening Payment Gateway...
          </>
        ) : (
          <>
            <span>🔒 Buy Course — ₹{Number(finalPrice).toLocaleString()}</span>
          </>
        )}
      </button>

      <div className="flex items-center justify-center gap-4 text-[11px] text-slate-400 font-semibold">
        <span>✓ Instant Access</span>
        <span>•</span>
        <span>✓ Razorpay Secure</span>
        <span>•</span>
        <span>✓ Lifetime Validity</span>
      </div>
    </div>
  );
}
