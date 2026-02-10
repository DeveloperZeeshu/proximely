import { ShopCategory } from "@/lib/constants"

export interface UserProfile {
    ownerName: string
    email: string
}

export interface ShopLocation {
    type: 'Point'
    coordinates: [number, number]
}

export interface ShopInfoType {
    _id: string
    ownerId: string
    shopName: string
    ownerName: string
    phone: string
    category: ShopCategory
    address: string
    city: string
    state: string
    zipcode: string
    location: ShopLocation
    imageUrl: string
    isProfileComplete: boolean
    isActive: boolean
}

