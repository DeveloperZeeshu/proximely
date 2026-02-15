import { configureStore } from "@reduxjs/toolkit"
import authSlice from './auth/authSlice'
import inventorySlice from './inventory/inventorySlice'
import shopSlice from './shop/shopSlice'
import productDiscoverySlice from './productDiscovery/productDiscoverySlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        shop: shopSlice,
        inventory: inventorySlice,
        product_discovery: productDiscoverySlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store




