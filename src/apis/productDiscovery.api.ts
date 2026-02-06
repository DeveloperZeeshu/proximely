import { LatLng } from "../types/search.types"
import apiClient from "./utils/apiClient"

// Search Product api
type PayloadType = {
    query: {
        search: string
        category?: string
        location: LatLng
        radius: number
    }
    sort: string
    cursor?: string | null
    dir?: 'next' | 'prev'
    limit?: number
}

export const productDiscovery = async ({
    query,
    cursor,
    dir,
    sort,
    limit
}: PayloadType) => {
    const res = await apiClient.post('/products/search', { query, cursor, dir, limit, sort })
    return res.data
}
