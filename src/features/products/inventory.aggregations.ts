import { InventorySortType } from "@/store/inventory/inventorySlice"
import { PipelineStage, Types } from "mongoose"

const SortMap = {
    'price_asc': 1,
    'price_desc': -1,
    'newest': -1,
    'oldest': 1,
    'name_asc': 1,
    'name_desc': -1
} as const

export const SortKey = {
    'price_asc': 'price',
    'price_desc': 'price',
    'newest': 'createdAt',
    'oldest': 'createdAt',
    'name_asc': 'name',
    'name_desc': 'name'
} as const

export type CursorObjType =
    | { id: string, price: number }
    | { id: string, createdAt: Date }
    | { id: string, name: string }


type CursorValueType = number | Date | string


const buildCursorExpr = (
    key: string,
    value: CursorValueType,
    id: string,
    order: 1 | -1
) => {
    const op = order === 1 ? '$gt' : '$lt'
    const objectId = new Types.ObjectId(id)

    return {
        $or: [
            { [key]: { [op]: value } },
            {
                $and: [
                    { [key]: value },
                    { _id: { [op]: objectId } }
                ]
            }
        ]
    }
}

export const buildInventoryPipeline = ({
    shopId,
    search,
    sort,
    cursor,
    limit
}: {
    shopId: string
    search: string
    sort: InventorySortType
    cursor: CursorObjType | null
    limit: number
}) => {
    const key = SortKey[sort]
    const order = SortMap[sort]

    const baseQuery: any = {
        shopId: new Types.ObjectId(shopId),
        isDeleted: false
    }

    if (search && search.trim() !== '') {
        baseQuery.name = {
            $regex: search,
            $options: 'i'
        }
    }

    if (cursor) {

        let cursorValue: CursorValueType

        if ("price" in cursor) {
            cursorValue = cursor.price
        }
        else if ("createdAt" in cursor) {
            cursorValue = new Date(cursor.createdAt)
        }
        else {
            cursorValue = cursor.name
        }

        Object.assign(
            baseQuery,
            buildCursorExpr(key, cursorValue, cursor.id, order)
        )
    }

    const sortStage: PipelineStage.Sort["$sort"] = {
        [key]: order,
        _id: order
    }

    const pipeline: PipelineStage[] = [
        { $match: baseQuery },
        { $sort: sortStage },
        { $limit: limit + 1 },
        {
            $project: {
                __v: 0
            }
        },
    ]

    return pipeline
}