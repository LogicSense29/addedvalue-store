'use client'
import React, { useEffect, useState } from 'react'
import { Heart, Trash2, ShoppingCart, MoveRight, ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Loading from '@/components/Loading'
import { useDispatch } from 'react-redux'
import { addToCart } from '@/lib/features/cart/cartSlice'

const WishlistPage = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();
    const dispatch = useDispatch();
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const fetchWishlist = async () => {
        try {
            const res = await fetch('/api/wishlist');
            const data = await res.json();
            if (data.success) {
                setWishlist(data.wishlist);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const removeFromWishlist = async (productId) => {
        try {
            const res = await fetch('/api/wishlist', {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(wishlist.filter(item => item.id !== productId));
                toast.success("Removed from wishlist");
            }
        } catch (error) {
            toast.error("Failed to remove item");
        }
    };

    const handleAddToCart = (product) => {
        dispatch(addToCart({ productId: product.id }));
        toast.success(`${product.name} added to cart!`);
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-white py-12 px-6">
            <div className="max-w-7xl mx-auto">
                
                <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="animate-in fade-in slide-in-from-left-4 duration-700">
                        <button onClick={() => router.back()} className="flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-colors mb-4 font-bold text-xs uppercase tracking-widest">
                            <ArrowLeft size={14} />
                            Back
                        </button>
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
                            My <span className="text-primary italic">Wishlist</span>
                        </h1>
                    </div>
                    <p className="text-slate-400 font-black uppercase tracking-[0.2em] text-xs animate-in fade-in slide-in-from-right-4 duration-700">
                        {wishlist.length} Items Saved
                    </p>
                </header>

                {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {wishlist.map((product, idx) => (
                            <div 
                                key={product.id} 
                                className="group relative animate-in fade-in zoom-in-95 duration-700"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                {/* Product Image Container */}
                                <div className="relative aspect-square rounded-[2rem] bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center p-8 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-slate-200">
                                    <Link href={`/product/${product.id}`} className="w-full h-full flex items-center justify-center">
                                        <Image 
                                            src={product.images[0]} 
                                            alt={product.name}
                                            width={300}
                                            height={300}
                                            className="w-auto h-auto max-h-full transition-transform duration-700 group-hover:scale-110"
                                        />
                                    </Link>
                                    
                                    {/* Actions Overlay */}
                                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500">
                                        <button 
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="size-10 rounded-xl bg-white text-red-500 shadow-lg flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                            title="Remove from wishlist"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>

                                    {/* Quick Drop Bottom Button */}
                                    <button 
                                        onClick={() => handleAddToCart(product)}
                                        className="absolute bottom-0 left-0 w-full py-4 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px] translate-y-full group-hover:translate-y-0 transition-transform duration-500 flex items-center justify-center gap-2"
                                    >
                                        <ShoppingCart size={14} />
                                        Add to Bag
                                    </button>
                                </div>

                                {/* Product Info */}
                                <div className="mt-6 space-y-2">
                                    <div className="flex items-start justify-between gap-4">
                                        <Link href={`/product/${product.id}`} className="block">
                                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                            <p className="text-xs font-bold text-slate-400">{product.category}</p>
                                        </Link>
                                        <span className="text-lg font-black text-slate-900 tracking-tighter">
                                            {currency}{product.price}
                                        </span>
                                    </div>
                                    <div className="pt-2">
                                        <Link href={`/product/${product.id}`} className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-slate-300 hover:text-primary transition-colors">
                                            View Details
                                            <MoveRight size={12} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[50vh] flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-1000">
                        <div className="size-20 rounded-full bg-slate-50 flex items-center justify-center text-slate-200 mb-8 border border-slate-100">
                            <Heart size={32} />
                        </div>
                        <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-4">Your Wishlist is Empty</h2>
                        <p className="text-slate-400 font-medium max-w-xs mx-auto mb-8">
                            Start curating your dream collection by saving items you love.
                        </p>
                        <Link href="/shop" className="px-10 py-4 bg-slate-900 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-xs hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200">
                            Browse Products
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WishlistPage
