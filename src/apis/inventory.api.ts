import { InventorySortType } from "@/store/inventory/inventorySlice"
import { ProductFormInput } from "../features/products/schemas/product.schema"
import { UpdateProductInput } from "../features/products/schemas/update.schema"
import apiClient from "./utils/apiClient"

// Fetch all products
export const getProducts = async ({
    search,
    sort,
    cursor,
    limit
}: {
    search?: string
    sort?: InventorySortType
    cursor: string | null
    limit: number
}) => {
    const res = await apiClient.get(`/shop/inventory?search=${search}&sort=${sort}&cursor=${cursor}&limit=${limit}`)
    return res.data
}


// Add product
export const createProduct = async ({
    payload
}: {
    payload: ProductFormInput
}) => {
    const res = await apiClient.post('/shop/inventory', payload)
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
    const res = await apiClient.patch(`/shop/inventory/${productId}`, payload)
    return res.data
}



// Product Stat
export const fetchProductStats = async () => {
    const res = await apiClient.get('/shop/inventory/stats')
    return res.data
}
