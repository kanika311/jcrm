"use client";

import { FieldSchema } from "@/lib/cmsDefaults";
import ImageUploader from "./ImageUploader";

interface DynamicFormProps {
  schema: Record<string, FieldSchema>;
  data: any;
  onChange: (newData: any) => void;
}

export default function DynamicForm({ schema, data, onChange }: DynamicFormProps) {
  const handleChange = (key: string, val: any) => {
    onChange({ ...data, [key]: val });
  };

  return (
    <div className="space-y-8">
      {Object.entries(schema).map(([key, field]) => {
        const val = data?.[key] ?? field.default;
        return (
          <div key={key} className="p-4 rounded-xl border" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)' }}>
            <label className="block text-sm font-bold mb-1">{field.label}</label>
            <div className="text-xs mb-3" style={{ color: 'var(--text-secondary)' }}>Key: {key}</div>
            
            {field.type === "string" && (
              <input 
                type="text"
                value={val || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="input-premium w-full"
              />
            )}

            {field.type === "text" && (
              <textarea 
                value={val || ""}
                onChange={(e) => handleChange(key, e.target.value)}
                className="input-premium w-full min-h-[120px]"
              />
            )}

            {field.type === "image" && (
              <ImageUploader
                value={val || ""}
                onChange={(url) => handleChange(key, url)}
                label={field.label}
              />
            )}

            {field.type === "number" && (
              <input 
                type="number"
                value={val || 0}
                onChange={(e) => handleChange(key, Number(e.target.value))}
                className="input-premium w-full"
              />
            )}

            {field.type === "boolean" && (
              <label className="flex items-center gap-3 cursor-pointer">
                <div className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${val ? 'bg-[var(--accent-success)]' : 'bg-gray-400 dark:bg-gray-700'}`}>
                   <div className={`w-4 h-4 rounded-full bg-white transition-transform ${val ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
                <span className="text-sm font-medium">{val ? "Enabled" : "Disabled"}</span>
                <input 
                  type="checkbox"
                  checked={!!val}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="hidden"
                />
              </label>
            )}

            {field.type === "array" && field.itemSchema && (
              <div className="space-y-4 mt-4">
                {Array.isArray(val) && val.map((item: any, index: number) => (
                  <div key={index} className="p-4 rounded-lg border relative group" style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-base)' }}>
                     <div className="absolute top-2 right-2 flex items-center gap-2 z-10">
                       <button 
                         onClick={() => {
                           const newArr = [...val];
                           // Swap up
                           if (index > 0) {
                             [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
                             handleChange(key, newArr);
                           }
                         }}
                         className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
                         title="Move Up"
                       >
                         ↑
                       </button>
                       <button 
                         onClick={() => {
                           const newArr = [...val];
                           // Swap down
                           if (index < newArr.length - 1) {
                             [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
                             handleChange(key, newArr);
                           }
                         }}
                         className="p-1 rounded bg-black/10 dark:bg-white/10 hover:bg-black/20 dark:hover:bg-white/20"
                         title="Move Down"
                       >
                         ↓
                       </button>
                       <button 
                         onClick={() => {
                           const newArr = [...val];
                           newArr.splice(index, 1);
                           handleChange(key, newArr);
                         }}
                         className="p-1 rounded bg-red-500/10 text-red-500 hover:bg-red-500/20"
                         title="Delete Row"
                       >
                         Delete
                       </button>
                     </div>
                     <DynamicForm 
                       schema={field.itemSchema!} 
                       data={item} 
                       onChange={(newItemData) => {
                         const newArr = [...val];
                         newArr[index] = newItemData;
                         handleChange(key, newArr);
                       }} 
                     />
                  </div>
                ))}
                
                <button
                  onClick={() => {
                    const newArr = Array.isArray(val) ? [...val] : [];
                    // Generate empty default based on itemSchema
                    const emptyItem: any = {};
                    Object.entries(field.itemSchema!).forEach(([k, f]) => {
                      emptyItem[k] = f.default;
                    });
                    newArr.push(emptyItem);
                    handleChange(key, newArr);
                  }}
                  className="btn-secondary w-full py-3 mt-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2"
                >
                  <span>+ Add Row ({field.label})</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
