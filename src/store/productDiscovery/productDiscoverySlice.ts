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
    dir: 'next' | 'prev' | null
    activeCursor: string | null
    cursor: {
        prev: string | null
        next: string | null
    }
}

type PayloadType = {
    query: QueryType
    pagination: PaginationType
}

type ProductDiscoveryState = {
    items: SearchedProductType[]
    query: QueryType
    pagination: PaginationType
    productDiscoveryStatus: ProductDiscoveryStatus
    hydrated: boolean
    error: string | null
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
        dir: null,
        activeCursor: null,
        cursor: {
            prev: null,
            next: null
        }
    },
    productDiscoveryStatus: 'loading',
    hydrated: false,
    error: null
}

const productDiscoverySlice = createSlice({
    name: 'product_discovery',
    initialState,

    reducers: {
        setQuery: (state, action: PayloadAction<PayloadType>) => {
            state.query = action.payload.query
            state.pagination = action.payload.pagination
            state.items = []
            state.productDiscoveryStatus = 'loading'
        }
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
                state.pagination.cursor = action.payload.cursor
                state.productDiscoveryStatus = 'success'
                state.hydrated = true
            })

            .addCase(itemsDiscovery.rejected, (state, action) => {
                state.items = []
                state.productDiscoveryStatus = 'failed'
                state.error = action.error.message ?? 'Error searching product.'
                state.hydrated = true
                state.pagination.cursor = { prev: null, next: null }
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
    state.product_discovery?.pagination.cursor?.prev

export const selectProductDiscoveryNextCursor = (state: { product_discovery: ProductDiscoveryState }) =>
    state.product_discovery?.pagination.cursor?.next

export const selectProductDiscoveryHasNext = (state: { product_discovery: ProductDiscoveryState }) =>
    Boolean(state.product_discovery?.pagination.cursor?.next)

export const selectProductDiscoveryHasPrev = (state: { product_discovery: ProductDiscoveryState }) =>
    Boolean(state.product_discovery?.pagination.cursor?.prev)


export const { setQuery } = productDiscoverySlice.actions
export default productDiscoverySlice.reducer

