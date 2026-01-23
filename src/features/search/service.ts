import { connectToDB } from "@/src/db/dbConnector"
import Shop from "@/src/models/shop.model"
import { ProductType } from "@/src/types/product.types"
import { SearchProductInput } from "@/src/validations/products/search.schema"
import { PipelineStage } from "mongoose"

// Search product service
export type SearchProductErrorType =
    'NOT_FOUND'

type SearchProductResult =
    | { ok: false, code: SearchProductErrorType }
    | { ok: true, products: ProductType[] }

export const searchProductService = async ({
    data
}: {
    data: SearchProductInput
}): Promise<SearchProductResult> => {

    await connectToDB()

    const { query, coordinates } = data
    const { name, category, radius } = query
    const { latitude, longitude } = coordinates

    // Product aggregation
    const productMatch: PipelineStage.Match['$match'] = {
        $expr: { $eq: ['$shopId', '$$shopId'] },
        name: { $regex: name, $options: 'i' },
        isAvailable: true
    }

    if (category && category !== 'All Categories') {
        productMatch.category = category
    }

    const MAX_DISTANCE = 50000
    const safeDistance = Math.min(radius || 10000, MAX_DISTANCE)

    const pipeline: PipelineStage[] = [
        {
            $geoNear: {
                near: {
                    type: 'Point',
                    coordinates: [longitude, latitude]
                },
                distanceField: 'distance',
                maxDistance: safeDistance,
                spherical: true
            }
        },
        {
            $lookup: {
                from: 'products',
                let: { shopId: '$_id' },
                pipeline: [
                    { $match: productMatch },
                    {
                        $project: {
                            shopId: 0,
                            createdAt: 0,
                            isDeleted: 0,
                            updatedAt: 0,
                            __v: 0
                        }
                    }
                ],
                as: 'product'
            }
        },
        {
            $unwind: '$product'
        },
        {
            $addFields: {
                distanceKm: {
                    $round: [{ $divide: ['$distance', 1000] }, 2]
                }
            }
        },
        {
            $project: {
                _id: 0,
                product: 1,
                distanceKm: 1,
                shop: {
                    name: '$shopName',
                    phone: '$phone',
                    address: '$address',
                    city: '$city',
                    state: '$state',
                    zipcode: '$zipcode',
                    location: '$location',
                    imageUrl: '$imageUrl',
                    isActive: '$isActive'
                }
            }
        },
        { $sort: { distanceKm: 1, 'product.price': 1 } },
        { $limit: 20 }
    ]

    const products = await Shop.aggregate(pipeline)

    if (products.length === 0) {
        return {
            ok: false,
            code: 'NOT_FOUND'
        }
    }

    return {
        ok: true,
        products
    }
}

