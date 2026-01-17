"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userData as setUserData } from "@/lib/features/user/userSlice";
import { setProduct } from "@/lib/features/product/productSlice";
import { setCart } from "@/lib/features/cart/cartSlice";
import { useSelector } from "react-redux";

export default function AuthInit({ children }) {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.cartItems);
  const user = useSelector(state => state.user.currentUser);

  // Sync cart to DB when it changes (debounced)
  useEffect(() => {
    if (!user) return;

    // Debounce cart sync to prevent excessive API calls
    const timeoutId = setTimeout(async () => {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, cart: cartItems }),
        });
      } catch (error) {
        console.error("Cart sync failed:", error);
      }
    }, 2000); // Wait 2 seconds after last cart change

    // Cleanup timeout on unmount or when dependencies change
    return () => clearTimeout(timeoutId);
  }, [cartItems, user]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const roleParam = user?.role ? `?userRole=${user.role}` : "";
        const res = await fetch(`/api/products${roleParam}`);
        const data = await res.json();
        if (data.success) {
          dispatch(setProduct(data.products));
        }
      } catch (error) {
        console.error("Auth init fetch products error:", error);
      }
    };

    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();
        if (data.user) {
          dispatch(setUserData(data.user));
          if (data.user.cart) {
            dispatch(setCart(data.user.cart));
          }
        }
      } catch (error) {
        console.error("Auth initialization failed", error);
      }
    };

    fetchProducts();
    if (!user) {
      checkAuth();
    }
  }, [dispatch, user]);

  return <>{children}</>;
}
