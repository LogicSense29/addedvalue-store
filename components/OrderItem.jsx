'use client'
import Image from "next/image";
import { DotIcon } from "lucide-react";
import { useSelector } from "react-redux";
import Rating from "./Rating";
import { useState } from "react";
import RatingModal from "./RatingModal";
import Link from "next/link";

const OrderItem = ({ order }) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    const [ratingModal, setRatingModal] = useState(null);

    const { ratings } = useSelector(state => state.rating);

    return (
        <>
            <tr className="text-sm">
                <td className="text-left">
                    <div className="flex flex-col gap-6">
                        {order.orderItems.map((item, index) => (
                            <div key={index} className="flex items-center gap-4">
                                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                                    <Image
                                        className="h-14 w-auto"
                                        src={item.product.images[0]}
                                        alt="product_img"
                                        width={50}
                                        height={50}
                                    />
                                </div>
                                <div className="flex flex-col justify-center text-sm">
                                    <p className="font-medium text-slate-600 text-base">{item.product.name}</p>
                                    <p className="text-slate-500">{currency}{item.price} Qty : {item.quantity} </p>
                                    
                                    {item.customizations && Object.keys(item.customizations).length > 0 && (
                                        <div className="text-xs text-slate-400 mt-1 space-y-0.5">
                                            {item.customizations.size && <p>Size: <span className="font-medium text-slate-500">{item.customizations.size}</span></p>}
                                            {item.customizations.color && <p>Color: <span className="font-medium text-slate-500">{item.customizations.color}</span></p>}
                                            {item.customizations.brandingText && (
                                                <p className="italic">Branding: "{item.customizations.brandingText}"</p>
                                            )}
                                        </div>
                                    )}

                                    <p className="mb-1 text-xs text-slate-400 mt-1">{new Date(order.createdAt).toDateString()}</p>
                                    <div>
                                        {ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId)
                                            ? <Rating value={ratings.find(rating => order.id === rating.orderId && item.product.id === rating.productId).rating} />
                                            : <button onClick={() => setRatingModal({ orderId: order.id, productId: item.product.id })} className={`text-primary hover:bg-primary/10 transition mt-2 ${order.status !== "DELIVERED" && 'hidden'}`}>Rate Product</button>
                                        }</div>
                                    {ratingModal && <RatingModal ratingModal={ratingModal} setRatingModal={setRatingModal} />}
                                </div>
                            </div>
                        ))}
                    </div>
                </td>

                <td className="text-center max-md:hidden">{currency}{order.total}</td>

                <td className="text-left max-md:hidden">
                    <p>{order.address.name}, {order.address.street},</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country},</p>
                    <p>{order.address.phone}</p>
                </td>

                <td className="text-left space-y-2 text-sm max-md:hidden">
                    <div
                        className={`flex items-center justify-center gap-1 rounded-full p-1 min-w-[100px] ${order.status === 'PENDING'
                            ? 'text-yellow-600 bg-yellow-100'
                            : order.status === 'DELIVERED'
                                ? 'text-primary bg-primary/10'
                                : order.status === 'SHIPPED'
                                    ? 'text-blue-600 bg-blue-100'
                                    : 'text-slate-500 bg-slate-100'
                            }`}
                    >
                        <DotIcon size={10} className="scale-250" />
                        {order.status.split('_').join(' ').toLowerCase()}
                    </div>
                    <Link href={`/orders/${order.id}/track`} className="text-primary hover:underline text-xs font-bold block text-center mt-2">
                        Track Order
                    </Link>
                </td>
            </tr>
            {/* Mobile */}
            <tr className="md:hidden">
                <td colSpan={5}>
                    <p>{order.address.name}, {order.address.street}</p>
                    <p>{order.address.city}, {order.address.state}, {order.address.zip}, {order.address.country}</p>
                    <p>{order.address.phone}</p>
                    <br />
                    <div className="flex items-center">
                        <span className='text-center mx-auto px-6 py-1.5 rounded bg-primary/10 text-primary uppercase text-[10px] font-bold tracking-widest' >
                            {order.status.replace(/_/g, ' ')}
                        </span>
                    </div>
                    <Link href={`/orders/${order.id}/track`} className="text-primary hover:underline text-xs font-bold block text-center mt-3">
                        Track Order
                    </Link>
                </td>
            </tr>
            <tr>
                <td colSpan={4}>
                    <div className="border-b border-slate-300 w-6/7 mx-auto" />
                </td>
            </tr>
        </>
    )
}

export default OrderItem