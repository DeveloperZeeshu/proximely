'use client'

import { useAppContext } from '@/context/AppContext'
import { useAuth } from '@/store/auth/useAuth'
import { Menu } from 'lucide-react'
import Link from 'next/link.js'
import { usePathname } from 'next/navigation'

interface NavItem {
    name: string
    slug: string
    active: boolean
}

export default function PublicHeader() {

    const { openSidebar } = useAppContext()
    const pathname = usePathname()

    const { authLoading, isAuth } = useAuth()

    const navItems: NavItem[] = [
        {
            name: 'Home',
            slug: '/',
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

    return (
        <header className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-sm border-b border-slate-100">
            <div className="mx-auto flex h-16 items-center justify-between px-3 lg:px-6 max-w-7xl">

                {/* LEFT: Menu & Logo */}
                <div className="flex items-center gap-3">
                    {/* Mobile Sidebar */}
                    <button
                        onClick={openSidebar}
                        className="lg:hidden text-gray-700 hover:text-black transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu size={24} className='text-blue-500' />
                    </button>

                    {/* Logo */}
                    <Link href="/" className="text-xl tracking-tight text-black flex  justify-center items-center gap">
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
                <nav className="hidden lg:flex items-center gap-2 ml-8 text-sm">
                    {navItems.map(
                        (nav: any) =>
                            nav.active && (
                                <Link
                                    key={nav.name}
                                    href={nav.slug}
                                    className={`rounded-full px-3 py-1 transition-colors ${pathname === nav.slug
                                        ? 'bg-blue-50 text-blue-500'
                                        : 'text-gray-600 hover:bg-blue-50 hover:text-blue-500'
                                        }`}
                                >
                                    {nav.name}
                                </Link>
                            )
                    )}
                </nav>

                {/* RIGHT: Auth / Shop */}
                <div className="flex items-center gap-4">
                    {authLoading && <HeaderAuthSkeleton />}

                    {!authLoading && !isAuth && (
                        <div className="hidden lg:flex items-center gap-3 h-9">
                            <Link
                                href="/auth/login"
                                className="px-3.5 h-full flex items-center text-sm font-medium border border-gray-300 rounded-md bg-gray-50 hover:bg-gray-100 transition"
                            >
                                Log In
                            </Link>
                            <Link
                                href="/auth/register"
                                className="px-3.5 h-full flex items-center text-sm font-medium rounded-md bg-blue-500 text-white hover:bg-blue-600 transition"
                            >
                                Register
                            </Link>
                        </div>
                    )}

                    {!authLoading && isAuth && (
                        <Link
                            href="/shop/dashboard"
                            className="px-3.5 h-9 flex items-center text-sm font-medium rounded-md text-white hover:bg-blue-600 bg-blue-500 transition"
                        >
                            My Dashboard
                        </Link>
                    )}
                </div>
            </div>
        </header>
    )
}

export const HeaderAuthSkeleton = () => {
    return (
        <div className="hidden lg:flex gap-3 items-center ml-2 h-9">
            <div className="h-full w-18 bg-gray-200 rounded-md" />
            <div className="h-full w-19 bg-gray-200 rounded-md" />
        </div>
    )
}

