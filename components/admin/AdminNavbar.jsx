'use client'
import Link from "next/link"
import Logo from "../Logo"

import { useSelector, useDispatch } from "react-redux"
import { useRouter } from "next/navigation"
import { userData as setUserData } from "@/lib/features/user/userSlice"
import toast from "react-hot-toast"

const AdminNavbar = () => {
    const user = useSelector(state => state.user.currentUser)
    const dispatch = useDispatch()
    const router = useRouter()

    const handleLogout = async () => {
        try {
            const res = await fetch('/api/auth/logout', { method: 'POST' });
            if (res.ok) {
                dispatch(setUserData(null));
                toast.success("Logged out");
                router.push('/');
            }
        } catch (error) {
            toast.error("Logout failed");
        }
    }

    return (
        <div className="flex flex-wrap items-center justify-between px-12 py-3 border-b border-slate-200 transition-all">
            <Logo />
            <div className="flex items-center gap-6">
                <p className="font-bold text-slate-700">Hi, {user?.name || 'Admin'}</p>
                <button 
                    onClick={handleLogout}
                    className="text-[10px] uppercase tracking-widest font-bold text-red-500 hover:text-red-700 transition-colors"
                >
                    Logout
                </button>
            </div>
        </div>
    )
}

export default AdminNavbar