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
    dir: 'next' | 'prev' | null
    limit: number
}

export const productDiscovery = async ({
    query,
    cursor,
    dir,
    limit
}: PayloadType) => {
    const res = await apiClient.post('/products/search', {
        query,
        cursor,
        dir,
        limit
    })
    return res.data
}
