'use client'
import React from 'react'
import { Check, Sparkles, Zap, Shield, Rocket } from 'lucide-react'

const PricingPage = () => {
    const plans = [
        {
            name: "Basic",
            price: "Free",
            description: "Essential features for casual shoppers and new sellers.",
            icon: Zap,
            color: "slate",
            features: [
                "Standard Checkout",
                "Up to 5 Wishlist Items",
                "Basic Order Tracking",
                "Community Support",
                "Standard Delivery Rates"
            ],
            buttonText: "Get Started",
            highlight: false
        },
        {
            name: "Plus Member",
            price: "$9.99",
            period: "/month",
            description: "Unlock premium features and exclusive savings.",
            icon: Sparkles,
            color: "primary",
            features: [
                "Everything in Basic",
                "Unlimited Wishlist Items",
                "Priority 24/7 Support",
                "Early Access to Drops",
                "Free Express Shipping",
                "Exclusive Plus Badges"
            ],
            buttonText: "Upgrade to Plus",
            highlight: true
        },
        {
            name: "Enterprise",
            price: "Custom",
            description: "High-volume solutions for professional merchants.",
            icon: Rocket,
            color: "slate",
            features: [
                "Everything in Plus",
                "Dedicated Account Manager",
                "Custom Revenue Analytics",
                "White-label Store Pages",
                "Unlimited Inventory Slots",
                "Global Logistics Hub"
            ],
            buttonText: "Contact Sales",
            highlight: false
        }
    ];

    return (
        <div className="min-h-screen bg-slate-50/50 py-24 px-6 overflow-hidden">
            <div className="max-w-7xl mx-auto relative">
                
                {/* Background Decorations */}
                <div className="absolute top-0 -left-20 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 -right-20 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />

                <header className="text-center mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 shadow-sm">
                        <Shield size={14} />
                        Subscription Plans
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 tracking-tight">
                        Choose Your <span className="text-primary italic">Success</span> Plan.
                    </h1>
                    <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
                        Transparent pricing for every stage of your growth. No hidden fees, just pure innovation.
                    </p>
                </header>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {plans.map((plan, idx) => (
                        <div 
                            key={plan.name}
                            className={`relative group rounded-[3rem] p-10 transition-all duration-500 ${
                                plan.highlight 
                                ? 'bg-slate-900 text-white shadow-2xl shadow-primary/20 scale-105 z-10' 
                                : 'bg-white border border-slate-200 hover:border-primary/30 text-slate-900'
                            } animate-in fade-in slide-in-from-bottom-8 duration-700`}
                            style={{ animationDelay: `${idx * 150}ms` }}
                        >
                            {plan.highlight && (
                                <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-primary text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/40">
                                    <Sparkles size={14} />
                                    Recommended
                                </div>
                            )}

                            <div className="mb-8">
                                <div className={`size-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 duration-500 ${
                                    plan.highlight ? 'bg-primary shadow-lg shadow-primary/20' : 'bg-slate-100 text-slate-600'
                                }`}>
                                    <plan.icon size={28} />
                                </div>
                                <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">{plan.name}</h3>
                                <div className="flex items-end gap-1 mb-4">
                                    <span className="text-5xl font-black">{plan.price}</span>
                                    {plan.period && <span className={`${plan.highlight ? 'text-slate-400' : 'text-slate-500'} font-bold mb-1`}>{plan.period}</span>}
                                </div>
                                <p className={`font-medium ${plan.highlight ? 'text-slate-400' : 'text-slate-500'}`}>
                                    {plan.description}
                                </p>
                            </div>

                            <ul className="space-y-4 mb-10">
                                {plan.features.map((feature) => (
                                    <li key={feature} className="flex items-center gap-3 text-sm font-bold tracking-tight">
                                        <div className={`size-5 rounded-full flex items-center justify-center transition-colors ${
                                            plan.highlight ? 'bg-primary/20 text-primary' : 'bg-slate-100 text-slate-400'
                                        }`}>
                                            <Check size={12} strokeWidth={4} />
                                        </div>
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <button className={`w-full py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest transition-all active:scale-95 ${
                                plan.highlight 
                                ? 'bg-primary text-white hover:bg-red-600 shadow-xl shadow-primary/30' 
                                : 'bg-slate-900 text-white hover:bg-black'
                            }`}>
                                {plan.buttonText}
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-24 text-center p-12 bg-white rounded-[3rem] border border-slate-200 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
                    <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight uppercase">Need something custom?</h2>
                    <p className="text-slate-500 font-medium max-w-2xl mx-auto mb-8">
                        Our team is ready to build a tailor-made solution for your unique business requirements. Let's discuss your vision.
                    </p>
                    <button className="px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest transition-all">
                        Talk to an Expert
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PricingPage