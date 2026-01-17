'use client'
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, Globe, CheckCircle2 } from 'lucide-react'
import toast from 'react-hot-toast'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        toast.success("Message sent! Our concierge will reach out soon.");
        setFormData({ name: '', email: '', subject: '', message: '' });
        setIsSubmitting(false);
    };

    const contactMethods = [
        {
            icon: Phone,
            title: "Call Us",
            value: "+1 (212) 456-7890",
            desc: "Mon-Fri from 8am to 6pm.",
            color: "indigo"
        },
        {
            icon: Mail,
            title: "Email Us",
            value: "concierge@gocart.com",
            desc: "We'll respond within 24 hours.",
            color: "primary"
        },
        {
            icon: MapPin,
            title: "Visit Us",
            value: "794 Francisco, CA 94102",
            desc: "Our flagship innovation hub.",
            color: "slate"
        }
    ];

    return (
        <div className="min-h-screen bg-white py-24 px-6">
            <div className="max-w-7xl mx-auto">
                
                <header className="max-w-3xl mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-500 mb-6 shadow-sm">
                        <MessageSquare size={14} />
                        Get In Touch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        We're Here to <span className="text-primary italic">Elevate</span> Your Experience.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium">
                        Have a question about our curated collections or need assistance with an order? Our dedicated concierge team is ready to help.
                    </p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    
                    {/* Contact Form */}
                    <div className="bg-slate-50 rounded-[3rem] p-10 md:p-14 border border-slate-100 shadow-sm animate-in fade-in slide-in-from-left-4 duration-1000">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                                    <input 
                                        required
                                        type="text" 
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="John Doe"
                                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                                    <input 
                                        required
                                        type="email" 
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        placeholder="john@example.com"
                                        className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Subject</label>
                                <input 
                                    required
                                    type="text" 
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    placeholder="How can we help?"
                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Message</label>
                                <textarea 
                                    required
                                    rows={5}
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    placeholder="Share your thoughts with us..."
                                    className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800 resize-none"
                                />
                            </div>

                            <button 
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 disabled:opacity-50 shadow-xl shadow-slate-200"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="size-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send size={18} />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Details */}
                    <div className="space-y-12 animate-in fade-in slide-in-from-right-4 duration-1000">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {contactMethods.map((method) => (
                                <div key={method.title} className="p-8 bg-slate-50/50 rounded-[2.5rem] border border-slate-100 group hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-500">
                                    <div className={`size-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
                                        method.color === 'primary' ? 'bg-primary/10 text-primary' : 'bg-slate-100 text-slate-600'
                                    }`}>
                                        <method.icon size={24} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-2">{method.title}</h3>
                                    <p className="text-slate-900 font-bold mb-1 tracking-tight">{method.value}</p>
                                    <p className="text-sm text-slate-400 font-medium tracking-tight leading-relaxed">{method.desc}</p>
                                </div>
                            ))}
                        </div>

                        <div className="p-10 bg-slate-900 rounded-[3rem] text-white relative overflow-hidden group">
                            <div className="absolute -top-10 -right-10 size-40 bg-primary/20 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000" />
                            <div className="relative z-10 flex items-start gap-6">
                                <div className="size-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary flex-shrink-0">
                                    <Clock size={28} />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black uppercase tracking-wider mb-2">Concierge Hours</h3>
                                    <p className="text-slate-300 font-medium mb-4 leading-relaxed">
                                        Our digital concierge is available globally, however our human specialists operate during:
                                    </p>
                                    <div className="space-y-2">
                                        <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                                            <CheckCircle2 size={16} className="text-primary" />
                                            Weekdays: 08:00 — 18:00 (EST)
                                        </div>
                                        <div className="flex items-center gap-3 text-sm font-bold opacity-80">
                                            <CheckCircle2 size={16} className="text-primary" />
                                            Weekends: 10:00 — 14:00 (EST)
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 p-6 border-b border-slate-100 last:border-0">
                            <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                                <Globe size={20} />
                            </div>
                            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">
                                Global Headquarters • San Francisco • California
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default ContactPage
