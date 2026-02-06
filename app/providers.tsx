'use client'

import AuthInitializer from "@/components/AuthInitializer"
import AppProvider from "@/context/AppContext"
import  store  from "@/store/store"
import React from "react"
import { Provider } from "react-redux"

export default function Providers({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <Provider store={store}>
            <AppProvider>
                <AuthInitializer />
                {children}
            </AppProvider>
        </Provider>
    )
}
