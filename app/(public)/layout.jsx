'use client'
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { assets, categories } from '@/assets/assets';
import { ShoppingBag, User, Search, Menu, X, ArrowRight, ChevronDown, Package, Mail, Heart, Ticket, LogOut, Store } from 'lucide-react';
import { useSelector, useDispatch } from 'react-redux';
import { LogoModern } from '@/components/Logo2';
import { useRouter } from 'next/navigation';
import { userData as setUserData } from "@/lib/features/user/userSlice";
import toast from "react-hot-toast";
import Logo from '@/components/Logo';

export default function ModernLayout({ children }) {
    const router = useRouter();
    const dispatch = useDispatch();
    const cartCount = useSelector(state => state.cart.total);
    const user = useSelector((state) => state.user.currentUser);
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isMobileCategoriesOpen, setIsMobileCategoriesOpen] = useState(false);
    const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                dispatch(setUserData(null));
                toast.success("Logged out successfully");
                router.push('/');
                setIsProfileDropdownOpen(false);
                setIsMobileMenuOpen(false);
            }
        } catch (error) {
            toast.error("An error occurred during logout");
        }
    }

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isMobileMenuOpen]);

    return (
        <div className="min-h-screen bg-white text-[#1a1a1a] selection:bg-primary selection:text-white">
            {/* Minimalist Floating Navbar */}
            <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 px-6 py-4 ${
                isScrolled ? 'top-2' : 'top-0'
            }`}>
                <div className={`max-w-7xl mx-auto flex items-center justify-between px-0 py-3 border-none rounded-2xl transition-all duration-500 relative ${
                    isScrolled 
                    ? 'bg-white/80 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/20 px-4 lg:px-6' 
                    : 'bg-transparent'
                }`}>
                    {/* Logo */}
<LogoModern/>

                    {/* Navigation Links */}
                    <div className="hidden lg:flex items-center gap-10">
                        <Link href="/shop" className="text-xs uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors relative group">
                            Shop
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/shop?category=Featured Drops" className="text-xs uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors relative group">
                            New Arrivals
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        <Link href="/shop?category=Trending Now" className="text-xs uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors relative group">
                            Trending
                            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary transition-all duration-300 group-hover:w-full"></span>
                        </Link>
                        
                        {/* Categories Dropdown */}
                        <div className="group">
                            <button className="flex items-center gap-1 text-xs uppercase tracking-[0.2em] font-medium hover:text-primary transition-colors">
                                Categories <ChevronDown size={14} className="group-hover:rotate-180 transition-transform duration-300" />
                            </button>
                            
                            {/* Horizontal Dropdown Menu */}
                            <div className="absolute top-full left-1/2 -translate-x-1/2 pt-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 w-screen max-w-[1200px]">
                                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 py-10 px-12 overflow-hidden grid grid-cols-4 gap-8">
                                    {categories.map((cat) => (
                                        <Link 
                                            key={cat} 
                                            href={`/shop?category=${cat}`}
                                            className="group/item flex flex-col gap-2 p-4 rounded-xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                                        >
                                            <span className="text-[10px] uppercase tracking-[0.3em] font-black text-gray-300 group-hover/item:text-primary transition-colors">Collection</span>
                                            <span className="text-lg font-bold tracking-tight text-[#1a1a1a]">{cat}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <form 
                            onSubmit={(e) => {
                                e.preventDefault();
                                const term = e.target.elements.search.value;
                                if (term.trim()) {
                                    router.push(`/shop?search=${encodeURIComponent(term)}`);
                                }
                            }}
                            className="hidden sm:flex relative group items-center mr-2"
                        >
                            <input 
                                name="search"
                                type="text"
                                placeholder="Search..."
                                className="pl-9 pr-4 py-2 bg-gray-100/50 border border-transparent rounded-full text-xs font-bold focus:bg-white focus:border-gray-200 focus:outline-none transition-all w-32 focus:w-48"
                            />
                            <Search size={14} className="absolute left-3 text-gray-400 pointer-events-none" />
                        </form>
                        
                        {/* Profile Dropdown */}
                        <div className="relative">
                            {!user ? (
                                <Link href="/auth" className="p-2 hover:bg-black/5 rounded-full transition-colors" title="Account">
                                    <User size={20} strokeWidth={1.5} />
                                </Link>
                            ) : (
                                <>
                                    <button 
                                        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                                        className="size-10 rounded-full bg-black text-white flex items-center justify-center font-bold text-xs hover:scale-105 transition-all"
                                    >
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </button>

                                    {/* Dropdown Card */}
                                    <div className={`absolute right-0 mt-4 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 overflow-hidden transition-all duration-300 ${
                                        isProfileDropdownOpen ? 'opacity-100 translate-y-0 visible' : 'opacity-0 translate-y-4 invisible'
                                    }`}>
                                        <div className="px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                                            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1a1a1a] truncate">{user.name || 'Member'}</p>
                                            <p className="text-[10px] text-gray-400 truncate mt-1">{user.email}</p>
                                        </div>
                                        
                                        <div className="py-2">
                                            {[
                                                { href: "/account", icon: User, label: "Account Overview" },
                                                { href: user.store ? "/store" : "/become-seller", icon: Store, label: user.store ? "My Store" : "Become a Seller" },
                                                { href: "/orders", icon: Package, label: "Order History" },
                                                { href: "/inbox", icon: Mail, label: "Message Inbox" },
                                                { href: "/wishlist", icon: Heart, label: "Saved Items" },
                                                { href: "/vouchers", icon: Ticket, label: "Gift Cards" },
                                            ].map((item) => (
                                                <Link 
                                                    key={item.href}
                                                    href={item.href} 
                                                    onClick={() => setIsProfileDropdownOpen(false)}
                                                    className="flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-400 hover:text-[#1a1a1a] hover:bg-gray-50 transition-all border-l-2 border-transparent hover:border-primary"
                                                >
                                                    <item.icon size={14} /> {item.label}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="pt-2 mt-2 border-t border-gray-50 px-4 pb-2">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-4 px-6 py-3 text-[10px] uppercase tracking-widest font-bold text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                            >
                                                <LogOut size={14} /> Close Session
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        <Link href="/cart" className="group relative p-2 bg-black text-white rounded-full transition-all duration-300 hover:scale-105 active:scale-95" title="Cart">
                            <ShoppingBag size={18} strokeWidth={2} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 size-4 bg-primary text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                        <button 
                            className="lg:hidden p-2 hover:bg-black/5 rounded-full transition-colors"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <div className={`fixed inset-0 z-[60] bg-white transition-all duration-700 ease-[cubic-bezier(0.85,0,0.15,1)] ${
                isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
            }`}>
                {/* Large Background Text */}
                <div className={`absolute -bottom-20 -left-20 text-[40vw] font-black text-gray-50 leading-none select-none pointer-events-none transition-all duration-1000 delay-300 ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
                    AV.
                </div>

                <div className="h-full flex flex-col pt-40 pb-12 px-10 relative z-10">
                    <div className="flex-1">
                        <div className="flex flex-col gap-4">
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold text-gray-400 mb-2 block">Navigation</span>
                            
                            <Link 
                                href="/shop"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-primary transition-all duration-700 transform ${
                                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: '300ms' }}
                            >
                                Shop<span className="text-primary">.</span>
                            </Link>

                            <Link 
                                href="/#featured"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-primary transition-all duration-700 transform ${
                                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: '340ms' }}
                            >
                                New<span className="text-primary">.</span>
                            </Link>

                            <Link 
                                href="/#trending"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-primary transition-all duration-700 transform ${
                                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: '380ms' }}
                            >
                                Trending<span className="text-primary">.</span>
                            </Link>

                            <div 
                                className={`flex flex-col transform transition-all duration-700 ${
                                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: '420ms' }}
                            >
                                <button 
                                    onClick={() => setIsMobileCategoriesOpen(!isMobileCategoriesOpen)}
                                    className="flex items-center justify-between text-4xl font-black tracking-tighter hover:text-primary transition-all text-left"
                                >
                                    Categories<span className="text-primary text-xl ml-2">{isMobileCategoriesOpen ? '−' : '+'}</span>
                                </button>
                                
                                <div className={`grid transition-all duration-500 ease-in-out ${isMobileCategoriesOpen ? 'grid-rows-[1fr] mt-6 opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                                    <div className="overflow-hidden flex flex-col gap-4 pl-6 border-l border-gray-100">
                                        {categories.map((cat, idx) => (
                                            <Link 
                                                key={cat} 
                                                href={`/shop?category=${cat}`}
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="text-lg font-bold tracking-tight text-gray-400 hover:text-[#1a1a1a] transition-all"
                                                style={{ transitionDelay: `${idx * 50}ms` }}
                                            >
                                                {cat}
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            </div>
 
                            <Link 
                                href="/account"
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-4xl font-black tracking-tighter hover:text-primary transition-all duration-700 transform ${
                                    isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                                }`}
                                style={{ transitionDelay: '500ms' }}
                            >
                                Account<span className="text-primary">.</span>
                            </Link>
                        </div>
                    </div>
                    
                    <div className={`mt-auto pt-10 border-t border-gray-100 transition-all duration-1000 delay-[800ms] transform ${
                        isMobileMenuOpen ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                    }`}>
                        <div className="grid grid-cols-2 gap-10">
                            <div>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Connect</h4>
                                <div className="flex flex-col gap-3 text-sm font-bold">
                                    <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">INSTAGRAM <ArrowRight size={12}/></a>
                                    <a href="#" className="hover:text-primary transition-colors flex items-center gap-2">TWITTER <ArrowRight size={12}/></a>
                                </div>
                            </div>
                            <div>
                                <h4 className="text-[10px] uppercase tracking-[0.3em] font-bold text-gray-400 mb-6">Location</h4>
                                <p className="text-sm font-bold leading-tight uppercase tracking-tighter">UNITED<br/>KINGDOM</p>
                                <span className="text-[10px] text-gray-400 mt-2 block font-medium uppercase tracking-widest">GTM +1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="pt-24">{children}</main>

            {/* Minimalist Footer */}
            <footer className="bg-white border-t border-gray-100 mt-20 py-20 px-6">
                <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-6">
                             {/* <Image src={assets.logo} alt="logo" width={32} height={32} />
                             <span className="text-2xl font-bold tracking-tighter">AddedValue.store</span> */}
                             <LogoModern/>
                        </Link>
                        <p className="text-gray-400 max-w-sm text-sm leading-relaxed">
                            Redefining the digital marketplace through elevated aesthetics and a curated selection of global innovation. We bridge the gap between necessity and luxury for the modern visionary.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Explore</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="/shop?category=Featured Drops" className="hover:text-primary transition-colors">Latest Drops</Link></li>
                            <li><Link href="/shop?category=Clothing" className="hover:text-primary transition-colors">Apparel</Link></li>
                            <li><Link href="/shop?category=Beauty & Health" className="hover:text-primary transition-colors">Beauty & Health</Link></li>
                            <li><Link href="/shop?category=Jewelry" className="hover:text-primary transition-colors">Jewelry</Link></li>
                            <li><Link href="/shop?category=Electronics" className="hover:text-primary transition-colors">Technology</Link></li>
                            <li><Link href="/shop?category=Home & Kitchen" className="hover:text-primary transition-colors">Home Studio</Link></li>
                            <li><Link href="/shop?category=Automobile" className="hover:text-primary transition-colors">Automobile</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs uppercase tracking-widest font-bold mb-6">Support</h4>
                        <ul className="space-y-4 text-sm text-gray-500">
                            <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                            <li><Link href="/terms" className="hover:text-primary transition-colors">Shipping & Returns</Link></li>
                            <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto mt-20 pt-8 border-t border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] uppercase tracking-[0.2em] font-bold text-gray-400">
                    <p>© 2026 AddedValue Hub. All Rights Reserved.</p>
                    <div className="flex gap-8">
                        <a href="#" className="hover:text-primary">Instagram</a>
                        <a href="#" className="hover:text-primary">Twitter</a>
                        <a href="#" className="hover:text-primary">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
