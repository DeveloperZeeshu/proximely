import { connectToDB } from "@/db/dbConnector"
import Product from "@/models/product.model"
import Shop from "@/models/shop.model"

// Product Stats Service
export type ProductStatsDTO = {
    totalProducts: number
    totalInStock: number
    totalOutOfStock: number
}

export type ProductStatErrorType = 'NOT_FOUND'

type ProductStatResult =
    | { ok: false, code: ProductStatErrorType }
    | { ok: true, stats: ProductStatsDTO }

export const productStatService = async (
    ownerId: string
): Promise<ProductStatResult> => {

    await connectToDB()

    const shop = await Shop.findOne({
        ownerId
    }).select('_id')

    if (!shop) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const stats = await Product.aggregate([
        { $match: { shopId: shop._id, isDeleted: false } },
        {
            $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalInStock: {
                    $sum: { $cond: ['$isAvailable', 1, 0] }
                },
                totalOutOfStock: {
                    $sum: { $cond: ['$isAvailable', 0, 1] }
                }
            }
        },
        {
            $project: {
                _id: 0,
                totalProducts: 1,
                totalInStock: 1,
                totalOutOfStock: 1
            }
        }
    ])

    if (!stats.length) {
        return { ok: false, code: 'NOT_FOUND' }
    }

    return {
        ok: true,
        stats: stats[0]
    }
}