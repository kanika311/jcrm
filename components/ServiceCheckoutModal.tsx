"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ServiceCategory, ServicePlan } from "@/lib/servicesData";
import { FiX, FiLock, FiCheckCircle, FiShield, FiUser, FiPhone, FiMail } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";
import { useSession } from "next-auth/react";

interface ServiceCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  service: ServiceCategory;
  plan: ServicePlan;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function ServiceCheckoutModal({
  isOpen,
  onClose,
  service,
  plan,
}: ServiceCheckoutModalProps) {
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  const [customerName, setCustomerName] = useState(
    session?.user?.name || (session?.user as any)?.fullName || ""
  );
  const [customerEmail, setCustomerEmail] = useState(session?.user?.email || "");
  const [customerPhone, setCustomerPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successOrder, setSuccessOrder] = useState<any | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const totalAmount = plan.price;

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

  const handlePayNow = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerEmail.trim() || !customerPhone.trim()) {
      setErrorMsg("Please fill in your name, phone number, and email.");
      return;
    }

    setLoading(true);

    try {
      // 1. Create order on backend
      const res = await fetch("/api/services/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceId: service.id,
          planId: plan.id,
          customerName: customerName.trim(),
          customerEmail: customerEmail.trim(),
          customerPhone: customerPhone.trim(),
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || "Failed to initialize order.");
        setLoading(false);
        return;
      }

      // 2. Load Razorpay script
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        setErrorMsg("Could not load Razorpay gateway. Please check your internet connection.");
        setLoading(false);
        return;
      }

      // 3. Open Razorpay options
      const options = {
        key: data.key,
        amount: data.amount,
        currency: data.currency || "INR",
        name: "JCRM Technologies",
        description: `${service.title} - ${plan.name} Plan`,
        image: "/logo - JCRM.jpeg",
        order_id: data.orderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerPhone,
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
            const verifyRes = await fetch("/api/services/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                ...response,
                orderDetails: data,
              }),
            });

            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              setSuccessOrder(verifyData.order || data);
            } else {
              setErrorMsg(verifyData.error || "Payment verification failed. Please contact JCRM support.");
            }
          } catch {
            setErrorMsg("Network error while verifying payment.");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", (resp: any) => {
        setErrorMsg(resp.error?.description || "Payment was declined or cancelled.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello JCRM Team, I have booked ${service.title} (${plan.name} Plan - ₹${totalAmount.toLocaleString("en-IN")}). Order ID: ${successOrder?.id || successOrder?.orderId || ""}. Please connect to start the project.`
  );

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-blue-100 dark:border-slate-800 overflow-hidden my-auto">
        
        {/* Top Header Strip */}
        <div className="bg-gradient-to-r from-[#003B95] via-[#0055FF] to-[#0091FF] p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/20 hover:bg-white/30 text-white transition-all cursor-pointer"
            aria-label="Close"
          >
            <FiX className="w-5 h-5" />
          </button>

          <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-xs font-black tracking-wider uppercase mb-1.5">
            Instant Activation
          </span>
          <h3 className="text-xl sm:text-2xl font-black heading-font tracking-tight">
            {service.title}
          </h3>
          <p className="text-blue-100 text-xs sm:text-sm font-semibold mt-0.5">
            Selected Plan: <strong className="text-white uppercase">{plan.name}</strong>
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-7">
          {successOrder ? (
            /* Success State */
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <FiCheckCircle className="w-10 h-10" />
              </div>

              <div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white">
                  Payment Successful!
                </h4>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm mt-1">
                  Your order for <strong>{service.title} ({plan.name} Plan)</strong> has been confirmed!
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700 text-left text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Amount Paid:</span>
                  <span className="font-extrabold text-slate-900 dark:text-white">
                    ₹{totalAmount.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-medium">Client Name:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">{customerName}</span>
                </div>
                {successOrder.paymentId && (
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-medium">Payment ID:</span>
                    <span className="font-mono text-blue-600 font-bold">{successOrder.paymentId}</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2.5 justify-center pt-2">
                <a
                  href={`https://wa.me/918310531309?text=${whatsappMessage}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3 rounded-xl font-black text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <FaWhatsapp className="w-4 h-4" />
                  <span>Connect on WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl font-bold text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200 transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form (Simple: Name, Phone, Email) */
            <form onSubmit={handlePayNow} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold flex items-center gap-2">
                  <span>⚠️</span> {errorMsg}
                </div>
              )}

              {/* Total Payable Card (No GST breakdown) */}
              <div className="flex items-center justify-between p-4 rounded-2xl bg-blue-50/80 dark:bg-slate-800/80 border border-blue-100 dark:border-slate-700">
                <div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Total Amount
                  </span>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                    {plan.name} Plan ({service.title})
                  </span>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-[#0055FF]">
                  ₹{totalAmount.toLocaleString("en-IN")}
                </div>
              </div>

              {/* Simple Inputs: Name, Phone, Email */}
              <div className="space-y-3.5 pt-1">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Phone / WhatsApp Number <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. +91 9876543210"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                      type="email"
                      required
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. rahul@example.com"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-6 rounded-2xl font-black text-sm text-white bg-gradient-to-r from-[#0055FF] to-[#003B95] hover:opacity-95 shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-60"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      <span>Opening Razorpay Gateway...</span>
                    </>
                  ) : (
                    <>
                      <FiLock className="w-4 h-4" />
                      <span>Proceed to Pay ₹{totalAmount.toLocaleString("en-IN")}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center justify-center gap-3 text-[11px] text-slate-400 font-semibold pt-1">
                <span className="flex items-center gap-1">
                  <FiShield className="text-[#0055FF]" /> Razorpay 256-Bit Encrypted
                </span>
                <span>•</span>
                <span>Instant Confirmation</span>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
