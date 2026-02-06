import logger from "core/logger";
import { ProductDiscoveryErrorType, productDiscoveryService } from "@/features/search/service";
import { productDiscoverySchema } from "@/validations/productDiscovery/search.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const PRODUCT_DISCOVERY_ERROR_MAP: Record<ProductDiscoveryErrorType, {
    status: number,
    message: string
}> = {
    NOT_FOUND: { message: 'Products not found.', status: 404 }
}

export const POST = async (req: NextRequest) => {
    try {
        const untrustedData = await req.json()

        const parsedData = productDiscoverySchema.safeParse(untrustedData)

        if (!parsedData.success) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid request data',
                errors: error
            }, { status: 422 })
        }

        const result = await productDiscoveryService({
            data: parsedData.data
        })

        if (!result.ok) {
            const err = PRODUCT_DISCOVERY_ERROR_MAP[result.code]

            if (!err) {
                logger.error('Unhandled SearchProductErrorCode', { code: result.code })

                return NextResponse.json({
                    success: false,
                    message: 'Internal server error.'
                }, { status: 500 })
            }
            return NextResponse.json({
                success: false,
                message: err.message
            }, { status: err.status })
        }

        return NextResponse.json({
            success: true,
            message: 'Products fetched successfully.',
            products: result.products,
            cursor: {
                prev: result.prevCursor,
                next: result.nextCursor
            }
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Unhandled location based product error.', { err })

        return NextResponse.json({
            success: false,
            message: 'Failed to search products.'
        }, { status: 500 })
    }
}

