import { CreateShopInput } from "../features/shop/schemas/create.schema"
import { UpdateShopInput } from "../features/shop/schemas/update.schema"
import apiClient from "./utils/apiClient"

export const fetchShopDetails = async (

) => {
    const res = await apiClient.get('/shop')
    return res.data
}


export const createShop = async (
    payload: CreateShopInput
) => {
    const res = await apiClient.post('/shop', payload)
    return res.data
}


export const updateShop = async ({
    payload,
    shopId
}: {
    payload: UpdateShopInput
    shopId: string
}) => {
    const res = await apiClient.patch(`/shop/${shopId}`,payload)
    return res.data
}

