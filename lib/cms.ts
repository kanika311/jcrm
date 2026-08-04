import { prisma } from "@/lib/prisma";
import { CMS_SCHEMAS, getDefaultDataForSchema } from "./cmsDefaults";

// Helper for deep merging objects and arrays
function deepMerge(target: any, source: any): any {
  if (Array.isArray(source)) {
    // For arrays, we don't merge items deeply because users might delete items or change order.
    // However, we should ensure each item in the array has the required keys from the itemSchema if possible.
    // For simplicity, we just take the source array directly since the UI will enforce item schema.
    return source;
  }
  
  if (source !== null && typeof source === "object") {
    const merged = { ...target };
    for (const key of Object.keys(source)) {
      if (source[key] !== undefined) {
        merged[key] = deepMerge(target[key] !== undefined ? target[key] : {}, source[key]);
      }
    }
    return merged;
  }
  
  return source;
}

export async function getSiteContent(pageId: string, runtimeDefaults?: any) {
  try {
    const pageSchema = CMS_SCHEMAS.find(s => s.id === pageId);
    const schemaDefaults = pageSchema ? getDefaultDataForSchema(pageSchema.schema) : {};
    
    // Fallback to runtime defaults if provided (for backwards compatibility)
    const baseDefaults = { ...runtimeDefaults, ...schemaDefaults };

    const page = await prisma.siteContent.findUnique({
      where: { pageId },
    });

    if (!page || !page.content) {
      return baseDefaults;
    }

    return deepMerge(baseDefaults, page.content);
  } catch (error) {
    console.error(`Failed to load CMS content for ${pageId}:`, error);
    return runtimeDefaults || {};
  }
}
