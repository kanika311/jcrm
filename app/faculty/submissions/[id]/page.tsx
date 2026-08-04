"use client";

import Link from "next/link";
import { useState } from "react";

export default function GradingWorkspace() {
  // Grading State
  const [functionalityScore, setFunctionalityScore] = useState("40");
  const [qualityScore, setQualityScore] = useState("35");
  const [feedback, setFeedback] = useState("");

  // DEMO STATE: Lets you toggle what kind of file the student submitted
  const [submissionType, setSubmissionType] = useState<'code' | 'image' | 'quiz'>('image');

  const totalScore = parseInt(functionalityScore || "0") + parseInt(qualityScore || "0");

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 pb-12 h-[calc(100vh-6rem)] flex flex-col">
      
      {/* --- WORKSPACE HEADER --- */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#131B2F] border border-bdr-soft rounded-2xl p-4 shadow-lg shrink-0">
        <div className="flex items-center gap-4">
          <Link href="/faculty/submissions" className="w-10 h-10 rounded-xl bg-[#0B0F19] border border-bdr-soft flex items-center justify-center text-txt-secondary hover:text-txt-primary hover:border-violet-500/50 transition-all shrink-0">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-xl font-extrabold text-txt-primary">Assignment 4: Advanced Integration</h1>
              <span className="bg-rose-500/10 text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded-md border border-rose-500/20 animate-pulse">Needs Grading</span>
            </div>
            <p className="text-sm text-txt-secondary font-medium">
              Submitted by <span className="text-violet-400 font-bold">Sanskar Gupta</span> • 2 hours ago
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-[#0B0F19] hover:bg-surf-elevated border border-bdr-soft text-txt-secondary rounded-xl text-sm font-bold transition-all">
            Request Revision
          </button>
          <button className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-txt-primary rounded-xl text-sm font-bold shadow-lg shadow-emerald-900/20 transition-all flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg>
            Return Grade ({totalScore}/100)
          </button>
        </div>
      </div>

      {/* --- SIMULATOR TOGGLE (For Demo Purposes Only) --- */}
      <div className="flex justify-center shrink-0">
        <div className="bg-[#131B2F] border border-bdr-soft p-1.5 rounded-xl flex items-center gap-2">
          <span className="text-xs font-bold text-txt-tertiary px-3 uppercase tracking-wider">Simulate Upload Type:</span>
          {['code', 'image', 'quiz'].map((type) => (
            <button
              key={type}
              onClick={() => setSubmissionType(type as any)}
              className={`px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all ${
                submissionType === type ? "bg-violet-600 text-txt-primary" : "text-txt-secondary hover:text-txt-primary"
              }`}
            >
              {type === 'image' ? 'Math/PDF Upload' : type}
            </button>
          ))}
        </div>
      </div>

      {/* --- SPLIT PANE WORKSPACE --- */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        
        {/* LEFT PANE (66%) - UNIVERSAL CONTENT VIEWER */}
        <div className="lg:col-span-2 bg-[#0B0F19] border border-bdr-soft rounded-2xl flex flex-col overflow-hidden shadow-2xl relative">
          
          {/* Header adjusts based on file type */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#131B2F] border-b border-bdr-soft">
            <div className="flex items-center gap-3">
               {submissionType === 'code' && (
                 <div className="flex items-center gap-2 bg-[#0B0F19] px-3 py-1 rounded-md border border-bdr-soft text-xs font-medium text-txt-secondary">
                   <svg className="w-4 h-4 text-sky-400" fill="currentColor" viewBox="0 0 24 24"><path d="M1.5 0h21l-1.91 24-8.564 2.378L3.4 24 1.5 0zm9.73 17.653l5.067-1.405.347-3.896H7.135l-.23-2.56h9.945l.414-4.63H6.494l.872 9.8h3.864l.001 2.691z"/></svg>
                   routes/api.ts
                 </div>
               )}
               {submissionType === 'image' && (
                 <div className="flex items-center gap-2 bg-[#0B0F19] px-3 py-1 rounded-md border border-bdr-soft text-xs font-medium text-txt-secondary">
                   <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                   math_homework_scan.jpg
                 </div>
               )}
               {submissionType === 'quiz' && (
                 <div className="flex items-center gap-2 bg-[#0B0F19] px-3 py-1 rounded-md border border-bdr-soft text-xs font-medium text-txt-secondary">
                   <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
                   Auto-Graded Quiz Results
                 </div>
               )}
            </div>
            
            <div className="flex items-center gap-3">
               {/* Show Zoom controls only for Images/PDFs */}
               {submissionType === 'image' && (
                 <div className="flex items-center gap-1 bg-surf-elevated rounded-lg p-1 mr-2">
                   <button className="p-1 hover:bg-surf-hover rounded text-txt-secondary hover:text-txt-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" /></svg></button>
                   <span className="text-[10px] font-bold text-txt-secondary px-1">100%</span>
                   <button className="p-1 hover:bg-surf-hover rounded text-txt-secondary hover:text-txt-primary"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" /></svg></button>
                 </div>
               )}
               <button className="text-xs font-bold text-violet-400 hover:text-txt-primary">Expand Fullscreen</button>
            </div>
          </div>

          {/* DYNAMIC CONTENT AREA */}
          <div className="flex-1 overflow-auto bg-[#0B0F19] relative [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:bg-surf-hover [&::-webkit-scrollbar-thumb]:rounded-full">
            
            {/* STATE 1: CODE VIEWER */}
            {submissionType === 'code' && (
              <div className="p-4 font-mono text-sm leading-relaxed text-txt-secondary">
                <div className="flex">
                  <div className="w-8 text-slate-600 text-right pr-4 select-none flex flex-col">
                    {[...Array(10)].map((_, i) => <span key={i}>{i + 1}</span>)}
                  </div>
                  <div className="flex-1 whitespace-pre">
                    <span className="text-fuchsia-400">import</span> {`React`} <span className="text-fuchsia-400">from</span> <span className="text-emerald-400">'react'</span>{`;\n`}
                    <span className="text-violet-400">export default function</span> {`App() {\n`}
                    {`  `}<span className="text-fuchsia-400">return</span>{` (\n`}
                    {`    `}<span className="text-sky-400">&lt;div&gt;</span>{`\n`}
                    {`      `}<span className="text-sky-400">&lt;h1&gt;</span>{`Hello World`}<span className="text-sky-400">&lt;/h1&gt;</span>{`\n`}
                    {`    `}<span className="text-sky-400">&lt;/div&gt;</span>{`\n`}
                    {`  );\n`}
                    {`}\n`}
                  </div>
                </div>
              </div>
            )}

            {/* STATE 2: IMAGE/PDF VIEWER (Math Paper) */}
            {submissionType === 'image' && (
              <div className="absolute inset-0 flex items-center justify-center p-8 bg-black/40">
                {/* Simulated Math Paper */}
                <div className="bg-white text-black p-10 w-full max-w-2xl min-h-full shadow-2xl transform transition-transform rounded border border-slate-300 font-serif">
                   <h2 className="text-xl font-bold mb-6 border-b pb-2">Calculus Assignment 4</h2>
                   <div className="space-y-8">
                     <div>
                       <p className="font-bold mb-2">1. Find the derivative of f(x) = x^2 * sin(x)</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">Using product rule: (u*v)' = u'v + uv'</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">u = x^2, u' = 2x</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">v = sin(x), v' = cos(x)</p>
                       <p className="text-blue-800 italic font-mono text-lg border border-red-500 p-2 inline-block">f'(x) = 2x*sin(x) - x^2*cos(x) &lt;-- (Mistake here, should be +)</p>
                     </div>
                     <div>
                       <p className="font-bold mb-2">2. Evaluate the integral of 2x dx from 0 to 3</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">Int(2x) = x^2</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">Evaluate at 3: 3^2 = 9</p>
                       <p className="text-blue-800 italic font-mono text-lg mb-1">Evaluate at 0: 0^2 = 0</p>
                       <p className="text-blue-800 italic font-mono text-lg font-bold border-2 border-green-500 p-2 inline-block">Answer: 9</p>
                     </div>
                   </div>
                </div>
              </div>
            )}

            {/* STATE 3: OBJECTIVE QUIZ VIEWER */}
            {submissionType === 'quiz' && (
              <div className="p-8 max-w-3xl mx-auto space-y-6">
                <div className="bg-[#131B2F] border border-bdr-soft p-6 rounded-xl flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-lg font-bold text-txt-primary">Auto-Graded Score</h2>
                    <p className="text-xs text-txt-secondary">System graded 4/5 correct. Faculty review required for final submission.</p>
                  </div>
                  <div className="text-3xl font-extrabold text-emerald-400">80%</div>
                </div>

                <div className="space-y-4">
                  {/* Question 1: Correct */}
                  <div className="bg-emerald-500/5 border border-emerald-500/20 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-txt-primary text-sm">1. What is the Big-O complexity of Binary Search?</h3>
                      <span className="text-emerald-400 font-bold text-xs flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" /></svg> Correct</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-[#0B0F19] p-3 rounded-lg border border-bdr-soft text-sm text-txt-secondary">A) O(n)</div>
                      <div className="bg-emerald-500/20 p-3 rounded-lg border border-emerald-500/30 text-sm text-emerald-200 font-bold flex justify-between">
                        B) O(log n) <span className="text-xs font-normal opacity-70">Student Selected</span>
                      </div>
                    </div>
                  </div>

                  {/* Question 2: Incorrect */}
                  <div className="bg-rose-500/5 border border-rose-500/20 p-5 rounded-xl">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-bold text-txt-primary text-sm">2. Which sorting algorithm is fastest in the worst-case scenario?</h3>
                      <span className="text-rose-400 font-bold text-xs flex items-center gap-1"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg> Incorrect</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-rose-500/20 p-3 rounded-lg border border-rose-500/30 text-sm text-rose-200 flex justify-between">
                        A) Quick Sort <span className="text-xs font-normal opacity-70">Student Selected</span>
                      </div>
                      <div className="bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/30 text-sm text-emerald-200 flex justify-between">
                        B) Merge Sort <span className="text-xs font-normal opacity-70">Correct Answer</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* RIGHT PANE (33%) - Evaluation & Rubric (Remains Stable) */}
        <div className="lg:col-span-1 bg-[#131B2F] border border-bdr-soft rounded-2xl flex flex-col overflow-hidden shadow-xl">
          
          <div className="p-5 border-b border-bdr-soft bg-white/[0.02]">
            <h2 className="text-sm font-bold text-txt-primary uppercase tracking-wider">Evaluation Rubric</h2>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            
            {/* Dynamic Rubric Labels based on type */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-txt-secondary">
                  {submissionType === 'image' ? 'Accuracy & Method' : 'Core Functionality'}
                </label>
                <span className="text-xs font-bold text-txt-tertiary">Max: 50</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" min="0" max="50" 
                  value={functionalityScore} onChange={(e) => setFunctionalityScore(e.target.value)}
                  className="flex-1 accent-violet-500"
                />
                <div className="w-16 bg-[#0B0F19] border border-bdr-soft rounded-lg px-2 py-1.5 text-center">
                  <span className="text-sm font-bold text-txt-primary">{functionalityScore}</span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-bold text-txt-secondary">
                  {submissionType === 'image' ? 'Formatting & Readability' : 'Code Quality / Best Practices'}
                </label>
                <span className="text-xs font-bold text-txt-tertiary">Max: 50</span>
              </div>
              <div className="flex items-center gap-3">
                <input 
                  type="range" min="0" max="50" 
                  value={qualityScore} onChange={(e) => setQualityScore(e.target.value)}
                  className="flex-1 accent-violet-500"
                />
                <div className="w-16 bg-[#0B0F19] border border-bdr-soft rounded-lg px-2 py-1.5 text-center">
                  <span className="text-sm font-bold text-txt-primary">{qualityScore}</span>
                </div>
              </div>
            </div>

            <div className="w-full h-px bg-surf-elevated"></div>

            {/* Final Score Preview */}
            <div className="flex items-center justify-between bg-violet-500/10 border border-violet-500/20 p-4 rounded-xl">
              <span className="font-bold text-violet-300">Total Score</span>
              <span className="text-2xl font-extrabold text-txt-primary">{totalScore}<span className="text-sm text-violet-400">/100</span></span>
            </div>

            {/* Written Feedback */}
            <div>
              <label className="block text-xs font-bold text-txt-secondary uppercase tracking-wider mb-2">Written Feedback (Sent to Student)</label>
              <textarea 
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write constructive feedback here..."
                className="w-full bg-[#0B0F19] border border-bdr-soft rounded-xl p-4 text-sm text-txt-primary placeholder-slate-600 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 min-h-[150px] resize-y"
              ></textarea>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}