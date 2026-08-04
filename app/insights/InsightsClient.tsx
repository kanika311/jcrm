"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function InsightsClient({ cmsData, initialPosts = [] }: { cmsData?: any, initialPosts?: any[] }) {
  const [posts, setPosts] = useState<any[]>(initialPosts.length > 0 ? initialPosts : (cmsData?.posts || []));

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts(posts.map(p => p.id === postId ? { ...p, likes: (p.likes || 0) + 1 } : p));
    
    try {
      await fetch("/api/public/insights/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "like" }),
      });
    } catch (err) {
      console.error("Failed to like post");
    }
  };

  const handleComment = async (postId: string, commentText: string) => {
    if (!commentText.trim()) return;

    // Optimistic UI update
    const newComment = { text: commentText, date: new Date().toISOString() };
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...(p.comments || []), newComment] };
      }
      return p;
    }));

    try {
      await fetch("/api/public/insights/interact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, action: "comment", comment: commentText }),
      });
    } catch (err) {
      console.error("Failed to post comment");
    }
  };

  return (
    <div className="pt-32 pb-24 max-w-4xl mx-auto px-4">
      <div className="text-center mb-16">
        <h1 className="heading-font text-4xl md:text-5xl font-bold mb-4">{cmsData?.heading || "Platform Insights"}</h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {cmsData?.subheading || "Stay up-to-date with the latest content, blogs, and course posters."}
        </p>
      </div>

      <div className="space-y-12">
        {posts.length === 0 && (
          <div className="text-center py-20 italic" style={{ color: 'var(--text-tertiary)' }}>
            No insights posted yet.
          </div>
        )}
        
        {posts.map((post: any) => (
          <PostCard key={post.id} post={post} onLike={() => handleLike(post.id)} onComment={(text) => handleComment(post.id, text)} />
        ))}
      </div>
    </div>
  );
}

function PostCard({ post, onLike, onComment }: { post: any, onLike: () => void, onComment: (text: string) => void }) {
  const [commentText, setCommentText] = useState("");
  const [showComments, setShowComments] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      className="glass-md rounded-[32px] overflow-hidden border shadow-lg" 
      style={{ borderColor: 'var(--border-soft)' }}
    >
      {post.imageUrl && (
        <div className="w-full h-[300px] md:h-[400px] relative">
          <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
        </div>
      )}
      
      {post.videoUrl && (
        <div className="w-full aspect-video relative bg-black">
          <video src={post.videoUrl} controls className="w-full h-full object-cover" />
        </div>
      )}

      <div className="p-8 md:p-10">
        <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 rounded-full bg-fuchsia-600 flex items-center justify-center font-bold text-sm text-white">
             {post.author ? post.author.charAt(0) : "A"}
           </div>
           <div>
             <h4 className="font-bold text-sm leading-none">{post.author || "Super Admin"}</h4>
             <span className="text-xs" style={{ color: 'var(--text-tertiary)' }}>{post.date || "Just now"}</span>
           </div>
        </div>

        <h2 className="heading-font text-2xl font-bold mb-4">{post.title}</h2>
        
        {post.content && (
          <p className="whitespace-pre-wrap leading-relaxed mb-6" style={{ color: 'var(--text-secondary)' }}>
            {post.content}
          </p>
        )}

        {post.codeSnippet && (
          <div className="p-4 rounded-xl mb-6 overflow-x-auto text-sm font-mono border" style={{ background: '#0d1117', borderColor: 'var(--border-strong)', color: '#c9d1d9' }}>
            <pre>{post.codeSnippet}</pre>
          </div>
        )}

        <div className="flex items-center gap-6 pt-6 border-t mt-6" style={{ borderColor: 'var(--border-soft)' }}>
           <button onClick={onLike} className="flex items-center gap-2 hover:text-fuchsia-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
              <span className="font-bold">{post.likes || 0}</span>
           </button>
           <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-2 hover:text-cyan-400 transition-colors" style={{ color: 'var(--text-secondary)' }}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
              <span className="font-bold">{(post.comments || []).length} Comments</span>
           </button>
        </div>

        {showComments && (
          <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--border-soft)' }}>
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {(!post.comments || post.comments.length === 0) && (
                <div className="text-sm italic" style={{ color: 'var(--text-tertiary)' }}>No comments yet. Be the first!</div>
              )}
              {post.comments?.map((c: any, i: number) => (
                <div key={i} className="p-4 rounded-xl" style={{ background: 'var(--bg-surface)' }}>
                  <div className="text-sm font-bold mb-1">Anonymous User</div>
                  <div className="text-sm" style={{ color: 'var(--text-secondary)' }}>{c.text}</div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 relative">
               <input 
                 type="text" 
                 value={commentText} 
                 onChange={e => setCommentText(e.target.value)}
                 onKeyDown={e => {
                   if (e.key === 'Enter') {
                     onComment(commentText);
                     setCommentText("");
                   }
                 }}
                 placeholder="Write a comment..." 
                 className="flex-1 input-premium pr-24"
               />
               <button 
                 onClick={() => {
                   onComment(commentText);
                   setCommentText("");
                 }}
                 className="absolute right-2 top-2 bottom-2 px-4 rounded-lg bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-sm transition-colors"
               >
                 Post
               </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
