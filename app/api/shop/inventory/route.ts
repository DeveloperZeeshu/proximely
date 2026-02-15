import logger from "core/logger";
import { AuthPayload, requireAuth } from "@/lib/auth/requireAuth";
import { addProductSchema } from "@/validations/products/add.schema";
import { NextRequest, NextResponse } from "next/server";
import z from "zod";
import { InventorySortType } from "@/store/inventory/inventorySlice";
import { ProductsErrorType, productsService } from "@/features/products/services/products.service";
import { AddProductErrorType, addProductService } from "@/features/products/services/add_product.service";

const PRODUCTS_ERROR_MAP: Record<ProductsErrorType, {
    message: string,
    status: number
}> = {
    NOT_FOUND: { message: 'Shop not found.', status: 404 },
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 }
}

// Fetching All products
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

        const searchParams = req.nextUrl.searchParams
        const cursor = searchParams.get('cursor')
        const rawLimit = Number(searchParams.get('limit') ?? 10)
        const limit = Number.isNaN(rawLimit) || rawLimit <= 0 ? 10 : rawLimit
        const search = String(searchParams.get('search'))
        const rawSort = searchParams.get('sort')
        const sort: InventorySortType =
            rawSort === 'name_asc' ||
                rawSort === 'name_desc' ||
                rawSort === 'newest' ||
                rawSort === 'oldest' ||
                rawSort === 'price_asc' ||
                rawSort === 'price_desc'
                ? rawSort
                : 'newest'

        const result = await productsService({
            sub,
            cursor,
            limit,
            search,
            sort
        })

        if (!result.ok) {
            const err = PRODUCTS_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled ProductsErrorType:', result.code)

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
            items: result.items,
            nextCursor: result.nextCursor,
        }, { status: 200 })

    } catch (err: unknown) {
        logger.error('Fetch Products Error:', err)

        return NextResponse.json({
            success: false,
            message: 'Internal server error.',
        }, { status: 500 })
    }
}


// Adding new product
const ADD_PRODUCT_ERROR_MAP: Record<AddProductErrorType, {
    message: string,
    status: number
}> = {
    NOT_FOUND: { message: 'Shop not found.', status: 404 },
    UNAUTHORIZED: { message: 'Unauthorized.', status: 401 },
    BAD_REQUEST: { message: 'Bad request.', status: 400 }
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

        const parsedData = addProductSchema.safeParse(untrustedData)

        if (!parsedData.success) {
            const error = z.treeifyError(parsedData.error)

            return NextResponse.json({
                success: false,
                message: 'Invalid request data.',
                errors: error
            }, { status: 422 })
        }

        const product = parsedData.data
        const { sub } = authPayload as AuthPayload

        const result = await addProductService({
            sub,
            product
        })

        if (!result.ok) {
            const err = ADD_PRODUCT_ERROR_MAP[result.code]
            if (!err) {
                logger.error('Unhandled AddProductErrorType: ', result.code)

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
            message: 'Product added successfully.',
            newProduct: result.newProduct
        }, { status: 201 })

    } catch (err: unknown) {
        logger.error('Add Product Error:', err)

        return NextResponse.json({
            success: false,
            message: 'Internal server error.'
        }, { status: 500 })
    }
}


