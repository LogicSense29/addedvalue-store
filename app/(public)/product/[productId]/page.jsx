'use client'
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';

import { Star, ShieldCheck, Truck, RefreshCcw, Box, Heart, ArrowLeft, Share2 } from 'lucide-react';
import { addToCart } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';

export default function ModernProductDetail() {
    const { productId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    
    const products = useSelector(state => state.product.list);
    const cart = useSelector(state => state.cart.cartItems);
    const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

    const [mainImage, setMainImage] = useState('');
    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [brandingText, setBrandingText] = useState('');
    const [showReviews, setShowReviews] = useState(true);

    const handleShare = async () => {
        const shareData = {
            title: product.name,
            text: product.description,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = [
        { name: 'White', hex: '#FFFFFF', border: 'border-gray-200' },
        { name: 'Black', hex: '#000000', border: 'border-black' },
        { name: 'Red', hex: '#EF4444', border: 'border-red-500' },
        { name: 'Blue', hex: '#3B82F6', border: 'border-blue-500' },
        { name: 'Grey', hex: '#9CA3AF', border: 'border-gray-400' }
    ];

    useEffect(() => {
        if (product) {
            setMainImage(product.images[0]);
            scrollTo(0, 0);
        }
    }, [product]);

    if (!product) {
        return <div className="min-h-screen flex items-center justify-center text-gray-300 italic tracking-widest text-2xl">Locating item in vault...</div>;
    }

    const isCustomizable = product.name.toLowerCase().includes('shirt') || product.category?.toLowerCase().includes('shirt');

    const cartKey = isCustomizable 
        ? `${productId}-${selectedSize}-${selectedColor}-${brandingText.trim()}`
        : productId;

    const handleAddToCart = () => {
        dispatch(addToCart({ 
            productId, 
            cartKey, 
            customizations: isCustomizable ? { 
                size: selectedSize, 
                color: selectedColor, 
                brandingText: brandingText.trim() 
            } : {} 
        }));
        toast.success("Added to vault.");
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 lg:grid-cols-2">
                
                {/* Image Section - Sticky Desktop */}
                <div className="relative h-[60vh] lg:h-screen lg:sticky lg:top-0 bg-[#f9f9f9]">
                    <button 
                        onClick={() => router.back()}
                        className="absolute top-8 left-8 z-10 size-12 rounded-full bg-white/80 backdrop-blur shadow-sm flex items-center justify-center hover:bg-black hover:text-white transition-all duration-300 group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                    </button>

                    <div className="h-full w-full flex items-center justify-center p-10">
                        <div className="relative w-full h-full animate-in fade-in zoom-in duration-1000">
                            <Image src={mainImage || product.images[0]} alt={product.name} fill className="object-contain" />
                        </div>
                    </div>

                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 overflow-x-auto no-scrollbar max-w-[80%] p-2">
                        {product.images.map((img, i) => (
                            <button 
                                key={i}
                                onClick={() => setMainImage(img)}
                                className={`relative size-20 rounded-xl overflow-hidden border-2 transition-all duration-300 shrink-0 ${
                                    mainImage === img ? 'border-primary shadow-lg scale-105' : 'border-transparent opacity-60 hover:opacity-100 hover:scale-105'
                                }`}
                            >
                                <Image src={img} alt="" fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Section - Scrolling */}
                <div className="p-8 lg:p-24 pb-32">
                    <div className="max-w-xl">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary">{product.category}</span>
                            </div>
                            <div className="flex gap-4">
                                <button onClick={handleShare} className="p-2 hover:text-primary transition-colors" title="Share"><Share2 size={18} /></button>
                                <button className="p-2 hover:text-primary transition-colors" title="Add to Wishlist"><Heart size={18} /></button>
                            </div>
                        </div>

                        <h1 className="text-5xl lg:text-6xl font-bold tracking-tighter leading-none mb-6 text-[#1a1a1a]">
                            {product.name}
                        </h1>

                        <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-10 pb-10 border-b border-gray-100">
                            <div className="flex items-center gap-4">
                                <p className="text-3xl font-bold text-[#1a1a1a]">${product.price}</p>
                                {product.mrp > product.price && (
                                    <p className="text-xl text-gray-300 line-through font-medium">${product.mrp}</p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-full">
                                <Star size={14} className="text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">4.9 ({product.rating?.length || 0} reviews)</span>
                            </div>
                        </div>

                        <div className="prose prose-sm text-gray-500 mb-12 leading-relaxed">
                            <p>{product.description}</p>
                        </div>

                        {/* Customization Options */}
                        {isCustomizable && (
                            <div className="space-y-12 mb-16">
                                {/* Size */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6 flex justify-between">
                                        Select Size 
                                        <button className="text-primary hover:underline lowercase tracking-normal">Size Guide</button>
                                    </h4>
                                    <div className="flex flex-wrap gap-3">
                                        {sizes.map(size => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size)}
                                                className={`size-14 rounded-2xl border-2 font-bold text-sm transition-all duration-300 ${
                                                    selectedSize === size 
                                                    ? 'border-[#1a1a1a] bg-[#1a1a1a] text-white shadow-xl -translate-y-1' 
                                                    : 'border-gray-100 bg-[#f9f9f9] text-gray-500 hover:border-gray-200'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Color */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-6">Execution Color: <span className="text-gray-400 font-medium">{selectedColor}</span></h4>
                                    <div className="flex gap-4">
                                        {colors.map(color => (
                                            <button
                                                key={color.name}
                                                onClick={() => setSelectedColor(color.name)}
                                                className={`size-10 rounded-full border-2 p-1 transition-all duration-300 ${
                                                    selectedColor === color.name ? 'border-primary shadow-lg scale-110' : 'border-transparent hover:scale-105'
                                                }`}
                                            >
                                                <div 
                                                    className={`w-full h-full rounded-full border ${color.border}`} 
                                                    style={{ backgroundColor: color.hex }}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Branding */}
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-widest mb-4">personalized branding (optional)</h4>
                                    <textarea 
                                        value={brandingText}
                                        onChange={(e) => setBrandingText(e.target.value)}
                                        placeholder="Enter inscription or branding requirements..."
                                        rows={3}
                                        className="w-full bg-[#f9f9f9] border border-gray-100 rounded-2xl p-6 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-none shadow-inner"
                                    />
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="flex flex-col gap-4 mb-20">
                            {isCustomizable && (
                                <Link 
                                    href={`/customize/${productId}`}
                                    className="w-full bg-white text-[#1a1a1a] border-2 border-[#1a1a1a] py-5 rounded-full font-bold tracking-widest uppercase text-center transition-all duration-500 hover:bg-[#1a1a1a] hover:text-white hover:-translate-y-1 active:scale-95"
                                >
                                    Open Design Studio
                                </Link>
                            )}
                            <button 
                                onClick={() => {
                                    if (cart[cartKey]) {
                                        router.push('/cart');
                                    } else {
                                        handleAddToCart();
                                    }
                                }}
                                className="w-full bg-primary text-white py-5 rounded-full font-bold tracking-widest uppercase transition-all duration-500 hover:shadow-[0_20px_40px_rgba(255,0,0,0.35)] hover:-translate-y-1 active:scale-95 disabled:opacity-50"
                                disabled={!product.inStock}
                            >
                                {cart[cartKey] ? 'View In Cart' : product.inStock ? 'Secure Item' : 'Out of Stock'}
                            </button>
                            <p className="text-[10px] text-center text-gray-400 font-bold tracking-[0.2em] uppercase">
                                {product.inStock ? 'Limited availability for this release' : 'This item has been fully vaulted'}
                            </p>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 border-t border-gray-100 pt-16">
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-primary/5 rounded-2xl text-primary"><Truck size={20} /></div>
                                <div>
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">Global Shipping</h5>
                                    <p className="text-[10px] text-gray-400 leading-tight">Meticulously packaged and delivered within 7 business days.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-3 bg-amber-500/5 rounded-2xl text-amber-500"><ShieldCheck size={20} /></div>
                                <div>
                                    <h5 className="text-[10px] font-bold uppercase tracking-widest mb-1">Authenticity Guaranteed</h5>
                                    <p className="text-[10px] text-gray-400 leading-tight">Verified authentic directly from the vault.</p>
                                </div>
                            </div>
                        </div>

                        {/* REVIEWS SECTION */}
                        <div className="mt-24 pt-24 border-t border-gray-100">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-12">
                                <div>
                                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-2">customer feedback</h4>
                                    <h3 className="text-3xl md:text-4xl font-bold tracking-tighter text-[#1a1a1a]">Customer Impressions<span className="text-gray-200">.</span></h3>
                                </div>
                                <div className="flex flex-wrap items-center gap-4 md:gap-6">
                                     <button 
                                        onClick={() => setShowReviews(!showReviews)}
                                        className="text-[10px] font-bold uppercase tracking-widest text-[#1a1a1a] bg-gray-100 hover:bg-black hover:text-white px-4 py-2.5 rounded-full transition-all flex items-center gap-2 active:scale-95"
                                     >
                                        {showReviews ? 'Hide Reviews' : 'Show Reviews'}
                                     </button>
                                     <div className="flex items-center gap-2">
                                         <Star size={18} className="text-amber-400 fill-amber-400" />
                                         <span className="text-xl font-bold">4.9</span>
                                         <span className="text-xs text-gray-400 font-medium whitespace-nowrap">/ {product.rating?.length || 0} reviews</span>
                                     </div>
                                </div>
                            </div>

                            <div className={`space-y-10 transition-all duration-700 overflow-hidden ${showReviews ? 'max-h-[5000px] opacity-100 mt-12' : 'max-h-0 opacity-0'}`}>
                                {product.rating?.length > 0 ? (
                                    product.rating.map((rev, i) => (
                                        <div key={i} className="group pb-10 border-b border-gray-50 last:border-0">
                                            <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-6">
                                                <div className="flex items-center gap-4">
                                                    <div className="size-12 rounded-full overflow-hidden bg-gray-100 relative grayscale group-hover:grayscale-0 transition-all duration-700">
                                                        {rev.user?.image ? (
                                                            <Image src={rev.user.image} alt={rev.user.name} fill className="object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-bold text-gray-400 text-xs">
                                                                {rev.user?.name?.charAt(0)}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <h5 className="text-sm font-bold text-[#1a1a1a] tracking-tight">{rev.user?.name || 'Anonymous'}</h5>
                                                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">Verified Collector</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, idx) => (
                                                        <Star 
                                                            key={idx} 
                                                            size={12} 
                                                            className={idx < Math.round(rev.rating) ? "text-amber-400 fill-amber-400" : "text-gray-200"} 
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-gray-500 text-sm leading-relaxed max-w-2xl italic">"{rev.review}"</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="py-12 bg-gray-50 rounded-3xl text-center">
                                        <p className="text-gray-400 text-sm italic">No impressions available for this release yet.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
