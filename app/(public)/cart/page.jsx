'use client'
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, MapPin, CreditCard, Banknote } from 'lucide-react';
import { deleteItemFromCart, addToCart, removeFromCart, clearCart } from '@/lib/features/cart/cartSlice';
import { setAddresses } from '@/lib/features/address/addressSlice';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import AddressModal from '@/components/AddressModal';

export default function ModernCart() {
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const dispatch = useDispatch();
    const router = useRouter();
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);
    const user = useSelector(state => state.user.currentUser);
    const addressList = useSelector(state => state.address.list);

    const [cartArray, setCartArray] = useState([]);
    const [subtotal, setSubtotal] = useState(0);
    
    // Checkout State
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [showAddressModal, setShowAddressModal] = useState(false);
    
    // Coupon State
    const [couponCode, setCouponCode] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const createCartArray = () => {
        let currentSubtotal = 0;
        const array = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const { productId, quantity, customizations } = value;
            const product = products.find(p => p.id === productId);
            if (product) {
                array.push({
                    ...product,
                    quantity,
                    customizations,
                    cartKey: key,
                    storeId: product.storeId // Ensure storeId is passed
                });
                currentSubtotal += product.price * quantity;
            }
        }
        setCartArray(array);
        setSubtotal(currentSubtotal);
    };

    // Load addresses on mount
    useEffect(() => {
        const fetchAddresses = async () => {
            if (user) {
                try {
                    const res = await fetch('/api/address');
                    const data = await res.json();
                    if (data.success) {
                        dispatch(setAddresses(data.addresses));
                    }
                } catch (error) {
                    console.error("Failed to load addresses");
                }
            }
        };
        fetchAddresses();
    }, [user, dispatch]);

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    const handleUpdateQuantity = (item, delta) => {
        if (delta > 0) {
            dispatch(addToCart({ 
                productId: item.id, 
                cartKey: item.cartKey, 
                customizations: item.customizations 
            }));
        } else {
            dispatch(removeFromCart({ 
                productId: item.id, 
                cartKey: item.cartKey 
            }));
        }
    };

    const handleDeleteItem = (cartKey) => {
        dispatch(deleteItemFromCart({ cartKey }));
        toast.success("Item removed from vault.");
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) return;
        const toastId = toast.loading('Verifying code...');
        try {
            const res = await fetch(`/api/coupons/public`);
            const data = await res.json();
            if (data.success) {
                const found = data.coupons.find(c => c.code.toLowerCase() === couponCode.toLowerCase());
                if (found) {
                    setAppliedCoupon(found);
                    toast.success("Privilege applied.", { id: toastId });
                } else {
                    toast.error("Code invalid or expired.", { id: toastId });
                }
            }
        } catch (error) {
            toast.error("Verification failed.", { id: toastId });
        }
    };

    const handlePlaceOrder = async () => {
        if (!user) {
            toast.error("Please login to place an order");
            return router.push('/auth');
        }

        if (!selectedAddress) {
            toast.error("Please select a shipping address");
            return;
        }

        const toastId = toast.loading('Securing order...');

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId: user.id,
                    addressId: selectedAddress.id,
                    paymentMethod,
                    items: cartArray.map(item => ({
                        productId: item.id,
                        storeId: item.storeId || 'default', // Fallback if storeId missing
                        quantity: item.quantity,
                        price: item.price,
                        customizations: item.customizations || {}
                    }))
                })
            });

            const data = await res.json();
            if (data.success) {
                dispatch(clearCart());
                toast.success("Order secured successfully!", { id: toastId });
                // Redirect to the track page of the first created order
                const orderId = data.orders[0].id;
                router.push(`/orders/${orderId}/track`);
            } else {
                toast.error(data.error || "Failed to secure order", { id: toastId });
            }
        } catch (error) {
            console.error(error);
            toast.error("Transmission failed. Please retry.", { id: toastId });
        }
    };

    if (cartArray.length === 0) {
        return (
            <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-700">
                <div className="size-24 bg-gray-50 rounded-full flex items-center justify-center mb-8">
                    <ShoppingBag size={32} className="text-gray-300" />
                </div>
                <h1 className="text-4xl font-bold tracking-tighter text-[#1a1a1a] mb-4">The vault is empty<span className="text-primary">.</span></h1>
                <p className="text-gray-400 max-w-xs mb-10 text-sm leading-relaxed">Your curated selection is currently unoccupied. Discover our latest releases to begin your collection.</p>
                <Link 
                    href="/shop" 
                    className="bg-[#1a1a1a] text-white px-10 py-5 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all duration-500 shadow-xl hover:shadow-[0_20px_40px_rgba(255,0,0,0.2)]"
                >
                    Explore Release
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#fafafa] pt-20 pb-40 px-6">
            <div className="max-w-[1400px] mx-auto">
                {/* Header */}
                <div className="mb-20">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-3">curated selection</h4>
                    <h1 className="text-6xl font-black tracking-tighter text-[#1a1a1a]">Your Cart<span className="text-gray-200">({cartArray.length})</span></h1>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-20">
                    {/* Items List */}
                    <div className="xl:col-span-2 space-y-12">
                        {cartArray.map((item, idx) => (
                            <div key={item.cartKey} className="group relative flex flex-col sm:flex-row gap-8 pb-12 border-b border-gray-100 animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                {/* Thumbnail */}
                                <div className="relative size-48 bg-white rounded-3xl overflow-hidden border border-gray-50 flex-shrink-0 group-hover:shadow-2xl transition-all duration-700">
                                    <Image src={item.images[0]} alt={item.name} fill className="object-contain p-4 group-hover:scale-110 transition-transform duration-700" />
                                </div>

                                {/* Details */}
                                <div className="flex-1 flex flex-col justify-between py-2">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-1">{item.category}</p>
                                                <h3 className="text-2xl font-bold tracking-tight text-[#1a1a1a]">{item.name}</h3>
                                            </div>
                                            <button 
                                                onClick={() => handleDeleteItem(item.cartKey)}
                                                className="p-2 text-gray-300 hover:text-primary transition-colors hover:bg-primary/5 rounded-full"
                                                title="Remove Item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>

                                        {/* Personalization Summary */}
                                        {item.customizations && Object.keys(item.customizations).length > 0 && (
                                            <div className="flex flex-wrap gap-4 mt-4">
                                                {item.customizations.size && (
                                                    <div className="px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 border border-gray-100">
                                                        Size: {item.customizations.size}
                                                    </div>
                                                )}
                                                {item.customizations.color && (
                                                    <div className="flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-lg text-[9px] font-bold uppercase tracking-widest text-gray-500 border border-gray-100">
                                                        Color: {item.customizations.color}
                                                    </div>
                                                )}
                                                {item.customizations.method && (
                                                    <div className="px-3 py-1 bg-primary/5 rounded-lg text-[9px] font-bold uppercase tracking-widest text-primary border border-primary/10">
                                                        {item.customizations.method}
                                                    </div>
                                                )}
                                                {item.customizations.brandingText && (
                                                    <div className="w-full mt-2 p-3 bg-gray-50 rounded-xl text-[10px] italic text-gray-400 border border-gray-100 leading-relaxed">
                                                        "{item.customizations.brandingText}"
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center justify-between mt-8 sm:mt-0 pt-6 border-t border-gray-50/50">
                                        <div className="flex items-center gap-6">
                                            <div className="flex items-center bg-white border border-gray-100 rounded-full px-2 py-1 shadow-sm">
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, -1)}
                                                    className="p-2 hover:text-primary transition-colors disabled:opacity-20"
                                                    disabled={item.quantity <= 1}
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="w-8 text-center text-xs font-black">{item.quantity}</span>
                                                <button 
                                                    onClick={() => handleUpdateQuantity(item, 1)}
                                                    className="p-2 hover:text-primary transition-colors"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Total</p>
                                            <p className="text-xl font-black text-[#1a1a1a]">{currency}{(item.price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary Sidebar */}
                    <div className="relative">
                        <div className="sticky top-32 space-y-8">
                            <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_40px_80px_rgba(0,0,0,0.03)] border border-gray-50">
                                <h3 className="text-xl font-bold tracking-tight text-[#1a1a1a] mb-8">Order Summary</h3>
                                
                                <div className="space-y-4 mb-8">
                                    <div className="flex justify-between text-sm font-medium text-gray-400">
                                        <span>Subtotal</span>
                                        <span className="text-[#1a1a1a]">{currency}{subtotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-sm font-medium text-gray-400">
                                        <span>Shipping</span>
                                        <span className="text-primary font-bold uppercase text-[10px] tracking-widest">Gratis</span>
                                    </div>
                                    {appliedCoupon && (
                                         <div className="flex justify-between text-sm font-medium text-primary">
                                            <span>Privilege ({appliedCoupon.code})</span>
                                            <span>-{appliedCoupon.discount}%</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between text-sm font-medium text-gray-400 italic">
                                        <span>Personalization</span>
                                        <span className="text-gray-300">Included</span>
                                    </div>

                                    {/* Coupon Input */}
                                    {!appliedCoupon && (
                                        <div className="flex gap-2">
                                            <input 
                                                type="text" 
                                                value={couponCode} 
                                                onChange={(e) => setCouponCode(e.target.value)}
                                                placeholder="PROMO CODE" 
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest focus:outline-none focus:border-primary transition-all"
                                            />
                                            <button 
                                                onClick={handleApplyCoupon}
                                                disabled={!couponCode}
                                                className="px-4 py-2 bg-[#1a1a1a] text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-primary disabled:opacity-50 transition-colors"
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {/* Address Selection */}
                                <div className="mb-8 pt-8 border-t border-gray-100">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-4 flex justify-between items-center">
                                        Shipping Destination
                                        {selectedAddress && (
                                            <button onClick={() => setSelectedAddress(null)} className="text-primary hover:underline">Change</button>
                                        )}
                                    </h4>
                                    
                                    {!selectedAddress ? (
                                        <div className="space-y-3">
                                            {addressList.length > 0 && (
                                                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                                    {addressList.map((addr) => (
                                                        <button 
                                                            key={addr.id || Math.random()} 
                                                            onClick={() => setSelectedAddress(addr)}
                                                            className="text-left p-3 rounded-xl border border-gray-100 hover:border-[#1a1a1a] transition-all text-xs group"
                                                        >
                                                            <div className="font-bold text-[#1a1a1a] group-hover:text-primary transition-colors">{addr.name}</div>
                                                            <div className="text-gray-400 truncate">{addr.street}, {addr.city}</div>
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <button 
                                                onClick={() => setShowAddressModal(true)}
                                                className="w-full py-3 border border-dashed border-gray-300 rounded-xl text-xs font-bold text-gray-400 hover:text-[#1a1a1a] hover:border-[#1a1a1a] transition-all flex items-center justify-center gap-2"
                                            >
                                                <Plus size={14} /> Add New Destination
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 relative group">
                                            <div className="absolute top-4 right-4 text-primary"><MapPin size={16} /></div>
                                            <p className="font-bold text-[#1a1a1a] text-sm mb-1">{selectedAddress.name}</p>
                                            <p className="text-xs text-gray-500 leading-relaxed">
                                                {selectedAddress.street}<br/>
                                                {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zip}<br/>
                                                {selectedAddress.country}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-2 font-mono">{selectedAddress.phone}</p>
                                        </div>
                                    )}
                                </div>

                                {/* Payment Method */}
                                <div className="mb-8 pt-8 border-t border-gray-100">
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] mb-4">Payment Method</h4>
                                    <div className="grid grid-cols-2 gap-3">
                                        <button 
                                            onClick={() => setPaymentMethod('COD')}
                                            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                                paymentMethod === 'COD' 
                                                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg' 
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <Banknote size={20} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">COD</span>
                                        </button>
                                        <button 
                                            onClick={() => setPaymentMethod('STRIPE')}
                                            className={`p-4 rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                                                paymentMethod === 'STRIPE' 
                                                ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg' 
                                                : 'bg-white text-gray-400 border-gray-100 hover:border-gray-200'
                                            }`}
                                        >
                                            <CreditCard size={20} />
                                            <span className="text-[10px] font-bold uppercase tracking-widest">Card</span>
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-8 border-t border-gray-100 mb-10">
                                    <div className="flex justify-between items-end">
                                        <div>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-1">Final Amount</p>
                                            <p className="text-4xl font-black tracking-tighter text-[#1a1a1a]">
                                                {currency}
                                                {(appliedCoupon 
                                                    ? subtotal - (subtotal * appliedCoupon.discount / 100) 
                                                    : subtotal
                                                ).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button 
                                    onClick={handlePlaceOrder}
                                    className="w-full bg-primary text-white py-6 rounded-full font-black tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3 hover:shadow-[0_20px_40px_rgba(251,5,5,0.3)] transition-all duration-500 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={!cartArray.length}
                                >
                                    Proceed to Checkout <ArrowRight size={16} />
                                </button>
                            </div>

                            {/* Reassurance */}
                            <div className="flex items-center gap-4 px-8">
                                <div className="p-3 bg-amber-400/5 text-amber-500 rounded-2xl"><ShieldCheck size={20} /></div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a]">Secure Transaction</p>
                                    <p className="text-[10px] text-gray-400 leading-tight">Your data is encrypted and protected directly via our vault.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {showAddressModal && <AddressModal setShowAddressModal={setShowAddressModal} />}
        </div>
    );
}
