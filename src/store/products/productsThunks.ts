import { getProducts } from "@/src/apis/product.api";
import { ProductType } from "@/src/types/product.types";
import { createAsyncThunk } from "@reduxjs/toolkit";

type FetchProductsArgs = {
    cursor?: string | null
    limit: number
    dir: 'next' | 'prev'
}

export type FetchProductsResponse = {
    products: ProductType[]
    nextCursor: string | null
    prevCursor: string | null
    hasNext: boolean
    hasPrev: boolean
}


export const fetchAllProducts = createAsyncThunk<
    FetchProductsResponse,
    FetchProductsArgs
>(
    'products/fetchAllProducts',
    async ({ cursor, limit, dir }) => {
        const res = await getProducts({
            cursor,
            limit,
            dir
        })

        return {
            products: res.products,
            hasNext: res.hasNext,
            hasPrev: res.hasPrev,
            nextCursor: res.nextCursor,
            prevCursor: res.prevCursor
        }
    }
)

