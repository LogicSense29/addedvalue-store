'use client'
import React from 'react'
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react'

const PrivacyPage = () => {
    const sections = [
        {
            title: "Data Collection",
            desc: "We collect information you provide directly to us, such as when you create an account, make a purchase, or communicate with our concierge team. This may include your name, email, billing address, and payment details."
        },
        {
            title: "Usage of Information",
            desc: "Your data allows us to personalize your shopping experience, process transactions efficiently, and provide proactive customer support. We also use it to improve our technological infrastructure and security protocols."
        },
        {
            title: "Data Security",
            desc: "Security is built into our DNA. We implement enterprise-grade encryption and multi-layered security measures to protect your personal information from unauthorized access, alteration, or disclosure."
        },
        {
            title: "Cookie Policy",
            desc: "We use cookies to enhance navigation, analyze site usage, and assist in our marketing efforts. You have full control over cookie preferences through your browser settings."
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50 py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 shadow-sm">
                        <Lock size={14} />
                        Security First
                    </div>
                    <h1 className="text-5xl font-black text-slate-900 mb-6 tracking-tight uppercase">Privacy Policy</h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed">
                        Last updated: January 7, 2026. Your privacy and the security of your data are fundamental to our mission.
                    </p>
                </header>

                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {sections.map((section, idx) => (
                        <div key={section.title} className="p-10 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm transition-all hover:shadow-md">
                            <div className="flex items-center gap-4 mb-6">
                                <div className="size-10 rounded-xl bg-slate-50 flex items-center justify-center text-primary">
                                    <ChevronRight size={20} />
                                </div>
                                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{section.title}</h2>
                            </div>
                            <p className="text-slate-600 font-medium leading-relaxed ml-14">
                                {section.desc}
                            </p>
                        </div>
                    ))}
                    
                    <div className="p-10 bg-slate-900 rounded-[2.5rem] text-white overflow-hidden relative group">
                        <div className="absolute top-0 right-0 w-1/2 h-full bg-primary/10 blur-[100px] rounded-full" />
                        <div className="relative z-10">
                            <div className="flex items-center gap-4 mb-6">
                                <Shield size={32} className="text-primary" />
                                <h2 className="text-2xl font-black uppercase tracking-tight">Got Questions?</h2>
                            </div>
                            <p className="text-slate-400 font-medium leading-relaxed mb-8 max-w-xl">
                                If you have any inquiries regarding your data or our privacy practices, please contact our Data Protection Officer at privacy@gocart.com.
                            </p>
                            <button className="px-8 py-3.5 bg-white text-slate-900 rounded-2xl font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all">
                                Request Data Export
                            </button>
                        </div>
                    </div>
                </div>

                <footer className="mt-16 pt-8 border-t border-slate-200 text-center">
                    <p className="text-slate-400 text-sm font-bold uppercase tracking-[0.2em]">
                        Gocart • Encrypted • Protected • Transparent
                    </p>
                </footer>
            </div>
        </div>
    )
}

export default PrivacyPage
