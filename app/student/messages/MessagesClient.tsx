"use client";
import { useState } from "react";

export default function MessagesClient({ cmsData }: { cmsData: any }) {
  const [activeChat, setActiveChat] = useState(1);
  
  const chats = [
    { id: 1, name: "Marcus Chen", role: "Instructor", msg: "Great work on the database schema! I left a few comments...", time: "10m", unread: 2, img: "11" },
    { id: 2, name: "Aisha Verma", role: "Instructor", msg: "Yes, the React patterns session is recorded.", time: "1h", unread: 0, img: "22" },
    { id: 3, name: "Cohort C General", role: "Group", msg: "David: Anyone want to form a study group?", time: "2h", unread: 5, img: "33" },
    { id: 4, name: "Support Team", role: "Admin", msg: "Your certificate has been issued.", time: "1d", unread: 0, img: "44" }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 pb-20" style={{ height: 'calc(100vh - 120px)' }}>
       
       {/* Sidebar List */}
       <div className="w-full lg:w-96 flex flex-col min-h-0 rounded-[24px]" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          <div className="p-6 border-b flex justify-between items-center" style={{ borderColor: 'var(--border-soft)' }}>
             <h2 className="heading-font text-2xl font-bold">{cmsData?.heading || "Messages"}</h2>
             <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/5 dark:hover:bg-surf-elevated" style={{ background: 'var(--bg-surface)' }}>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"/></svg>
             </button>
          </div>
          
          <div className="p-4 border-b" style={{ borderColor: 'var(--border-soft)' }}>
             <input type="text" placeholder="Search messages..." className="input-premium w-full px-4 py-2 text-sm rounded-lg" />
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
             {chats.map(chat => (
                <div 
                   key={chat.id} 
                   onClick={() => setActiveChat(chat.id)}
                   className={`p-4 border-b flex items-center gap-4 cursor-pointer transition-colors ${activeChat === chat.id ? 'bg-[var(--bg-surface)]' : 'hover:bg-black/5 dark:hover:bg-surf-elevated'}`}
                   style={{ borderColor: 'var(--border-soft)' }}
                >
                   <img src={`https://i.pravatar.cc/150?img=${chat.img}`} className="w-12 h-12 rounded-full shrink-0" />
                   <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center mb-1">
                         <h4 className="font-bold text-sm truncate">{chat.name}</h4>
                         <span className="text-xs font-semibold" style={{ color: 'var(--text-tertiary)' }}>{chat.time}</span>
                      </div>
                      <p className={`text-xs truncate ${chat.unread > 0 ? 'font-bold text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>{chat.msg}</p>
                   </div>
                   {chat.unread > 0 && (
                      <div className="w-5 h-5 rounded-full bg-[var(--accent-primary)] text-txt-primary text-[10px] font-bold flex items-center justify-center shrink-0">
                         {chat.unread}
                      </div>
                   )}
                </div>
             ))}
          </div>
       </div>

       {/* Chat Area */}
       <div className="flex-1 hidden lg:flex flex-col min-h-0 rounded-[24px] overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-soft)' }}>
          
          {/* Header */}
          <div className="p-6 border-b flex items-center gap-4" style={{ borderColor: 'var(--border-soft)', background: 'var(--bg-surface)' }}>
             <img src={`https://i.pravatar.cc/150?img=${chats.find(c => c.id === activeChat)?.img}`} className="w-12 h-12 rounded-full shrink-0" />
             <div>
                <h3 className="font-bold">{chats.find(c => c.id === activeChat)?.name}</h3>
                <p className="text-xs text-emerald-500 font-semibold">Online</p>
             </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
             <div className="text-center text-xs font-bold my-4" style={{ color: 'var(--text-tertiary)' }}>Today</div>
             
             {/* Received */}
             <div className="flex gap-4">
                <img src={`https://i.pravatar.cc/150?img=${chats.find(c => c.id === activeChat)?.img}`} className="w-8 h-8 rounded-full shrink-0 mt-1" />
                <div className="max-w-[70%]">
                   <div className="p-4 rounded-2xl rounded-tl-sm text-sm" style={{ background: 'var(--bg-surface)' }}>
                      {chats.find(c => c.id === activeChat)?.msg}
                   </div>
                   <div className="text-[10px] mt-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>10:42 AM</div>
                </div>
             </div>

             {/* Sent */}
             <div className="flex gap-4 justify-end">
                <div className="max-w-[70%] flex flex-col items-end">
                   <div className="p-4 rounded-2xl rounded-tr-sm text-sm text-txt-primary" style={{ background: 'var(--accent-primary)' }}>
                      Sounds good, I'll take a look!
                   </div>
                   <div className="text-[10px] mt-1 font-semibold" style={{ color: 'var(--text-tertiary)' }}>11:15 AM</div>
                </div>
             </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t" style={{ borderColor: 'var(--border-soft)' }}>
             <div className="relative">
                <button className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-tertiary)' }}>
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"/></svg>
                </button>
                <input type="text" placeholder="Type a message..." className="w-full bg-black/5 dark:bg-surf-elevated py-3 pl-12 pr-12 rounded-xl focus:outline-none focus:ring-2 ring-[var(--accent-primary)] text-sm" />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--accent-primary)] hover:text-[var(--accent-light)] transition-colors">
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
                </button>
             </div>
          </div>

       </div>
    </div>
  );
}