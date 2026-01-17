'use client'
import React from 'react'
import { FileText, CheckCircle2, AlertCircle, Info, ArrowRight } from 'lucide-react'

const TermsPage = () => {
    const terms = [
        {
            id: "01",
            title: "Acceptance of Terms",
            content: "By accessing or using the Gocart platform, you agree to comply with and be bound by these Terms of Service. If you do not agree, please refrain from using our services."
        },
        {
            id: "02",
            title: "User Obligations",
            content: "Users are responsible for maintaining the confidentiality of their account credentials and for all activities that occur under their account. You must provide accurate and complete information."
        },
        {
            id: "03",
            title: "Intellectual Property",
            content: "All content on the platform, including logos, designs, and product descriptions, is the exclusive property of Gocart and is protected by international copyright laws."
        },
        {
            id: "04",
            title: "Limitation of Liability",
            content: "Gocart shall not be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use our platform or purchased products."
        }
    ];

    return (
        <div className="min-h-screen bg-white py-24 px-6">
            <div className="max-w-4xl mx-auto">
                <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-full text-xs font-black uppercase tracking-widest text-slate-400 mb-6">
                        <FileText size={14} />
                        Legal Agreement
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-slate-900 mb-6 tracking-tighter uppercase">Terms of Service</h1>
                    <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-2xl mx-auto">
                        Please read these terms carefully. They govern your use of our platform and the purchase of our curated products.
                    </p>
                </header>

                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                    {terms.map((term) => (
                        <div key={term.id} className="group p-8 md:p-12 hover:bg-slate-50 rounded-[3rem] transition-all duration-500 border border-transparent hover:border-slate-100">
                            <div className="flex flex-col md:flex-row gap-8">
                                <span className="text-4xl font-black text-slate-200 group-hover:text-primary transition-colors duration-500">
                                    {term.id}
                                </span>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">{term.title}</h2>
                                    <p className="text-slate-600 font-medium leading-relaxed">
                                        {term.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="mt-12 p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 flex flex-col md:flex-row items-center gap-8 shadow-sm">
                        <div className="size-16 rounded-3xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                            <Info size={32} />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="text-xl font-black text-indigo-950 uppercase tracking-tight mb-2">Need Clarification?</h3>
                            <p className="text-indigo-900/60 font-medium">
                                Our legal team is committed to transparency. If any part of these terms is unclear, we're happy to explain them in plain language.
                            </p>
                        </div>
                        <button className="px-10 py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 shadow-lg shadow-indigo-100">
                            Support Desk
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>

                <div className="mt-16 flex flex-wrap justify-center gap-12 opacity-50 font-black text-[10px] uppercase tracking-[0.4em] text-slate-400">
                    <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Binding Agreement</span>
                    <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Global Compliance</span>
                    <span className="flex items-center gap-2"><CheckCircle2 size={12} /> Protected Content</span>
                </div>
            </div>
        </div>
    )
}

export default TermsPage
