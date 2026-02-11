import { ProductCategory } from "@/lib/constants"

export interface ProductTabDetails {
    _id: string
    shopId: string
    name: string
    category: ProductCategory
    description: string
    price: string
    imageUrl: string
    isAvailable: boolean
}

export interface ProductType {
    _id: string
    shopId: string
    name: string
    slug: string
    category: ProductCategory
    description: string
    price: string
    currency: string
    imageUrl: string
    isAvailable: boolean
}

