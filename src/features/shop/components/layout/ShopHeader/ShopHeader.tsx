'use client'

import { useAppContext } from '@/context/AppContext'
import { Menu } from 'lucide-react'
import Link from 'next/link.js'
import { usePathname } from 'next/navigation'
import { HeaderProfile } from './HeaderProfile'
import { HeaderSkeleton } from './HeaderSkeleton'
import { useAuth } from '@/store/auth/useAuth'
import { useShop } from '@/store/shop/useShop'

interface NavItem {
    name: string
    slug: string
    active: boolean
}

export default function ShopHeader() {

    const { isAuth, authLoading, hasShop } = useAuth()
    const { shop } = useShop()
    const {openShopSidebar} = useAppContext()
    const pathname = usePathname()

    const navItems: NavItem[] = [
        {
            name: 'Dashboard',
            slug: '/shop/dashboard',
            active: true
        },
        {
            name: 'Manage Products',
            slug: "/shop/manage-products?cursor=&limit=10&dir=next",
            active: true
        },
        {
            name: 'Shop Profile',
            slug: '/shop/shop-profile',
            active: true
        },
        {
            name: 'Shops',
            slug: '/shops',
            active: true
        },
        {
            name: 'About Us',
            slug: '/about-us',
            active: true
        }
    ]

    if (authLoading) {
        return (
            <HeaderSkeleton />
        )
    }

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
            <div className="mx-auto flex h-13 items-center justify-between px-4 lg:px-6 max-w-7xl">
                {/* LEFT: Logo + Menu */}
                <div className="flex items-center gap-3">
                    {/* Mobile Sidebar Toggle */}
                    <button
                        onClick={openShopSidebar}
                        className="lg:hidden text-gray-700 hover:text-black transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={24} className='text-blue-500' />
                    </button>

                    {/* Logo */}
                    <Link href="/shop/dashboard" className="text-xl tracking-tight text-black flex justify-center items-center gap">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="w-6.5 h-6.5 text-blue-500"
                        >
                            <path
                                fillRule="evenodd"
                                d="M12 2a7 7 0 00-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 00-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z"
                                clipRule="evenodd"
                            />
                        </svg>
                        <span>Proximely</span>
                    </Link>
                </div>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-1 ml-8 text-sm">
                    {navItems
                        .filter(nav => nav.active)
                        .map(nav => (
                            <Link
                                key={nav.name}
                                href={nav.slug}
                                className={`rounded-full px-3 py-1 transition-colors ${nav.slug.includes(pathname)
                                    ? 'bg-blue-50 text-blue-500'
                                    : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                                    }`}
                                aria-current={pathname.includes(nav.slug) ? 'page' : undefined}
                            >
                                {nav.name}
                            </Link>
                        ))}
                </nav>

                {/* RIGHT: Auth / Shop */}
                <div className="flex items-center gap-4">
                    {isAuth && !hasShop && (
                        <Link
                            href="/shop/onboarding"
                            className="px-3.5 h-9 flex items-center text-sm font-medium bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
                        >
                            Create Shop
                        </Link>
                    )}

                    {isAuth && hasShop && (
                        <HeaderProfile
                            name={shop?.ownerName}
                            avatarUrl={shop?.imageUrl}
                        />
                    )}
                </div>
            </div>
        </header>
    )
}


