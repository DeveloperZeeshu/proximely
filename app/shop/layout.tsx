'use client'

import Container from "@/src/components/container/Container";
import { useAppContext } from "@/src/context/AppContext";
import { ProductForm } from "@/src/features/products/components/ProductForm";
import DashboardSkeleton from "@/src/features/shop/components/DashboardSkeleton";
import ShopFooter from "@/src/features/shop/components/layout/ShopFooter/ShopFooter";
import ShopHeader from "@/src/features/shop/components/layout/ShopHeader/ShopHeader";
import ShopSidebar from "@/src/features/shop/components/layout/ShopSidebar/ShopSidebar";
import { useAppDispatch } from "@/src/hooks/redux-hooks";
import { useAuth } from "@/src/store/auth/useAuth";
import { fetchMyShop } from "@/src/store/shop/shopThunks";
import { useShop } from "@/src/store/shop/useShop";
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
    }, [shopSidebarOpen, isProductFormOpen])

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
        <>
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
            <main className={isProductFormOpen ? 'pointer-events-none blur-sm' : ''}>
                {children}
            </main>
            <ShopFooter />
        </>
    )
}


