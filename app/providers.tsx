'use client'

import AuthInitializer from "@/src/components/AuthInitializer"
import AppProvider from "@/src/context/AppContext"
import  store  from "@/src/store/store"
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
