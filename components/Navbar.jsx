import { PackageIcon, UserCircle, Search, ShoppingCart, Menu, X } from "lucide-react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userData as setUserData } from "@/lib/features/user/userSlice";
import { ChevronDown, User, Package, Mail, Heart, Ticket, LogOut, Store } from "lucide-react";
import toast from "react-hot-toast";

const Navbar = () => {
    const router = useRouter();
    const dispatch = useDispatch();

    const [search, setSearch] = useState('')
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const cartCount = useSelector(state => state.cart.total)
    const user = useSelector((state) => state.user.currentUser);

    const handleSearch = (e) => {
        e.preventDefault()
        router.push(`/shop?search=${search}`)
        setIsMobileMenuOpen(false)
    }

    const handleLogin = () => {
        router.push('/auth')
        setIsMobileMenuOpen(false)
    }

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                dispatch(setUserData(null));
                toast.success("Logged out successfully");
                router.push('/');
                setIsMobileMenuOpen(false);
                setIsDropdownOpen(false);
            }
        } catch (error) {
            toast.error("An error occurred during logout");
        }
    }

    const NavLinks = () => (
        <>
            <Link onClick={() => setIsMobileMenuOpen(false)} href='/'>Home</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href='/shop'>Shop</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href='/about'>About</Link>
            <Link onClick={() => setIsMobileMenuOpen(false)} href='/contact'>Contact</Link>
        </>
    )

    return (
        <nav className='relative bg-white'>
            <div className='mx-6'>
                <div className='flex items-center justify-between max-w-7xl mx-auto py-4 transition-all'>
                    {/* Mobile: Hamburger & Logo */}
                    <div className="flex items-center gap-4">
                        <button 
                            className="sm:hidden text-slate-700"
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                        
                        <Link
                            href='/'
                            className='relative text-xl sm:text-2xl lg:text-3xl font-semibold flex items-center text-slate-700'>
                            <span className=''>AddedValue</span>
                            <span className='text-sm mr-1 self-start'>.store</span>
                            <Image src={assets.logo} className='w-7 sm:w-10' alt="logo" />
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className='hidden sm:flex items-center gap-4 lg:gap-8 text-slate-600 font-medium'>
                        <NavLinks />

                        <form
                            onSubmit={handleSearch}
                            className='hidden xl:flex items-center w-xs text-sm gap-2 bg-slate-100 px-4 py-3 rounded-full'>
                            <Search size={18} className='text-slate-600' />
                            <input
                                className='w-full bg-transparent outline-none placeholder-slate-600'
                                type='text'
                                placeholder='Search products'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                required
                            />
                        </form>
                    </div>

                    {/* Right Side Icons (Desktop & Mobile) */}
                    <div className="flex items-center gap-4 sm:gap-6">
                        <Link
                            href='/cart'
                            className='relative flex items-center gap-2 text-slate-600'>
                            <ShoppingCart size={22} className="sm:size-[18px]" />
                            <span className="hidden sm:inline">Cart</span>
                            <button className='absolute -top-1 left-4 sm:left-3 text-[8px] text-white bg-red-500 size-3.5 rounded-full'>
                                {cartCount}
                            </button>
                        </Link>

                        {!user ? (
                            <button
                                className='px-6 py-2 sm:px-8 sm:py-2 bg-indigo-500 hover:bg-indigo-600 transition text-white rounded-full text-sm sm:text-base'
                                onClick={handleLogin}>
                                Login
                            </button>
                        ) : (
                            <div className="relative">
                                <button 
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className='flex items-center gap-2 text-slate-600 hover:text-indigo-500 transition-colors'
                                >
                                    <div className="size-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold border border-indigo-200">
                                        {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="hidden lg:block max-w-[100px] truncate font-medium">{user.name || 'User'}</span>
                                    <ChevronDown size={14} className={`hidden sm:block transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 py-2 z-50 overflow-hidden">
                                        <div className="px-4 py-3 border-b border-slate-50">
                                            <p className="text-sm font-semibold text-slate-900 truncate">{user.name || 'User'}</p>
                                            <p className="text-xs text-slate-500 truncate">{user.email}</p>
                                        </div>
                                        
                                        <div className="py-1">
                                            {[
                                                { href: "/account", icon: User, label: "Account" },
                                                { href: user.store ? "/store" : "/become-seller", icon: Store, label: user.store ? "My Store" : "Become a Seller" },
                                                { href: "/orders", icon: Package, label: "Orders" },
                                                { href: "/inbox", icon: Mail, label: "Inbox" },
                                                { href: "/wishlist", icon: Heart, label: "Wishlist" },
                                                { href: "/vouchers", icon: Ticket, label: "Voucher" },
                                            ].map((item) => (
                                                <Link 
                                                    key={item.href}
                                                    href={item.href} 
                                                    onClick={() => { setIsDropdownOpen(false); setIsMobileMenuOpen(false); }}
                                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                                                >
                                                    <item.icon size={16} /> {item.label}
                                                </Link>
                                            ))}
                                        </div>

                                        <div className="pt-1 mt-1 border-t border-slate-50">
                                            <button 
                                                onClick={handleLogout}
                                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                            >
                                                <LogOut size={16} /> Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mobile Search - Below Header */}
                <div className="sm:hidden pb-4">
                    <form
                        onSubmit={handleSearch}
                        className='flex items-center w-full text-sm gap-2 bg-slate-100 px-4 py-2.5 rounded-full border border-slate-200'>
                        <Search size={18} className='text-slate-500' />
                        <input
                            className='w-full bg-transparent outline-none placeholder-slate-500'
                            type='text'
                            placeholder='Search for products...'
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            required
                        />
                    </form>
                </div>
            </div>

            {/* Mobile Menu Backdrop & Content */}
            {isMobileMenuOpen && (
                <div className="sm:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
                    <div className="bg-white w-3/4 max-w-xs h-full p-6 shadow-2xl animate-in slide-in-from-left duration-300" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-8">
                            <span className="font-semibold text-xl text-indigo-600">Menu</span>
                            <button onClick={() => setIsMobileMenuOpen(false)}><X size={24} className="text-slate-500" /></button>
                        </div>
                        <div className="flex flex-col gap-6 text-lg font-medium text-slate-700">
                            <NavLinks />
                        </div>
                    </div>
                </div>
            )}

            <hr className='border-gray-200' />
        </nav>
    );
}

export default Navbar