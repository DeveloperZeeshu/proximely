'use client'

import { createContext, useContext, useState, type ReactNode } from "react";
import type { ProductTabDetails } from "../types/product.types";

interface AppProviderProps {
    children: ReactNode
}

interface AppContextType {
    isProductFormOpen: boolean
    isSidebarOpen: boolean
    shopSidebarOpen: boolean
    editingProduct: ProductTabDetails | null

    openSidebar: () => void
    closeSidebar: () => void
    openShopSidebar: () => void
    closeShopSidebar: () => void
    openProductForm: () => void
    closeProductForm: () => void
    openEditProductForm: (product: ProductTabDetails) => void
}

export const AppContext = createContext<AppContextType | null>(null)

const AppProvider = ({ children }: AppProviderProps) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false)
    const [isProductFormOpen, setIsProductFormOpen] = useState<boolean>(false)
    const [editingProduct, setEditingProduct] = useState<ProductTabDetails | null>(null)
    const [shopSidebarOpen, setShopSidebarOpen] = useState<boolean>(false)

    const openProductForm = () => {
        setIsProductFormOpen(true)
        setEditingProduct(null)
    }

    const closeProductForm = () => {
        setIsProductFormOpen(false)
    }

    const openEditProductForm = (product: ProductTabDetails) => {
        setEditingProduct(product);
        setIsProductFormOpen(true);
    };

    const openSidebar = () => {
        setIsSidebarOpen(true)
    }

    const closeSidebar = () => {
        setIsSidebarOpen(false)
    }

    const openShopSidebar = () => {
        setShopSidebarOpen(true)
    }

    const closeShopSidebar = () => {
        setShopSidebarOpen(false)
    }

    return <AppContext.Provider value={{
        isProductFormOpen,
        openProductForm,
        isSidebarOpen,
        openSidebar,
        closeSidebar,
        openEditProductForm,
        editingProduct,
        closeProductForm,

        shopSidebarOpen,
        openShopSidebar,
        closeShopSidebar
    }}>
        {children}
    </AppContext.Provider>
}

export default AppProvider

export const useAppContext = () => {
    const context = useContext(AppContext)
    if (!context)
        throw new Error('App Context Error.')

    return context
}
