import { connectToDB } from "@/src/db/dbConnector"
import Product from "@/src/models/product.model"
import Shop from "@/src/models/shop.model"
import { ProductType } from "@/src/types/product.types"
import { AddProductInput } from "@/src/validations/products/add.schema"
import { UpdateProductInput } from "@/src/validations/products/update.schema"
import mongoose from "mongoose"


// Fetch all products service
export type ProductsErrorType = 'UNAUTHORIZED' | 'NOT_FOUND'

type ProductsResult =
    | {
        ok: true
        products: ProductType[]
        hasNext: boolean
        hasPrev: boolean
        nextCursor: string | null
        prevCursor: string | null
    }
    | { ok: false; code: ProductsErrorType }


export const productsService = async ({
    sub,
    cursor,
    limit,
    next
}: {
    sub: string
    cursor?: string | null
    limit: number
    next: boolean
}): Promise<ProductsResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    const MAX_LIMIT = 30
    const queryLimit = Math.max(1, Math.min(MAX_LIMIT, limit))

    await connectToDB()

    const shop = await Shop.findOne({
        ownerId: sub
    }).select('_id').lean()

    if (!shop) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const baseQuery: any = {
        shopId: shop._id,
        isDeleted: false
    }

    if (cursor) {
        const id = new mongoose.Types.ObjectId(cursor)
        baseQuery._id = next ? { $gt: id } : { $lt: id }
    }

    let products = await Product.find(baseQuery)
        .sort({ _id: next ? 1 : -1 })
        .limit(queryLimit + 1)
        .select('-createdAt -updatedAT -__v')
        .lean()
    
    if(!products || products.length <= 0) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    const hasMore = products.length > queryLimit

    if (hasMore) {
        next ? products.pop() : products.shift()
    }

    if (!next) {
        products.reverse()
    }

    return {
        ok: true,
        products,
        hasNext: next ? hasMore : true,
        hasPrev: next ? true : hasMore,
        nextCursor: products.at(-1)?._id.toString() ?? null,
        prevCursor: products.at(0)?._id.toString() ?? null
    }
}


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


