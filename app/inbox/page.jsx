'use client'
import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Search, Send, User, Store, ShieldCheck, MoreVertical, Paperclip, Smile, ArrowLeft, MessageSquare, Clock, Filter, Loader2 } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useSelector } from 'react-redux' // Assuming redux is used for user data, or we fetch it.

const InboxPageContent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeChat, setActiveChat] = useState(null); // Whole chat object
    const [message, setMessage] = useState('');
    const [conversations, setConversations] = useState([]);
    const [messages, setMessages] = useState([]);
    const [loadingChats, setLoadingChats] = useState(true);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Ideally from Redux or Context

    const messagesEndRef = useRef(null);

    // Fetch current user (Mock or from Redux/API)
    // For now, let's assume we can get it from an API or it's stored in a global state. 
    // I'll try to fetch 'me' to be safe since I don't see Redux setup in the file provided, but `useSelector` was imported in Login.
    // Let's assume fetching /api/auth/me is a good way if redux isn't populated yet.
    
    useEffect(() => {
        // Fetch conversations
        const fetchConversations = async () => {
            try {
                const res = await fetch('/api/messages/conversations');
                const data = await res.json();
                if (data.conversations) {
                    setConversations(data.conversations);
                    // Select first chat by default if none selected
                    // if (data.conversations.length > 0 && !activeChat) {
                    //     setActiveChat(data.conversations[0]);
                    // }
                }
            } catch (error) {
                console.error("Failed to fetch conversations", error);
            } finally {
                setLoadingChats(false);
            }
        };

        fetchConversations();
        const interval = setInterval(fetchConversations, 5000); // Poll every 5s
        return () => clearInterval(interval);
    }, []);

    // Fetch Messages when activeChat changes
    useEffect(() => {
        if (!activeChat) return;

        setLoadingMessages(true);
        const fetchMessages = async () => {
            try {
                const res = await fetch(`/api/messages?userId=${activeChat.id}`);
                const data = await res.json();
                if (data.messages) {
                    setMessages(data.messages);
                    // Scroll to bottom
                    // messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                }
            } catch (error) {
                console.error("Failed to fetch messages", error);
            } finally {
                setLoadingMessages(false);
            }
        };

        fetchMessages();
        const interval = setInterval(async () => {
             // Poll for new messages silently
             try {
                const res = await fetch(`/api/messages?userId=${activeChat.id}`);
                const data = await res.json();
                if (data.messages) {
                    setMessages(data.messages);
                }
            } catch (error) { console.error(error) }
        }, 3000);

        return () => clearInterval(interval);
    }, [activeChat]);

    // Scroll effect
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);


    const handleSendMessage = async () => {
        if (!message.trim() || !activeChat) return;
        
        const content = message;
        setMessage(''); // Optimistic clear
        setSending(true);

        try {
            const res = await fetch('/api/messages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    receiverId: activeChat.id,
                    content: content
                })
            });
            const data = await res.json();
            if (data.success) {
                // Determine layout for 'Me' based on senderId usually, but here we can just append
                // Actually polling will catch it, but we can optimistically append if we knew our own ID.
                // Re-fetch immediately
                const resMsg = await fetch(`/api/messages?userId=${activeChat.id}`);
                const dataMsg = await resMsg.json();
                if (dataMsg.messages) setMessages(dataMsg.messages);
            }
        } catch (error) {
            console.error("Failed to send", error);
            // Restore message if failed?
        } finally {
            setSending(false);
        }
    }


    const formatTime = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    return (
        <div className="h-[calc(100vh-80px)] bg-white flex overflow-hidden">
            
            {/* Sidebar: Chat List */}
            <aside className={`w-full md:w-80 lg:w-96 border-r border-slate-100 flex flex-col bg-slate-50/30 flex-shrink-0 animate-in fade-in slide-in-from-left-4 duration-700 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
                <div className="p-6">
                    <div className="flex items-center justify-between mb-8">
                        <button onClick={() => router.back()} className="p-2 hover:bg-slate-100 rounded-xl transition-colors md:hidden">
                            <ArrowLeft size={20} />
                        </button>
                        <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">Messages</h1>
                        <button className="p-2 hover:bg-slate-100 rounded-xl transition-colors text-slate-400">
                            <Filter size={20} />
                        </button>
                    </div>

                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search conversations..." 
                            className="w-full pl-12 pr-4 py-3 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-sm"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto px-4 space-y-1">
                    {loadingChats ? (
                        <div className="flex items-center justify-center p-4">
                            <Loader2 className="animate-spin text-slate-400" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="p-4 text-center text-slate-400 text-sm">No conversations yet</div>
                    ) : (
                        conversations.map((chat) => (
                            <button 
                                key={chat.id}
                                onClick={() => setActiveChat(chat)}
                                className={`w-full flex items-center gap-4 p-4 rounded-3xl transition-all duration-300 ${
                                    activeChat?.id === chat.id 
                                    ? 'bg-white shadow-xl shadow-slate-200/50 ring-1 ring-slate-100' 
                                    : 'hover:bg-slate-100/50'
                                }`}
                            >
                                <div className="relative">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center text-white ${
                                        chat.isOfficial ? 'bg-slate-900' : 'bg-primary/80'
                                    }`}>
                                        {chat.isOfficial ? <ShieldCheck size={24} /> : <Store size={24} />}
                                    </div>
                                    {/* Online status could be real if we had socket, for now hide or mock */}
                                </div>
                                <div className="flex-1 text-left">
                                    <div className="flex items-center justify-between mb-1">
                                        <h3 className={`text-sm font-black uppercase tracking-tight ${activeChat?.id === chat.id ? 'text-slate-900' : 'text-slate-700'}`}>
                                            {chat.name}
                                        </h3>
                                        <span className="text-[10px] font-bold text-slate-400">{formatTime(chat.time)}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs text-slate-400 font-medium truncate max-w-[180px]">
                                            {chat.lastMessage}
                                        </p>
                                        {chat.unread > 0 && (
                                            <span className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full">{chat.unread}</span>
                                        )}
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </aside>

            {/* Main: Chat Window */}
            <main className={`flex-1 flex flex-col bg-white overflow-hidden relative animate-in fade-in duration-1000 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
                {activeChat ? (
                    <>
                        {/* Chat Header */}
                        <header className="p-6 border-b border-slate-100 flex items-center justify-between bg-white/80 backdrop-blur-xl sticky top-0 z-10">
                            <div className="flex items-center gap-4">
                                <button onClick={() => setActiveChat(null)} className="md:hidden p-2 -ml-2 text-slate-500">
                                    <ArrowLeft size={20} />
                                </button>
                                <div className={`size-12 rounded-2xl flex items-center justify-center text-white ${
                                    activeChat.isOfficial ? 'bg-slate-900' : 'bg-primary/80'
                                }`}>
                                    {activeChat.isOfficial ? <ShieldCheck size={24} /> : <Store size={24} />}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h2 className="font-black text-slate-900 uppercase tracking-tight">
                                            {activeChat.name}
                                        </h2>
                                        {activeChat.isOfficial && <ShieldCheck size={14} className="text-blue-500 fill-blue-500/10" />}
                                    </div>
                                    {/* <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">
                                            Online
                                        </span>
                                    </div> */}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="p-3 hover:bg-slate-50 rounded-2xl transition-colors text-slate-400">
                                    <MoreVertical size={20} />
                                </button>
                            </div>
                        </header>

                        {/* Messages Area */}
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <div className="flex items-center justify-center">
                                <span className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    Today
                                </span>
                            </div>

                            {loadingMessages && messages.length === 0 ? (
                                <div className="flex justify-center p-10"><Loader2 className="animate-spin text-slate-400" /></div>
                            ) : (
                                messages.map((msg, idx) => {
                                    // Determine if message is from me. 
                                    // The API returns sender object. 
                                    // Use logic: if senderId !== activeChat.id then it's me.
                                    // Wait, assuming 'me' is the one fetching. 
                                    const isMe = msg.senderId !== activeChat.id;

                                    return (
                                        <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                                            <div className={`max-w-[70%] group`}>
                                                {!isMe && (
                                                    <div className="flex items-center gap-2 mb-2 px-1">
                                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{msg.sender?.name || activeChat.name}</span>
                                                        <div className="size-1 bg-slate-200 rounded-full" />
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formatTime(msg.createdAt)}</span>
                                                    </div>
                                                )}
                                                <div className={`px-6 py-4 rounded-[2rem] shadow-sm font-medium leading-relaxed transition-all duration-300 ${
                                                    isMe 
                                                    ? 'bg-slate-900 text-white rounded-tr-lg hover:shadow-xl hover:shadow-slate-200' 
                                                    : 'bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-lg hover:bg-white hover:shadow-xl hover:shadow-slate-100'
                                                }`}>
                                                    {msg.content}
                                                </div>
                                                {isMe && (
                                                    <div className="flex items-center justify-end gap-2 mt-2 px-1">
                                                        <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">{formatTime(msg.createdAt)}</span>
                                                        {msg.isRead && (
                                                            <>
                                                                <div className="size-1 bg-slate-200 rounded-full" />
                                                                <span className="text-[10px] font-black text-primary uppercase tracking-widest">Read</span>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <footer className="p-6 bg-white border-t border-slate-100">
                            <div className="max-w-4xl mx-auto flex items-end gap-4">
                                <div className="flex-1 relative bg-slate-50 rounded-[2.5rem] border border-slate-100 focus-within:bg-white focus-within:shadow-2xl focus-within:shadow-slate-200 focus-within:border-primary/20 transition-all duration-500">
                                    <textarea 
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Type your message here..."
                                        rows={1}
                                        className="w-full pl-6 pr-24 py-5 bg-transparent outline-none font-medium text-slate-900 placeholder-slate-400 resize-none max-h-32"
                                        onKeyDown={(e) => {
                                            if(e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSendMessage();
                                            }
                                        }}
                                    />
                                    <div className="absolute right-4 bottom-3.5 flex items-center gap-2 text-slate-400">
                                        <button className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                                            <Paperclip size={20} />
                                        </button>
                                        <button className="p-2 hover:bg-slate-200 rounded-xl transition-colors">
                                            <Smile size={20} />
                                        </button>
                                    </div>
                                </div>
                                <button 
                                    onClick={handleSendMessage}
                                    disabled={sending || !message.trim()}
                                    className="size-14 rounded-2xl bg-primary text-white flex items-center justify-center shadow-xl shadow-primary/30 hover:bg-red-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {sending ? <Loader2 className="animate-spin" size={24} /> : <Send size={24} />}
                                </button>
                            </div>
                            <div className="mt-4 flex items-center justify-center gap-6 opacity-30">
                                <div className="flex items-center gap-2">
                                    <ShieldCheck size={12} className="text-slate-400" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">End-to-End Encrypted</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock size={12} className="text-slate-400" />
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em]">Real-time Sync</span>
                                </div>
                            </div>
                        </footer>
                    </>
                ) : (
                   <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                       <MessageSquare size={64} className="mb-4 opacity-50" />
                       <p className="font-bold text-lg">Select a conversation to start chatting</p>
                   </div>
                )}
            </main>
        </div>
    )
}

export default function InboxPage() {
    return (
        <Suspense fallback={
            <div className="h-[calc(100vh-80px)] flex items-center justify-center bg-white">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <InboxPageContent />
        </Suspense>
    );
}
