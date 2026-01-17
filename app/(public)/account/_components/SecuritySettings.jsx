'use client'
import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ShieldAlert, Lock, Trash2, Loader2, LogOut } from 'lucide-react'
import { userData as setUserData } from '@/lib/features/user/userSlice'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

const SecuritySettings = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    // Change Password State
    const [securityData, setSecurityData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    // Delete Account State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteConfirmText, setDeleteConfirmText] = useState('');

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (securityData.newPassword !== securityData.confirmPassword) {
            return toast.error("Passwords do not match");
        }
        setLoading(true);
        try {
            const res = await fetch('/api/user/change-password', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    oldPassword: securityData.oldPassword, 
                    newPassword: securityData.newPassword 
                })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Password updated successfully");
                setSecurityData({ oldPassword: '', newPassword: '', confirmPassword: '' });
            } else {
                toast.error(data.error);
            }
        } catch (error) {
            toast.error("Failed to change password");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (deleteConfirmText !== 'DELETE') return;
        setLoading(true);
        try {
            const res = await fetch('/api/user', { method: 'DELETE' });
            if (res.ok) {
                toast.success("Account deleted. We're sorry to see you go.");
                dispatch(setUserData(null));
                router.push('/');
            }
        } catch (error) {
            toast.error("Failed to delete account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Login & Security</h2>
                <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
                    <ShieldAlert size={20} />
                </div>
            </div>

            {/* Password Change Section */}
            <form onSubmit={handleChangePassword} className="max-w-xl space-y-6 pb-12 mb-12 border-b border-slate-100">
                <h3 className="text-lg font-bold text-slate-800">Change Password</h3>
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Current Password</label>
                        <input 
                            required 
                            type="password" 
                            value={securityData.oldPassword}
                            onChange={(e) => setSecurityData({...securityData, oldPassword: e.target.value})}
                            className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                        />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Password</label>
                            <input 
                                required 
                                type="password" 
                                value={securityData.newPassword}
                                onChange={(e) => setSecurityData({...securityData, newPassword: e.target.value})}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Confirm New Password</label>
                            <input 
                                required 
                                type="password" 
                                value={securityData.confirmPassword}
                                onChange={(e) => setSecurityData({...securityData, confirmPassword: e.target.value})}
                                className="w-full px-5 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-primary/20 outline-none transition-all font-semibold"
                            />
                        </div>
                    </div>
                </div>
                <button 
                    disabled={loading}
                    className="bg-slate-900 text-white px-8 py-3.5 rounded-2xl font-bold flex items-center gap-2 hover:scale-105 active:scale-100 transition-all disabled:opacity-50"
                >
                    <Lock size={18} />
                    Update Password
                </button>
            </form>

            {/* Danger Zone */}
            <div className="p-8 bg-rose-50/50 rounded-[2rem] border border-rose-100">
                <div className="flex items-center gap-3 text-rose-600 mb-4">
                    <ShieldAlert size={24} />
                    <h3 className="text-xl font-bold uppercase tracking-tight">Danger Zone</h3>
                </div>
                <p className="text-slate-600 font-medium mb-6">
                    Deleting your account is permanent and cannot be undone. All your data, including your orders and addresses, will be removed.
                </p>
                <button 
                    onClick={() => setShowDeleteModal(true)}
                    className="px-8 py-3.5 bg-rose-600 text-white rounded-2xl font-bold flex items-center gap-2 hover:bg-rose-700 transition-colors shadow-lg shadow-rose-200"
                >
                    <Trash2 size={18} />
                    Close My Account Forever
                </button>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-white w-full max-w-lg rounded-[2.5rem] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
                        <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Are you absolutely sure?</h3>
                        <p className="text-slate-500 mb-8 leading-relaxed">
                            This action will permanently delete your account and all associated data. To confirm, please type <span className="text-rose-600 font-black">DELETE</span> below.
                        </p>
                        
                        <input 
                            type="text" 
                            placeholder="Type DELETE to confirm"
                            value={deleteConfirmText}
                            onChange={(e) => setDeleteConfirmText(e.target.value)}
                            className="w-full px-6 py-4 bg-slate-50 border-2 border-slate-100 rounded-2xl mb-8 focus:border-rose-500 outline-none transition-all font-bold text-rose-600 uppercase tracking-widest text-center"
                        />

                        <div className="flex gap-4">
                            <button 
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-6 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                            >
                                Cancel
                            </button>
                            <button 
                                disabled={deleteConfirmText !== 'DELETE' || loading}
                                onClick={handleDeleteAccount}
                                className="flex-[1.5] px-6 py-4 bg-rose-600 text-white rounded-2xl font-bold hover:bg-rose-700 transition-all disabled:opacity-30 flex items-center justify-center gap-2"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : <LogOut size={20} />}
                                Delete My Account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default SecuritySettings
