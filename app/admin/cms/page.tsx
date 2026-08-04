"use client";

import { useState, useEffect } from "react";
import { CMS_SCHEMAS, PageSchema, getDefaultDataForSchema } from "@/lib/cmsDefaults";
import SidebarDraggable from "./SidebarDraggable";
import DynamicForm from "@/components/cms/DynamicForm";

type Tab = "global" | "public" | "student" | "faculty" | "admin";
const TABS: Tab[] = ["global", "public", "student", "faculty", "admin"];

export default function CMSAdminPage() {
  const [activeTab, setActiveTab] = useState<Tab>("global");
  const [activePageId, setActivePageId] = useState<string>("global-settings");
  
  // Data stores
  const [cmsConfig, setCmsConfig] = useState<any>(null); // holds the order/visibility config
  const [content, setContent] = useState<any>({});
  
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");

  // Fetch cms-config on mount to know the sidebar order
  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch(`/api/admin/cms?pageId=cms-config`);
        const data = await res.json();
        setCmsConfig(data.content || getDefaultDataForSchema(CMS_SCHEMAS.find(s => s.id === "cms-config")!.schema));
      } catch (error) {
        console.error("Failed to load CMS config", error);
      }
    };
    fetchConfig();
  }, []);

  // Fetch content for the active page
  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      setMessage("");
      try {
        const res = await fetch(`/api/admin/cms?pageId=${activePageId}`);
        const data = await res.json();
        
        // Merge with default schema structure in case it's empty
        const pageSchema = CMS_SCHEMAS.find(s => s.id === activePageId);
        const defaultData = pageSchema ? getDefaultDataForSchema(pageSchema.schema) : {};
        
        setContent(Object.keys(data.content || {}).length > 0 ? data.content : defaultData);
      } catch (error) {
        console.error(error);
        setMessage("Failed to load content.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchContent();
  }, [activePageId]);

  // When tab changes, pick the first visible page in that tab
  useEffect(() => {
    const pagesForTab = getVisiblePagesForTab(activeTab);
    if (pagesForTab.length > 0 && !pagesForTab.find(p => p.id === activePageId)) {
      setActivePageId(pagesForTab[0].id);
    }
  }, [activeTab, cmsConfig]);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage("");
    try {
      const res = await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: activePageId,
          category: activeTab,
          content: content,
        }),
      });

      if (res.ok) {
        setMessage("Saved successfully!");
        // If we just saved the cms-config, update our local sidebar state
        if (activePageId === "cms-config") {
           setCmsConfig(content);
        }
      } else {
        setMessage("Failed to save.");
      }
    } catch (error) {
      console.error(error);
      setMessage("An error occurred while saving.");
    } finally {
      setIsSaving(false);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const handleReorder = async (newOrder: PageSchema[]) => {
    // 1. Update local config state for instant feedback
    const orderKey = `${activeTab}Order`;
    const newConfigList = newOrder.map(p => ({ id: p.id, isHidden: false }));
    const newConfig = { ...cmsConfig, [orderKey]: newConfigList };
    setCmsConfig(newConfig);

    // 2. Save new order to database
    try {
      await fetch("/api/admin/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pageId: "cms-config",
          category: "admin",
          content: newConfig,
        }),
      });
    } catch (err) {
      console.error("Failed to save new order", err);
    }
  };

  // Compute ordered sidebar pages based on cmsConfig
  const getVisiblePagesForTab = (tab: Tab): PageSchema[] => {
    if (!cmsConfig) {
      return CMS_SCHEMAS.filter(s => s.category === tab);
    }
    
    const orderKey = `${tab}Order`;
    const orderConfig = cmsConfig[orderKey] || [];
    
    const orderedPages: PageSchema[] = [];
    
    for (const item of orderConfig) {
      if (!item.isHidden) {
        const schema = CMS_SCHEMAS.find(s => s.id === item.id && s.category === tab);
        if (schema) orderedPages.push(schema);
      }
    }
    
    const configIds = orderConfig.map((c: any) => c.id);
    const unconfigured = CMS_SCHEMAS.filter(s => s.category === tab && !configIds.includes(s.id));
    orderedPages.push(...unconfigured);
    
    return orderedPages;
  };

  const activeSchema = CMS_SCHEMAS.find(s => s.id === activePageId);
  const sidebarPages = getVisiblePagesForTab(activeTab);

  return (
    <div className="flex flex-col h-[calc(100vh-80px)]" style={{ background: 'var(--bg-base)' }}>
      {/* CMS Header / Tabs */}
      <div className="border-b px-6 py-4 flex items-center justify-between" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-card)' }}>
        <div>
          <h1 className="heading-font text-2xl font-bold">Visual Content Editor</h1>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Manage all content without touching code.</p>
        </div>
        <div className="flex bg-black/5 p-1 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-bold rounded-lg transition-all capitalize ${activeTab === tab ? 'bg-white shadow-sm text-[var(--text-primary)]' : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'}`}
              style={activeTab === tab ? {background: 'var(--bg-card)'} : {}}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <SidebarDraggable 
           activeTab={activeTab} 
           sidebarPages={sidebarPages} 
           activePageId={activePageId} 
           setActivePageId={setActivePageId} 
           onReorder={handleReorder}
        />

        {/* Editor Area */}
        <div className="flex-1 flex flex-col p-8 bg-[var(--bg-base)] overflow-y-auto">
          <div className="flex items-center justify-between mb-8 pb-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
            <div>
              <h2 className="heading-font text-3xl font-bold mb-1">
                {activeSchema?.name || "Unknown Page"}
              </h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>ID: {activePageId}</p>
            </div>
            
            <div className="flex items-center gap-4">
              {message && (
                <span className={`text-sm font-bold ${message.includes('Failed') ? 'text-red-500' : 'text-green-500'}`}>
                  {message}
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={isSaving || isLoading}
                className="btn-primary px-8 py-3 rounded-xl text-sm font-bold transition-transform hover:scale-105 active:scale-95"
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>

          <div className="max-w-4xl">
            {isLoading ? (
              <div className="animate-pulse flex flex-col gap-6">
                 <div className="h-16 rounded-xl bg-black/5 dark:bg-white/5 w-full"></div>
                 <div className="h-32 rounded-xl bg-black/5 dark:bg-white/5 w-full"></div>
                 <div className="h-16 rounded-xl bg-black/5 dark:bg-white/5 w-full"></div>
              </div>
            ) : (
              activeSchema && (
                <DynamicForm 
                  schema={activeSchema.schema} 
                  data={content} 
                  onChange={setContent} 
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
