import { ProductDiscoveryInput } from "@/validations/productDiscovery/search.schema"
import { PipelineStage, Types } from "mongoose"

const SORT_MAP = {
    distance: 1,
    price_asc: 1,
    price_desc: -1,
} as const

export type SortType = keyof typeof SORT_MAP

export interface CursorObj {
    id: string;
    price: number;
    distance: number;
}

const buildCursorExpr = (cursor: CursorObj, sort: SortType, order: 1 | -1) => {
    const op = order === 1 ? "$gt" : "$lt";
    const cursorId = new Types.ObjectId(cursor.id);

    if (sort === "distance") {
        return {
            $or: [
                { [op]: ["$distance", cursor.distance] },
                {
                    $and: [
                        { $eq: ["$distance", cursor.distance] },
                        { [op]: ["$product._id", cursorId] },
                    ],
                },
            ],
        };
    }

    return {
        $or: [
            { [op]: ["$product.price", cursor.price] },
            {
                $and: [
                    { $eq: ["$product.price", cursor.price] },
                    { $gt: ["$distance", cursor.distance] },
                ],
            },
            {
                $and: [
                    { $eq: ["$product.price", cursor.price] },
                    { $eq: ["$distance", cursor.distance] },
                    { [op]: ["$product._id", cursorId] },
                ],
            },
        ],
    };
};

export function buildProductDiscoveryPipeline({
    query,
    cursor,
    limit
}: {
    query: ProductDiscoveryInput["query"],
    cursor: CursorObj | null,
    limit: number
}): PipelineStage[] {
    const { search, category, sort, radius, location } = query;
    const order = SORT_MAP[sort];

    const productMatch: any = {
        $expr: { $eq: ["$shopId", "$$shopId"] },
        isDeleted: false,
        isAvailable: true,
    };

    if (search) productMatch.name = { $regex: search, $options: "i" };
    if (category && category !== "All Categories") productMatch.category = category;

    const sortConfig: Record<string, 1 | -1> = sort === "distance"
        ? { distance: order, "product._id": order }
        : { "product.price": order, distance: 1, "product._id": order };

    const pipeline: PipelineStage[] = [
        {
            $geoNear: {
                near: { type: "Point", coordinates: [location.longitude, location.latitude] },
                distanceField: "distance",
                maxDistance: Math.min(radius ?? 10000, 50000),
                spherical: true,
            },
        },
        {
            $lookup: {
                from: "products",
                let: { shopId: "$_id" },
                pipeline: [
                    { $match: productMatch },
                    { $project: { name: 1, price: 1, imageUrl: 1 } },
                ],
                as: "product",
            },
        },
        { $unwind: "$product" }
    ];

    if (cursor) {
        pipeline.push({ $match: { $expr: buildCursorExpr(cursor, sort, order) } });
    }

    pipeline.push(
        { $addFields: { distanceKm: { $round: [{ $divide: ["$distance", 1000] }, 2] } } },
        {
            $project: {
                _id: 0,
                product: 1,
                distance: 1,
                distanceKm: 1,
                shop: {
                    name: "$shopName",
                },
            },
        },
        { $sort: sortConfig as any },
        { $limit: limit + 1 }
    );

    return pipeline;
}