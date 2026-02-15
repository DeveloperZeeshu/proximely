import { fromLeftVariants } from '@/animations/fromLeftVariants'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'

interface ProductType {
    _id: string
    name: string
    imageUrl: string
    price: number
}

interface ShopType {
    name: string
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
    shopInfo: any
    distance: number
}) => {
    const { _id: productId, name, imageUrl, price } = productInfo;
    const { name: shopName } = shopInfo;

    return (
        <Link
            href={`/products/${productId}`}
            className="block w-full group"
        >
            <motion.article
                variants={fromLeftVariants}
                initial="hidden"
                animate="show"
                whileHover={{ y: -2 }}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-sm transition"
            >
                {/* IMAGE SECTION - Set to h-32 as per your request */}
                <div className="relative h-32 w-full bg-slate-100">
                    <Image
                        src={imageUrl || "/images/product-placeholder.jpg"}
                        alt={name}
                        fill
                        sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                </div>

                {/* CONTENT SECTION */}
                <div className="p-3">
                    {/* Name - Truncated */}
                    <p className="text-sm font-semibold text-slate-900 truncate">
                        {name}
                    </p>

                    {/* Price & Distance Row */}
                    <div className="flex justify-between items-center text-sm mt-1">
                        <span className="text-blue-600 font-bold">
                            ₹{price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium">
                            {distance} km
                        </span>
                    </div>

                    {/* Shop Name - Truncated with separator */}
                    <p className="text-[11px] text-slate-500 mt-1.5 truncate border-t border-slate-50 pt-1.5">
                        {shopName}
                    </p>
                </div>
            </motion.article>
        </Link>
    );
}

