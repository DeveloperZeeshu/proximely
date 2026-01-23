import { fromLeftVariants } from '@/src/animations/fromLeftVariants'
import Button from '@/src/components/ui/button'
import { ShopLocation } from '@/src/types/shop.types'
import { MapPin, Phone } from 'lucide-react'
import { motion } from 'motion/react'

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
        <>
            <motion.div
                variants={fromLeftVariants}
                initial="hidden"
                animate="show"
                whileHover={{ y: -4 }}
                className="group bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 w-full max-w-xs"
            >
                {/* Image */}
                <div className="relative aspect-4/3 overflow-hidden rounded-t-2xl">
                    <img
                        src={img || `https://placehold.co/400x300?text=${encodeURIComponent(name)}`}
                        alt={name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />

                    <span className="absolute top-3 right-3 rounded-full bg-emerald-500/90 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                        In stock
                    </span>
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                    {/* Category + Distance */}
                    <div className="flex items-center justify-between text-xs">
                        <span className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700">
                            {category}
                        </span>
                        <span className="text-gray-500">{distance} km away</span>
                    </div>

                    {/* Name */}
                    <h3 className="line-clamp-1 text-lg font-semibold text-gray-900">
                        {name}
                    </h3>

                    {/* Description */}
                    <p className="line-clamp-2 text-sm text-gray-600">
                        {description || 'High quality product available nearby'}
                    </p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-xl font-bold text-blue-600">₹{price}</span>
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-gray-100" />

                    {/* Shop Info */}
                    <div className="space-y-1 text-sm">
                        <p className="font-medium text-gray-900">{shopName}</p>
                        <p className="truncate text-gray-500">{address}</p>

                        <p className="flex items-center gap-2 text-gray-600">
                            <Phone size={14} />
                            <span>+91 {phone}</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                        <button
                            className="w-full border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 rounded-lg text-sm"
                        >
                            Message
                        </button>

                        <a
                            href={`https://www.google.com/maps?q=${lat},${lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-1 rounded-lg bg-blue-500 py-2 text-sm text-white transition hover:bg-blue-600 active:scale-95"
                        >
                            <MapPin size={16} />
                            Directions
                        </a>
                    </div>
                </div>
            </motion.div>

        </>
    )
}

