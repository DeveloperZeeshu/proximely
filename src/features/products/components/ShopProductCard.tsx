import ConfirmDialog from "@/components/ConfirmDialog";
import { useAppContext } from "@/context/AppContext";
import { useDeleteProduct } from "@/hooks/products/useDeleteProduct";
import { ProductType } from "@/types/product.types";
import { Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export function ShopProductCard({ product }: { product: ProductType }) {
    const [open, setOpen] = useState<boolean>(false)

    const { mutate, loading } = useDeleteProduct()

    const { openEditProductForm } = useAppContext()

    return (
        <div className="bg-white flex items-center gap-3 border-b border-gray-200 px-3 py-2 rounded-lg">
            {/* Image */}
            <div className="relative h-12 w-12">
                <Image
                    src={product.imageUrl || "/images/product-placeholder.jpg"}
                    alt={product.name}
                    fill
                    sizes="48px"
                    className="rounded object-cover"
                />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                    {product.name}
                </p>

                {/* Description */}
                <p className="truncate text-xs text-gray-500">
                    {product.description}
                </p>

                {/* Meta */}
                <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                    <span>₹{product.price.toLocaleString()}</span>
                    <span>•</span>
                    <span
                        className={
                            product.isAvailable
                                ? "text-green-600"
                                : "text-red-600"
                        }
                    >
                        {product.isAvailable ? "In Stock" : "Out"}
                    </span>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-1">
                <button
                    onClick={() => openEditProductForm(product)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-blue-600 hover:bg-blue-50"
                >
                    <Pencil size={14} />
                </button>

                <button
                    onClick={() => setOpen(true)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-red-600 hover:bg-red-50"
                >
                    <Trash size={14} />
                </button>

                <ConfirmDialog
                    open={open}
                    title="Delete Item?"
                    description="You can't undo this action."
                    onConfirm={() => mutate(product._id)}
                    onCancel={() => setOpen(false)}
                    />
            </div>
        </div>
    )
}
