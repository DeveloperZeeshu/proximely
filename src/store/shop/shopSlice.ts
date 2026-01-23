import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { ShopInfoType } from "../../types/shop.types"
import { fetchMyShop } from "./shopThunks"

type ShopStatus = 'loading' | 'success' | 'failed'

interface ShopState {
  shop: ShopInfoType | null
  shopStatus: ShopStatus
  error: string | null
  hydrated: boolean
}

const initialState: ShopState = {
  shop: null,
  shopStatus: 'loading',
  error: null,
  hydrated: false
}

const shopSlice = createSlice({
  name: 'shop',
  initialState,

  reducers: {
    clearShop: (state) => {
      state.shop = null
      state.shopStatus = 'success'
      state.error = null
      state.hydrated = true
    },

    editShop: (state, action: PayloadAction<ShopInfoType>) => {
      state.shop = action.payload
      state.shopStatus = 'success'
      state.error = null
      state.hydrated = true
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMyShop.pending, (state) => {
        state.shopStatus = 'loading'
        state.error = null
      })
      .addCase(fetchMyShop.fulfilled, (state, action: PayloadAction<ShopInfoType | null>) => {
        state.shop = action.payload
        state.shopStatus = 'success'
        state.error = null
        state.hydrated = true
      })
      .addCase(fetchMyShop.rejected, (state, action) => {
        state.shop = null
        state.shopStatus = 'failed'
        state.error = action.error.message ?? 'Shop fetching failed'
        state.hydrated = true
      })
  }
});


export const selectShop = (state: { shop: ShopState }) =>
  state.shop.shop

export const selectShopLoading = (state: { shop: ShopState }) =>
  state.shop.shopStatus === 'loading'

export const selectShopSuccess = (state: { shop: ShopState }) =>
  state.shop.shopStatus === 'success'

export const selectShopError = (state: { shop: ShopState }) =>
  state.shop.error

export const selectShopHydrated = (state: { shop: ShopState }) =>
  state.shop.hydrated

export const { clearShop, editShop } = shopSlice.actions
export default shopSlice.reducer
