'use client'
import { useEffect, useState } from "react"
import { toast } from "react-hot-toast"
import Image from "next/image"
import Loading from "@/components/Loading"
import { Trash2 } from "lucide-react"

export default function AdminManageProducts() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '£'

    const [loading, setLoading] = useState(true)
    const [products, setProducts] = useState([])

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products?all=true')
            const data = await res.json()
            if (data.success) {
                setProducts(data.products)
            }
        } catch (error) {
            toast.error("Failed to fetch products")
        } finally {
            setLoading(false)
        }
    }

    const updateProductProperty = async (productId, property, value) => {
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [property]: value })
            })
            const data = await res.json()
            if (data.success) {
                setProducts(prev => prev.map(p => p.id === productId ? { ...p, [property]: value } : p))
                return `${property} updated`
            }
            throw new Error(data.error || "Failed to update")
        } catch (error) {
            throw error
        }
    }

    const deleteProduct = async (productId) => {
        if (!confirm("Are you sure you want to delete this product?")) return

        const toastId = toast.loading("Deleting product...")
        try {
            const res = await fetch(`/api/products/${productId}`, {
                method: 'DELETE'
            })
            const data = await res.json()
            if (data.success) {
                toast.success("Product deleted", { id: toastId })
                setProducts(prev => prev.filter(p => p.id !== productId))
            } else {
                toast.error(data.error || "Failed to delete", { id: toastId })
            }
        } catch (error) {
            toast.error("Server error", { id: toastId })
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [])

    if (loading) return <Loading />

    return (
        <div className="pb-20">
            <h1 className="text-2xl text-slate-500 mb-5">Manage <span className="text-slate-800 font-medium">Products</span></h1>
            <div className="overflow-x-auto ring-1 ring-slate-200 rounded-lg">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-gray-700 uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-4">Product</th>
                            <th className="px-6 py-4 hidden md:table-cell">Category</th>
                            <th className="px-6 py-4 text-center">Price</th>
                            <th className="px-6 py-4 text-center">In Stock</th>
                            <th className="px-6 py-4 text-center">Delete</th>
                        </tr>
                    </thead>
                    <tbody className="text-slate-700 bg-white divide-y divide-gray-200">
                        {products.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex gap-4 items-center">
                                        <div className="relative w-12 h-12 flex-shrink-0">
                                            <Image 
                                                fill 
                                                className='object-cover rounded-lg border border-gray-100 p-1 bg-white' 
                                                src={product.images[0]} 
                                                alt={product.name} 
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-medium text-slate-900 line-clamp-1">{product.name}</span>
                                            <span className="text-xs text-slate-400 md:hidden">{product.category}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 hidden md:table-cell">
                                    <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                        {product.category}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center font-medium">
                                    {currency}{product.price.toLocaleString()}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex justify-center">
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="sr-only peer" 
                                                onChange={() => toast.promise(updateProductProperty(product.id, 'inStock', !product.inStock), { 
                                                    loading: "Updating...",
                                                    success: "Stock status updated",
                                                    error: "Failed"
                                                })} 
                                                checked={product.inStock} 
                                            />
                                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => deleteProduct(product.id)}
                                        className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {products.length === 0 && (
                <div className="text-center py-20 bg-white border border-t-0 border-slate-200 rounded-b-lg">
                    <p className="text-slate-400">No products found in the database.</p>
                </div>
            )}
        </div>
    )
}