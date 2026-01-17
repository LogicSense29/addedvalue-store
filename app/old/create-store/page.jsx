'use client'
import { assets } from "@/assets/assets"
import { useEffect, useState } from "react"
import Image from "next/image"
import toast from "react-hot-toast"
import Loading from "@/components/Loading"
import { Store, Upload, CheckCircle2, Info, ArrowRight, ShieldCheck, Zap } from "lucide-react"

export default function CreateStore() {

    const [alreadySubmitted, setAlreadySubmitted] = useState(false)
    const [status, setStatus] = useState("")
    const [loading, setLoading] = useState(true)
    const [message, setMessage] = useState("")

    const [storeInfo, setStoreInfo] = useState({
        name: "",
        username: "",
        description: "",
        email: "",
        contact: "",
        address: "",
        image: ""
    })

    const onChangeHandler = (e) => {
        setStoreInfo({ ...storeInfo, [e.target.name]: e.target.value })
    }

    const fetchSellerStatus = async () => {
        // Logic to check if the store is already submitted
        await new Promise(resolve => setTimeout(resolve, 800));
        setLoading(false)
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        // Logic to submit the store details
        await new Promise(resolve => setTimeout(resolve, 2000));
        setAlreadySubmitted(true);
        setMessage("Your store application has been submitted for review. Expect an update within 48 hours.");
    }

    useEffect(() => {
        fetchSellerStatus()
    }, [])

    return !loading ? (
        <div className="min-h-screen bg-white py-24 px-6 overflow-hidden">
            {!alreadySubmitted ? (
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
                        
                        {/* Sidebar Information */}
                        <div className="lg:col-span-5 space-y-12 animate-in fade-in slide-in-from-left-4 duration-1000">
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-xs font-black uppercase tracking-widest text-primary mb-8 animate-pulse">
                                    <Zap size={14} />
                                    Seller Onboarding
                                </div>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-none uppercase">
                                    Launch Your <span className="text-primary italic">Legacy</span>.
                                </h1>
                                <p className="text-xl text-slate-500 font-medium leading-relaxed">
                                    Join an elite network of merchants. Submit your store details, and our curation team will review your application for activation.
                                </p>
                            </div>

                            <div className="space-y-6">
                                {[
                                    { icon: ShieldCheck, title: "Verified Platform", desc: "Enterprise-grade security and trust for your business." },
                                    { icon: Store, title: "Custom Storefront", desc: "A premium digital space for your curated collections." },
                                    { icon: CheckCircle2, title: "Global Logistics", desc: "Access to our worldwide fulfillment and shipping network." }
                                ].map((item) => (
                                    <div key={item.title} className="flex gap-6 items-start">
                                        <div className="size-12 rounded-2xl bg-slate-50 flex items-center justify-center text-primary flex-shrink-0">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight mb-1">{item.title}</h3>
                                            <p className="text-slate-500 font-medium text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="p-8 bg-slate-900 rounded-[2.5rem] text-white flex items-center gap-6">
                                <Info size={32} className="text-primary" />
                                <p className="text-sm font-medium leading-relaxed italic opacity-80">
                                    "Our mission is to empower visionaries. Your store is the first step towards a global digital presence."
                                </p>
                            </div>
                        </div>

                        {/* Form Section */}
                        <div className="lg:col-span-7 animate-in fade-in slide-in-from-right-4 duration-1000">
                            <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Analyzing data...", success: "Application Sent!", error: "Request Failed" })} className="bg-slate-50 rounded-[3rem] p-8 md:p-12 border border-slate-100 shadow-sm space-y-8">
                                
                                {/* Logo Upload */}
                                <div className="flex flex-col items-center justify-center py-6 border-2 border-dashed border-slate-200 rounded-[2rem] bg-white group hover:border-primary transition-colors duration-500">
                                    <label className="cursor-pointer flex flex-col items-center">
                                        <div className="size-20 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:text-primary transition-colors overflow-hidden mb-4">
                                            {storeInfo.image ? (
                                                <Image src={URL.createObjectURL(storeInfo.image)} className="w-full h-full object-cover" alt="" width={80} height={80} />
                                            ) : (
                                                <Upload size={32} />
                                            )}
                                        </div>
                                        <span className="text-sm font-black text-slate-400 uppercase tracking-widest px-1 group-hover:text-primary transition-colors">
                                            {storeInfo.image ? 'Change Logo' : 'Upload Store Logo'}
                                        </span>
                                        <input type="file" accept="image/*" onChange={(e) => setStoreInfo({ ...storeInfo, image: e.target.files[0] })} hidden />
                                    </label>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Unique Username</label>
                                        <input required name="username" onChange={onChangeHandler} value={storeInfo.username} type="text" placeholder="@yourstore" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Official Name</label>
                                        <input required name="name" onChange={onChangeHandler} value={storeInfo.name} type="text" placeholder="The Luxury Collection" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Elevator Pitch (Description)</label>
                                    <textarea required name="description" onChange={onChangeHandler} value={storeInfo.description} rows={3} placeholder="Tell us what makes your products unique..." className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold resize-none" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Business Email</label>
                                        <input required name="email" onChange={onChangeHandler} value={storeInfo.email} type="email" placeholder="official@business.com" className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Contact Hotline</label>
                                        <input required name="contact" onChange={onChangeHandler} value={storeInfo.contact} type="text" placeholder="+1..." className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold text-slate-800" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Regional Headquarters (Address)</label>
                                    <textarea required name="address" onChange={onChangeHandler} value={storeInfo.address} rows={2} placeholder="Legal business address..." className="w-full px-6 py-4 bg-white border border-slate-100 rounded-2xl focus:ring-4 focus:ring-primary/5 focus:border-primary outline-none transition-all font-semibold resize-none" />
                                </div>

                                <button className="w-full bg-slate-900 text-white py-5 rounded-[2rem] font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-95 shadow-xl shadow-slate-200">
                                    Submit Application
                                    <ArrowRight size={18} />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 animate-in zoom-in-95 duration-700">
                    <div className="size-24 rounded-[2rem] bg-indigo-50 text-indigo-600 flex items-center justify-center mb-10 shadow-lg shadow-indigo-100">
                        <CheckCircle2 size={48} />
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black text-slate-900 uppercase tracking-tight mb-6">Application <span className="text-indigo-600">Pending</span></h2>
                    <p className="text-xl text-slate-500 font-medium max-w-xl mx-auto mb-10 leading-relaxed">{message}</p>
                    <button onClick={() => setAlreadySubmitted(false)} className="px-12 py-5 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-[2rem] font-black uppercase tracking-widest transition-all">
                        Back to Overview
                    </button>
                    {status === "approved" && <p className="mt-8 text-slate-400 font-bold uppercase tracking-widest text-xs">redirecting to dashboard in <span className="text-slate-800">5 seconds</span></p>}
                </div>
            )}
        </div>
    ) : (<Loading />)
}