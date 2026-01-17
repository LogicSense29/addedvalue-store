'use client'
import React from 'react'
import { Target, Eye, ShieldCheck, Heart, Users, Sparkles, Globe2, ArrowRight } from 'lucide-react'
import Link from 'next/link'

const AboutPage = () => {
    const values = [
        {
            icon: Target,
            title: "Precision",
            desc: "Every product in our collection is meticulously vetted for engineering excellence and aesthetic perfection."
        },
        {
            icon: ShieldCheck,
            title: "Authenticity",
            desc: "Trust is our currency. We guarantee 100% genuine products sourced directly from authorized channels."
        },
        {
            icon: Heart,
            title: "Curation",
            desc: "We don't just sell gadgets; we curate lifestyles. Only the most innovative tech makes it to our shelves."
        },
        {
            icon: Users,
            title: "Community",
            desc: "A global network of tech enthusiasts united by a passion for the ultimate user experience."
        }
    ];

    return (
        <div className="min-h-screen bg-white overflow-hidden">
            {/* Hero Section */}
            <section className="relative py-32 px-6 bg-slate-50">
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-8 animate-pulse">
                            <Sparkles size={14} />
                            The Gocart Story
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-8 tracking-tighter leading-none">
                            Defining the <span className="text-primary italic">Future</span> of Commerce.
                        </h1>
                        <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10">
                            Born from a desire to bridge the gap between human intuition and technological brilliance. We are more than a marketplace; we are a destination for the visionary.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <div className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center gap-2 group cursor-default">
                                Established 2024
                            </div>
                            <div className="px-8 py-4 bg-white border border-slate-200 text-slate-600 rounded-2xl font-bold flex items-center gap-2">
                                <Globe2 size={18} className="text-primary" />
                                Global Reach
                            </div>
                        </div>
                    </div>
                </div>
                {/* Decorative background text */}
                <div className="absolute top-1/2 -right-20 -translate-y-1/2 text-[20vw] font-black text-slate-200/40 select-none pointer-events-none uppercase tracking-tighter whitespace-nowrap">
                    Innovation
                </div>
            </section>

            {/* Vision & Mission */}
            <section className="py-24 px-6 border-y border-slate-100">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20">
                    <div className="space-y-8 p-10 bg-slate-50 rounded-[3rem] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-2xl hover:shadow-slate-100 duration-700">
                        <div className="size-16 rounded-3xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                            <Eye size={32} />
                        </div>
                        <h2 className="text-4xl font-black text-slate-900 uppercase tracking-tight">Our Vision</h2>
                        <p className="text-lg text-slate-500 font-medium leading-relaxed">
                            To create a world where technology is seamless, accessible, and deeply integrated into the fabric of daily life, empowering every individual to achieve more through innovation.
                        </p>
                    </div>
                    <div className="space-y-8 p-10 bg-slate-900 rounded-[3rem] text-white relative group transition-all hover:scale-[1.02] duration-700">
                        <div className="size-16 rounded-3xl bg-white text-primary flex items-center justify-center shadow-lg shadow-white/10 transition-transform group-hover:scale-110">
                            <Target size={32} />
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tight">Our Mission</h2>
                        <p className="text-lg text-slate-300 font-medium leading-relaxed">
                            To bridge the distance between creators and consumers by providing a premium platform that celebrates quality, design, and functional excellence in the digital age.
                        </p>
                    </div>
                </div>
            </section>

            {/* Core Values */}
            <section className="py-32 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-4">Our Core Values</h2>
                        <div className="w-20 h-2 bg-primary mx-auto rounded-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {values.map((v, i) => (
                            <div key={v.title} className="p-8 rounded-[2.5rem] border border-slate-100 bg-slate-50/30 hover:bg-white hover:shadow-xl hover:shadow-slate-100/50 transition-all duration-500 group animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms` }}>
                                <div className="size-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                                    <v.icon size={24} />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight mb-4">{v.title}</h3>
                                <p className="text-slate-500 font-medium leading-relaxed">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="bg-primary rounded-[4rem] p-12 md:p-24 text-white text-center relative overflow-hidden group">
                        {/* Decorative gradients */}
                        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                        <div className="absolute -bottom-20 -right-20 size-80 bg-white/10 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-1000" />
                        
                        <div className="relative z-10">
                            <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter">Ready to join the <span className="italic underline decoration-white/30 underline-offset-8">revolution</span>?</h2>
                            <p className="text-xl text-white/80 font-medium max-w-2xl mx-auto mb-10">
                                Explore our latest collections or start your own journey as a verified gocart partner today.
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                                <Link href="/shop" className="px-12 py-5 bg-white text-primary rounded-[2rem] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-black/10 flex items-center gap-2">
                                    Browse Shop
                                    <ArrowRight size={20} />
                                </Link>
                                <Link href="/create-store" className="px-12 py-5 bg-black/20 backdrop-blur-md text-white border border-white/30 rounded-[2rem] font-black uppercase tracking-widest hover:bg-black/30 transition-all">
                                    Become a Seller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AboutPage
