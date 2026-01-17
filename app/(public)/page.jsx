'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { assets, ourSpecsData, categories, productDummyData } from '@/assets/assets';
import { useSelector } from 'react-redux';
import { ArrowRight, Star, ChevronLeft, ChevronRight } from 'lucide-react';

export default function ModernHome() {
    const products = useSelector(state => state.product.list);
    
    // Helper to mix real products with placeholders
    const getMixedCollection = (realList, dummyFallback, limit) => {
        const combined = [...realList, ...dummyFallback];
        // Unique by ID to avoid duplicates if real data matches dummy data structure
        const unique = combined.filter((v, i, a) => a.findIndex(t => (t.id === v.id)) === i);
        return unique.slice(0, limit);
    };

    const displayFeatured = getMixedCollection(products, productDummyData, 12);
    const displayTrending = getMixedCollection([...products].sort((a,b) => (b.rating?.length || 0) - (a.rating?.length || 0)), productDummyData, 6);
    const displayLimited = getMixedCollection([...products].reverse(), productDummyData, 6);

    const tshirtProducts = getMixedCollection(
        products.filter(p => p.category === 'Fashion' || p.category === 'Clothing' || p.name.toLowerCase().includes('shirt')),
        productDummyData.filter(p => p.category === 'Fashion'),
        6
    );

    const [heroIndex, setHeroIndex] = useState(0);

    const heroImages = [
        assets.tshirtshero,
        assets.foodhero,
        assets.smartwatch
    ];

    const ProductSection = ({ title, subtitle, badge, products, link = "/shop", isScrollable = false }) => (
        <section className="pt-20 pb-8 overflow-hidden">
            <div className="max-w-[1600px] mx-auto px-6 mb-12 flex flex-col md:flex-row justify-between items-end gap-6 text-left">
                <div>
                    <h2 className="text-xs uppercase tracking-[0.4em] font-bold text-gray-400 mb-4 block underline decoration-primary underline-offset-8">{badge}</h2>
                    <h3 className="text-5xl md:text-6xl font-bold tracking-tighter leading-none text-[#1a1a1a]">{title}<span className="text-primary">.</span></h3>
                </div>
                <Link href={link} className="text-sm font-bold border-b-2 border-[#1a1a1a] pb-1 hover:text-primary hover:border-primary transition-all duration-300 flex items-center gap-2">
                    VIEW COLLECTION <ArrowRight size={16} />
                </Link>
            </div>

            <div className={`
                ${isScrollable 
                    ? 'flex flex-nowrap overflow-x-auto no-scrollbar pb-10 pl-[max(1.5rem,calc((100vw-1600px)/2+1.5rem))] pr-6  xl:grid xl:grid-cols-6 xl:max-w-[1600px] xl:mx-auto xl:px-6' 
                    : 'grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 max-w-[1600px] mx-auto px-6'
                } gap-8
            `}>
                
                {products.length > 0 ? (
                    products.map((product) => (
                        <Link 
                            key={product.id} 
                            href={`/product/${product.id}`} 
                            className={`group block shrink-0  ${isScrollable ? 'w-[280px] md:w-[320px] xl:w-full' : ''}`}
                        >
                            <div  className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f5f5f5] mb-8 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2 select-none">
                                <Image 
            
                                    src={product.images[0]} 
                                    alt={product.name} 
                                    fill 
                                    draggable="false"
                                    className="object-cover transition-transform duration-1000 group-hover:scale-110 pointer-events-none select-none" 
                                />
                                <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                <div className="absolute top-6 left-6 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold tracking-widest uppercase shadow-sm">
                                    {product.category}
                                </div>
                                <div className="absolute bottom-6 right-6 size-12 rounded-full bg-white flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 shadow-xl">
                                     <ArrowRight size={20} className="text-[#1a1a1a]" />
                                </div>
                            </div>
                            <h4 className="text-xl font-bold tracking-tight text-[#1a1a1a] mb-2 group-hover:text-primary transition-colors line-clamp-1">{product.name}</h4>
                            <div className="flex items-center justify-between">
                                <p className="font-bold text-gray-400 text-lg">${product.price}</p>
                                <div className="flex items-center">
                                    <Star size={14} className="text-amber-400 fill-amber-400" />
                                    <span className="text-xs font-bold ml-1 text-gray-400">4.9</span>
                                </div>
                            </div>
                        </Link>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-gray-300 text-xl italic tracking-widest">
                        Populating the vault...
                    </div>
                )}
            </div>
        </section>
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setHeroIndex((prev) => (prev + 1) % heroImages.length);
        }, 8000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    return (
        <div className="overflow-hidden">
            {/* HERO SECTION - Awwward Style */}
            {/* <section className="relative h-[92vh] flex items-center px-6">
                <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="z-10 animate-in fade-in slide-in-from-left duration-1000 ease-out">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                            </span>
                            Universal Multipurpose Hub
                        </div>
                        <h1 className="text-7xl lg:text-8xl font-bold tracking-tighter leading-[0.9] text-[#1a1a1a] mb-8">
                            Everything <br />
                            <span className="text-gray-300 italic font-medium">You Need</span> <br />
                            In One Place<span className="text-primary">.</span>
                        </h1>
                        <p className="text-gray-500 max-w-md text-lg leading-relaxed mb-10">
                          Discover an infinite curation of quality goods across every category you can imagine.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/modern/shop" className="group bg-primary text-white px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase transition-all duration-300 hover:shadow-[0_20px_40px_rgba(255,0,0,0.3)] hover:-translate-y-1 flex items-center gap-2">
                                browse categories
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </Link>
                            <Link href="/modern/shop?category=New Arrivals" className="px-10 py-5 rounded-full text-sm font-bold tracking-widest uppercase text-[#1a1a1a] border border-gray-200 transition-all duration-300 hover:bg-black hover:text-white hover:border-black">
                                latest arrivals
                            </Link>
                        </div>
                    </div>

                    <div className="relative h-[80vh] w-full hidden lg:block">
                        <div className="absolute inset-y-0 right-0 w-[90%] bg-[#f0f0f0] rounded-3xl -z-10 animate-in fade-in zoom-in duration-1000"></div>
                        <div className="h-full flex items-center justify-center p-12">
                             {heroImages.map((img, idx) => (
                                <div 
                                    key={idx}
                                    className={`absolute inset-0 transition-all duration-[1500ms] ease-[cubic-bezier(0.23,1,0.32,1)] ${
                                        idx === heroIndex ? 'opacity-100 scale-100 translate-x-0 rotate-0' : 'opacity-0 scale-75 translate-x-20 rotate-6 pointer-events-none'
                                    }`}
                                >
                                    <Image 
                                        src={img} 
                                        alt="Hero" 
                                        fill 
                                        className="object-contain" 
                                        priority={idx === 0}
                                    />
                                </div>
                             ))}
                        </div>
                        
                        Hero Slider Controls
                        <div className="absolute bottom-10 left-0 flex items-center gap-4">
                            {heroImages.map((_, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setHeroIndex(idx)}
                                    className={`h-1 transition-all duration-500 rounded-full ${idx === heroIndex ? 'w-12 bg-primary' : 'w-4 bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                Decorative Text background
                <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 text-[15vw] font-black text-gray-400/5 select-none pointer-events-none whitespace-nowrap uppercase italic tracking-tighter">
                    MULTIPURPOSE STORE
                </div>
            </section> */}

            {/* NEW HERO SECTION VARIANT - Bento/Grid Style (Mimicking components/Hero.jsx) */}
            <section className="px-6 pb-12 bg-white">
                <div className="flex flex-col xl:flex-row gap-6 max-w-[1600px] mx-auto">
                    {/* Main Feature Card */}
                    <div className="relative flex-[2] bg-gray-100 rounded-[2.5rem] overflow-hidden group min-h-[500px] sm:min-h-[600px] flex flex-col justify-center p-8 sm:p-16">
                         <div className="relative z-10 max-w-xl">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#1a1a1a] text-[10px] font-bold uppercase tracking-widest mb-6 shadow-xs">
                                <span className="w-2 h-2 rounded-full bg-primary"></span>
                                Universal Multipurpose Hub
                            </div>
                            <h2 className="text-5xl sm:text-6xl font-black tracking-tighter leading-[1] text-[#1a1a1a] mb-6">
                                Everything <br />
                                <span className="text-gray-400">You Need <br/><span className='text-black' >In One Place<span className="text-primary">.</span></span></span>
                            </h2>
                            <p className="text-gray-500 font-medium mb-8 max-w-sm text-lg">
                                Discover an infinite curation of quality goods across every category you can imagine.
                            </p>
                            <Link href="/shop" className="inline-flex bg-primary text-white text-sm font-bold py-4 px-8 rounded-full hover:bg-primary transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                                BROWSE CATEGORIES
                            </Link>
                         </div>
                         <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[50%] h-[80%] hidden md:block">
                            {heroImages.map((img, idx) => (
                                <Image 
                                    key={idx}
                                    src={img} 
                                    alt="Hero Model" 
                                    fill 
                                    className={`object-contain object-right-bottom drop-shadow-2xl transition-all duration-1000 ease-in-out absolute inset-0 ${
                                        idx === heroIndex 
                                            ? 'opacity-100 scale-100 translate-x-0' 
                                            : 'opacity-0 scale-95 translate-x-10'
                                    }`}
                                />
                            ))}
                         </div>
                    </div>

                    {/* Side Column */}
                    <div className="flex-1 flex flex-col md:flex-row xl:flex-col gap-6">
                        {/* Top Side Card */}
                        <div className="flex-1 bg-[#1a1a1a] rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group text-white">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight mb-2">Best Products</h3>
                                <Link href="/shop?category=Trending Now" className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors flex items-center gap-2">
                                    Shop Trending <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 h-40 translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500">
                                <Image src={assets.hero_product_img1} alt="Product" fill className="object-contain" />
                            </div>
                        </div>

                        {/* Bottom Side Card */}
                        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-[2.5rem] p-10 flex flex-col justify-between relative overflow-hidden group">
                            <div className="relative z-10">
                                <h3 className="text-3xl font-bold tracking-tight text-[#1a1a1a] mb-2">20% Discount</h3>
                                <Link href="/shop?category=New Arrivals" className="text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-primary transition-colors flex items-center gap-2">
                                    Grab Deal <ArrowRight size={14} />
                                </Link>
                            </div>
                            <div className="absolute bottom-0 right-0 w-40 h-40 translate-x-10 translate-y-10 group-hover:translate-x-5 group-hover:translate-y-5 transition-transform duration-500">
                                <Image src={assets.smartwatch} alt="Product" fill className="object-contain" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CATEGORY SHOWCASE - Multi-purpose Highlight */}
            <section className="py-24 border-y border-gray-100 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                         <h2 className="text-[10px] uppercase tracking-[0.6em] font-bold text-primary mb-4">infinite variety</h2>
                         <h3 className="text-4xl font-bold tracking-tighter text-[#1a1a1a]">Explore Every Product Realm<span className="text-gray-300">.</span></h3>
                    </div>

                    <div className="flex flex-wrap justify-center gap-4">
                        {categories.map((cat, i) => (
                            <Link 
                                key={cat} 
                                href={`/shop?category=${cat}`}
                                className="px-4 py-6 md:px-8 md:py-10 bg-white rounded-3xl border border-gray-100 flex flex-col items-center justify-center gap-4 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 group w-[calc(50%-0.5rem)] sm:w-[calc(33.33%-1rem)] lg:w-[calc(20%-1rem)]"
                            >
                                <div className="size-12 md:size-16 rounded-full bg-gray-50 flex items-center justify-center text-[#1a1a1a] transition-all duration-500 group-hover:bg-primary group-hover:text-white">
                                    <Star size={24} strokeWidth={1} />
                                </div>
                                <span className="text-center text-xs font-bold uppercase tracking-widest text-gray-400 group-hover:text-[#1a1a1a] transition-colors">{cat}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* SPECS SECTION */}
            <section className="bg-[#1a1a1a] py-16">
                <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row flex-wrap gap-12 sm:gap-0 sm:justify-between text-white">
                    {ourSpecsData.map((spec, i) => (
                        <div key={i} className="flex gap-4 items-center w-full sm:w-1/3 lg:max-w-xs group cursor-default">
                            <div className="p-2 rounded-full flex items-center justify-center transition-transform duration-500 group-hover:-rotate-12" style={{ backgroundColor: spec.accent + '20', color: spec.accent }}>
                                <spec.icon strokeWidth={1.5} className='w-5 h-5'/>
                            </div>
                            <div>
                                <h4 className="font-bold text-sm tracking-widest uppercase mb-1">{spec.title}</h4>
                                <p className="text-xs text-gray-500 leading-tight">{spec.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* FEATURED DROPS Grid */}
            <div id="featured">
                <ProductSection 
                    title="Featured Drops" 
                    badge="vast collections" 
                    products={displayFeatured} 
                    isScrollable={false}
                    link="/shop?category=Featured Drops"
                />
            </div>

            {/* TRENDING Grid */}
            <div id="trending">
                <ProductSection 
                    title="Trending Now" 
                    badge="community picks" 
                    products={displayTrending} 
                    link="/shop?category=Trending Now"
                    isScrollable={true}
                />
            </div>

            {/* BRANDING HIGHLIGHT - Plain T-shirts focus */}
            <section className="py-32 bg-[#1a1a1a] text-white overflow-hidden relative">
                <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none text-[30vw] font-black italic whitespace-nowrap -translate-y-1/2">BRANDED</div>
                <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1">
                        <h2 className="text-[10px] uppercase tracking-[0.6em] font-bold text-primary mb-6">personalized apparel</h2>
                        <h3 className="text-6xl md:text-7xl font-bold tracking-tighter leading-[0.9] mb-8">
                            Branded <br />
                            <span className="text-gray-500 italic">By You</span><span className="text-primary">.</span>
                        </h3>
                        <p className="text-gray-400 text-lg leading-relaxed mb-10 max-w-md">
                            Our signature Plain Cotton T-shirts are more than just basics. They are a canvas for your identity. Add your custom branding, select your unique color, and make it truly yours.
                        </p>
                        <div className="space-y-6 mb-12">
                            {['Custom Branding Text', 'Premium 100% Cotton', 'Collective & Individual Orders'].map((feature, i) => (
                                <div key={i} className="flex items-center gap-4 group">
                                    <div className="size-6 rounded-full border border-primary/30 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                        <ArrowRight size={12} />
                                    </div>
                                    <span className="text-sm font-bold tracking-widest uppercase text-gray-300">{feature}</span>
                                </div>
                            ))}
                        </div>
                        <Link href="/product/prod_13" className="inline-flex items-center gap-4 bg-white text-[#1a1a1a] px-10 py-5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-all duration-500">
                            START CUSTOMIZING
                        </Link>
                    </div>
                    <div className="flex-1 relative w-full">
                        <div className="relative aspect-[4/5] w-full rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
                            <Image src={assets.brandingSection} alt="Custom Branding" fill className="object-cover" />
                            <div className="absolute inset-x-0 bottom-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
                                 <div className="border-l-2 border-primary pl-6">
                                     <p className="text-2xl font-bold tracking-tight">"The perfect canvas for our team's identity. Quality is unmatched."</p>
                                     <span className="text-[10px] uppercase tracking-widest text-gray-400 mt-2 block font-bold">Studio Noir, Brand Partner</span>
                                 </div>
                            </div>
                        </div>
                        {/* Interactive floating badges */}
                        <div className="absolute -top-5 -right-5 md:-top-10 md:-right-5 lg:-right-10 size-28 lg:size-40 bg-primary rounded-full flex flex-col items-center justify-center -rotate-12 animate-pulse shadow-2xl">
                             <span className="text-xs font-black tracking-widest uppercase">Custom</span>
                             <span className="text-3xl font-black tracking-tighter">TEXT</span>
                             <span className="text-[8px] font-bold uppercase tracking-widest">Available Now</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* T-SHIRTS Grid */}
            <ProductSection 
                title="Signature Tees" 
                badge="premium cotton" 
                products={tshirtProducts} 
                link="/shop?category=Signature Tees"
                isScrollable={true}
            />

            {/* LIMITED STOCKS Grid */}
            <ProductSection 
                title="Limited Stock" 
                badge="vault exclusives" 
                products={displayLimited} 
                link="/shop?category=New Arrivals"
                isScrollable={true}
            />

             {/* BRAND STATEMENT - Immersive */}
             {/* <section className="relative bg-white py-40 px-6 overflow-hidden">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-[#f9f9f9] -z-10 translate-x-1/2 skew-x-12"></div>
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-20">
                    <div className="flex-1 order-2 md:order-1">
                        <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden shadow-2xl">
                            <Image src={assets.hero_product_img1} alt="Brand" fill className="object-cover" />
                        </div>
                    </div>
                    <div className="flex-1 order-1 md:order-2">
                        <h2 className="text-6xl font-bold tracking-tighter leading-none mb-10">
                            A curated <br />
                            universe for <br />
                            <span className="text-primary underline underline-offset-[12px] decoration-4">everything.</span>
                        </h2>
                        <p className="text-gray-500 text-lg leading-relaxed mb-8">
                            We believe that diversity in selection shouldn't mean a compromise in quality. From the smallest accessory to the boldest statement piece, we bridge the gap between disparate worlds to bring you the best of all.
                        </p>
                        <blockquote className="border-l-4 border-primary pl-6 py-2 mb-10">
                            <p className="text-2xl font-medium italic text-[#1a1a1a] leading-tight">
                                "Quality is not an act, it is a habit."
                            </p>
                        </blockquote>
                        <Link href="/about" className="inline-flex items-center gap-4 group">
                           <div className="size-14 rounded-full border border-gray-200 flex items-center justify-center transition-all duration-500 group-hover:bg-[#1a1a1a] group-hover:border-[#1a1a1a] group-hover:text-white">
                               <ArrowRight size={20} />
                           </div>
                           <span className="text-sm font-bold tracking-widest uppercase">read more about us</span>
                        </Link>
                    </div>
                </div>
            </section> */}
        </div>
    );
}
