'use client'

import React, { useEffect } from "react";
import PublicHeader from "../../src/components/layout/PublicHeader/PublicHeader";
import PublicFooter from "../../src/components/layout/PublicFooter/PublicFooter";
import PublicSidebar from "../../src/components/layout/PublicSidebar/PublicSidebar";
import { useAppContext } from "@/src/context/AppContext";

export default function PublicLayout({
    children
}: {
    children: React.ReactNode
}) {
    const { isSidebarOpen, closeSidebar } = useAppContext()

    useEffect(() => {
        if (isSidebarOpen) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }

        return () => document.body.classList.remove('overflow-hidden')
    }, [isSidebarOpen])

    return (
        <div className="min-h-screen flex flex-col">
            <PublicHeader />
            {
                isSidebarOpen && (
                    <div
                        className={`fixed inset-0 bg-black/30 z-50 transition-opacity ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
                        onClick={closeSidebar}
                    />
                )
            }
            <PublicSidebar />
            <main className="flex-1">{children}</main>
            <PublicFooter />
        </div>
    )
}

