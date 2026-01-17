'use client'
import { assets } from "@/assets/assets"
import Image from "next/image"
import { useState } from "react"
import { toast } from "react-hot-toast"
import { useDispatch } from "react-redux"
import { setProduct } from "@/lib/features/product/productSlice"
import imageCompression from 'browser-image-compression'

export default function AdminAddProduct() {
    const dispatch = useDispatch()
    const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Home Office', 'Jewelry','Automobile', 'Others']
    // const categories = ['Electronics', 'Clothing', 'Home & Kitchen', 'Beauty & Health', 'Toys & Games', 'Sports & Outdoors', 'Books & Media', 'Food & Drink', 'Hobbies & Crafts','Automobile', 'Others']

    const [images, setImages] = useState({ 1: null, 2: null, 3: null, 4: null })
    const [productInfo, setProductInfo] = useState({
        name: "",
        description: "",
        mrp: 0,
        price: 0,
        category: "",
    })
    const [loading, setLoading] = useState(false)


    const onChangeHandler = (e) => {
        setProductInfo({ ...productInfo, [e.target.name]: e.target.value })
    }

    const onSubmitHandler = async (e) => {
        e.preventDefault()
        setLoading(true)

        try {
            // 1. Get ImageKit Auth Signature
            const authRes = await fetch('/api/imagekit/auth')
            const authData = await authRes.json()

            if (!authRes.ok) throw new Error("ImageKit auth failed")

            // 2. Upload images to ImageKit
            const uploadedUrls = []
            const imageFiles = Object.values(images).filter(file => file !== null)

            if (imageFiles.length === 0) {
                toast.error("Please select at least one image")
                setLoading(false)
                return
            }

            // 2. Compress images
            const options = {
                maxSizeMB: 0.8,
                maxWidthOrHeight: 1200,
                useWebWorker: true,
            };

            const compressedFiles = await Promise.all(
                imageFiles.map(async (file) => {
                    try {
                        return await imageCompression(file, options);
                    } catch (error) {
                        console.error("Compression error:", error);
                        return file; // Fallback to original if compression fails
                    }
                })
            );

            // 3. Upload images to ImageKit
            for (const file of compressedFiles) {
                const formData = new FormData()
                formData.append('file', file)
                formData.append('fileName', file.name)
                formData.append('publicKey', process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY)
                formData.append('signature', authData.signature)
                formData.append('expire', authData.expire)
                formData.append('token', authData.token)
                formData.append('useUniqueFileName', 'true')
                formData.append('folder', '/products')

                const uploadRes = await fetch(`https://upload.imagekit.io/api/v1/files/upload`, {
                    method: 'POST',
                    body: formData
                })

                const uploadData = await uploadRes.json()
                if (!uploadRes.ok) throw new Error(uploadData.message || "Image upload failed")
                uploadedUrls.push(uploadData.url)
            }

            // 4. Save product to database
            const productRes = await fetch('/api/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...productInfo,
                    images: uploadedUrls
                })
            })

            const productData = await productRes.json()

            if (productData.success) {
                toast.success("Product added successfully")
                
                // Refresh product list in Redux
                try {
                    const res = await fetch('/api/products?all=true');
                    const data = await res.json();
                    if (data.success) {
                        dispatch(setProduct(data.products));
                    }
                } catch (error) {
                    console.error("Failed to refresh products:", error);
                }

                // Reset form
                setImages({ 1: null, 2: null, 3: null, 4: null })
                setProductInfo({
                    name: "",
                    description: "",
                    mrp: 0,
                    price: 0,
                    category: "",
                })
            } else {
                toast.error(productData.error || "Failed to add product")
            }

        } catch (error) {
            console.error(error)
            toast.error(error.message || "An error occurred")
        } finally {
            setLoading(false)
        }
    }


    return (
        <form onSubmit={e => toast.promise(onSubmitHandler(e), { loading: "Adding Product..." })} className="text-slate-500 mb-28">
            <h1 className="text-2xl">Add New <span className="text-slate-800 font-medium">Products</span></h1>
            <p className="mt-7">Product Images</p>

            <div htmlFor="" className="flex gap-3 mt-4">
                {Object.keys(images).map((key) => (
                    <label key={key} htmlFor={`images${key}`}>
                        <Image width={300} height={300} className='h-15 w-auto border border-slate-200 rounded cursor-pointer' src={images[key] ? URL.createObjectURL(images[key]) : assets.upload_area} alt="" />
                        <input type="file" accept='image/*' id={`images${key}`} onChange={e => setImages({ ...images, [key]: e.target.files[0] })} hidden />
                    </label>
                ))}
            </div>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Name
                <input type="text" name="name" onChange={onChangeHandler} value={productInfo.name} placeholder="Enter product name" className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded" required />
            </label>

            <label htmlFor="" className="flex flex-col gap-2 my-6 ">
                Description
                <textarea name="description" onChange={onChangeHandler} value={productInfo.description} placeholder="Enter product description" rows={5} className="w-full max-w-sm p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
            </label>

            <div className="flex gap-5">
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Actual Price ($)
                    <input type="number" name="mrp" onChange={onChangeHandler} value={productInfo.mrp} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
                <label htmlFor="" className="flex flex-col gap-2 ">
                    Offer Price ($)
                    <input type="number" name="price" onChange={onChangeHandler} value={productInfo.price} placeholder="0" rows={5} className="w-full max-w-45 p-2 px-4 outline-none border border-slate-200 rounded resize-none" required />
                </label>
            </div>


            <select onChange={e => setProductInfo({ ...productInfo, category: e.target.value })} value={productInfo.category} className="w-full max-w-sm p-2 px-4 my-6 outline-none border border-slate-200 rounded" required>
                <option value="">Select a category</option>
                {categories.map((category) => (
                    <option key={category} value={category}>{category}</option>
                ))}
            </select>

            <br />

            <button disabled={loading} className="bg-slate-800 text-white px-6 mt-7 py-2 hover:bg-slate-900 rounded transition">Add Product</button>
        </form>
    )
}
