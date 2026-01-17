'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  Laptop, 
  ShoppingBag, 
  Home, 
  Sparkles, 
  Gamepad2, 
  Dumbbell, 
  BookOpen, 
  Palette, 
  Layers 
} from 'lucide-react'
import Title from './Title'

const categoriesList = [
  { name: "Electronics", icon: Laptop, color: "#4F46E5" },
  { name: "Clothing & Jewelry", icon: ShoppingBag, color: "#EC4899" },
  { name: "Home & Kitchen", icon: Home, color: "#10B981" },
  { name: "Beauty & Health", icon: Sparkles, color: "#8B5CF6" },
  { name: "Toys & Games", icon: Gamepad2, color: "#F59E0B" },
  { name: "Sports & Outdoors", icon: Dumbbell, color: "#EF4444" },
  { name: "Books & Media", icon: BookOpen, color: "#3B82F6" },
  { name: "Hobbies & Crafts", icon: Palette, color: "#6366F1" },
  { name: "Others", icon: Layers, color: "#6B7280" }
]

const CategorySection = () => {
    const router = useRouter()

    return (
        <div className='px-6 my-20 max-w-6xl mx-auto'>
            <Title 
                visibleButton={false} 
                title='Shop by Category' 
                description="Explore our wide range of products across various categories designed to suit your lifestyle." 
            />

            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 mt-16'>
                {categoriesList.map((item, index) => (
                    <div 
                        key={index}
                        onClick={() => router.push(`/shop?search=${item.name}`)}
                        className='group relative flex flex-col items-center justify-center p-8 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden'
                    >
                        {/* Decorative Background Blob */}
                        <div 
                            className='absolute -right-4 -bottom-4 size-20 rounded-full opacity-5 group-hover:opacity-10 transition-opacity duration-300'
                            style={{ backgroundColor: item.color }}
                        />
                        
                        <div 
                            className='size-14 flex items-center justify-center rounded-2xl mb-4 group-hover:scale-110 transition-transform duration-300'
                            style={{ backgroundColor: `${item.color}10`, color: item.color }}
                        >
                            <item.icon size={28} />
                        </div>
                        
                        <h3 className='text-slate-800 font-bold text-center text-sm group-hover:text-primary transition-colors duration-300 leading-tight'>
                            {item.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CategorySection
