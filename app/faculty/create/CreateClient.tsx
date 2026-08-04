"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function CreateClient({ cmsData }: { cmsData: any }) {
  const [step, setStep] = useState(1);
  const router = useRouter();

  return (
    <div className="max-w-3xl mx-auto pb-20">
       <div className="mb-8">
          <Link href="/faculty" className="text-sm font-semibold mb-4 inline-flex items-center gap-2 hover:underline" style={{ color: 'var(--text-secondary)' }}>
             <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"/></svg>
             Back to Dashboard
          </Link>
          <h1 className="heading-font text-3xl font-bold mb-2">Create New Course</h1>
          {cmsData?.guidelines && (
             <div className="p-4 rounded-xl mb-4 text-sm font-medium" style={{ background: 'color-mix(in srgb, var(--accent-primary) 10%, transparent)', color: 'var(--text-primary)', border: '1px solid var(--accent-primary)' }}>
                <strong>Guidelines:</strong> {cmsData.guidelines}
             </div>
          )}
       </div>

       {/* Progress Indicator */}
       <div className="flex items-center mb-12">
          {[1, 2, 3].map((s, i) => (
             <div key={s} className="flex items-center flex-1 last:flex-none">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 transition-colors ${step >= s ? 'bg-[var(--accent-primary)] text-txt-primary' : 'bg-[var(--bg-surface)] text-[var(--text-tertiary)]'}`}>
                   {s}
                </div>
                {i < 2 && (
                   <div className={`h-1 w-full mx-2 rounded-full transition-colors ${step > s ? 'bg-[var(--accent-primary)]' : 'bg-[var(--bg-surface)]'}`}></div>
                )}
             </div>
          ))}
       </div>

       {/* Step Content */}
       <div className="p-8 rounded-[32px] mb-8" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          {step === 1 && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Basic Information</h2>
                
                <div>
                   <label className="block text-sm font-medium mb-2">Course Title</label>
                   <input type="text" className="input-premium w-full px-4 py-3 rounded-xl" placeholder="e.g. Advanced Rust Programming" />
                </div>
                
                <div>
                   <label className="block text-sm font-medium mb-2">Short Description</label>
                   <textarea className="input-premium w-full px-4 py-3 rounded-xl" rows={3} placeholder="A short summary of what students will learn..."></textarea>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select className="select-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent">
                         <option>Web Development</option>
                         <option>Mobile</option>
                         <option>AI/ML</option>
                         <option>Systems</option>
                      </select>
                   </div>
                   <div>
                      <label className="block text-sm font-medium mb-2">Level</label>
                      <select className="select-premium w-full px-4 py-3 rounded-xl appearance-none bg-transparent">
                         <option>Beginner</option>
                         <option>Intermediate</option>
                         <option>Advanced</option>
                      </select>
                   </div>
                </div>
             </div>
          )}

          {step === 2 && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Media & Cover</h2>
                
                <div>
                   <label className="block text-sm font-medium mb-2">Course Thumbnail</label>
                   <div className="w-full h-48 rounded-xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer hover:bg-black/5 dark:hover:bg-surf-elevated transition-colors" style={{ borderColor: 'var(--border-soft)' }}>
                      <svg className="w-8 h-8 mb-2 text-[var(--text-tertiary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>Click to upload an image</span>
                      <span className="text-xs mt-1" style={{ color: 'var(--text-tertiary)' }}>1920x1080 recommended</span>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium mb-2">Promo Video URL (Optional)</label>
                   <input type="url" className="input-premium w-full px-4 py-3 rounded-xl" placeholder="https://youtube.com/..." />
                </div>
             </div>
          )}

          {step === 3 && (
             <div className="space-y-6 animate-fade-in-up">
                <h2 className="text-2xl font-bold mb-6">Pricing & Publish</h2>
                
                <div>
                   <label className="block text-sm font-medium mb-2">Price (USD)</label>
                   <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold" style={{ color: 'var(--text-secondary)' }}>₹</span>
                      <input type="number" className="input-premium w-full pl-8 pr-4 py-3 rounded-xl" placeholder="99.00" defaultValue="149.00" />
                   </div>
                </div>

                <div className="p-4 rounded-xl border" style={{ background: 'var(--bg-surface)', borderColor: 'var(--border-soft)' }}>
                   <div className="flex items-center gap-3 mb-2">
                      <input type="checkbox" id="draft" className="w-4 h-4 rounded text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]" defaultChecked />
                      <label htmlFor="draft" className="font-bold text-sm">Save as Draft initially</label>
                   </div>
                   <p className="text-xs pl-7" style={{ color: 'var(--text-secondary)' }}>You can build the curriculum and publish it later.</p>
                </div>
             </div>
          )}
       </div>

       {/* Actions */}
       <div className="flex justify-between">
          <button 
             onClick={() => setStep(Math.max(1, step - 1))}
             disabled={step === 1}
             className={`px-6 py-3 rounded-xl font-bold ${step === 1 ? 'opacity-0 pointer-events-none' : 'btn-secondary'}`}
          >
             Back
          </button>
          
          <button 
             onClick={() => {
                if (step < 3) setStep(step + 1);
                else router.push("/faculty/courses");
             }}
             className="btn-primary px-8 py-3 rounded-xl font-bold"
          >
             {step === 3 ? "Create Course & Go to My Courses" : "Continue"}
          </button>
       </div>
    </div>
  );
}