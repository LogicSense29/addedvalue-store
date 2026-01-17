'use client'
import React, { useEffect, useState } from 'react'
import { Ticket, Copy, Check, Info, Sparkles, Zap, Gift, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'

const VoucherPage = () => {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [copiedCode, setCopiedCode] = useState(null);
    const router = useRouter();

    const fetchCoupons = async () => {
        try {
            const res = await fetch('/api/coupons/public');
            const data = await res.json();
            if (data.success) {
                setCoupons(data.coupons);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (code) => {
        navigator.clipboard.writeText(code);
        setCopiedCode(code);
        toast.success(`Code ${code} copied!`);
        setTimeout(() => setCopiedCode(null), 3000);
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-slate-50 py-16 px-6">
            <div className="max-w-7xl mx-auto">
                
                <header className="mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
                    <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-6 font-bold text-xs uppercase tracking-widest">
                        <ArrowLeft size={14} />
                        Back
                    </button>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-6 shadow-sm">
                        <Gift size={14} />
                        Exclusive Rewards
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter uppercase leading-none mb-6">
                        Claim Your <span className="text-primary italic">Bonus</span>.
                    </h1>
                    <p className="text-xl text-slate-500 font-medium max-w-2xl leading-relaxed">
                        Explore our active rewards and discount vouchers. Apply these codes at checkout to unlock significant savings on your favorite tech.
                    </p>
                </header>

                {coupons.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {coupons.map((coupon, idx) => (
                            <div 
                                key={coupon.code} 
                                className="relative bg-white rounded-[2.5rem] p-10 border border-slate-200 shadow-sm overflow-hidden group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                                style={{ animationDelay: `${idx * 150}ms` }}
                            >
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-primary/10 transition-colors" />
                                
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="size-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform">
                                            <Ticket size={28} />
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">Expires</p>
                                            <p className="text-sm font-bold text-slate-900 uppercase tracking-tight">
                                                {new Date(coupon.expiresAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-8">
                                        <div className="flex items-baseline gap-1 mb-2">
                                            <span className="text-5xl font-black text-slate-900 tracking-tighter">{coupon.discount}%</span>
                                            <span className="text-xl font-black text-primary uppercase italic">Off</span>
                                        </div>
                                        <h3 className="text-lg font-black text-slate-800 uppercase tracking-tight mb-2">{coupon.code}</h3>
                                        <p className="text-slate-500 font-medium leading-relaxed italic">
                                            {coupon.description}
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-2xl group/input transition-all hover:bg-white hover:border-primary/30">
                                            <span className="flex-1 font-black text-slate-900 tracking-widest text-center select-all">{coupon.code}</span>
                                            <button 
                                                onClick={() => copyToClipboard(coupon.code)}
                                                className={`size-10 rounded-xl flex items-center justify-center transition-all ${
                                                    copiedCode === coupon.code ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white'
                                                }`}
                                            >
                                                {copiedCode === coupon.code ? <Check size={18} /> : <Copy size={18} />}
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            <Zap size={10} className="text-primary" />
                                            Active and Verified
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] p-16 md:p-24 text-center border border-slate-100 shadow-sm animate-in fade-in duration-1000">
                        <div className="size-24 rounded-[2rem] bg-indigo-50 text-indigo-400 flex items-center justify-center mx-auto mb-10 shadow-lg shadow-indigo-100/20">
                            <Sparkles size={48} />
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter mb-6">No Active Vouchers</h2>
                        <p className="text-xl text-slate-400 font-medium max-w-xl mx-auto mb-12">
                            Our team is currently preparing the next wave of exclusive rewards. Check back soon for new opportunities to save.
                        </p>
                        <button className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                            Notify Me of Deals
                        </button>
                    </div>
                )}

                <div className="mt-20 p-10 bg-slate-900 rounded-[3rem] text-white flex flex-col md:flex-row items-center justify-between gap-10 overflow-hidden relative group">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10 text-center md:text-left">
                        <div className="size-20 rounded-3xl bg-white/10 backdrop-blur-md flex items-center justify-center text-primary flex-shrink-0">
                            <Info size={40} />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black uppercase tracking-wider mb-2">Member Exclusive?</h3>
                            <p className="text-slate-400 font-medium leading-relaxed max-w-2xl">
                                Some vouchers are exclusively unlocked for our Plus Members. Upgrade your account today to access the most prestigious rewards.
                            </p>
                        </div>
                    </div>
                    <Link href="/pricing" className="relative z-10 px-10 py-5 bg-primary text-white rounded-[2rem] font-black uppercase tracking-widest text-sm hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/40 flex-shrink-0">
                        View Memberships
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default VoucherPage
