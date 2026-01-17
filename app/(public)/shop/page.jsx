'use client'
import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, Star, ArrowRight } from 'lucide-react';
import { categories } from '@/assets/assets';
import { useSearchParams, useRouter } from 'next/navigation';
import { Suspense } from 'react';

const specialCategories = ["New Arrivals", "Featured Drops", "Trending Now", "Signature Tees"];

function ShopContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialCategory = searchParams.get('category') || "All";
    const initialSearch = searchParams.get('search') || "";
    const products = useSelector(state => state.product.list);
    const [selectedCategory, setSelectedCategory] = useState(initialCategory);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [sortOrder, setSortOrder] = useState("newest");

    // Update category and search if URL changes
    React.useEffect(() => {
        const cat = searchParams.get('category');
        const search = searchParams.get('search');
        
        setSelectedCategory(cat || "All");
        setSearchTerm(search || "");
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let result = [...products];

        if (selectedCategory !== "All") {
            if (specialCategories.includes(selectedCategory)) {
                if (selectedCategory === "New Arrivals") {
                    result = result.slice(-6).reverse();
                } else if (selectedCategory === "Featured Drops") {
                    result = result.slice(0, 12);
                } else if (selectedCategory === "Trending Now") {
                    result = result.slice().sort((a, b) => (b.rating?.length || 0) - (a.rating?.length || 0));
                } else if (selectedCategory === "Signature Tees") {
                    result = result.filter(p => p.category === 'Fashion' || p.category === 'Clothing' || p.name.toLowerCase().includes('shirt'));
                }
            } else {
                result = result.filter(p => p.category === selectedCategory);
            }
        }

        if (searchTerm) {
            const query = searchTerm.toLowerCase();
            result = result.filter(p => 
                p.name.toLowerCase().includes(query) || 
                p.description.toLowerCase().includes(query)
            );
        }

        if (sortOrder === "price-asc") {
            result.sort((a, b) => a.price - b.price);
        } else if (sortOrder === "price-desc") {
            result.sort((a, b) => b.price - a.price);
        }

        return result;
    }, [products, selectedCategory, searchTerm, sortOrder]);

    return (
        <div className="min-h-screen px-6 pt-10 pb-32 bg-[#fafafa]">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="mb-0">
                    <h1 className="text-6xl font-bold tracking-tighter mb-4 text-[#1a1a1a]">Shop<span className="text-primary">.</span></h1>
                    <p className="text-gray-400 max-w-lg text-lg">Browse our complete collection of meticulously crafted essentials designed for modern living.</p>
                </div>

                {/* Toolbar */}
                <div className="mb-12 flex flex-col lg:flex-row gap-6 lg:items-center justify-between sticky top-24 z-30 bg-[#fafafa]/80 backdrop-blur-lg py-4 border-y border-gray-100">
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="relative group block lg:hidden">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 transition-colors group-focus-within:text-black" />
                            <input 
                                type="text" 
                                placeholder="Search inventory..."
                                value={searchTerm}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setSearchTerm(val);
                                    // Optionally sync to URL as you type, but maybe better to do on blur or enter to avoid jitter
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        router.push(`/shop?search=${encodeURIComponent(searchTerm)}&category=${selectedCategory}`);
                                    }
                                }}
                                className="pl-12 pr-6 py-3 bg-white border border-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all w-full sm:w-64 xxl:w-80 shadow-sm"
                            />
                        </div>

                        <div className="h-8 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>

                        <div className="flex flex-nowrap sm:flex-wrap items-center gap-2 py-2 overflow-x-auto sm:overflow-visible no-scrollbar w-full sm:w-auto">
                            <button 
                                onClick={() => setSelectedCategory("All")}
                                className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                    selectedCategory === "All" ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
                                }`}
                            >
                                All Items
                            </button>
                            {specialCategories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`shrink-0 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                        selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                            <div className="h-6 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
                            {categories.map(cat => (
                                <button 
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest whitespace-nowrap transition-all duration-300 ${
                                        selectedCategory === cat ? 'bg-primary text-white shadow-lg' : 'bg-white text-gray-500 hover:bg-gray-100'
                                    }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1a1a1a]">
                            <ArrowUpDown size={14} className="text-primary" />
                            <span className="hidden sm:inline">Sort By</span>
                            <select 
                                value={sortOrder}
                                onChange={(e) => setSortOrder(e.target.value)}
                                className="bg-transparent border-none focus:outline-none p-2 cursor-pointer appearance-none text-[#1a1a1a] hover:text-primary font-bold"
                            >
                                <option value="newest">Latest Release</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Optimized Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-x-8 gap-y-16">
                    {filteredProducts.map((product, i) => (
                        <Link 
                            key={product.id} 
                            href={`/product/${product.id}`} 
                            className="group block"
                            style={{ animationDelay: `${i * 50}ms` }}
                        >
                            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl bg-[#f5f5f5] mb-8 shadow-sm transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-2 select-none">
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
                    ))}
                </div>

                {filteredProducts.length === 0 && (
                    <div className="py-40 text-center animate-in fade-in zoom-in duration-500">
                        <h2 className="text-2xl font-bold text-[#1a1a1a] mb-2 tracking-tighter">No items match your criteria.</h2>
                        <p className="text-gray-400 mb-8">Try adjusting your filters or search term to discover other essentials.</p>
                        <button 
                            onClick={() => {
                                router.push('/shop');
                            }}
                            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                        >
                            Reset filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function ModernShop() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        }>
            <ShopContent />
        </Suspense>
    );
}
