'use client'

import { addToCart } from "@/lib/features/cart/cartSlice";
import { StarIcon, TagIcon, EarthIcon, CreditCardIcon, UserIcon, Box, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import Counter from "./Counter";
import { useDispatch, useSelector } from "react-redux";
import ARViewer from "./ARViewer";

const ProductDetails = ({ product }) => {

    const productId = product.id;
    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';

    const cart = useSelector(state => state.cart.cartItems);
    const dispatch = useDispatch();

    const router = useRouter()

    const [mainImage, setMainImage] = useState(product.images[0]);
    const [isAROpen, setIsAROpen] = useState(false);

    const [selectedSize, setSelectedSize] = useState('M');
    const [selectedColor, setSelectedColor] = useState('White');
    const [brandingText, setBrandingText] = useState('');

    const sizes = ['S', 'M', 'L', 'XL', 'XXL'];
    const colors = [
        { name: 'White', hex: '#FFFFFF', border: 'border-gray-300' },
        { name: 'Black', hex: '#000000', border: 'border-black' },
        { name: 'Red', hex: '#EF4444', border: 'border-red-500' },
        { name: 'Blue', hex: '#3B82F6', border: 'border-blue-500' },
        { name: 'Grey', hex: '#9CA3AF', border: 'border-gray-400' }
    ];

    const isCustomizable = product.name.toLowerCase().includes('shirt') || product.category?.toLowerCase().includes('shirt');

    const cartKey = isCustomizable 
        ? `${productId}-${selectedSize}-${selectedColor}-${brandingText.trim()}`
        : productId;

    const addToCartHandler = () => {
        dispatch(addToCart({ 
            productId, 
            cartKey, 
            customizations: isCustomizable ? { size: selectedSize, color: selectedColor, brandingText: brandingText.trim() } : {} 
        }))
        toast.success("Added to cart!");
    }

    const addToWishlistHandler = async () => {
        try {
            const res = await fetch('/api/wishlist', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ productId })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Added to wishlist!");
            } else {
                toast.error(data.error || "Please login to save items");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    const averageRating = product.rating.reduce((acc, item) => acc + item.rating, 0) / product.rating.length;
    
    return (
        <div className="flex max-lg:flex-col gap-12">
            <div className="flex max-sm:flex-col-reverse gap-3">
                <div className="flex sm:flex-col gap-3">
                    {product.images.map((image, index) => (
                        <div key={index} onClick={() => setMainImage(product.images[index])} className="bg-slate-100 flex items-center justify-center size-26 rounded-lg group cursor-pointer">
                            <Image src={image} className="group-hover:scale-103 group-active:scale-95 transition" alt="" width={45} height={45} />
                        </div>
                    ))}
                </div>
                <div className="flex justify-center items-center h-100 sm:size-113 bg-slate-100 rounded-lg ">
                    <Image src={mainImage} alt="" width={250} height={250} />
                </div>
            </div>
            <div className="flex-1">
                <h1 className="text-3xl font-semibold text-slate-800">{product.name}</h1>
                <div className='flex items-center mt-2'>
                    {Array(5).fill('').map((_, index) => (
                        <StarIcon key={index} size={14} className='text-transparent mt-0.5' fill={averageRating >= index + 1 ? "#00C950" : "#D1D5DB"} />
                    ))}
                    <p className="text-sm ml-3 text-slate-500">{product.rating.length} Reviews</p>
                </div>
                <div className="flex items-start my-6 gap-3 text-2xl font-semibold text-slate-800">
                    <p> {currency}{product.price} </p>
                    <p className="text-xl text-slate-500 line-through">{currency}{product.mrp}</p>
                </div>
                <div className="flex items-center gap-2 text-slate-500">
                    <TagIcon size={14} />
                    <p>Save {((product.mrp - product.price) / product.mrp * 100).toFixed(0)}% right now</p>
                </div>

                {isCustomizable && (
                    <div className="mt-8 space-y-6">
                        {/* Size Selection */}
                        <div>
                            <p className="text-sm font-semibold text-slate-800 mb-3">Select Size</p>
                            <div className="flex gap-3">
                                {sizes.map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-10 flex items-center justify-center rounded-md border text-sm font-medium transition-all ${
                                            selectedSize === size
                                                ? 'bg-slate-800 text-white border-slate-800'
                                                : 'border-slate-200 text-slate-600 hover:border-slate-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Color Selection */}
                        <div>
                            <p className="text-sm font-semibold text-slate-800 mb-3">Select Color</p>
                            <div className="flex gap-3">
                                {colors.map(color => (
                                    <button
                                        key={color.name}
                                        onClick={() => setSelectedColor(color.name)}
                                        className={`size-8 rounded-full border-2 transition-all p-0.5 ${
                                            selectedColor === color.name ? 'border-slate-800' : 'border-transparent'
                                        }`}
                                        title={color.name}
                                    >
                                        <div 
                                            className={`w-full h-full rounded-full border shadow-sm ${color.border}`} 
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    </button>
                                ))}
                                <span className="text-sm text-slate-500 self-center ml-1">{selectedColor}</span>
                            </div>
                        </div>

                        {/* Branding Text */}
                        <div>
                            <p className="text-sm font-semibold text-slate-800 mb-3">Custom Branding (Optional)</p>
                            <textarea
                                value={brandingText}
                                onChange={(e) => setBrandingText(e.target.value)}
                                placeholder="Enter text for branding (e.g., your name, company logo text...)"
                                className="w-full border border-slate-200 rounded-md p-3 text-sm focus:outline-none focus:border-slate-400 transition-all resize-none"
                                rows={2}
                            />
                        </div>
                    </div>
                )}

                <div className="flex items-end gap-5 mt-10">
                    {
                        cart[cartKey] && (
                            <div className="flex flex-col gap-3">
                                <p className="text-lg text-slate-800 font-semibold">Quantity</p>
                                <Counter productId={productId} cartKey={cartKey} />
                            </div>
                        )
                    }
                    <div className="flex gap-3">
                        <button onClick={() => !cart[cartKey] ? addToCartHandler() : router.push('/cart')} className="bg-slate-800 text-white px-10 py-3 text-sm font-medium rounded hover:bg-slate-900 active:scale-95 transition">
                            {!cart[cartKey] ? 'Add to Cart' : 'View Cart'}
                        </button>
                        
                        <button 
                            onClick={() => setIsAROpen(true)}
                            className="bg-indigo-100 text-indigo-700 px-6 py-3 text-sm font-bold rounded-lg hover:bg-indigo-200 transition-all flex items-center gap-2 border border-indigo-200"
                        >
                            <Box size={18} />
                            View in AR
                        </button>

                        <button 
                            onClick={addToWishlistHandler}
                            className="bg-slate-100 text-slate-600 px-4 py-3 text-sm font-bold rounded-lg hover:bg-rose-50 hover:text-rose-500 transition-all flex items-center gap-2 border border-slate-200 group"
                            title="Add to wishlist"
                        >
                            <Heart size={18} className="group-hover:fill-rose-500 transition-all" />
                        </button>
                    </div>
                </div>
                <hr className="border-gray-300 my-5" />
                <div className="flex flex-col gap-4 text-slate-500">
                    <p className="flex gap-3"> <EarthIcon className="text-slate-400" /> Free shipping worldwide </p>
                    <p className="flex gap-3"> <CreditCardIcon className="text-slate-400" /> 100% Secured Payment </p>
                    <p className="flex gap-3"> <UserIcon className="text-slate-400" /> Trusted by top brands </p>
                </div>

            </div>

            {/* AR Modal */}
            {isAROpen && (
                <ARViewer 
                    onClose={() => setIsAROpen(false)} 
                    productName={product.name}
                    // For demo, we use a constant model. In a real app, this would be product.arModelUrl
                    modelSrc="https://modelviewer.dev/shared-assets/models/Astronaut.glb"
                />
            )}
        </div>
    )
}

export default ProductDetails