import { connectToDB } from "@/db/dbConnector"
import Product from "@/models/product.model"
import Shop from "@/models/shop.model"
import { ProductType } from "@/types/product.types"
import { UpdateProductInput } from "@/validations/products/update.schema"

// Update Product service
export type UpdateProductErrorType = 'UNAUTHORIZED' | 'NOT_FOUND' | 'BAD_REQUEST'

type UpdateProductResult =
    | { ok: true, updatedProduct: ProductType }
    | { ok: false, code: UpdateProductErrorType }

export const updateProductService = async ({
    sub,
    productId,
    updates
}: {
    sub: string
    productId: string
    updates: UpdateProductInput
}): Promise<UpdateProductResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    if (!productId) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    await connectToDB()

    const shop = await Shop.findOne({
        ownerId: sub
    }).select('_id')

    if (!shop) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const updatedProduct = await Product.findOneAndUpdate(
        { _id: productId, shopId: shop.id },
        updates,
        { new: true }
    ).lean()

    if (!updatedProduct) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const { createdAt, updatedAt, __v, ...cleanedProduct } = updatedProduct

    return {
        ok: true,
        updatedProduct: cleanedProduct
    }
}