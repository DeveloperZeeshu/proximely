import { useAppContext } from "@/src/context/AppContext";
import { useDeleteProduct } from "@/src/hooks/products/useDeleteProduct";
import { ProductType } from "@/src/types/product.types";
import { Pencil, Trash } from "lucide-react";

export function ShopProductCard({ product }: { product: ProductType }) {
    const { mutate, loading } = useDeleteProduct()

    const {openEditProductForm} = useAppContext()

    return (
        <div className="bg-white flex items-center gap-3 border-b border-gray-200 px-3 py-2 rounded-lg">
            {/* Image */}
            <img
                src={`https://placehold.co/80x80?text=${product.name}`}
                alt={product.name}
                className="h-12 w-12 shrink-0 rounded object-cover"
            />

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
                    onClick={() => mutate(product._id)}
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-red-600 hover:bg-red-50"
                >
                    <Trash size={14} />
                </button>
            </div>
        </div>
    )
}
