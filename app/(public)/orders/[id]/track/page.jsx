'use client'
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { Package, Truck, CheckCircle, Clock, ChevronRight } from 'lucide-react';

const steps = [
  { id: 'ORDER_PLACED', label: 'Order Placed', icon: Clock, description: 'Your order has been received' },
  { id: 'PROCESSING', label: 'Processing', icon: Package, description: 'We are preparing your items' },
  { id: 'SHIPPED', label: 'Shipped', icon: Truck, description: 'Your order is on the way' },
  { id: 'DELIVERED', label: 'Delivered', icon: CheckCircle, description: 'Order has been delivered' },
];

export default function OrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/orders/${id}`);
        const data = await res.json();
        if (data.order) {
          setOrder(data.order);
        }
      } catch (error) {
        console.error("Failed to fetch order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-gray-500 mb-8">We couldn't find an order with this ID.</p>
        <a href="/shop" className="bg-primary text-white px-8 py-3 rounded-full font-bold">Continue Shopping</a>
      </div>
    );
  }

  const currentStepIndex = steps.findIndex(step => step.id === order.status);

  return (
    <div className="min-h-screen bg-[#fafafa] pt-10 pb-32 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold tracking-tighter text-[#1a1a1a] mb-2">Track Order<span className="text-primary">.</span></h1>
          <p className="text-gray-400">Order ID: <span className="text-gray-600 font-mono uppercase font-bold">{order.id}</span></p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 mb-8">
          <div className="relative flex flex-col md:flex-row justify-between gap-8">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.id} className="flex-1 flex flex-row md:flex-col items-center gap-4 relative">
                  {/* Connector Line */}
                  {index < steps.length - 1 && (
                    <div className={`hidden md:block absolute top-6 left-[60%] w-[80%] h-[2px] ${index < currentStepIndex ? 'bg-primary' : 'bg-gray-100'}`}></div>
                  )}

                  <div className={`size-12 rounded-full flex items-center justify-center z-10 transition-all duration-500 ${
                    isCompleted ? 'bg-primary text-white' : 'bg-gray-50 text-gray-300'
                  } ${isCurrent ? 'ring-4 ring-primary/20 scale-110' : ''}`}>
                    <Icon size={20} />
                  </div>

                  <div className="flex flex-col md:items-center md:text-center">
                    <h3 className={`font-bold text-sm tracking-tight ${isCompleted ? 'text-black' : 'text-gray-400'}`}>{step.label}</h3>
                    <p className="text-xs text-gray-400 max-w-[120px]">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Order Items
            </h2>
            <div className="space-y-4">
              {order.orderItems.map((item, i) => (
                <div key={i} className="flex gap-4 items-center p-4 rounded-2xl bg-gray-50/50 hover:bg-gray-50 transition-colors">
                  <div className="size-16 relative rounded-xl overflow-hidden bg-white">
                    <img src={item.product.images[0]} alt={item.product.name} className="object-cover w-full h-full" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-sm line-clamp-1">{item.product.name}</h4>
                    <p className="text-xs text-gray-400">Quantity: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-sm">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 pt-6 border-t border-gray-100">
               <div className="flex justify-between items-center mb-2">
                 <span className="text-gray-400 text-sm">Subtotal</span>
                 <span className="font-bold text-sm">${order.total.toFixed(2)}</span>
               </div>
               <div className="flex justify-between items-center">
                 <span className="text-gray-400 text-sm">Status</span>
                 <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${order.status === 'DELIVERED' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'}`}>
                   {order.status.replace('_', ' ')}
                 </span>
               </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Truck size={20} className="text-primary" />
              Delivery Details
            </h2>
            <div className="space-y-6">
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Shipping To</h4>
                <p className="text-sm font-bold">{order.address.name}</p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {order.address.street}<br />
                  {order.address.city}, {order.address.state} {order.address.zip}<br />
                  {order.address.country}
                </p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Payment Info</h4>
                <p className="text-sm font-bold">{order.paymentMethod}</p>
                <p className="text-sm text-gray-500">Status: {order.isPaid ? 'Paid' : 'Pending Payment'}</p>
              </div>
              <div>
                <h4 className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mb-2">Store Info</h4>
                <p className="text-sm font-bold">{order.store.name}</p>
                <p className="text-sm text-gray-500">{order.store.email}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
