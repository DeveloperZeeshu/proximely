'use client'

import Container from "@/components/container/Container";
import { useAppContext } from "@/context/AppContext";
import { ProductForm } from "@/features/products/components/ProductForm";
import DashboardSkeleton from "@/features/shop/components/DashboardSkeleton";
import ShopFooter from "@/features/shop/components/layout/ShopFooter/ShopFooter";
import ShopHeader from "@/features/shop/components/layout/ShopHeader/ShopHeader";
import ShopSidebar from "@/features/shop/components/layout/ShopSidebar/ShopSidebar";
import { useAppDispatch } from "@/hooks/redux-hooks";
import { useAuth } from "@/store/auth/useAuth";
import { fetchMyShop } from "@/store/shop/shopThunks";
import { useShop } from "@/store/shop/useShop";
import React, { useEffect } from "react";


export default function ShopLayout({
    children
}: {
    children: React.ReactNode
}) {

    const dispatch = useAppDispatch()

    const { hasShop, authLoading } = useAuth()
    const { shop } = useShop()

    const { isProductFormOpen, editingProduct, shopSidebarOpen, closeShopSidebar } = useAppContext()

    useEffect(() => {
        if (shopSidebarOpen || isProductFormOpen) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }

        return () => document.body.classList.remove('overflow-hidden')
    }, [shopSidebarOpen,isProductFormOpen])

    useEffect(() => {
        if (hasShop && !shop) {
            dispatch(fetchMyShop())
        }
    }, [hasShop, shop, dispatch])

    if (authLoading) {
        return (
            <Container>
                <DashboardSkeleton />
            </Container>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            {/* Product form */}
            {
                isProductFormOpen &&
                <div className="fixed inset-0 bg-black/30 z-60" />
            }
            {
                isProductFormOpen &&
                <ProductForm
                    mode={editingProduct ? 'Edit' : 'Add'}
                    product={editingProduct}
                />
            }

            <ShopHeader />
            {
                shopSidebarOpen && (
                    <div
                        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${shopSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={closeShopSidebar}
                    />
                )
            }

            <ShopSidebar />
            <main className={isProductFormOpen ? 'blur-sm flex-1' : ' flex-1'}>
                {children}
            </main>
            <ShopFooter />
        </div>
    )
}