import logger from "@/core/logger";
import { SearchProductErrorType, searchProductService } from "@/src/features/search/service";
import { searchProductSchema } from "@/src/validations/products/search.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const SEARCH_PRODUCT_ERROR_MAP: Record<SearchProductErrorType, {
    status: number,
    message: string
}> = {
    NOT_FOUND: { message: 'Products not found.', status: 404 }
}

export const POST = async (req: NextRequest) => {
    try {
        const untrustedData = await req.json()

        const parsedData = searchProductSchema.safeParse(untrustedData)

        if (!parsedData.success) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid request data',
                errors: error
            }, { status: 422 })
        }

        const result = await searchProductService({
            data: parsedData.data
        })

        if (!result.ok) {
            const err = SEARCH_PRODUCT_ERROR_MAP[result.code]

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
            products: result.products
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Unhandled location based product error.', { err })

        return NextResponse.json({
            success: false,
            message: 'Failed to search products.'
        }, { status: 500 })
    }
}

