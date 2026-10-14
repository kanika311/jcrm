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
            <label className="block text-sm font-bold mb-3">{field.label}</label>
            
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
                {Array.isArray(val) && val.map((item: any, index: number) => {
                  const itemTitle =
                    item?.question ||
                    item?.title ||
                    item?.name ||
                    item?.label ||
                    `Item #${index + 1}`;
                  return (
                    <div
                      key={index}
                      className="p-4 sm:p-5 rounded-2xl border relative group transition-all duration-200 bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-2xs hover:shadow-sm"
                    >
                      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="w-6 h-6 rounded-full bg-blue-50 text-[#0055FF] text-xs font-black flex items-center justify-center shrink-0">
                            {index + 1}
                          </span>
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate max-w-[240px] sm:max-w-md">
                            {itemTitle}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            disabled={index === 0}
                            onClick={() => {
                              const newArr = [...val];
                              if (index > 0) {
                                [newArr[index - 1], newArr[index]] = [newArr[index], newArr[index - 1]];
                                handleChange(key, newArr);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Up"
                          >
                            ↑ Up
                          </button>
                          <button
                            type="button"
                            disabled={index === val.length - 1}
                            onClick={() => {
                              const newArr = [...val];
                              if (index < newArr.length - 1) {
                                [newArr[index + 1], newArr[index]] = [newArr[index], newArr[index + 1]];
                                handleChange(key, newArr);
                              }
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            title="Move Down"
                          >
                            ↓ Down
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const newArr = [...val];
                              newArr.splice(index, 1);
                              handleChange(key, newArr);
                            }}
                            className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-200 transition-colors"
                            title="Delete Item"
                          >
                            Delete
                          </button>
                        </div>
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
                  );
                })}

                <button
                  type="button"
                  onClick={() => {
                    const newArr = Array.isArray(val) ? [...val] : [];
                    const emptyItem: any = {};
                    Object.entries(field.itemSchema!).forEach(([k, f]) => {
                      emptyItem[k] = f.default !== undefined ? f.default : "";
                    });
                    newArr.push(emptyItem);
                    handleChange(key, newArr);
                  }}
                  className="w-full py-3.5 mt-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 border-2 border-dashed border-blue-200 hover:border-[#0055FF] bg-blue-50/60 hover:bg-blue-50 text-[#0055FF] transition-all cursor-pointer shadow-2xs"
                >
                  <span>+ Add Item ({field.label})</span>
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
