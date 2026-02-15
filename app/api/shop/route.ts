import logger from "core/logger"
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth"
import { createShopSchema } from "@/validations/shop/create.schema"
import { NextRequest, NextResponse } from "next/server"
import z from "zod"
import { CreateShopErrorType, createShopService } from "@/features/shop/services/create_shop.service"
import { shopService } from "@/features/shop/services/shop.service"

// Create Shop 
const SHOP_ERROR_MAP: Record<CreateShopErrorType, {
    message: string,
    status: number
}> = {
    NOT_FOUND: { message: 'Shop not found.', status: 404 },
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 },
    USER_EXISTS: { message: 'Shop already exists.', status: 409 }
}

export const POST = async (req: NextRequest) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const untrustedData = await req.json()

        const parsedData = createShopSchema.safeParse(untrustedData)

        if (!parsedData.success) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid requested data.',
                errors: error
            }, { status: 422 })
        }

        const { sub } = authPayload as AuthPayload

        const result = await createShopService({
            sub,
            data: parsedData.data
        })

        if (!result.ok) {
            const err = SHOP_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled CreateShopErrorType:',  result.code )

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
            message: 'Shop created successfully.',
            shop: result.createdShop
        }, { status: 201 })

    } catch (err: unknown) {
        logger.error('Create Shop Error:',  err )

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}


// Fetch Shop info
export const GET = async (req: NextRequest) => {
    try {
        const { authPayload, success } = await requireAuth()
        if (!success) {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized.'
            }, { status: 401 })
        }

        const { sub } = authPayload as AuthPayload

        const result = await shopService({
            sub
        })

        if (!result.ok) {
            const err = SHOP_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled FetchShopErrorType:',result.code )

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
            shop: result.shop
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Fetch Shop Error:', err )

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}
