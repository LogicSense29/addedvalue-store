'use client'
import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useRouter } from 'next/navigation'
import { Store, Loader2, CheckCircle2, Building2, MapPin, Phone, Mail, FileText, AtSign } from 'lucide-react'
import toast from 'react-hot-toast'
import { userData as setUserData } from '@/lib/features/user/userSlice'

const BecomeSellerPage = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.user.currentUser);

    const [loading, setLoading] = useState(false);
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        description: '',
        address: '',
        contact: '',
        email: ''
    });

    useEffect(() => {
        // If user is already in Redux, we are good
        if (user) {
            if (user.store) {
                 router.push('/store');
            } else {
                 setFormData(prev => ({ ...prev, email: user.email }));
                 setIsCheckingAuth(false);
            }
            return;
        }

        // If no user in Redux, try to fetch me to confirm if logged in or not
        const checkAuth = async () => {
            try {
                const res = await fetch('/api/auth/me');
                const data = await res.json();
                
                if (data.user) {
                    dispatch(setUserData(data.user)); // Update redux
                    if (data.user.store) {
                        router.push('/store');
                    } else {
                         setFormData(prev => ({ ...prev, email: data.user.email }));
                         setIsCheckingAuth(false);
                    }
                } else {
                    // Not logged in
                    router.push('/auth'); 
                }
            } catch (error) {
                router.push('/auth');
            }
        };

        checkAuth();
    }, [user, router, dispatch]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            // Auto-generate username from name if username hasn't been manually edited
            ...(name === 'name' && !prev.usernameTouched ? { 
                username: value.toLowerCase().replace(/[^a-z0-9]/g, '') 
            } : {})
        }));
    };

    const handleUsernameChange = (e) => {
        setFormData(prev => ({ 
            ...prev, 
            username: e.target.value,
            usernameTouched: true 
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (data.success) {
                toast.success("Store created successfully!");
                // Refresh user data to get the new store in the state
                const userRes = await fetch('/api/auth/me');
                if (userRes.ok) {
                    const userDataRes = await userRes.json();
                    dispatch(setUserData(userDataRes.user));
                }
                router.push('/store');
            } else {
                toast.error(data.error || "Failed to create store");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    if (isCheckingAuth) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-slate-500 font-medium">Loading...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 py-12 px-6 flex justify-center">
            <div className="max-w-3xl w-full bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-slate-100">
                
                <header className="mb-10 text-center">
                    <div className="size-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                        <Store size={32} />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-3 tracking-tight">Become a Seller</h1>
                    <p className="text-slate-500 font-medium text-lg">Launch your store and start selling to thousands of customers today.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-8">
                    
                    {/* Basic Info */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <Building2 size={20} className="text-primary" />
                            Store Details
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Store Name</label>
                                <input 
                                    required
                                    type="text" 
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. My Awesome Shop"
                                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Username</label>
                                <div className="relative">
                                    <AtSign size={16} className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />
                                    <input 
                                        required
                                        type="text" 
                                        name="username"
                                        value={formData.username}
                                        onChange={handleUsernameChange}
                                        placeholder="unique_username"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Description</label>
                            <textarea 
                                required
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Tell us about your store..."
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold resize-none"
                            />
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-6 pt-4">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-2">
                            <MapPin size={20} className="text-primary" />
                            Location & Contact
                        </h2>
                        
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Business Address</label>
                            <input 
                                required
                                type="text" 
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Full business address"
                                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Business Email</label>
                                <div className="relative">
                                    <Mail size={16} className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />
                                    <input 
                                        required
                                        type="email" 
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Contact Number</label>
                                <div className="relative">
                                    <Phone size={16} className="absolute top-1/2 -translate-y-1/2 left-4 text-slate-400" />
                                    <input 
                                        required
                                        type="tel" 
                                        name="contact"
                                        value={formData.contact}
                                        onChange={handleChange}
                                        placeholder="+1 234 567 8900"
                                        className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="pt-6">
                        <button 
                            type="submit"
                            disabled={loading}
                            className="w-full bg-slate-900 text-white p-5 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 hover:bg-black transition-all active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-slate-200"
                        >
                            {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 />}
                            Create My Store
                        </button>
                    </div>

                </form>
            </div>
        </div>
    )
}

export default BecomeSellerPage
