"use client";

import { useState, useEffect } from "react";
import { CMS_SCHEMAS, CMS_EDITOR_PAGES, getDefaultDataForSchema } from "@/lib/cmsDefaults";
import DynamicForm from "@/components/cms/DynamicForm";

export default function CMSAdminPage() {
  const [activePageId, setActivePageId] = useState<string>(CMS_EDITOR_PAGES[0].id);
  const [content, setContent] = useState<any>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  const activePage = CMS_EDITOR_PAGES.find((p) => p.id === activePageId) || CMS_EDITOR_PAGES[0];
  const activeSchema = CMS_SCHEMAS.find((s) => s.id === activePageId);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setMessage("");
      try {
        const res = await fetch(`/api/admin/cms?pageId=${activePageId}`);
        const data = await res.json();
        const pageSchema = CMS_SCHEMAS.find((s) => s.id === activePageId);
        const defaultData = pageSchema ? getDefaultDataForSchema(pageSchema.schema) : {};
        const saved = data.content && Object.keys(data.content).length > 0 ? data.content : {};
        setContent({ ...defaultData, ...saved });
      } catch (error) {
        console.error(error);
        setMessage("Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [activePageId]);

  const handleSave = async () => {
    if (!activeSchema) return;
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePageId,
          category: activeSchema.category,
          content,
        }),
      });

      setMessage(res.ok ? "Saved. Refresh the live page to see changes." : "Failed to save.");
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 4000);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-80px)] gap-6">
      <aside className="w-full lg:w-64 shrink-0">
        <div className="lg:sticky lg:top-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-xs">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-3 px-1">
            Edit a page
          </p>
          <nav className="flex flex-col gap-1">
            {CMS_EDITOR_PAGES.map((page) => {
              const isActive = page.id === activePageId;
              return (
                <button
                  key={page.id}
                  type="button"
                  onClick={() => setActivePageId(page.id)}
                  className={`text-left px-3.5 py-2.5 rounded-xl text-sm font-bold transition-colors ${
                    isActive
                      ? "bg-[#0055FF] text-white shadow-sm"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                >
                  {page.name}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      <section className="flex-1 min-w-0">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-8 pb-6 border-b border-slate-100">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {activePage.name}
              </h1>
              <p className="text-sm text-slate-500 mt-1">{activePage.description}</p>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              {message && (
                <span className={`text-sm font-bold ${message.includes("Failed") || message.includes("error") ? "text-red-500" : "text-emerald-600"}`}>
                  {message}
                </span>
              )}
              <a
                href={activePage.path}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2.5 rounded-xl text-sm font-bold border border-slate-200 text-slate-700 hover:bg-slate-50"
              >
                View page
              </a>
              <button
                type="button"
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-[#0055FF] hover:bg-blue-600 disabled:opacity-60"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {isLoading ? (
            <div className="animate-pulse flex flex-col gap-6">
              <div className="h-16 rounded-xl bg-slate-100 w-full" />
              <div className="h-32 rounded-xl bg-slate-100 w-full" />
              <div className="h-16 rounded-xl bg-slate-100 w-full" />
            </div>
          ) : (
            activeSchema && (
              <DynamicForm schema={activeSchema.schema} data={content} onChange={setContent} />
            )
          )}
        </div>
      </section>
    </div>
  );
}
