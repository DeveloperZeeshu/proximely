import { ProductType } from "@/types/product.types";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchAllProducts, FetchProductsResponse } from "./productsThunks";

type ProductStatus =
  | 'loading'
  | 'success'
  | 'failed'

interface ProductsState {
  products: ProductType[],
  hasNext: boolean
  hydrated: boolean
  error: string | null
  hasPrev: boolean
  nextCursor: string | null
  prevCursor: string | null
  productsStatus: ProductStatus
}

interface EditProductPayloadAction {
  _id: string
  product: ProductType
}

const initialState: ProductsState = {
  products: [],
  hasNext: false,
  hasPrev: false,
  error: null,
  hydrated: false,
  nextCursor: null,
  prevCursor: null,
  productsStatus: 'loading'
}

const productsSlice = createSlice({
  name: 'products',
  initialState,

  reducers: {
    addProduct: (state, action: PayloadAction<ProductType>) => {
      state.products.push(action.payload)
      state.productsStatus = 'success'
    },
    editProduct: (state, action: PayloadAction<EditProductPayloadAction>) => {
      state.products = state.products.map(p => p._id === action.payload._id ? action.payload.product : p)
      state.productsStatus = 'success'
    },
    editProductStatus: (state, action: PayloadAction<string>) => {
      state.products = state.products.map(p =>
        p._id === action.payload ?
          { ...p, isAvailable: !p.isAvailable } :
          p
      )
      state.productsStatus = 'success'
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p._id !== action.payload)
      state.productsStatus = 'success'
    },
    clearProducts: (state) => {
      state.products = []
      state.productsStatus = 'success'
      state.error = null
      state.hydrated = true
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.productsStatus = 'loading'
        state.error = null
      })
      .addCase(fetchAllProducts.fulfilled, (state, action: PayloadAction<FetchProductsResponse>) => {
        state.products = action.payload.products
        state.hasNext = action.payload.hasNext
        state.hasPrev = action.payload.hasPrev
        state.nextCursor = action.payload.nextCursor
        state.prevCursor = action.payload.prevCursor
        state.productsStatus = 'success'
        state.hydrated = true
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.products = []
        state.productsStatus = 'failed'
        state.error = action.error.message ?? 'Product fetching failed'
        state.hydrated = true
      })
  }
})


export const selectProductsLoading = (state: { products: ProductsState }) =>
  state.products.productsStatus === 'loading'

export const selectShopSuccess = (state: { products: ProductsState }) =>
  state.products.productsStatus === 'success'

export const selectProducts = (state: { products: ProductsState }) =>
  state.products.products;

export const selectHasNext = (state: { products: ProductsState }) =>
  state.products.hasNext

export const selectHasPrev = (state: { products: ProductsState }) =>
  state.products.hasPrev

export const selectNextCursor = (state: { products: ProductsState }) =>
  state.products.nextCursor

export const selectPrevCursor = (state: { products: ProductsState }) =>
  state.products.prevCursor

export const selectProductsError = (state: { products: ProductsState }) =>
  state.products.error;

export const selectProductsHydrated = (state: { products: ProductsState }) =>
  state.products.hydrated;

export const {
  addProduct,
  editProduct,
  editProductStatus,
  deleteProduct,
  clearProducts
} = productsSlice.actions

export default productsSlice.reducer
