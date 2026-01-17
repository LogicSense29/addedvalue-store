'use client'
import { addToCart, removeFromCart } from "@/lib/features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

const Counter = ({ productId, cartKey }) => {
    
    const { cartItems } = useSelector(state => state.cart);
    const dispatch = useDispatch();

    const key = cartKey || productId;

    const addToCartHandler = () => {
        dispatch(addToCart({ productId, cartKey }))
    }

    const removeFromCartHandler = () => {
        dispatch(removeFromCart({ productId, cartKey }))
    }

    return (
        <div className="inline-flex items-center gap-1 sm:gap-3 px-3 py-1 rounded border border-slate-200 max-sm:text-sm text-slate-600">
            <button onClick={removeFromCartHandler} className="p-1 select-none focus:outline-none">-</button>
            <p className="p-1 min-w-[1.5rem] text-center">{cartItems[key]?.quantity || 0}</p>
            <button onClick={addToCartHandler} className="p-1 select-none focus:outline-none">+</button>
        </div>
    )
}

export default Counter