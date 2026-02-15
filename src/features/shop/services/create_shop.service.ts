import { connectToDB } from "@/db/dbConnector";
import Shop from "@/models/shop.model";
import { ShopInfoType } from "@/types/shop.types";
import { CreateShopInput } from "@/validations/shop/create.schema";

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