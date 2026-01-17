import { createSlice } from '@reduxjs/toolkit'

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        total: 0,
        cartItems: {}, // Key: cartKey (e.g., productId or productId-size-color-branding), Value: { quantity, productId, customizations }
    },
    reducers: {
        addToCart: (state, action) => {
            const { productId, cartKey, customizations } = action.payload
            const key = cartKey || productId
            if (state.cartItems[key]) {
                state.cartItems[key].quantity++
            } else {
                state.cartItems[key] = {
                    quantity: 1,
                    productId,
                    customizations: customizations || {}
                }
            }
            state.total += 1
        },
        removeFromCart: (state, action) => {
            const { cartKey, productId } = action.payload
            const key = cartKey || productId
            if (state.cartItems[key]) {
                state.cartItems[key].quantity--
                if (state.cartItems[key].quantity === 0) {
                    delete state.cartItems[key]
                }
                state.total -= 1
            }
        },
        deleteItemFromCart: (state, action) => {
            const { cartKey, productId } = action.payload
            const key = cartKey || productId
            if (state.cartItems[key]) {
                state.total -= state.cartItems[key].quantity
                delete state.cartItems[key]
            }
        },
        setCart: (state, action) => {
            state.cartItems = action.payload || {}
            state.total = Object.values(state.cartItems).reduce((sum, item) => sum + item.quantity, 0)
        },
        clearCart: (state) => {
            state.cartItems = {}
            state.total = 0
        },
    }
})

export const { addToCart, removeFromCart, clearCart, deleteItemFromCart, setCart } = cartSlice.actions

export default cartSlice.reducer
