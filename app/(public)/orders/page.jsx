'use client'
import PageTitle from "@/components/PageTitle";
import { useEffect, useState } from "react";
import OrderItem from "@/components/OrderItem";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";

export default function Orders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const user = useSelector(state => state.user.currentUser);

    const fetchOrders = async () => {
        if (!user) return setLoading(false);
        try {
            const res = await fetch(`/api/orders?userId=${user.id}`);
            const data = await res.json();
            if (data.orders) {
                setOrders(data.orders);
            }
        } catch (error) {
            console.error("Failed to fetch orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [user]);

    if (loading) return <Loading />;

    return (
        <div className="min-h-screen bg-[#fafafa] pt-20 pb-40 px-6">
            <div className="max-w-[1400px] mx-auto">
                <div className="mb-20">
                    <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-primary mb-3">Order Management</h4>
                    <h1 className="text-6xl font-black tracking-tighter text-[#1a1a1a]">Purchase History<span className="text-gray-200">({orders.length})</span></h1>
                </div>

                {orders.length > 0 ? (
                    <div className="grid grid-cols-1 gap-12">
                        {orders.map((order) => (
                            <OrderItem order={order} key={order.orderId || order.id} />
                        ))}
                    </div>
                ) : (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center">
                        <div className="size-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                            <Package size={32} className="text-gray-300" />
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight text-[#1a1a1a] mb-2">No orders found</h2>
                        <p className="text-gray-400 text-sm max-w-xs mb-8">You haven't placed any orders yet. Start exploring our collections to find your first item.</p>
                        <Link 
                            href="/shop" 
                            className="bg-[#1a1a1a] text-white px-8 py-4 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-primary transition-all duration-500"
                        >
                            Start Shopping
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}