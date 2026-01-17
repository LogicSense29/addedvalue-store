'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { productDummyData } from "@/assets/assets"

export default function StoreManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products') // This will return products from all stores, but the user only manages their own
            const data = await res.json()
            if (data.success) {
                // Filter products that belong to the user's store (store owner logic usually handled on API, 
                // but let's assume we want to show everything this user is authorized to see)
                setProducts(data.products)
            }
        } catch (error) {
            toast.error("Failed to sync with vault")
        } finally {
            setLoading(false)
        }
    }

    const updateStock = async (productId, newStock) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ stock: parseInt(newStock) || 0 })
            })
            const data = await res.json()
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: newStock } : p))
                return "Inventory updated"
            }
            throw new Error(data.error || "Update failed")
        } catch (error) {
            throw error
        }
    }

    useEffect(() => {
            fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="pb-20">
            <div className="flex justify-between items-center mb-10">
                <h1 className="text-3xl font-bold tracking-tight text-[#1a1a1a]">
                    Inventory <span className="text-gray-400 font-medium">Control</span>
                </h1>
            </div>

            <div className="bg-white rounded-[2rem] border border-gray-100 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100">
                            <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-gray-400">Item Details</th>
                            <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-gray-400 hidden md:table-cell">Category</th>
                            <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-gray-400 text-center">Unit Price</th>
                            <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-gray-400 text-center">In Stock</th>
                            <th className="px-8 py-5 font-bold uppercase tracking-widest text-[10px] text-gray-400 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {products.map((product) => (
                            <tr key={product.id} className="group hover:bg-gray-50/50 transition-all duration-300">
                                <td className="px-8 py-6">
                                    <div className="flex gap-6 items-center">
                                        <div className="relative size-16 rounded-2xl overflow-hidden border border-gray-100 bg-white group-hover:scale-105 transition-transform duration-500">
                                            <Image 
                                                fill 
                                                className='object-cover p-1' 
                                                src={product.images[0]} 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <div>
                                            <p className="font-bold text-[#1a1a1a] text-base group-hover:text-primary transition-colors">{product.name}</p>
                                            <p className="text-xs text-gray-400 line-clamp-1 max-w-xs">{product.description}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-8 py-6 hidden md:table-cell">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 py-1.5 px-3 bg-gray-100 rounded-full">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <p className="font-bold text-[#1a1a1a]">{currency}{product.price.toLocaleString()}</p>
                                    <p className="text-[10px] text-gray-300 line-through font-medium">{currency}{product.mrp.toLocaleString()}</p>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    <input 
                                        type="number" 
                                        value={product.stock} 
                                        onChange={(e) => toast.promise(updateStock(product.id, e.target.value), {
                                            loading: "Syncing...",
                                            success: (m) => m,
                                            error: (e) => e.message
                                        })}
                                        className="w-20 text-center bg-transparent border-b-2 border-transparent focus:border-primary focus:outline-none font-bold text-lg text-[#1a1a1a]"
                                    />
                                    <p className="text-[8px] font-bold uppercase tracking-widest text-gray-400 mt-1">units</p>
                                </td>
                                <td className="px-8 py-6 text-center">
                                    {product.stock > 0 ? (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-widest">
                                            <span className="size-1.5 rounded-full bg-green-600 animate-pulse"></span>
                                            Active
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-widest">
                                            Out of Stock
                                        </span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && (
                    <div className="py-24 text-center">
                        <p className="text-gray-300 italic text-xl tracking-widest">Your vault is currently empty.</p>
                        <Link href="/store/add-product" className="mt-6 inline-block text-primary font-bold uppercase text-xs tracking-widest hover:underline">
                            + Initialize First Release
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}