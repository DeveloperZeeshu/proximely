import { connectToDB } from "@/db/dbConnector";
import Product from "@/models/product.model";
import Shop from "@/models/shop.model";

// Product Detail service
export type ProductDetailErrorType = 'NOT_FOUND' | 'SHOP_NOT_FOUND';

type ProductDetailResult =
    | { ok: false; code: ProductDetailErrorType }
    | { ok: true; product: any; shop: any };

export const productDetailService = async ({
    productId,
}: {
    productId: string;
}): Promise<ProductDetailResult> => {

    await connectToDB();

    const product = await Product
        .findById(productId)
        .select('shopId name price description category imageUrl')
        .lean();

    if (!product) {
        return {
            ok: false,
            code: 'NOT_FOUND',
        };
    }

    const { shopId, ...finalProduct } = product

    const shop = await Shop
        .findById(shopId)
        .select('shopName phone address city state location')
        .lean();

    if (!shop) {
        return {
            ok: false,
            code: 'SHOP_NOT_FOUND',
        };
    }

    const { city, state, location, address: street, ...finalShop } = shop

    finalShop.address = `${street}, ${city}, ${state}`
    finalShop.coordinates = location.coordinates

    return {
        ok: true,
        product: finalProduct,
        shop: finalShop,
    };
};