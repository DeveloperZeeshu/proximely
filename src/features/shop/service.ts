import { connectToDB } from "@/db/dbConnector"
import Shop from "@/models/shop.model"
import { ShopInfoType } from "@/types/shop.types"
import { CreateShopInput } from "@/validations/shop/create.schema"
import { UpdateShopInput } from "@/validations/shop/update.schema"


// Create shop service 
export type CreateShopErrorType = 'NOT_FOUND' | 'UNAUTHORIZED' | 'USER_EXISTS'

export type CreateShopResult =
    | { ok: false; code: CreateShopErrorType }
    | { ok: true; createdShop: ShopInfoType }

export const createShopService = async ({
    sub,
    data
}: {
    sub: string
    data: CreateShopInput
}): Promise<CreateShopResult> => {
    if (!sub) {
        return { ok: false, code: 'UNAUTHORIZED' }
    }

    await connectToDB()

    // Ensure user does not already own a shop
    const existingShop = await Shop.findOne({ ownerId: sub }).lean()
    if (existingShop) {
        return { ok: false, code: 'USER_EXISTS' }
    }

    const createdShop = await Shop.create({
        ownerId: sub,
        ...data,
        onboardingStep: 'BASIC_INFO',
        isProfileComplete: false,
        isActive: true,
        isDeleted: false
    })

    const cleanedShop = createdShop.toObject({
        versionKey: false
    })

    delete cleanedShop.createdAt
    delete cleanedShop.updatedAt

    return {
        ok: true,
        createdShop: cleanedShop
    }
}


// Fetch shop info service
type ShopResult =
    | { ok: false, code: CreateShopErrorType }
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

    // Fetch shop first (needed for onboarding logic)
    const shop = await Shop.findOne({ _id: shopId, ownerId: sub })
    if (!shop) {
        return { ok: false, code: 'NOT_FOUND' }
    }

    const { latitude, longitude, ...updateDoc } = updates as any

    /* ---------------- Location handling ---------------- */

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

    /* ---------------- Apply updates ---------------- */

    Object.assign(shop, updateDoc)

    /* ---------------- Onboarding completion logic ---------------- */

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

    /* ---------------- Save ---------------- */

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

