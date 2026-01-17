'use client'
import React from 'react'
import { useDispatch } from 'react-redux'
import { MapPin, Plus, Trash2 } from 'lucide-react'
import { setAddresses } from '@/lib/features/address/addressSlice'
import toast from 'react-hot-toast'

const AddressList = ({ addresses, setShowAddressForm }) => {
    const dispatch = useDispatch();

    const fetchAddresses = async () => {
        try {
            const res = await fetch('/api/address');
            const data = await res.json();
            if (data.success) dispatch(setAddresses(data.addresses));
        } catch (error) {
            console.error("Failed to fetch addresses");
        }
    };

    const handleDeleteAddress = async (id) => {
        try {
            const res = await fetch(`/api/address?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchAddresses(); 
                toast.success("Address removed");
            }
        } catch (error) {
            toast.error("Failed to delete address");
        }
    };

    return (
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between mb-8 gap-4">
                <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">My Addresses</h2>
                <button 
                    onClick={() => setShowAddressForm(true)}
                    className="flex items-center gap-2 px-3 md:px-6 py-3 bg-primary/10 text-primary rounded-2xl font-bold hover:bg-primary/20 transition-all"
                >
                    <Plus size={18} />
                    Add New
                </button>
            </div>

            {addresses.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center text-center opacity-50">
                    <MapPin size={64} className="mb-4 text-slate-300" />
                    <p className="font-bold text-slate-500">No addresses saved yet</p>
                    <p className="text-sm">Add your first shipping address to speed up checkout.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {addresses.map((addr) => (
                        <div key={addr.id} className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100 relative group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="font-black text-slate-800 uppercase tracking-tight text-sm">{addr.name}</p>
                                    <p className="text-xs font-bold text-slate-400">{addr.phone}</p>
                                </div>
                                <button 
                                    onClick={() => handleDeleteAddress(addr.id)}
                                    className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <div className="space-y-1 text-sm text-slate-600 font-medium">
                                <p>{addr.street}</p>
                                <p>{addr.city}, {addr.state} {addr.zip}</p>
                                <p className="text-xs uppercase font-bold tracking-widest text-slate-400 mt-2">{addr.country}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

export default AddressList
