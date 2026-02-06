import { ProductFormInput } from "../features/products/schemas/product.schema"
import { UpdateProductInput } from "../features/products/schemas/update.schema"
import { LatLng } from "../types/search.types"
import apiClient from "./utils/apiClient"

// Fetch all products
export const getProducts = async ({
    cursor,
    limit,
    dir
}: {
    cursor?: string | null
    limit: number
    dir: string
}) => {
    const res = await apiClient.get(`/products?cursor=${cursor}&limit=${limit}&dir=${dir}`)
    return res.data
}


// Add product
export const createProduct = async ({
    payload
}: {
    payload: ProductFormInput
}) => {
    const res = await apiClient.post('/products', payload)
    return res.data
}


// Update product
export const updateProduct = async ({
    productId,
    payload
}: {
    productId: string
    payload: UpdateProductInput
}) => {
    const res = await apiClient.patch(`/products/${productId}`, payload)
    return res.data
}




