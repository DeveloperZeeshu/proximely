'use client'

import ProductsSkeleton from "@/src/features/products/components/ProductsSkeleton";
import ProductListCard from "@/src/features/products/components/ProductListCard";
import Container from "@/src/components/container/Container";
import { useAppDispatch } from "@/src/hooks/redux-hooks";
import { ShopProductCard } from "@/src/features/products/components/ShopProductCard";
import { fetchAllProducts } from "@/src/store/products/productsThunks";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Pagination, PaginationEllipsis, PaginationNext, PaginationPageNumber, PaginationPrevious } from "@/src/components/ui/pagination";
import { ProductsHeader } from "@/src/features/products/components/ProductsHeader";
import { useEffect } from "react";
import { Menu } from "lucide-react";
import { useAppContext } from "@/src/context/AppContext";
import { useAuth } from "@/src/store/auth/useAuth";
import { useProducts } from "@/src/store/products/useProducts";
import { AccountGate } from "../../AccountGate";

export default function ManageProducts() {

    const dispatch = useAppDispatch()
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { openProductForm } = useAppContext()

    const {
        products,
        hasNext,
        hasPrev,
        nextCursor,
        prevCursor,
        productsLoading
    } = useProducts()

    const { hasShop, authLoading } = useAuth()

    // Query params
    const page = Number(searchParams.get('page') ?? 1)
    const cursor = searchParams.get('cursor')
    const limit = Number(searchParams.get('limit') ?? 10)
    const dirParam = searchParams.get('dir')

    const dir: 'next' | 'prev' =
        dirParam === 'prev' ? 'prev' : 'next'


    useEffect(() => {
        if (!authLoading && hasShop) {
            dispatch(fetchAllProducts({
                cursor,
                limit,
                dir: dir ?? 'next'
            }))
        }
    }, [cursor, dir, limit, hasShop, dispatch])


    // Pagination logic
    const handlePrevious = () => {
        if (!hasPrev || !prevCursor) return

        router.replace(
            `${pathname}?page=${page - 1}&cursor=${prevCursor}&limit=${limit}&dir=prev`
        )
    }

    const handleNext = () => {
        if (!hasNext || !nextCursor) return

        router.replace(
            `${pathname}?page=${page + 1}&cursor=${nextCursor}&limit=${limit}&dir=next`
        )
    }

    if (hasShop && productsLoading)
        return (
            <Container>
                <ProductsSkeleton />
            </Container>
        )

    if (hasShop && !productsLoading && products.length === 0) {
        return (
            <Container>
                {/* Header Section */}
                <div className="mb-12 text-center">
                    <h1 className="text-2xl font-semibold text-slate-900">
                        Manage Your Products
                    </h1>
                    <p className="text-sm text-slate-500 mt-2 max-w-xl mx-auto">
                        You haven’t added any products yet. Start adding products to manage your inventory, update stock, and grow your store.
                    </p>
                </div>

                {/* Empty State Card */}
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 rounded-xl p-12 bg-slate-50 space-y-4">
                    {/* Icon / Illustration */}
                    <Menu className="text-gray-400" size={40} />

                    {/* Message */}
                    <h2 className="text-xl font-semibold text-slate-800">
                        No Products Found
                    </h2>
                    <p className="text-sm text-slate-500 text-center max-w-xs">
                        It looks like you haven’t added any products yet. You can add products to start managing your store.
                    </p>

                    {/* Call-to-action Button */}
                    <button
                        onClick={openProductForm}
                        className="mt-4 px-5 py-2 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-md shadow-sm transition text-sm">
                        Add New Product
                    </button>
                </div>
            </Container>
        )
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

                    <ProductsHeader />

                    {/* RESPONSIVE PRODUCT LIST */}
                    <div className="flex flex-col gap-2">
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
                                    {products.map((product) => (
                                        <ProductListCard
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Mobile cards */}
                        <div className="md:hidden space-y-3">
                            {products.map((p) => (
                                <ShopProductCard
                                    key={p._id}
                                    product={p}
                                />
                            ))}
                        </div>
                    </div>
                </div>
                <Pagination>
                    <PaginationPrevious
                        onClick={handlePrevious}
                        disabled={!hasPrev || page <= 1}
                    />
                    <PaginationPageNumber page={page} />
                    {hasNext && <PaginationEllipsis />}
                    <PaginationNext
                        onClick={handleNext}
                        disabled={!hasNext}
                    />
                </Pagination>
            </AccountGate>
        </Container>
    );
};
