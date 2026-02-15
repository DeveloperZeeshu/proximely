import { connectToDB } from "@/db/dbConnector"
import Shop from "@/models/shop.model"
import { ShopInfoType } from "@/types/shop.types"

// Fetch shop info service
export type ShopErrorType = 'NOT_FOUND' | 'UNAUTHORIZED' | 'USER_EXISTS'

type ShopResult =
    | { ok: false, code: ShopErrorType }
    | { ok: true, shop: ShopInfoType }

export const shopService = async ({
    sub
}: {
    sub: string
}): Promise<ShopResult> => {
    if (!sub) {
        return {
            ok: false,
            code: 'UNAUTHORIZED'
        }
    }

    await connectToDB()

    const shop = await Shop.findOne(
        { ownerId: sub },
    )
        .select('-createdAt -updatedAt -__v -ownerId')
        .lean()

    if (!shop) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    return {
        ok: true,
        shop
    }
}