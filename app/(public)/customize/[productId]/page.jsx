'use client'
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Type, Palette, Save, ShoppingBag, Undo, Redo, Share2, Download } from 'lucide-react';
import { addToCart } from '@/lib/features/cart/cartSlice';
import toast from 'react-hot-toast';

export default function DesignStudio() {
    const { productId } = useParams();
    const router = useRouter();
    const dispatch = useDispatch();
    
    // Data
    const products = useSelector(state => state.product.list);
    const product = useMemo(() => products.find(p => p.id === productId), [products, productId]);

    // State
    const [customText, setCustomText] = useState('YOUR TEXT');
    const [textColor, setTextColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(48);
    const [fontFamily, setFontFamily] = useState('font-sans');
    const [executionMethod, setExecutionMethod] = useState('');
    const [textPosition, setTextPosition] = useState({ x: 50, y: 30 }); // Percentage
    const [isDragging, setIsDragging] = useState(false);
    
    // Canvas Ref for potential export (simplified for now to just DOM overlay)
    const previewRef = useRef(null);

    // Initial load check
    useEffect(() => {
        if (!product && products.length > 0) {
            router.push('/shop');
        }
    }, [product, products, router]);

    if (!product) return <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">Loading Studio...</div>;

    // Handlers
    const handleDragStart = (e) => {
        setIsDragging(true);
    };

    const handleDragEnd = (e) => {
        setIsDragging(false);
    };

    const handleDrag = (e) => {
        if (!isDragging || !previewRef.current) return;
        // Simple drag logic (would use a library like dnd-kit for robust mobile support, using rough mouse calc here for MVP)
        // For this version, we will use simple range sliders for positioning to ensure stability first
    };

    const handleAddToCart = () => {
        const customizationId = `custom-${Date.now()}`;
        dispatch(addToCart({
            productId: product.id,
            cartKey: `${product.id}-${customizationId}`,
            customizations: {
                type: 'Design Studio',
                text: customText,
                textColor,
                fontFamily,
                executionMethod,
                previewData: { x: textPosition.x, y: textPosition.y, fontSize }
            },
            price: product.price + 20 // Added value for customization
        }));
        toast.success("Custom design added to cart");
        router.push('/cart');
    };


    const colors = [
        '#000000', '#FFFFFF', '#EF4444', '#3B82F6', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'
    ];

    return (
        <div className="min-h-screen bg-[#fafafa] flex flex-col lg:flex-row overflow-hidden">
            {/* LEFT PANEL: PREVIEW */}
            <div className="flex-1 relative h-[60vh] lg:h-screen bg-[#f0f0f0] flex items-center justify-center p-8 overflow-hidden select-none">
                
                {/* Back Button */}
                <Link href={`/product/${productId}`} className="absolute top-8 left-8 z-20 flex items-center gap-2 text-xs font-bold uppercase tracking-widest hover:text-primary transition-colors">
                    <ArrowLeft size={16} /> Back to Product
                </Link>

                <div 
                    ref={previewRef}
                    className="relative w-full max-w-xl aspect-[4/5] shadow-2xl rounded-3xl overflow-hidden bg-white animate-in zoom-in duration-500 will-change-transform"
                >
                    {/* Product Base Image */}
                    <Image 
                        src={product.images[0]} 
                        alt="Product Base" 
                        fill 
                        className="object-cover pointer-events-none" 
                        priority
                    />
                    
                    {/* Overlay Layer (Visual Only) */}
                    <div className="absolute inset-0 bg-black/0 pointer-events-none mix-blend-multiply"></div>

                    {/* Text Layer */}
                    <div 
                        className={`absolute cursor-move select-none whitespace-nowrap leading-none ${fontFamily} font-bold drop-shadow-sm hover:ring-2 ring-primary ring-dashed rounded-lg p-2 transition-all`}
                        style={{ 
                            left: `${textPosition.x}%`, 
                            top: `${textPosition.y}%`, 
                            transform: 'translate(-50%, -50%)',
                            color: textColor,
                            fontSize: `${fontSize}px`, // Responsive scaling might be needed
                        }}
                        onMouseDown={handleDragStart} // Placeholder for drag logic
                    >
                        {customText || 'YOUR TEXT'}
                    </div>
                </div>

                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4">
                     <button className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all"><Undo size={18} /></button>
                     <button className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all"><Redo size={18} /></button>
                     <button className="p-3 bg-white rounded-full shadow-lg hover:bg-black hover:text-white transition-all"><Share2 size={18} /></button>
                </div>
            </div>

            {/* RIGHT PANEL: CONTROLS */}
            <div className="flex-1 lg:max-w-md bg-white border-l border-gray-100 flex flex-col h-[40vh] lg:h-screen z-10 shadow-2xl">
                <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                     <div>
                        <h1 className="text-2xl font-bold tracking-tighter mb-1">Design Studio<span className="text-primary">.</span></h1>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Personalize Your Piece</p>
                     </div>
                     <div className="h-10 w-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                        <Palette size={20} />
                     </div>
                </div>

                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    
                    {/* Text Input */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block flex items-center gap-2">
                            <Type size={14} /> Inscription
                        </label>
                        <input 
                            type="text" 
                            value={customText}
                            onChange={(e) => setCustomText(e.target.value)}
                            className="w-full bg-[#f9f9f9] border border-gray-200 rounded-xl px-4 py-3 font-bold text-[#1a1a1a] focus:outline-none focus:border-primary transition-all placeholder:text-gray-300"
                            placeholder="YOUR TEXT HERE"
                        />
                        <p className="text-[10px] text-gray-300 mt-2">* Emoji support limited for print.</p>
                    </div>

                    {/* Execution Method */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block flex justify-between">
                            Execution Method <span className="text-gray-300 font-medium italic">(optional)</span>
                        </label>
                        <div className="grid grid-cols-1 gap-2">
                            {['Sublimation', 'DTF Transformation', 'Brymation (Brym stone)'].map(method => (
                                <button
                                    key={method}
                                    onClick={() => setExecutionMethod(executionMethod === method ? '' : method)}
                                    className={`px-4 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                                        executionMethod === method 
                                        ? 'bg-[#1a1a1a] text-white border-[#1a1a1a] shadow-lg scale-[1.02]' 
                                        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                                    }`}
                                >
                                    {method}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div>
                        <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block">Ink Color</label>
                        <div className="flex flex-wrap gap-3">
                            {colors.map(color => (
                                <button
                                    key={color}
                                    onClick={() => setTextColor(color)}
                                    className={`size-8 rounded-full border transition-all ${
                                        textColor === color ? 'ring-2 ring-primary ring-offset-2 scale-110' : 'ring-0 hover:scale-110'
                                    }`}
                                    style={{ backgroundColor: color, borderColor: color === '#FFFFFF' ? '#e5e5e5' : 'transparent' }}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Simple Position Controls (Vertical/Horizontal sliders) */}
                    <div>
                         <label className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-3 block">Adjustments</label>
                         <div className="space-y-4">
                            <div>
                                <span className="text-[10px] font-bold text-[#1a1a1a] mb-1 block">Size</span>
                                <input 
                                    type="range" 
                                    min="12" 
                                    max="120" 
                                    value={fontSize} 
                                    onChange={(e) => setFontSize(parseInt(e.target.value))}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a]"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-[#1a1a1a] mb-1 block">Horizontal</span>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={textPosition.x} 
                                    onChange={(e) => setTextPosition({ ...textPosition, x: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a]"
                                />
                            </div>
                            <div>
                                <span className="text-[10px] font-bold text-[#1a1a1a] mb-1 block">Vertical</span>
                                <input 
                                    type="range" 
                                    min="0" 
                                    max="100" 
                                    value={textPosition.y} 
                                    onChange={(e) => setTextPosition({ ...textPosition, y: parseInt(e.target.value) })}
                                    className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a1a1a]"
                                />
                            </div>
                         </div>
                    </div>

                </div>

                {/* Footer Actions */}
                <div className="p-8 border-t border-gray-100 bg-[#fbfbfb]">
                    <div className="flex justify-between items-end mb-4">
                        <div>
                             <p className="text-xs text-gray-400 uppercase font-bold tracking-widest">Total Value</p>
                             <p className="text-3xl font-bold text-[#1a1a1a]">${product.price + 20}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-primary font-bold uppercase tracking-widest">+ Customization Fee ($20)</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleAddToCart}
                        className="w-full py-4 bg-[#1a1a1a] text-white rounded-xl font-bold uppercase tracking-widest hover:bg-primary transition-all shadow-xl hover:shadow-[0_10px_30px_rgba(255,0,0,0.3)] active:scale-[0.98] flex items-center justify-center gap-3"
                    >
                        <ShoppingBag size={18} /> Add Custom Piece
                    </button>
                </div>
            </div>
        </div>
    );
}
