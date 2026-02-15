import { connectToDB } from "@/db/dbConnector"
import Product from "@/models/product.model"
import Shop from "@/models/shop.model"
import { ProductType } from "@/types/product.types"
import { AddProductInput } from "@/validations/products/add.schema"

// Add Product service
export type AddProductErrorType = 'UNAUTHORIZED' | 'NOT_FOUND' | 'BAD_REQUEST'

type AddProductResult =
    | { ok: true, newProduct: ProductType }
    | { ok: false, code: AddProductErrorType }

export const addProductService = async ({
    sub,
    product
}: {
    sub: string
    product: AddProductInput
}): Promise<AddProductResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
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

    const newProduct = await Product.create({
        shopId: shop._id,
        ...product
    })

    const cleanedProduct = newProduct.toObject({
        versionKey: false
    })
    delete cleanedProduct.createdAt
    delete cleanedProduct.updatedAt

    return {
        ok: true,
        newProduct: cleanedProduct
    }
}