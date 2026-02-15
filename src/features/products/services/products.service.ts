import Product from "@/models/product.model"
import { decodeCursor, encodeCursor } from "@/utils/cursor"
import { buildInventoryPipeline, CursorObjType, SortKey } from "../inventory.aggregations"
import { connectToDB } from "@/db/dbConnector"
import { InventorySortType } from "@/store/inventory/inventorySlice"
import { ProductType } from "@/types/product.types"
import Shop from "@/models/shop.model"

// Fetch all products service
export type ProductsErrorType = 'UNAUTHORIZED' | 'NOT_FOUND'

type ProductsResult =
    | {
        ok: true
        items: ProductType[]
        nextCursor: string | null
    }
    | { ok: false; code: ProductsErrorType }


export const productsService = async ({
    sub,
    cursor,
    limit,
    search,
    sort
}: {
    sub: string
    cursor?: string | null
    limit: number
    sort: InventorySortType
    search: string
}): Promise<ProductsResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const MAX_LIMIT = 30
    const queryLimit = Math.max(1, Math.min(MAX_LIMIT, limit))
    let decodedCursor: CursorObjType | null = null

    if (cursor) {
        decodedCursor = decodeCursor<CursorObjType>(cursor)
    }

    await connectToDB()

    const shop = await Shop.findOne({
        ownerId: sub
    }).select('_id').lean()

    if (!shop) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const pipeline = buildInventoryPipeline({
        shopId: shop._id,
        search,
        sort,
        cursor: decodedCursor,
        limit: queryLimit
    })

    const items = await Product.aggregate(pipeline)

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
        const sortField = SortKey[sort]

        let obj = {}

        if (sortField === 'price') {
            obj = {
                id: cursorItem._id,
                price: cursorItem[sortField]
            }
        } else if (sortField === 'createdAt') {
            obj = {
                id: cursorItem._id,
                createdAt: cursorItem[sortField]
            }
        } else if (sortField === 'name') {
            obj = {
                id: cursorItem._id,
                name: cursorItem[sortField]
            }
        }
        nextCursor = encodeCursor(obj)
    }

    return {
        ok: true,
        items,
        nextCursor
    }
}