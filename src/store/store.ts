import { configureStore } from "@reduxjs/toolkit"
import authSlice from './auth/authSlice'
import productsSlice from './products/productsSlice'
import shopSlice from './shop/shopSlice'

const store = configureStore({
    reducer: {
        auth: authSlice,
        shop: shopSlice,
        products: productsSlice
    }
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export default store




