"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const CODE_SNIPPET = `// Advanced Systems Programming: Lock-Free Queue in Rust
use std::sync::atomic::{AtomicPtr, Ordering};
use std::ptr;

pub struct LockFreeQueue<T> {
    head: AtomicPtr<Node<T>>,
    tail: AtomicPtr<Node<T>>,
}

struct Node<T> {
    data: Option<T>,
    next: AtomicPtr<Node<T>>,
}

impl<T> LockFreeQueue<T> {
    pub fn push(&self, value: T) {
        let new_node = Box::into_raw(Box::new(Node {
            data: Some(value),
            next: AtomicPtr::new(ptr::null_mut()),
        }));

        loop {
            let tail = self.tail.load(Ordering::Acquire);
            let next = unsafe { (*tail).next.load(Ordering::Acquire) };

            if tail == self.tail.load(Ordering::Acquire) {
                if next.is_null() {
                    // Attempt to link the new node at the end of the queue
                    if unsafe {
                        (*tail).next.compare_exchange_weak(
                            next, new_node, Ordering::Release, Ordering::Relaxed
                        )
                    }.is_ok() {
                        let _ = self.tail.compare_exchange(
                            tail, new_node, Ordering::Release, Ordering::Relaxed
                        );
                        return;
                    }
                } else {
                    let _ = self.tail.compare_exchange(
                        tail, next, Ordering::Release, Ordering::Relaxed
                    );
                }
            }
        }
    }
}`;

export default function LiveCodeEditor() {
  const [displayedCode, setDisplayedCode] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    let i = 0;
    const intervalId = setInterval(() => {
      setDisplayedCode(CODE_SNIPPET.substring(0, i));
      i++;
      if (i > CODE_SNIPPET.length) {
        clearInterval(intervalId);
        setIsTyping(false);
        // Reset after 8 seconds to loop the animation
        setTimeout(() => {
          i = 0;
          setIsTyping(true);
        }, 8000);
      }
    }, 15); // Faster typing for longer snippet

    return () => clearInterval(intervalId);
  }, []);

  const highlightCode = (code: string, isPhantom = false) => {
    let html = code
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      // Keywords
      .replace(/\b(use|pub|struct|impl|fn|let|loop|unsafe|if|else|return|mut)\b/g, '<span style="color: #c678dd">$1</span>')
      // Types/Traits (Capitalized words)
      .replace(/\b([A-Z][a-zA-Z0-9_]*)\b/g, '<span style="color: #e5c07b">$1</span>')
      // Methods
      .replace(/\b(push|into_raw|new|load|is_null|compare_exchange_weak|compare_exchange|is_ok)\b/g, '<span style="color: #61afef">$1</span>')
      // Comments
      .replace(/(\/\/.*)/g, '<span style="color: #5c6370; font-style: italic">$1</span>');
      
    return { __html: html + (!isPhantom && isTyping ? '<span class="animate-pulse" style="color: #528bff">|</span>' : '') };
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-32 px-4 sm:px-6 relative z-20">
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className="text-center mb-10"
      >
        <h2 className="heading-font text-3xl font-bold mb-4">Learn by building real systems.</h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          Write production-grade code using the modern stack. No more toy examples.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className="rounded-xl overflow-hidden shadow-2xl border"
        style={{ background: '#1e1e1e', borderColor: 'var(--border-strong)' }}
      >
        {/* Mac OS Window Controls */}
        <div className="flex items-center px-4 py-3 bg-[#252526] border-b border-[#333]">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
            <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
            <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
          </div>
          <div className="mx-auto text-xs text-[#858585] font-mono tracking-wider">lockfree_queue.rs — JCRM Technology</div>
        </div>
        
        {/* Code Area */}
        <div className="p-6 md:p-8 overflow-x-auto text-sm md:text-base font-mono leading-relaxed text-[#abb2bf] whitespace-pre text-left">
          <div className="grid">
            {/* Phantom element to reserve exact space so the layout doesn't shift */}
            <div className="invisible col-start-1 row-start-1" aria-hidden="true" dangerouslySetInnerHTML={highlightCode(CODE_SNIPPET, true)} />
            {/* Real typing text overlay */}
            <div className="col-start-1 row-start-1 pointer-events-auto" dangerouslySetInnerHTML={highlightCode(displayedCode, false)} />
          </div>
        </div>
      </motion.div>
    </div>
  );
}
