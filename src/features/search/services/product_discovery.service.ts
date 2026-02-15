import { decodeCursor, encodeCursor } from "@/utils/cursor";
import { buildProductDiscoveryPipeline, CursorObj } from "../aggregations";
import Shop from "@/models/shop.model";
import { connectToDB } from "@/db/dbConnector";
import { ProductDiscoveryInput } from "@/validations/productDiscovery/search.schema";

export type ProductDiscoveryErrorType = 'NOT_FOUND'

type ProductDiscoveryResult =
    | { ok: false, code: ProductDiscoveryErrorType }
    | { ok: true; items: any[]; nextCursor: string | null }

export const productDiscoveryService = async ({
    data,
}: {
    data: ProductDiscoveryInput
}): Promise<ProductDiscoveryResult> => {

    const MAX_LIMIT = 30
    const queryLimit = Math.max(1, Math.min(MAX_LIMIT, data.limit ?? 10))

    let decodedCursor: CursorObj | null = null
    if (data.cursor) {
        decodedCursor = decodeCursor<CursorObj>(data.cursor)
    }

    await connectToDB()

    const pipeline = buildProductDiscoveryPipeline({
        query: data.query,
        cursor: decodedCursor,
        limit: queryLimit
    })

    const items = await Shop.aggregate(pipeline)

    if (!items || items.length <= 0) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const hasMore = items.length > queryLimit
    let nextCursor = null

    if (hasMore) {
        items.pop()

        const cursorItem = items.at(-1)
        const sort = data.query.sort

        let obj: CursorObj = {
            id: cursorItem.product._id.toString(),
            price: cursorItem.product.price,
            distance: cursorItem.distance
        }

        nextCursor = encodeCursor(obj)
    }

    return {
        ok: true,
        items,
        nextCursor
    }
}