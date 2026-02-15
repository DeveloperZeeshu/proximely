import { SearchedProductType } from "@/features/search/components/ProductCard";
import { LatLng } from "@/types/search.types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { itemsDiscovery, ProductDiscoveryResponse } from "./productDiscoveryThunk";

type ProductDiscoveryStatus =
    | 'idle'
    | 'loading'
    | 'success'
    | 'failed'

export type SortType =
    | 'distance'
    | 'price_asc'
    | 'price_desc'


type QueryType = {
    search: string
    location: LatLng | null
    radius: number | null
    sort: SortType
}

type PaginationType = {
    limit: number
    nextCursor: string | null
    hasMore: boolean
}

type PayloadType = {
    query: QueryType
    pagination: PaginationType
}

type ProductDiscoveryState = {
    items: SearchedProductType[]
    query: QueryType
    pagination: PaginationType
    ui: {
        productDiscoveryStatus: ProductDiscoveryStatus
        error: string | null
    }
}

const initialState: ProductDiscoveryState = {
    items: [],

    query: {
        search: '',
        location: null,
        radius: null,
        sort: 'distance'
    },

    pagination: {
        limit: 10,
        nextCursor: null,
        hasMore: false
    },

    ui: {
        productDiscoveryStatus: 'loading',
        error: null
    }
}

const productDiscoverySlice = createSlice({
    name: 'product_discovery',
    initialState,

    reducers: {
        setQuery: (state, action: PayloadAction<PayloadType>) => {
            state.query = action.payload.query
            state.pagination = action.payload.pagination
            state.items = []
            state.ui.productDiscoveryStatus = 'loading'
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(itemsDiscovery.pending, (state) => {
                state.ui.productDiscoveryStatus = 'loading'
                state.ui.error = null
            })

            .addCase(itemsDiscovery.fulfilled, (state, action: PayloadAction<ProductDiscoveryResponse>) => {
                state.ui.productDiscoveryStatus = 'success'

                if (!state.pagination.nextCursor) {
                    state.items = action.payload.items
                } else {
                    const existingIds = new Set(state.items.map(i => i.product._id))
                    const uniqueNewItems = action.payload.items.filter(i => !existingIds.has(i.product._id))
                    state.items = [...state.items, ...uniqueNewItems]
                }

                state.pagination.nextCursor = action.payload.nextCursor
                state.pagination.hasMore = action.payload.nextCursor !== null
            })

            .addCase(itemsDiscovery.rejected, (state, action) => {
                state.ui.productDiscoveryStatus = 'failed'
                state.ui.error = action.error.message ?? 'Error searching product.'
            })
    }
})


// State selectors
export const selectProductDiscoveryItems = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.items

export const selectProductDiscoveryError = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.ui.error

export const selectProductDiscoveryLoading = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.ui.productDiscoveryStatus === 'loading'

export const selectProductDiscoverySuccess = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.ui.productDiscoveryStatus === 'success'

export const selectProductDiscoveryNextCursor = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery?.pagination.nextCursor

export const selectProductDiscoveryHasMore = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery.pagination.hasMore


export const { setQuery } = productDiscoverySlice.actions
export default productDiscoverySlice.reducer

