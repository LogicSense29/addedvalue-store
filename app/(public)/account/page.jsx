'use client'
import React, { useState, useEffect, Suspense } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { User, MapPin, Package, Settings, Camera, Plus, Trash2, CheckCircle2, Loader2, Lock, ShieldAlert, LogOut, Mail, Heart, Ticket, Store } from 'lucide-react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import AddressModal from '@/components/AddressModal'
import { setAddresses } from '@/lib/features/address/addressSlice'

// Components
import ProfileForm from './_components/ProfileForm'
import AddressList from './_components/AddressList'
import SecuritySettings from './_components/SecuritySettings'

const AccountPageContent = () => {
    const dispatch = useDispatch();
    const router = useRouter();
    const searchParams = useSearchParams();
    const user = useSelector((state) => state.user.currentUser);
    
    // Determine active tab
    const tabParam = searchParams.get('tab');
    const activeTab = tabParam || 'profile';

    const addresses = useSelector(state => state.address.list);
    const [showAddressForm, setShowAddressForm] = useState(false);

    useEffect(() => {
        if (user) {
            fetchAddresses();
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const res = await fetch('/api/address');
            const data = await res.json();
            if (data.success) dispatch(setAddresses(data.addresses));
        } catch (error) {
            console.error("Failed to fetch addresses");
        }
    };


    if (!user) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-slate-500 font-medium tracking-wide">Loading your account...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col lg:flex-row gap-10">
                    
                    {/* Sidebar Navigation */}
                    <aside className={`lg:w-72 ${tabParam ? 'hidden lg:block' : 'block'}`}>
                        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/50">
                            <div className="flex items-center gap-4 mb-8 pb-6 border-b border-slate-100 uppercase tracking-tighter">
                                <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xl">
                                    {user.name?.charAt(0) || user.email?.charAt(0)}
                                </div>
                                <div>
                                    <p className="font-extrabold text-slate-800 truncate max-w-[150px]">{user.name || 'User'}</p>
                                    <p className="text-xs font-bold text-slate-400">Member</p>
                                </div>
                            </div>
                            
                            <nav className="space-y-2">
                                {[
                                    { id: 'profile', label: 'Profile Info', icon: User },
                                    { id: 'addresses', label: 'My Addresses', icon: MapPin },
                                    { id: 'security', label: 'Login & Security', icon: Lock },
                                    { id: 'store', label: user.store ? 'My Store' : 'Become a Seller', icon: Store, href: user.store ? '/store' : '/become-seller' },
                                    { id: 'orders', label: 'Order History', icon: Package, href: '/orders' },
                                    { id: 'inbox', label: 'Inbox', icon: Mail, href: '/inbox' },
                                    { id: 'wishlist', label: 'Wishlist', icon: Heart, href: '/wishlist' },
                                    { id: 'vouchers', label: 'Vouchers', icon: Ticket, href: '/vouchers' },
                                ].map((item) => (
                                    item.href ? (
                                        <Link key={item.id} href={item.href} className="flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-50 rounded-xl transition-all font-semibold text-sm">
                                            <item.icon size={18} />
                                            {item.label}
                                        </Link>
                                    ) : (
                                        <Link 
                                            key={item.id}
                                            href={`/account?tab=${item.id}`}
                                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                                                activeTab === item.id 
                                                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                                : 'text-slate-600 hover:bg-slate-50'
                                            }`}
                                        >
                                            <item.icon size={18} />
                                            {item.label}
                                        </Link>
                                    )
                                ))}
                            </nav>
                        </div>
                    </aside>

                    {/* Main Content Area */}
                    <main className={`flex-1 ${!tabParam ? 'hidden lg:block' : 'block'}`}>
                        {/* Mobile Back Button */}
                        <div className="lg:hidden mb-4">
                            <Link href="/account" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-900">
                                <LogOut className="rotate-180" size={16} /> Back to Menu
                            </Link>
                        </div>
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/50 min-h-[500px]">
                            
                            {activeTab === 'profile' && <ProfileForm user={user} />}
                            
                            {activeTab === 'addresses' && <AddressList addresses={addresses} setShowAddressForm={setShowAddressForm} />}
                            
                            {activeTab === 'security' && <SecuritySettings />}

                        </div>
                    </main>
                </div>
            </div>

            {/* Address Modal */}
            {showAddressForm && <AddressModal setShowAddressModal={setShowAddressForm} />}

        </div>
    )
}

export default function AccountPage() {
    return (
        <Suspense fallback={
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-slate-500 font-medium tracking-wide">Loading your account...</p>
            </div>
        }>
            <AccountPageContent />
        </Suspense>
    );
}
