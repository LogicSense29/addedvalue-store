'use client'
import Counter from "@/components/Counter";
import OrderSummary from "@/components/OrderSummary";
import PageTitle from "@/components/PageTitle";
import { deleteItemFromCart } from "@/lib/features/cart/cartSlice";
import { Trash2Icon } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function Cart() {

    const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || '$';
    
    const { cartItems } = useSelector(state => state.cart);
    const products = useSelector(state => state.product.list);

    const dispatch = useDispatch();

    const [cartArray, setCartArray] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    const createCartArray = () => {
        setTotalPrice(0);
        const cartArray = [];
        for (const [key, value] of Object.entries(cartItems)) {
            const { productId, quantity, customizations } = value;
            const product = products.find(product => product.id === productId);
            if (product) {
                cartArray.push({
                    ...product,
                    quantity: quantity,
                    customizations: customizations,
                    cartKey: key
                });
                setTotalPrice(prev => prev + product.price * quantity);
            }
        }
        setCartArray(cartArray);
    }

    const handleDeleteItemFromCart = (cartKey) => {
        dispatch(deleteItemFromCart({ cartKey }))
    }

    useEffect(() => {
        if (products.length > 0) {
            createCartArray();
        }
    }, [cartItems, products]);

    return cartArray.length > 0 ? (
        <div className="min-h-screen mx-6 text-slate-800">

            <div className="max-w-7xl mx-auto ">
                {/* Title */}
                <PageTitle heading="My Cart" text="items in your cart" linkText="Add more" />

                <div className="flex items-start justify-between gap-5 max-lg:flex-col">

                    <table className="w-full max-w-4xl text-slate-600 table-auto">
                        <thead>
                            <tr className="max-sm:text-sm border-b border-slate-200">
                                <th className="text-left pb-4">Product</th>
                                <th className="pb-4">Quantity</th>
                                <th className="pb-4">Total Price</th>
                                <th className="max-md:hidden pb-4">Remove</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                cartArray.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-100 last:border-0">
                                        <td className="flex gap-3 my-4">
                                            <div className="flex gap-3 items-center justify-center bg-slate-100 size-20 rounded-md shrink-0">
                                                <Image src={item.images[0]} className="h-16 w-auto object-contain" alt="" width={60} height={60} />
                                            </div>
                                            <div className="flex flex-col justify-center">
                                                <p className="font-medium text-slate-800 max-sm:text-sm">{item.name}</p>
                                                {item.customizations && Object.keys(item.customizations).length > 0 && (
                                                    <div className="text-xs text-slate-500 mt-1 space-y-0.5">
                                                        {item.customizations.size && <p>Size: <span className="font-semibold">{item.customizations.size}</span></p>}
                                                        {item.customizations.color && <p>Color: <span className="font-semibold">{item.customizations.color}</span></p>}
                                                        {item.customizations.brandingText && (
                                                            <p className="italic text-slate-400 max-w-[200px] truncate" title={item.customizations.brandingText}>
                                                                Branding: "{item.customizations.brandingText}"
                                                            </p>
                                                        )}
                                                    </div>
                                                )}
                                                <p className="text-sm mt-1">{currency}{item.price}</p>
                                            </div>
                                        </td>
                                        <td className="text-center">
                                            <Counter productId={item.id} cartKey={item.cartKey} />
                                        </td>
                                        <td className="text-center font-medium">{currency}{(item.price * item.quantity).toLocaleString()}</td>
                                        <td className="text-center max-md:hidden">
                                            <button onClick={() => handleDeleteItemFromCart(item.cartKey)} className=" text-red-500 hover:bg-red-50 p-2.5 rounded-full active:scale-95 transition-all">
                                                <Trash2Icon size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>
                    <OrderSummary totalPrice={totalPrice} items={cartArray} />
                </div>
            </div>
        </div>
    ) : (
        <div className="min-h-[80vh] mx-6 flex items-center justify-center text-slate-400">
            <h1 className="text-2xl sm:text-4xl font-semibold">Your cart is empty</h1>
        </div>
    )
}