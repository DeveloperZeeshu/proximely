import { useAppContext } from "@/context/AppContext"
import { ProductType } from "@/types/product.types"
import { Pencil, Trash } from "lucide-react"
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct"
import Image from "next/image"
import { useState } from "react"
import ConfirmDialog from "@/components/ConfirmDialog"

interface ProductListPropType {
    product: ProductType
}

const ProductListCard = ({ product }: ProductListPropType) => {
    const [open, setOpen] = useState<boolean>(false)

    const { openEditProductForm } = useAppContext()

    const { mutate, loading } = useDeleteProduct()

    return (
        <tr className="border-b last:border-b-0 border-gray-200 hover:bg-gray-50 transition"
        >
            {/* Image */}
            <td className="px-4 py-2">
                <div className="relative h-12 w-12">
                    <Image
                        src={product.imageUrl || "/images/product-placeholder.jpg"}
                        alt={product.name}
                        fill
                        sizes="48px"
                        className="rounded object-cover"
                    />
                </div>
            </td>

            {/* Name & Description */}
            <td className="px-4 py-2">
                <div className="flex flex-col">
                    <span className="font-medium text-gray-900">
                        {product.name}
                    </span>
                    <span className="text-xs text-gray-500 line-clamp-1">
                        {product.description}
                    </span>
                </div>
            </td>

            {/* Price */}
            <td className="px-4 py-2 font-medium text-gray-800">
                ₹{product.price.toLocaleString()}
            </td>

            {/* Stock */}
            <td className="px-4 py-2 text-gray-700">
                {product.isAvailable ? 12 : 0}
            </td>

            {/* Status */}
            <td className="px-4 py-2">
                <span
                    className={` items-center rounded-full px-2 py-1 text-xs font-medium ${product.isAvailable
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                        }`}
                >
                    {product.isAvailable ? 'In Stock' : 'Out of Stock'}
                </span>
            </td>

            {/* Actions */}
            <td className="px-4 py-2 text-right">
                <div className="inline-flex gap-2">
                    <button
                        onClick={() => openEditProductForm(product)}
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300
                       text-blue-600 hover:bg-blue-50 transition"
                    >
                        <Pencil size={16} />
                    </button>

                    <button
                        onClick={() => setOpen(true)}
                        className="h-8 w-8 flex items-center justify-center rounded-md border border-gray-300
                       text-red-600 hover:bg-red-50 transition"
                    >
                        <Trash size={16} />
                    </button>

                    <ConfirmDialog
                        open={open}
                        title="Delete item?"
                        description="You can't undo this action."
                        onConfirm={() => mutate(product._id)}
                        onCancel={() => setOpen(false)}
                    />
                </div>
            </td>
        </tr>
    )
}

export default ProductListCard
