import { connectToDB } from "@/db/dbConnector"
import Shop from "@/models/shop.model"
import { ProductType } from "@/types/product.types"
import { decodeCursor, encodeCursor } from "@/utils/cursor"
import { ProductDiscoveryInput } from "@/validations/productDiscovery/search.schema"
import { buildProductDiscoveryPipeline, CursorObj, fromRow } from "./aggregations"

interface AggregationRow {
    product: {
        price: number;
        _id: any;
    };
    distance: number;
    distanceKm?: number;
    shop?: any;
}

const from = (row: AggregationRow) => ({
    price: row.product.price,
    distance: row.distance,
    id: row.product._id.toString()
});

// Search product service
export type ProductDiscoveryErrorType = 'NOT_FOUND'

type ProductDiscoveryResult =
    | { ok: false, code: ProductDiscoveryErrorType }
    | { ok: true; products: ProductType[]; nextCursor?: string | null, prevCursor?: string | null }

export const productDiscoveryService = async ({
    data,
}: {
    data: ProductDiscoveryInput
}): Promise<ProductDiscoveryResult> => {
    await connectToDB()

    const { query, cursor: cursorStr, dir, limit = 10 } = data

    let decodedCursor: CursorObj | null = null
    if (cursorStr) {
        decodedCursor = decodeCursor<CursorObj>(cursorStr)
    }

    const pipeline = buildProductDiscoveryPipeline(query, decodedCursor, dir, limit)

    const rows = await Shop.aggregate(pipeline)

    if (rows.length === 0) {
        return { ok: false, code: 'NOT_FOUND' }
    }

    const hasMore = rows.length > limit
    let items = hasMore ? rows.slice(0, limit) : rows

    // Return consistent order (ascending) to frontend
    if (dir === 'prev') {
        items = items.reverse()
    }

    const first = items[0]
    const last = items[items.length - 1]
    const hasIncomingCursor = cursorStr != null

    let nextCursor: string | null = null
    let prevCursor: string | null = null

    if (dir === 'next' || dir === null) {
        // Moving forward (or first page)
        if (hasMore) {
            nextCursor = encodeCursor(fromRow(last))
        }
        if (hasIncomingCursor) {
            prevCursor = encodeCursor(fromRow(first))
        }
    } else {
        // Moving backward
        if (hasMore) {
            prevCursor = encodeCursor(fromRow(first))
        }
        // If we had a cursor, we know there are items ahead
        nextCursor = encodeCursor(fromRow(last))
    }

    return {
        ok: true,
        products: items,
        nextCursor,
        prevCursor,
    }
}


