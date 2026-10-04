"use client";

import { useState } from "react";
import { ServiceCategory, ServiceOrder, ServicePlan } from "@/lib/servicesData";
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiCheck,
  FiX,
  FiShoppingBag,
  FiPhone,
  FiMail,
  FiCheckCircle,
  FiClock,
  FiAward,
  FiCopy,
  FiArrowUp,
  FiArrowDown,
  FiTag,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { FaWhatsapp, FaCrown, FaGem } from "react-icons/fa";

interface Props {
  initialServices: ServiceCategory[];
  initialOrders: ServiceOrder[];
}

export default function ServicesManagementClient({
  initialServices,
  initialOrders,
}: Props) {
  const [activeTab, setActiveTab] = useState<"editor" | "orders">("editor");
  const [services, setServices] = useState<ServiceCategory[]>(initialServices);
  const [orders, setOrders] = useState<ServiceOrder[]>(initialOrders);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(
    initialServices[0]?.id || "srv_seo"
  );

  const [saving, setSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  // Modal for creating a new service
  const [showNewServiceModal, setShowNewServiceModal] = useState(false);
  const [newServiceTitle, setNewServiceTitle] = useState("");
  const [newServiceSlug, setNewServiceSlug] = useState("");

  const currentService =
    services.find((s) => s.id === selectedServiceId) || services[0];

  // Total revenue collected via services
  const totalRevenue = orders
    .filter((o) => o.status !== "CANCELLED")
    .reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // -------------------------------------------------------------
  // Service Updates
  // -------------------------------------------------------------
  const handleUpdateServiceField = (field: keyof ServiceCategory, val: any) => {
    setServices((prev) =>
      prev.map((s) => (s.id === currentService.id ? { ...s, [field]: val } : s))
    );
    setHasUnsavedChanges(true);
  };

  const handleCreateNewService = () => {
    if (!newServiceTitle.trim()) {
      alert("Please enter a service title.");
      return;
    }

    const slug =
      newServiceSlug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") ||
      newServiceTitle.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-");

    const newService: ServiceCategory = {
      id: `srv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      slug,
      title: newServiceTitle.trim(),
      headline: "TRANSFORM YOUR BUSINESS. ACHIEVE PEAK GROWTH.",
      subtitle: "INDUSTRY-LEADING PROFESSIONAL DIGITAL SOLUTIONS",
      badge: "GROW YOUR BUSINESS WITH JCRM",
      description: "Comprehensive digital growth solutions engineered for scalable performance and maximum ROI.",
      trustTag: "TRUSTED BY LEADING ENTERPRISES. DELIVERED WITH EXCELLENCE.",
      contactPhone: "+91 8310531309",
      contactEmail: "hr@jcrm.in",
      website: "www.jcrm.in",
      isActive: true,
      platforms: ["GOOGLE", "CHATGPT", "LINKEDIN"],
      highlights: [
        { title: "High Impact", subtitle: "Strategic execution", icon: "shield" },
        { title: "Proven Growth", subtitle: "Measurable metrics", icon: "trending-up" },
        { title: "Safe & Compliant", subtitle: "100% verified process", icon: "lock" },
        { title: "Real Results", subtitle: "Transparent ROI", icon: "bar-chart" },
      ],
      plans: [
        {
          id: `plan_${Date.now()}_1`,
          name: "ESSENTIAL",
          icon: "star",
          price: 9999,
          gstPercent: 0,
          period: "month",
          isPopular: false,
          isActive: true,
          features: [
            "Complete Core Strategy Setup",
            "Dedicated Project Manager",
            "Bi-Weekly Performance Reviews",
            "Priority Support Channel",
          ],
        },
        {
          id: `plan_${Date.now()}_2`,
          name: "ADVANCED",
          icon: "crown",
          badge: "MOST POPULAR",
          price: 19999,
          gstPercent: 0,
          period: "month",
          isPopular: true,
          isActive: true,
          features: [
            "Everything in Essential Plan",
            "Advanced Multi-Channel Scaling",
            "Custom Creative Assets & Audits",
            "Weekly Growth & Strategy Calls",
            "24/7 Priority Support",
          ],
        },
      ],
    };

    setServices((prev) => [...prev, newService]);
    setSelectedServiceId(newService.id);
    setNewServiceTitle("");
    setNewServiceSlug("");
    setShowNewServiceModal(false);
    setHasUnsavedChanges(true);
    setFeedbackMsg({
      type: "success",
      text: `Service "${newService.title}" created! Don't forget to click "Save All Changes".`,
    });
  };

  const handleDeleteService = (serviceId: string) => {
    if (services.length <= 1) {
      alert("You must keep at least one service category.");
      return;
    }
    const target = services.find((s) => s.id === serviceId);
    if (!confirm(`Are you sure you want to permanently delete the "${target?.title}" service and all its plans?`)) {
      return;
    }

    const filtered = services.filter((s) => s.id !== serviceId);
    setServices(filtered);
    setSelectedServiceId(filtered[0]?.id || "");
    setHasUnsavedChanges(true);
    setFeedbackMsg({
      type: "success",
      text: `Service "${target?.title}" removed from list. Click "Save All Changes" to persist.`,
    });
  };

  const handleDuplicateService = (serviceId: string) => {
    const target = services.find((s) => s.id === serviceId);
    if (!target) return;

    const cloned: ServiceCategory = {
      ...target,
      id: `srv_${Date.now()}_copy`,
      slug: `${target.slug}-copy`,
      title: `${target.title} (Copy)`,
      plans: target.plans.map((p) => ({
        ...p,
        id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      })),
    };

    setServices((prev) => [...prev, cloned]);
    setSelectedServiceId(cloned.id);
    setHasUnsavedChanges(true);
    setFeedbackMsg({
      type: "success",
      text: `Service cloned as "${cloned.title}".`,
    });
  };

  // -------------------------------------------------------------
  // Plan Updates
  // -------------------------------------------------------------
  const handleAddNewPlan = () => {
    const newPlan: ServicePlan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      name: "NEW TIER",
      icon: "diamond",
      price: 14999,
      gstPercent: 0,
      period: "month",
      isPopular: false,
      isActive: true,
      features: [
        "Core Feature 1",
        "Performance Optimization",
        "Direct Project Support",
      ],
    };

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: [...s.plans, newPlan],
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleDeletePlan = (planId: string) => {
    if (currentService.plans.length <= 1) {
      alert("A service category must have at least one plan.");
      return;
    }
    if (!confirm("Are you sure you want to delete this plan tier?")) return;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.filter((p) => p.id !== planId),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleUpdatePlanField = (
    planId: string,
    field: keyof ServicePlan,
    val: any
  ) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.map((p) =>
            p.id === planId ? { ...p, [field]: val } : p
          ),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleAddFeature = (planId: string) => {
    const text = prompt("Enter feature description:");
    if (!text?.trim()) return;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.map((p) =>
            p.id === planId
              ? { ...p, features: [...p.features, text.trim()] }
              : p
          ),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleEditFeature = (planId: string, index: number, currentVal: string) => {
    const edited = prompt("Edit feature description:", currentVal);
    if (edited === null || !edited.trim()) return;

    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.map((p) => {
            if (p.id !== planId) return p;
            const updated = [...p.features];
            updated[index] = edited.trim();
            return { ...p, features: updated };
          }),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleRemoveFeature = (planId: string, index: number) => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.map((p) =>
            p.id === planId
              ? {
                  ...p,
                  features: p.features.filter((_, idx) => idx !== index),
                }
              : p
          ),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  const handleMoveFeature = (planId: string, index: number, direction: "up" | "down") => {
    setServices((prev) =>
      prev.map((s) => {
        if (s.id !== currentService.id) return s;
        return {
          ...s,
          plans: s.plans.map((p) => {
            if (p.id !== planId) return p;
            const updated = [...p.features];
            const targetIdx = direction === "up" ? index - 1 : index + 1;
            if (targetIdx < 0 || targetIdx >= updated.length) return p;
            const temp = updated[index];
            updated[index] = updated[targetIdx];
            updated[targetIdx] = temp;
            return { ...p, features: updated };
          }),
        };
      })
    );
    setHasUnsavedChanges(true);
  };

  // -------------------------------------------------------------
  // Platform / Coverage Tags
  // -------------------------------------------------------------
  const handleAddPlatformTag = () => {
    const tag = prompt("Enter platform or engine name (e.g. TikTok, Bing, Pinterest):");
    if (!tag?.trim()) return;

    const currentPlatforms = currentService.platforms || [];
    handleUpdateServiceField("platforms", [...currentPlatforms, tag.trim().toUpperCase()]);
  };

  const handleRemovePlatformTag = (idx: number) => {
    const currentPlatforms = currentService.platforms || [];
    handleUpdateServiceField(
      "platforms",
      currentPlatforms.filter((_, i) => i !== idx)
    );
  };

  // -------------------------------------------------------------
  // Save & Reset Handlers
  // -------------------------------------------------------------
  const handleSaveServices = async () => {
    setSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_services",
          services,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setHasUnsavedChanges(false);
        setFeedbackMsg({
          type: "success",
          text: "Services CMS successfully updated and published to live website!",
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: data.error || "Failed to save services.",
        });
      }
    } catch {
      setFeedbackMsg({
        type: "error",
        text: "Network error while saving changes.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = async () => {
    if (
      !confirm(
        "Are you sure you want to reset all services & plans back to original brochure defaults?"
      )
    ) {
      return;
    }

    setSaving(true);
    setFeedbackMsg(null);

    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset_defaults" }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setServices(data.services);
        setHasUnsavedChanges(false);
        setFeedbackMsg({
          type: "success",
          text: "Services reset to original brochure defaults.",
        });
      } else {
        setFeedbackMsg({
          type: "error",
          text: data.error || "Failed to reset.",
        });
      }
    } catch {
      setFeedbackMsg({
        type: "error",
        text: "Network error while resetting.",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: ServiceOrder["status"]
  ) => {
    try {
      const res = await fetch("/api/admin/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_order_status",
          orderId,
          status: newStatus,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setOrders(data.orders);
      } else {
        alert(data.error || "Failed to update order status");
      }
    } catch {
      alert("Error updating order status");
    }
  };

  return (
    <div className="space-y-6 pb-20">
      {/* Clean Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Services
          </h1>
          {hasUnsavedChanges && (
            <p className="text-xs text-amber-600 dark:text-amber-400 font-bold mt-0.5 animate-pulse">
              ● You have unsaved changes
            </p>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          {orders.length > 0 && (
            <button
              type="button"
              onClick={() => setActiveTab(activeTab === "orders" ? "editor" : "orders")}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <FiShoppingBag className="w-3.5 h-3.5" />
              <span>{activeTab === "orders" ? "Back to Services" : `Orders (${orders.length})`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setShowNewServiceModal(true)}
            className="px-4 py-2.5 rounded-xl font-bold text-xs bg-[#0055FF] hover:bg-blue-600 text-white flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
          >
            <FiPlus className="w-4 h-4" />
            <span>Add New Service</span>
          </button>

          <button
            type="button"
            onClick={handleSaveServices}
            disabled={saving}
            className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm ${
              hasUnsavedChanges
                ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-500/20"
                : "bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-100 dark:text-slate-900"
            } disabled:opacity-50`}
          >
            <FiSave className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save All Changes"}</span>
          </button>
        </div>
      </div>

      {/* Feedback Banner */}
      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between ${
            feedbackMsg.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800"
              : "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800"
          }`}
        >
          <span>{feedbackMsg.text}</span>
          <button
            onClick={() => setFeedbackMsg(null)}
            className="text-xs underline cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Direct Services & Plans Editor */}
      {activeTab === "editor" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Services Catalog Sidebar */}
          <div className="lg:col-span-4 space-y-4">
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-black text-sm text-slate-900 dark:text-white uppercase tracking-wider">
                  Service Categories ({services.length})
                </h3>
                <button
                  type="button"
                  onClick={() => setShowNewServiceModal(true)}
                  className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/40 text-[#0055FF] text-xs font-bold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                >
                  <FiPlus className="w-3 h-3" />
                  <span>New</span>
                </button>
              </div>

              {/* Service Cards list */}
              <div className="space-y-2">
                {services.map((srv) => {
                  const isSelected = srv.id === currentService?.id;

                  return (
                    <div
                      key={srv.id}
                      onClick={() => setSelectedServiceId(srv.id)}
                      className={`group p-3.5 rounded-2xl border transition-all cursor-pointer relative ${
                        isSelected
                          ? "bg-blue-50/90 dark:bg-blue-950/50 border-[#0055FF] shadow-sm"
                          : "bg-slate-50/70 dark:bg-slate-800/40 border-slate-200/80 dark:border-slate-800 hover:bg-slate-100"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                srv.isActive ? "bg-emerald-500" : "bg-slate-400"
                              }`}
                            />
                            <p className="font-black text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {srv.title}
                            </p>
                          </div>
                          <p className="text-[11px] text-slate-500 font-mono">
                            /services/{srv.slug}
                          </p>
                          <div className="flex items-center gap-2 mt-2 text-[10px] font-bold text-slate-600 dark:text-slate-400">
                            <span className="px-2 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                              {srv.plans.length} Plans
                            </span>
                            <span>From ₹{Math.min(...srv.plans.map((p) => p.price)).toLocaleString("en-IN")}</span>
                          </div>
                        </div>

                        {/* Quick action buttons on card */}
                        <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDuplicateService(srv.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-500 transition-colors"
                            title="Duplicate Service"
                          >
                            <FiCopy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteService(srv.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/40 text-rose-500 transition-colors"
                            title="Delete Service"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Detailed Service & Plans Form */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Card 1: Core Service Settings */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600"></span>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Service Settings: {currentService.title}
                  </h3>
                </div>

                <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={currentService.isActive}
                    onChange={(e) =>
                      handleUpdateServiceField("isActive", e.target.checked)
                    }
                    className="w-4 h-4 text-[#0055FF] rounded"
                  />
                  <span>Active on Public Website</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Service Title
                  </label>
                  <input
                    type="text"
                    value={currentService.title}
                    onChange={(e) =>
                      handleUpdateServiceField("title", e.target.value)
                    }
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-bold focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    URL Slug Path
                  </label>
                  <div className="flex items-center">
                    <span className="px-3 py-2.5 rounded-l-xl bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-300 dark:border-slate-700 text-xs text-slate-500 font-mono">
                      /services/
                    </span>
                    <input
                      type="text"
                      value={currentService.slug}
                      onChange={(e) =>
                        handleUpdateServiceField(
                          "slug",
                          e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-")
                        )
                      }
                      className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-bold focus:outline-none focus:border-[#0055FF]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Headline
                  </label>
                  <input
                    type="text"
                    value={currentService.headline}
                    onChange={(e) =>
                      handleUpdateServiceField("headline", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-[#0055FF]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                    Tagline / Subtitle
                  </label>
                  <input
                    type="text"
                    value={currentService.subtitle}
                    onChange={(e) =>
                      handleUpdateServiceField("subtitle", e.target.value)
                    }
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold focus:outline-none focus:border-[#0055FF]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Description Narrative
                </label>
                <textarea
                  rows={2}
                  value={currentService.description || ""}
                  onChange={(e) =>
                    handleUpdateServiceField("description", e.target.value)
                  }
                  placeholder="Describe what client gains from this service..."
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              {/* Target Networks / Coverage Tags */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
                    <FiTag className="w-3.5 h-3.5 text-[#0055FF]" />
                    <span>Target Coverage / Platform Tags</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleAddPlatformTag}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0055FF] text-xs font-bold hover:bg-blue-100 flex items-center gap-1 cursor-pointer"
                  >
                    <FiPlus className="w-3 h-3" />
                    <span>Add Tag</span>
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {(currentService.platforms || []).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                    >
                      <span>{tag}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePlatformTag(tIdx)}
                        className="text-slate-400 hover:text-red-500 cursor-pointer"
                      >
                        <FiX className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  {(!currentService.platforms || currentService.platforms.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No custom tags added.</span>
                  )}
                </div>
              </div>
            </div>

            {/* Card 2: Plans Management (Full CRUD for Plans) */}
            <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wider text-slate-900 dark:text-white">
                    Plans & Pricing Tiers ({currentService.plans.length})
                  </h3>
                  <p className="text-xs text-slate-500 font-semibold mt-0.5">
                    Customize plan names, monthly charges, popular badge, and feature lists.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAddNewPlan}
                  className="px-3.5 py-2 rounded-xl bg-[#0055FF] hover:bg-blue-600 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-blue-500/20 cursor-pointer"
                >
                  <FiPlus className="w-3.5 h-3.5" />
                  <span>Add Plan Tier</span>
                </button>
              </div>

              {/* Plans Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {currentService.plans.map((plan, pIdx) => (
                  <div
                    key={plan.id}
                    className="p-5 rounded-3xl bg-slate-50/80 dark:bg-slate-800/40 border-2 border-slate-200/90 dark:border-slate-700/80 space-y-4 relative flex flex-col justify-between"
                  >
                    <div>
                      {/* Plan Header & Controls */}
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                        <span className="text-[11px] font-black uppercase text-blue-600">
                          Tier #{pIdx + 1}
                        </span>
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 cursor-pointer text-[11px] font-bold">
                            <input
                              type="checkbox"
                              checked={plan.isActive}
                              onChange={(e) =>
                                handleUpdatePlanField(plan.id, "isActive", e.target.checked)
                              }
                              className="rounded text-[#0055FF]"
                            />
                            <span>Active</span>
                          </label>

                          <button
                            type="button"
                            onClick={() => handleDeletePlan(plan.id)}
                            className="p-1 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
                            title="Delete Plan"
                          >
                            <FiTrash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Plan Name & Price */}
                      <div className="space-y-3 mt-3">
                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                            Plan Name
                          </label>
                          <input
                            type="text"
                            value={plan.name}
                            onChange={(e) =>
                              handleUpdatePlanField(plan.id, "name", e.target.value.toUpperCase())
                            }
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-xs uppercase focus:outline-none focus:border-[#0055FF]"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                            Monthly Price (₹)
                          </label>
                          <input
                            type="number"
                            value={plan.price}
                            onChange={(e) =>
                              handleUpdatePlanField(plan.id, "price", Number(e.target.value) || 0)
                            }
                            className="w-full px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 font-black text-sm focus:outline-none focus:border-[#0055FF]"
                          />
                        </div>

                        {/* Icon & Popular Badge */}
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                              Icon
                            </label>
                            <select
                              value={plan.icon}
                              onChange={(e) =>
                                handleUpdatePlanField(plan.id, "icon", e.target.value)
                              }
                              className="w-full px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-bold focus:outline-none"
                            >
                              <option value="star">Star</option>
                              <option value="crown">Crown</option>
                              <option value="diamond">Diamond</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-[11px] font-bold text-slate-500 mb-0.5">
                              Most Popular?
                            </label>
                            <div className="pt-1.5">
                              <label className="flex items-center gap-1.5 cursor-pointer text-xs font-bold">
                                <input
                                  type="checkbox"
                                  checked={plan.isPopular}
                                  onChange={(e) =>
                                    handleUpdatePlanField(plan.id, "isPopular", e.target.checked)
                                  }
                                  className="rounded text-[#0055FF]"
                                />
                                <span>Featured</span>
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Features Checklist List Manager */}
                      <div className="pt-3 mt-3 border-t border-slate-200 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-black uppercase text-slate-700 dark:text-slate-300">
                            Features ({plan.features.length})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleAddFeature(plan.id)}
                            className="px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-[#0055FF] text-[10px] font-bold hover:bg-blue-100 flex items-center gap-0.5 cursor-pointer"
                          >
                            <FiPlus className="w-2.5 h-2.5" />
                            <span>Add</span>
                          </button>
                        </div>

                        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                          {plan.features.map((feature, fIdx) => (
                            <div
                              key={fIdx}
                              className="group flex items-center justify-between p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs gap-1.5"
                            >
                              <span
                                onClick={() => handleEditFeature(plan.id, fIdx, feature)}
                                className="font-semibold text-slate-700 dark:text-slate-200 truncate cursor-pointer hover:text-[#0055FF] flex-1"
                                title="Click to edit text"
                              >
                                {feature}
                              </span>

                              <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                  type="button"
                                  onClick={() => handleMoveFeature(plan.id, fIdx, "up")}
                                  disabled={fIdx === 0}
                                  className="text-slate-400 hover:text-blue-600 disabled:opacity-30"
                                  title="Move Up"
                                >
                                  <FiArrowUp className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleMoveFeature(plan.id, fIdx, "down")}
                                  disabled={fIdx === plan.features.length - 1}
                                  className="text-slate-400 hover:text-blue-600 disabled:opacity-30"
                                  title="Move Down"
                                >
                                  <FiArrowDown className="w-3 h-3" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemoveFeature(plan.id, fIdx)}
                                  className="text-slate-400 hover:text-red-500"
                                  title="Delete"
                                >
                                  <FiTrash2 className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}



      {/* ========================================================= */}
      {/* TAB 3: CUSTOMER ORDERS & PAYMENTS (Razorpay)              */}
      {/* ========================================================= */}
      {activeTab === "orders" && (
        <div className="space-y-4">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 overflow-x-auto shadow-sm">
            {orders.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <FiShoppingBag className="w-12 h-12 text-slate-300 mx-auto" />
                <h4 className="text-base font-bold text-slate-700 dark:text-slate-200">
                  No service orders placed yet
                </h4>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  When clients purchase SEO or Social Media Management packages via Razorpay, their bookings will appear here in real-time.
                </p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-extrabold uppercase tracking-wider">
                    <th className="py-3 px-3">Order & Payment</th>
                    <th className="py-3 px-3">Client Contact</th>
                    <th className="py-3 px-3">Service & Plan</th>
                    <th className="py-3 px-3">Amount</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {orders.map((ord) => (
                    <tr
                      key={ord.id}
                      className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3.5 px-3">
                        <p className="font-mono font-bold text-slate-900 dark:text-white">
                          {ord.id}
                        </p>
                        <p className="text-[11px] text-blue-600 font-mono font-semibold">
                          {ord.paymentId || "Razorpay Verified"}
                        </p>
                        <span className="text-[10px] text-slate-400">
                          {new Date(ord.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-900 dark:text-white text-sm">
                          {ord.customerName}
                        </p>
                        <p className="text-slate-500 font-semibold">{ord.customerEmail}</p>
                        <p className="text-slate-600 font-bold">{ord.customerPhone}</p>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-bold text-slate-800 dark:text-slate-200">
                          {ord.serviceTitle}
                        </p>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-black uppercase text-[10px]">
                          {ord.planName}
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <p className="font-black text-sm text-slate-900 dark:text-white">
                          ₹{ord.totalAmount?.toLocaleString("en-IN")}
                        </p>
                      </td>

                      <td className="py-3.5 px-3">
                        <select
                          value={ord.status}
                          onChange={(e) =>
                            handleUpdateOrderStatus(ord.id, e.target.value as any)
                          }
                          className="px-2.5 py-1 rounded-xl text-xs font-bold border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:outline-none"
                        >
                          <option value="PAID">PAID</option>
                          <option value="ACTIVE">ACTIVE</option>
                          <option value="IN PROGRESS">IN PROGRESS</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={`https://wa.me/${ord.customerPhone.replace(
                              /[^0-9]/g,
                              ""
                            )}?text=${encodeURIComponent(
                              `Hello ${ord.customerName}, thanks for booking ${ord.serviceTitle} (${ord.planName} Plan) with JCRM Technologies! Our project team is ready to begin.`
                            )}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors shadow-xs"
                            title="Chat with client on WhatsApp"
                          >
                            <FaWhatsapp className="w-3.5 h-3.5" />
                          </a>

                          <a
                            href={`tel:${ord.customerPhone.replace(/\s+/g, "")}`}
                            className="p-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-xs"
                            title="Call client"
                          >
                            <FiPhone className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create New Service Topic */}
      {showNewServiceModal && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-black text-base text-slate-900 dark:text-white">
                Add New Service Topic
              </h3>
              <button
                type="button"
                onClick={() => setShowNewServiceModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  Service Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newServiceTitle}
                  onChange={(e) => setNewServiceTitle(e.target.value)}
                  placeholder="e.g. Cloud & DevOps Architecture"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold focus:outline-none focus:border-[#0055FF]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-600 dark:text-slate-400 mb-1">
                  URL Slug (Optional - auto-generated if left empty)
                </label>
                <input
                  type="text"
                  value={newServiceSlug}
                  onChange={(e) => setNewServiceSlug(e.target.value)}
                  placeholder="e.g. cloud-devops"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-mono font-semibold focus:outline-none focus:border-[#0055FF]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowNewServiceModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateNewService}
                className="px-5 py-2.5 rounded-xl text-xs font-black bg-[#0055FF] hover:bg-blue-600 text-white shadow-md shadow-blue-500/20"
              >
                Create Service
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
