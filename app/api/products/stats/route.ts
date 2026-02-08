import { ProductStatErrorType, productStatService } from "@/features/products/service"
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth"
import logger from "core/logger"
import { NextRequest, NextResponse } from "next/server"

const PRODUCT_STAT_ERROR_MAP: Record<ProductStatErrorType, {
    status: number
    message: string
}> = {
    NOT_FOUND: { status: 404, message: 'No products found.' }
}


export const GET = async (_req: NextRequest) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const { sub } = authPayload as AuthPayload

        const result = await productStatService(sub)

        if (!result.ok) {
            const err = PRODUCT_STAT_ERROR_MAP[result.code]

            return NextResponse.json({
                success: false,
                message: err.message
            }, { status: err.status })
        }

        return NextResponse.json({
            success: true,
            message: 'Product stats fetched successfully.',
            stats: {
                totalProducts: result.stats.totalProducts,
                totalInStock: result.stats.totalInStock,
                totalOutOfStock: result.stats.totalOutOfStock
            }
        }, { status: 200 })

    } catch (err) {
        logger.error('Product stats error', err)

        return NextResponse.json({
            success: false,
            message: 'Failed to fetch product stats.'
        }, { status: 500 })
    }
}
