import { ProductDiscoveryInput } from "@/src/validations/productDiscovery/search.schema"
import { PipelineStage } from "mongoose"

const SORT_MAP = {
    'distance': 1,
    'price_asc': 1,
    'price_desc': -1
} as const

type SortDir = 1 | -1

type ProductSort = {
    'product._id'?: SortDir
    'product.price'?: SortDir
    distance?: SortDir
}

interface AggregationRow {
    product: {
        price: number
        _id: any // mongoose.Types.ObjectId
        [key: string]: any
    }
    distance: number
    distanceKm?: number
    shop?: any
}

export const fromRow = (row: AggregationRow) => ({
    price: row.product.price,
    distance: row.distance,
    id: row.product._id.toString(),
})

export type CursorObj = ReturnType<typeof fromRow>

export const buildCursorExpr = (
    cursor: CursorObj,
    dir: 'next' | 'prev',
    sort: 'distance' | 'price_asc' | 'price_desc'
) => {
    const cmp = dir === 'next' ? '$gt' : '$lt'

    if (sort === 'distance') {
        return {
            $or: [
                { [cmp]: ['$distance', cursor.distance] },
                {
                    $and: [
                        { $eq: ['$distance', cursor.distance] },
                        { [cmp]: [{ $toString: '$product._id' }, cursor.id] }
                    ]
                }
            ]
        }
    }

    return {
        $or: [
            { [cmp]: ['$product.price', cursor.price] },
            {
                $and: [
                    { $eq: ['$product.price', cursor.price] },
                    { [cmp]: ['$distance', cursor.distance] }
                ]
            },
            {
                $and: [
                    { $eq: ['$product.price', cursor.price] },
                    { $eq: ['$distance', cursor.distance] },
                    { [cmp]: [{ $toString: '$product._id' }, cursor.id] }
                ]
            }
        ]
    }
}

export function buildProductDiscoveryPipeline(
    query: ProductDiscoveryInput['query'],
    sort: 'distance' | 'price_asc' | 'price_desc',
    cursor: CursorObj | null,
    dir: 'next' | 'prev',
    limit: number
): PipelineStage[] {
    const { search, category, radius, location } = query
    const { latitude, longitude } = location

    const productMatch: PipelineStage.Match['$match'] = {
        $expr: { $eq: ['$shopId', '$$shopId'] },
        name: { $regex: search, $options: 'i' },
        isAvailable: true,
    }

    if (category && category !== 'All Categories') {
        productMatch.category = category
    }

    const MAX_DISTANCE = 50000
    const safeDistance = Math.min(radius ?? 10000, MAX_DISTANCE)

    // Sort direction: forward = ascending, backward = descending
    const sortDir: SortDir = dir === 'next' ? 1 : -1

    let buildSort: ProductSort = {}

    if (sort === 'distance') {
        buildSort.distance = sortDir
    } else {
        buildSort['product.price'] = SORT_MAP[sort]
    }
    buildSort['product._id'] = sortDir

    const pipeline: PipelineStage[] = [
        {
            $geoNear: {
                near: { type: 'Point', coordinates: [longitude, latitude] },
                distanceField: 'distance',
                maxDistance: safeDistance,
                spherical: true,
            },
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
                            updatedAt: 0,
                            isDeleted: 0,
                            __v: 0,
                        },
                    },
                ],
                as: 'product',
            },
        },
        { $unwind: '$product' },
    ]

    // Apply cursor filter (must come after $unwind)
    if (cursor) {
        pipeline.push({
            $match: {
                $expr: buildCursorExpr(cursor, dir, sort),
            },
        })
    }

    pipeline.push(
        {
            $addFields: {
                distanceKm: { $round: [{ $divide: ['$distance', 1000] }, 2] },
            },
        },
        {
            $project: {
                _id: 0,
                product: 1,
                distance: 1,
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
                    isActive: '$isActive',
                },
            },
        },
        {
            $sort: buildSort
        },
        { $limit: limit + 1 }
    )

    return pipeline
}