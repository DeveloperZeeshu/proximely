import { connectToDB } from "@/db/dbConnector"
import Shop from "@/models/shop.model"
import { ShopInfoType } from "@/types/shop.types"
import { UpdateShopInput } from "@/validations/shop/update.schema"

// Update hop service
export type UpdateShopErrorType = 'NOT_FOUND' | 'UNAUTHORIZED' | 'INVALID_LOCATION'

type UpdateShopResult =
    | { ok: false, code: UpdateShopErrorType }
    | { ok: true, updatedShop: ShopInfoType }

export const updateShopService = async ({
    sub,
    shopId,
    updates
}: {
    sub: string
    shopId: string
    updates: UpdateShopInput
}): Promise<UpdateShopResult> => {
    if (!sub) {
        return { ok: false, code: 'UNAUTHORIZED' }
    }

    await connectToDB()

    const shop = await Shop.findOne({ _id: shopId, ownerId: sub })
    if (!shop) {
        return { ok: false, code: 'NOT_FOUND' }
    }

    const { latitude, longitude, ...updateDoc } = updates as any


    if (
        latitude !== undefined ||
        longitude !== undefined
    ) {
        if (
            typeof latitude !== 'number' ||
            typeof longitude !== 'number'
        ) {
            return { ok: false, code: 'INVALID_LOCATION' }
        }

        updateDoc.location = {
            type: 'Point',
            coordinates: [longitude, latitude]
        }
    }


    Object.assign(shop, updateDoc)

    const isBasicInfoComplete =
        !!shop.shopName &&
        !!shop.ownerName &&
        !!shop.phone &&
        !!shop.category

    const isAddressComplete =
        !!shop.address &&
        !!shop.city &&
        !!shop.state &&
        !!shop.zipcode

    const isLocationComplete =
        !!shop.location?.coordinates &&
        shop.location.coordinates.length === 2

    const isAppearanceComplete =
        !!shop.profileImageUrl

    if (
        isBasicInfoComplete &&
        isAddressComplete &&
        isLocationComplete
        // isAppearanceComplete
    ) {
        shop.isProfileComplete = true
        shop.onboardingStep = 'DONE'
    } else {
       
        if (!isBasicInfoComplete) shop.onboardingStep = 'BASIC_INFO'
        else if (!isAddressComplete) shop.onboardingStep = 'ADDRESS'
        else if (!isLocationComplete) shop.onboardingStep = 'LOCATION'
        else if (!isAppearanceComplete) shop.onboardingStep = 'APPEARANCE'
    }

    await shop.save()

    const cleanedShop = shop.toObject({
        versionKey: false
    })

    delete cleanedShop.createdAt
    delete cleanedShop.updatedAt

    return {
        ok: true,
        updatedShop: cleanedShop
    }
}