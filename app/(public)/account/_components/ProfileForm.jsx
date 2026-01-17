'use client'
import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { User, Settings, Camera, CheckCircle2, Loader2 } from 'lucide-react'
import { userData as setUserData } from '@/lib/features/user/userSlice'
import toast from 'react-hot-toast'

const ProfileForm = ({ user }) => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [profileData, setProfileData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });

    useEffect(() => {
        if (user) {
            setProfileData({ name: user.name || '', email: user.email || '' });
        }
    }, [user]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch('/api/user', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: profileData.name })
            });
            const data = await res.json();
            if (data.success) {
                dispatch(setUserData(data.user));
                toast.success("Profile updated successfully");
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Personal Information</h2>
                <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                    <Settings size={20} />
                </div>
            </div>
            
            <form onSubmit={handleUpdateProfile} className="max-w-2xl space-y-8">
                <div className="relative group w-fit">
                    <div className="size-24 rounded-3xl bg-slate-100 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
                        <User size={40} />
                    </div>
                    <button type="button" className="absolute -bottom-2 -right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-primary transition-colors">
                        <Camera size={16} />
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profileData.name}
                            onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                            className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-semibold text-slate-800"
                        />
                    </div>
                    <div className="space-y-2 opacity-60">
                        <label className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">Email Address</label>
                        <input 
                            type="email" 
                            readOnly 
                            value={profileData.email}
                            className="w-full px-5 py-4 bg-slate-100 border border-slate-100 rounded-2xl cursor-not-allowed font-semibold text-slate-500"
                        />
                    </div>
                </div>

                <button 
                    disabled={loading}
                    className="bg-slate-900 hover:bg-black text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-3 transition-all active:scale-95 disabled:opacity-50"
                >
                    {loading ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                    Save Changes
                </button>
            </form>
        </div>
    )
}

export default ProfileForm
