import { productDiscovery } from "@/apis/productDiscovery.api";
import { SearchedProductType } from "@/features/search/components/ProductCard";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";

export type ProductDiscoveryResponse = {
    items: SearchedProductType[]
    cursor: {
        next: string | null
        prev: string | null
    }
}

export const itemsDiscovery = createAsyncThunk<
    ProductDiscoveryResponse,
    void,
    { state: RootState }
>(
    'productDiscovery/search',
    async (_, { getState }) => {
        const { query, pagination } = getState().product_discovery

        const { search, location, radius, sort } = query

        if (!search || !location || !radius || !sort) {
            return {
                items: [],
                cursor: { prev: null, next: null }
            }
        }

        const res = await productDiscovery({
            query: {
                search,
                radius,
                sort,
                location,
            },
            cursor: pagination.activeCursor,
            dir: pagination.dir,
            limit: pagination.limit
        })

        return {
            items: res.products,
            cursor: res.cursor
        }
    }
)
