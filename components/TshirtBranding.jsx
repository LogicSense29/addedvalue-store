'use client'
import React, { useState, useEffect } from 'react'
import { Sparkles, ArrowRight, ShieldCheck, Zap } from 'lucide-react'

const TshirtBranding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const variants = [
        { color: 'bg-primary', name: 'Signature Red', textColor: 'text-white', description: 'Bold and authoritative brand presence.' },
        { color: 'bg-[#F8F9FA]', name: 'Arctic White', textColor: 'text-slate-900', description: 'Minimalist elegance for modern labels.' },
        { color: 'bg-[#FFD700]', name: 'Legacy Gold', textColor: 'text-slate-950', description: 'Premium distinction for exclusive collections.' },
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % variants.length);
        }, 4000);
        return () => clearInterval(timer);
    }, []);

    return (
        <section className="py-24 px-6 bg-white overflow-hidden">
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-[#0F172A] rounded-[3rem] overflow-hidden shadow-2xl border border-white/5 p-8 md:p-20">
                    
                    {/* Atmospheric Accents */}
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -mr-64 -mt-64 animate-pulse"></div>
                    <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[100px] -ml-48 -mb-48"></div>
                    
                    <div className="relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
                        
                        {/* Text Content */}
                        <div className="flex-1 text-center lg:text-left">
                            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-300 text-xs font-bold tracking-[0.2em] uppercase mb-8 backdrop-blur-sm">
                                <Sparkles size={14} className="text-yellow-400" />
                                <span>Bespoke Branding</span>
                            </div>
                            
                            <h2 className="text-5xl md:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-8">
                                Distinctive <br />
                                <span className="bg-gradient-to-r from-primary via-rose-400 to-orange-400 bg-clip-text text-transparent">Apparel Identity</span>
                            </h2>
                            
                            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-12 max-w-xl mx-auto lg:mx-0">
                                Experience the pinnacle of textile customization. Our <strong className="text-white">Brimestone</strong> series combines luxury fabrics with high-definition branding precision.
                            </p>

                            <div className="space-y-6 mb-12">
                                {variants.map((v, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setCurrentIndex(i)}
                                        className={`w-full max-w-md flex items-center gap-5 p-5 rounded-2xl transition-all duration-500 border ${
                                            currentIndex === i 
                                            ? 'bg-white/10 border-white/20 shadow-xl scale-[1.02]' 
                                            : 'bg-transparent border-transparent grayscale opacity-40 hover:opacity-100 hover:grayscale-0'
                                        }`}
                                    >
                                        <div className={`size-12 rounded-xl ${v.color} shadow-lg flex-shrink-0 border border-white/10`}></div>
                                        <div className="text-left flex-1">
                                            <p className="text-white font-bold text-lg">{v.name}</p>
                                            <p className="text-slate-400 text-sm hidden sm:block">{v.description}</p>
                                        </div>
                                        {currentIndex === i && <ArrowRight size={20} className="text-primary animate-pulse" />}
                                    </button>
                                ))}
                            </div>

                            <button className="relative group overflow-hidden bg-primary text-white px-12 py-6 rounded-2xl font-black text-xl tracking-wide transition-all hover:scale-105 active:scale-95 shadow-2xl shadow-primary/20">
                                <span className="relative z-10 flex items-center gap-3">
                                    Inquire via Concierge
                                    <ArrowRight className="group-hover:translate-x-2 transition-transform duration-300" />
                                </span>
                                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                            </button>
                        </div>

                        {/* Visual Presentation */}
                        <div className="flex-1 w-full relative">
                            <div className="relative aspect-[4/5] w-full max-w-md mx-auto">
                                <div className="absolute inset-0 bg-white/5 rounded-[3rem] border border-white/10 backdrop-blur-xl shadow-inner group overflow-hidden">
                                    
                                    {variants.map((variant, index) => (
                                        <div 
                                            key={index}
                                            className={`absolute inset-0 flex items-center justify-center p-12 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                                                index === currentIndex 
                                                ? 'opacity-100 scale-100 translate-y-0 rotate-0' 
                                                : 'opacity-0 scale-75 translate-y-20 rotate-6 pointer-events-none'
                                            }`}
                                        >
                                            {/* Luxury T-Shirt Mockup */}
                                            <div className="relative w-full h-full flex items-center justify-center">
                                                {/* Fabric Body */}
                                                <div className={`relative w-full aspect-[3/4] ${variant.color} rounded-t-[3rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] transition-colors duration-700`}>
                                                    
                                                    {/* Premium Sleeves */}
                                                    <div className={`absolute top-0 -left-[15%] w-[40%] h-[30%] ${variant.color} rounded-tl-full rotate-[38deg] origin-top-right transition-colors duration-700 overflow-hidden`}>
                                                         <div className="absolute inset-x-0 bottom-0 h-1 bg-black/5"></div>
                                                    </div>
                                                    <div className={`absolute top-0 -right-[15%] w-[40%] h-[30%] ${variant.color} rounded-tr-full -rotate-[38deg] origin-top-left transition-colors duration-700 overflow-hidden`}>
                                                         <div className="absolute inset-x-0 bottom-0 h-1 bg-black/5"></div>
                                                    </div>
                                                    
                                                    {/* Hand-stitched Look Collar */}
                                                    <div className="absolute top-0 inset-x-[25%] h-12 bg-black/10 rounded-b-full border-b border-white/5"></div>

                                                    {/* Centerpiece Branding */}
                                                    <div className="absolute inset-x-0 top-1/4 flex flex-col items-center">
                                                        <div className={`text-center transition-all duration-700 ${variant.textColor}`}>
                                                            <div className="font-[900] text-5xl md:text-6xl tracking-[ -0.05em] leading-none mb-4 italic">
                                                                BRIME<span className="text-primary opacity-90 transition-opacity">STONE</span>
                                                            </div>
                                                            <div className="flex items-center gap-4 w-full px-12">
                                                                <div className="h-px flex-1 bg-current opacity-20"></div>
                                                                <span className="text-[10px] font-black tracking-[0.4em] uppercase opacity-40">Series One</span>
                                                                <div className="h-px flex-1 bg-current opacity-20"></div>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Elegant Fabric Shadows */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 rounded-t-[3rem] pointer-events-none"></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Carousel Indicators */}
                                    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
                                        {variants.map((_, i) => (
                                            <div 
                                                key={i} 
                                                className={`transition-all duration-500 rounded-full ${
                                                    i === currentIndex 
                                                    ? 'w-10 h-1.5 bg-primary' 
                                                    : 'w-1.5 h-1.5 bg-white/20'
                                                }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TshirtBranding
