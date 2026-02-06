import { SearchedProductType } from "@/features/search/components/ProductCard";
import { LatLng } from "@/types/search.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { itemsDiscovery, ProductDiscoveryResponse } from "./productDiscoveryThunk";

type ProductDiscoveryStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'failed'

type ProductDiscoveryState = {
    items: SearchedProductType[]
    query: {
        search: string
        location: LatLng | null
        radius: number | null
    }
    cursor: {
        prev: string | null
        next: string | null
    }
    productDiscoveryStatus: ProductDiscoveryStatus
    hydrated: boolean
    error: string | null
}

const initialState: ProductDiscoveryState = {
    items: [],
    query: {
        search: '',
        location: null,
        radius: null
    },
    cursor: {
        prev: null,
        next: null
    },
    productDiscoveryStatus: 'loading',
    hydrated: false,
    error: null
}

const productDiscoverySlice = createSlice({
    name: 'product_discovery',
    initialState,

    reducers: {

    },

    extraReducers: (builder) => {
        builder
            .addCase(itemsDiscovery.pending, (state) => {
                state.productDiscoveryStatus = 'loading'
                state.error = null
                state.hydrated = false
            })

            .addCase(itemsDiscovery.fulfilled, (state, action: PayloadAction<ProductDiscoveryResponse>) => {
                state.items = action.payload.items
                state.cursor = action.payload.cursor
                state.productDiscoveryStatus = 'success'
                state.hydrated = true
            })

            .addCase(itemsDiscovery.rejected, (state, action) => {
                state.items = []
                state.productDiscoveryStatus = 'failed'
                state.error = action.error.message ?? 'Error searching product.'
                state.hydrated = true
                state.cursor = { prev: null, next: null }
            })
    }
})


// State selectors
export const selectProductDiscoveryItems = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.items

export const selectProductDiscoveryError = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.error

export const selectProductDiscoveryHydrated = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.hydrated

export const selectProductDiscoveryLoading = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.productDiscoveryStatus === 'loading'

export const selectProductDiscoverySuccess = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.productDiscoveryStatus === 'success'

export const selectProductDiscoveryPrevCursor = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery?.cursor?.prev

export const selectProductDiscoveryNextCursor = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery?.cursor?.next

export const selectProductDiscoveryHasNext = (state: { product_discovery: ProductDiscoveryState }) =>
    Boolean(state.product_discovery?.cursor?.next)

export const selectProductDiscoveryHasPrev = (state: { product_discovery: ProductDiscoveryState }) =>
    Boolean(state.product_discovery?.cursor?.prev)


export default productDiscoverySlice.reducer

