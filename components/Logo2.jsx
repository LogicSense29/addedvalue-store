'use-client'
import Link from 'next/link';
import Image from 'next/image';
import { assets } from '@/assets/assets';
export function LogoModern() {
    return (
                            <Link href="/" className="flex items-center gap-2 group">
                                <div className="relative size-10 overflow-hidden rounded-full bg-primary/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                                     <Image src={assets.logo} alt="logo" width={32} height={32} className="object-contain p-1" />
                                </div>
                                <span className="text-xl font-bold tracking-tight text-[#1a1a1a]">AddedValue<span className="text-primary">.</span></span>
                            </Link>
    )
}