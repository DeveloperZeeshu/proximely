import { getProducts } from "@/apis/inventory.api";
import { ProductType } from "@/types/product.types";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

type FetchProductsArgs = {
    search: string | null
}

export type FetchProductsResponse = {
    items: ProductType[]
    nextCursor: string | null
}


export const fetchShopProducts = createAsyncThunk<
    FetchProductsResponse,
    void,
    { state: RootState }
>(
    'inventory/fetchProducts',
    async (_, { getState }) => {
        const { filters, pagination } = getState().inventory
        const { search, sort } = filters
        const { nextCursor, limit } = pagination

        const res = await getProducts({
            search: search ? search : '',
            sort,
            cursor: nextCursor ? nextCursor : '',
            limit
        })

        return {
            items: res.items,
            nextCursor: res.nextCursor
        }
    }
)

