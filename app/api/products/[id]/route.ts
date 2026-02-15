import { productDetailService } from '@/features/search/services/product_detail.service';
import logger from 'core/logger';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';


type ProductDetailErrorType = 'NOT_FOUND' | 'SHOP_NOT_FOUND';

const PRODUCT_DETAIL_ERROR_MAP: Record<ProductDetailErrorType, {
    status: number,
    message: string
}> = {
    NOT_FOUND: { message: 'Product not found.', status: 404 },
    SHOP_NOT_FOUND: { message: 'The shop for this product no longer exists.', status: 404 }
};

export const GET = async (
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) => {
    try {
        const { id: productId } = await params
        const idSchema = z.string().min(1);
        const parsedId = idSchema.safeParse(productId);

        if (!parsedId.success) {
            return NextResponse.json({
                success: false,
                message: 'Invalid product ID.',
            }, { status: 400 });
        }

        const result = await productDetailService({
            productId: parsedId.data
        });

        // 3. Error Mapping
        if (!result.ok) {
            const err = PRODUCT_DETAIL_ERROR_MAP[result.code as ProductDetailErrorType];

            if (!err) {
                logger.error('Unhandled ProductDetailErrorCode', result.code);
                return NextResponse.json({
                    success: false,
                    message: 'Internal server error.'
                }, { status: 500 });
            }

            return NextResponse.json({
                success: false,
                message: err.message
            }, { status: err.status });
        }

        return NextResponse.json({
            success: true,
            message: 'Product details fetched successfully.',
            product: result.product,
            shop: result.shop
        }, { status: 200 });

    } catch (err: unknown) {
        logger.error('Unhandled product detail fetch error.', err);

        return NextResponse.json({
            success: false,
            message: 'Failed to fetch product details.'
        }, { status: 500 });
    }
}