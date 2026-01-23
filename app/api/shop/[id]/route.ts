import logger from "@/core/logger";
import { UpdateShopErrorType, updateShopService } from "@/src/features/shop/service";
import { AuthPayload, requireAuth } from "@/src/lib/auth/requireAuth";
import { updateShopSchema } from "@/src/validations/shop/update.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";

const UPDATE_SHOP_ERROR_MAP: Record<UpdateShopErrorType, {
    message: string
    status: number
}> = {
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 },
    NOT_FOUND: { message: 'Product not found.', status: 404 },
    INVALID_LOCATION: { message: 'Invalid location.', status: 422 }
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

        const { id: shopId } = await params

        const untrustedData = await req.json()

        const parsedData = updateShopSchema.safeParse(untrustedData)

        if (parsedData.error) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid requested data.',
                errors: error
            }, { status: 422 })
        }

        const updates = parsedData.data
        const { sub } = authPayload as AuthPayload

        const result = await updateShopService({
            sub,
            shopId,
            updates
        })

        if (!result.ok) {
            const err = UPDATE_SHOP_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled UpdateShopErrorType:', { code: result.code })

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
            message: 'Shop updated successfully.',
            updatedShop: result.updatedShop
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Shop Update Error:', { err })

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
