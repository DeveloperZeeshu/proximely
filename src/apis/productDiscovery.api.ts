import { SortType } from "@/store/productDiscovery/productDiscoverySlice"
import { LatLng } from "../types/search.types"
import apiClient from "./utils/apiClient"

// Search Product api
type PayloadType = {
    query: {
        search: string
        category?: string
        location: LatLng
        radius: number
        sort: SortType
    }
    cursor: string | null
    limit: number
}

export const productDiscovery = async ({
    query,
    cursor,
    limit
}: PayloadType) => {
    const res = await apiClient.post('/products', {
        query,
        cursor,
        limit
    })
    return res.data
}

// Product Detail api
export const productInDetail = async (
    productId: string
) => {
    const res = await apiClient.get(`/products/${productId}`)
    return res.data
}