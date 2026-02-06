import { productDiscovery } from "@/apis/productDiscovery.api";
import { SearchedProductType } from "@/features/search/components/ProductCard";
import { LatLng } from "@/types/search.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

type ProductDiscoveryArgs = {
    query: {
        search: string
        location: LatLng
        radius: number
    },
    cursor?: {
        value: string | null
        dir: 'next' | 'prev'
    }
    sort: string
    limit?: number
}

export type ProductDiscoveryResponse = {
    items: SearchedProductType[]
    cursor: {
        next: string | null
        prev: string | null
    }
}

export const itemsDiscovery = createAsyncThunk<
    ProductDiscoveryResponse,
    ProductDiscoveryArgs
>(
    'productDiscovery/search',
    async ({ query, cursor, limit, sort }) => {
        const res = await productDiscovery({
            query,
            sort,
            cursor: cursor?.value,
            dir: cursor?.dir,
            limit
        })
        return {
            items: res.products,
            cursor: res.cursor
        }
    }
)
