"use client";

import { useState } from "react";

export default function FeedbackForm() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="p-8 rounded-[32px] shadow-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
       {submitted ? (
          <div className="text-center py-8">
             <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center mb-6" style={{ background: 'var(--accent-success)', color: 'white' }}>
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/></svg>
             </div>
             <h2 className="text-2xl font-bold mb-2">Thank you!</h2>
             <p style={{ color: 'var(--text-secondary)' }}>Your feedback helps us build a better platform for everyone.</p>
             <button onClick={() => {setSubmitted(false); setRating(0);}} className="mt-8 text-sm font-semibold hover:underline" style={{ color: 'var(--accent-primary)' }}>Submit another response</button>
          </div>
       ) : (
          <form onSubmit={handleSubmit} className="space-y-8">
             
             <div className="flex flex-col items-center">
                <p className="font-bold mb-4">Rate your overall experience</p>
                <div className="flex gap-2">
                   {[1, 2, 3, 4, 5].map((star) => (
                      <button
                         key={star}
                         type="button"
                         onClick={() => setRating(star)}
                         onMouseEnter={() => setHovered(star)}
                         onMouseLeave={() => setHovered(0)}
                         className="focus:outline-none transition-transform hover:scale-110"
                      >
                         <svg 
                            className={`w-10 h-10 ${star <= (hovered || rating) ? 'text-amber-400' : 'text-txt-secondary'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                         >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                         </svg>
                      </button>
                   ))}
                </div>
             </div>

             <div>
                <label className="block text-sm font-medium mb-2">What could we improve?</label>
                <textarea required rows={5} className="input-premium w-full px-4 py-3 rounded-xl" placeholder="Tell us what you liked or what needs work..."></textarea>
             </div>

             <button type="submit" disabled={rating === 0} className={`w-full py-4 rounded-xl text-lg font-bold transition-all ${rating === 0 ? 'opacity-50 cursor-not-allowed' : 'btn-primary'}`}>
                Submit Feedback
             </button>
          </form>
       )}
    </div>
  );
}
