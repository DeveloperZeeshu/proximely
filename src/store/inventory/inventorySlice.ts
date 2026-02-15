import { ProductType } from "@/types/product.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { FetchProductsResponse, fetchShopProducts } from "./inventoryThunks";

type Status =
  | 'idle'
  | 'loading'
  | 'succeeded'
  | 'failed'

export type InventorySortType =
  | 'newest'
  | 'oldest'
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'

type FiltersPayload = {
  search?: string
  sort?: InventorySortType
}

interface InventoryState {
  items: ProductType[]

  filters: {
    search?: string
    sort?: InventorySortType
  }

  pagination: {
    limit: number
    nextCursor: string | null
    hasMore: boolean
  }

  ui: {
    fetchStatus: Status
    actionStatus: Status
    error: string | null
  }
}

interface EditProductPayloadAction {
  _id: string
  product: ProductType
}

const initialState: InventoryState = {
  items: [],

  filters: {
    search: '',
    sort: 'newest'
  },

  pagination: {
    limit: 10,
    nextCursor: null,
    hasMore: false
  },

  ui: {
    fetchStatus: 'loading',
    actionStatus: 'idle',
    error: null
  }
}

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,

  reducers: {
    setFilters: (state, action: PayloadAction<FiltersPayload>) => {
      state.pagination.hasMore = false
      state.pagination.nextCursor = null
      state.items = []
      state.filters = action.payload
    },

    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.items.unshift(action.payload)
      state.ui.actionStatus = 'succeeded'
    },
    editProduct: (state, action: PayloadAction<EditProductPayloadAction>) => {
      state.items = state.items.map(p => p._id === action.payload._id ? action.payload.product : p)
      state.ui.actionStatus = 'succeeded'
    },
    editProductStatus: (state, action: PayloadAction<string>) => {
      state.items = state.items.map(p =>
        p._id === action.payload ?
          { ...p, isAvailable: !p.isAvailable } :
          p
      )
      state.ui.actionStatus = 'succeeded'
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(p => p._id !== action.payload)
      state.ui.actionStatus = 'succeeded'
    },
    clearProducts: (state) => {
      state.items = []
      state.ui.actionStatus = 'succeeded'
      state.ui.error = null
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchShopProducts.pending, (state) => {
        state.ui.fetchStatus = 'loading'
        state.ui.error = null
      })
      .addCase(fetchShopProducts.fulfilled, (state, action: PayloadAction<FetchProductsResponse>) => {
        state.ui.fetchStatus = 'succeeded'

        if (!state.pagination.nextCursor) {
          state.items = action.payload.items
        } else {
          const existingIds = new Set(state.items.map(i => i._id))
          const uniqueNewItems = action.payload.items.filter(i => !existingIds.has(i._id))
          state.items = [...state.items, ...uniqueNewItems]
        }

        state.pagination.nextCursor = action.payload.nextCursor
        state.pagination.hasMore = action.payload.nextCursor !== null
      })
      .addCase(fetchShopProducts.rejected, (state, action) => {
        state.ui.fetchStatus = 'failed'
        state.ui.error = action.error.message ?? 'Product fetching failed'
      })
  }
})


export const selectInventoryLoading = (state: { inventory: InventoryState }) =>
  state.inventory?.ui.fetchStatus === 'loading'

export const selectInventorySuccess = (state: { inventory: InventoryState }) =>
  state.inventory?.ui.fetchStatus === 'succeeded'

export const selectItems = (state: { inventory: InventoryState }) =>
  state.inventory.items

export const selectHasMore = (state: { inventory: InventoryState }) =>
  state.inventory?.pagination.hasMore

export const selectNextCursor = (state: { inventory: InventoryState }) =>
  state.inventory?.pagination.nextCursor

export const selectInventoryError = (state: { inventory: InventoryState }) =>
  state.inventory?.ui.fetchStatus

export const selectInventorySearch = (state: { inventory: InventoryState }) =>
  state.inventory.filters.search

export const selectInventorySort = (state: { inventory: InventoryState }) =>
  state.inventory.filters.sort


export const {
  addProduct,
  editProduct,
  editProductStatus,
  deleteProduct,
  clearProducts,
  setFilters
} = inventorySlice.actions

export default inventorySlice.reducer
