'use client'

import ProductsSkeleton from "@/features/products/components/ProductsSkeleton";
import ProductListCard from "@/features/products/components/ProductListCard";
import Container from "@/components/container/Container";
import { ShopProductCard } from "@/features/products/components/ShopProductCard";
import { InventoryForm } from "@/features/products/components/InventoryForm";
import { PackageOpen } from "lucide-react";
import { useAuth } from "@/store/auth/useAuth";
import { useInventory } from "@/store/inventory/useInventory";
import { AccountGate } from "../../AccountGate";
import { cn } from "lib/utils";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { fetchShopProducts } from "@/store/inventory/inventoryThunks";
import { InventorySortType, setFilters } from "@/store/inventory/inventorySlice";

export default function ManageProducts() {

    const pathname = usePathname()
    const dispatch = useAppDispatch()
    const searchParams = useSearchParams()

    const {
        items,
        hasMore,
        inventoryLoading,
        nextCursor
    } = useInventory()

    const { hasShop, authLoading } = useAuth()

    useEffect(() => {
        if (authLoading || !hasShop) return

        const search = searchParams.get('search')
        const rawSort = searchParams.get('sort')

        const sort: InventorySortType =
            rawSort === 'name_asc' ||
                rawSort === 'name_desc' ||
                rawSort === 'newest' ||
                rawSort === 'oldest' ||
                rawSort === 'price_asc' ||
                rawSort === 'price_desc'
                ? rawSort
                : 'newest'

        dispatch(setFilters({
            search: search ? search : '',
            sort
        }))

        dispatch(fetchShopProducts())

    }, [pathname, searchParams, hasShop])

    const handleLoadMore = () => {
        if (!hasShop || authLoading || !nextCursor) return

        dispatch(fetchShopProducts())
    }

    return (
        <Container>
            <AccountGate>
                <div className="min-h-screen">
                    {/* HEADER */}
                    <div className="mb-10">
                        <h1 className="text-2xl font-bold text-slate-800">Manage Products</h1>
                        <p className="text-sm text-slate-500 mt-1">
                            View, edit, restock, or deactivate your products.
                        </p>
                    </div>

                    <InventoryForm />

                    {/* RESPONSIVE PRODUCT LIST */}
                    {(hasShop && inventoryLoading && items.length === 0) &&
                        <ProductsSkeleton />
                    }

                    {/* Products found */}
                    {(hasShop && items.length > 0) &&
                        (<div className="flex flex-col gap-2">
                            <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 bg-white shadow-sm">
                                <table className="w-full text-sm">
                                    <thead className="bg-gray-50 border-b border-gray-200">
                                        <tr className="text-left text-xs font-medium text-gray-500 uppercase">
                                            <th className="px-4 py-3">Image</th>
                                            <th className="px-4 py-3">Name</th>
                                            <th className="px-4 py-3">Price</th>
                                            <th className="px-4 py-3">Stock</th>
                                            <th className="px-4 py-3">Status</th>
                                            <th className="px-4 py-3 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map((item) => (
                                            <ProductListCard
                                                key={item._id}
                                                product={item}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile cards */}
                            <div className="md:hidden space-y-3">
                                {items.map((p) => (
                                    <ShopProductCard
                                        key={p._id}
                                        product={p}
                                    />
                                ))}
                            </div>

                            <div className="mx-auto">
                                {inventoryLoading && items.length > 0 ? (
                                    <div className="mt-4 flex justify-center">
                                        <div className="h-5 w-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                                    </div>
                                ) : (
                                    <button
                                        disabled={!hasMore}
                                        onClick={handleLoadMore}
                                        className={cn(
                                            "mt-4 text-sm border border-gray-300 rounded-lg py-1.5 px-4",
                                            hasMore
                                                ? "bg-white hover:bg-gray-50 cursor-pointer"
                                                : "bg-gray-100 cursor-not-allowed opacity-50"
                                        )}
                                    >
                                        Load More
                                    </button>
                                )}
                            </div>
                        </div>
                        )}

                    {/* No product found */}
                    {(hasShop && !inventoryLoading && items.length === 0) &&
                        <div className="flex flex-col items-center justify-center rounded-xl border border-slate-200 bg-linear-to-b bg-white px-10 py-16 text-center shadow-sm">

                            {/* Icon */}
                            <div className="flex items-center justify-center w-20 h-20 rounded-full bg-slate-100 border border-slate-200 shadow-inner mb-5">
                                <PackageOpen className="text-slate-400" size={38} />
                            </div>

                            {/* Heading */}
                            <h2 className="text-xl font-semibold text-slate-800 mb-2">
                                No products found
                            </h2>

                            {/* Description */}
                            <p className="text-sm text-slate-500 max-w-sm leading-relaxed mb-6">
                                We couldn’t find any products here. Try adjusting your search, or add a new product to start building your inventory.
                            </p>
                        </div>}
                </div>
            </AccountGate>
        </Container>
    );
};
