import { fromLeftVariants } from '@/animations/fromLeftVariants'
import { ShopLocation } from '@/types/shop.types'
import { MapPin, Phone } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'

interface ProductType {
    _id: string
    name: string
    slug: string
    category: string
    currency: string
    imageUrl: string
    description: string
    isAvailable: boolean
    price: number
}

interface ShopType {
    name: string
    city: string
    state: string
    address: string
    phone: string
    location: ShopLocation
    zipcode: string
    imageUrl: string
    isActive: boolean
}

export interface SearchedProductType {
    product: ProductType
    shop: ShopType
    distanceKm: number
}

export const ProductCard = ({
    productInfo,
    shopInfo,
    distance
}: {
    productInfo: ProductType
    shopInfo: ShopType
    distance: number
}) => {
    const {
        name: shopName,
        address,
        phone,
        location
    } = shopInfo

    const lat = location?.coordinates[1]
    const lng = location?.coordinates[0]

    const {
        name,
        imageUrl: img,
        description,
        price,
        category
    } = productInfo

    return (
        <motion.div
            variants={fromLeftVariants}
            initial="hidden"
            animate="show"
            whileHover={{ y: -2 }}
            className="group w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
        >
            {/* Image */}
            <div className="relative aspect-4/3 overflow-hidden rounded-t-xl bg-gray-100">
                <Image
                    src={img || "/images/product-placeholder.jpg"}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    height={500}
                    width={500}
                    priority
                />

                <span className="absolute top-2 right-2 rounded-full bg-emerald-500/90 px-2.5 py-0.5 text-[11px] font-medium text-white">
                    In stock
                </span>
            </div>

            {/* Content */}
            <div className="p-3 space-y-1.5">
                {/* Category + Distance */}
                <div className="flex items-center justify-between text-[11px]">
                    <span className="rounded-full bg-blue-50 px-2 py-0.5 font-medium text-blue-700">
                        {category}
                    </span>
                    <span className="text-gray-500">{distance} km</span>
                </div>

                {/* Name */}
                <h3 className="line-clamp-1 text-sm font-semibold text-gray-900">
                    {name}
                </h3>

                {/* Description */}
                <p className="line-clamp-2 text-xs text-gray-600">
                    {description || "Quality product available nearby"}
                </p>

                {/* Price */}
                <div className="flex items-center justify-between pt-1">
                    <span className="text-lg font-bold text-blue-600">₹{price}</span>
                </div>

                {/* Divider */}
                <div className="h-px bg-gray-100" />

                {/* Shop */}
                <div className="text-xs text-gray-600">
                    <p className="font-medium text-gray-900 line-clamp-1 flex justify-between">
                        <span>{shopName}</span>
                        <span>+91 {phone}</span>
                        </p>
                    <p className="truncate">{address}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                    <button className="w-full rounded-md border border-gray-300 bg-white py-1.5 text-xs text-gray-800 hover:bg-gray-100">
                        Message
                    </button>

                    <a
                        href={`https://www.google.com/maps?q=${lat},${lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex w-full items-center justify-center gap-1 rounded-md bg-blue-500 py-1.5 text-xs text-white transition hover:bg-blue-600"
                    >
                        <MapPin size={14} />
                        Directions
                    </a>
                </div>
            </div>
        </motion.div>
    )
}

