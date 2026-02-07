import { UpdateProductErrorType, updateProductService } from "@/features/products/service";
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth";
import { updateProductSchema } from "@/validations/products/update.schema";
import logger from "core/logger";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UPDATE_PRODUCT_ERROR_MAP: Record<UpdateProductErrorType, {
    message: string
    status: number
}> = {
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 },
    NOT_FOUND: { message: 'Product not found.', status: 404 },
    BAD_REQUEST: { message: 'Bad request.', status: 400 }
}

export const PATCH = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const { id: productId } = await params

        const untrustedData = await req.json()

        const parsedData = updateProductSchema.safeParse(untrustedData)

        if (parsedData.error) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid requested data.',
                errors: error
            }, { status: 422 })
        }

        const updates = parsedData.data
        const {sub} = authPayload as AuthPayload

        const result = await updateProductService({
            sub,
            productId,
            updates
        })

        if (!result.ok) {
            const err = UPDATE_PRODUCT_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled UpdateProductErrorType:', result.code)

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
            message: 'Product updated successfully.',
            updatedProduct: result.updatedProduct
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Product Update Error:', err)

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
